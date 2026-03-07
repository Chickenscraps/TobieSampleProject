'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Bot,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
  Flag,
} from 'lucide-react';

interface Transcript {
  id: string;
  user_message: string;
  bot_response: string;
  sources_used: string[];
  created_at: string;
}

interface SessionData {
  session_id: string;
  status: string;
  review_status: string;
  reviewer_notes: string | null;
  risk_flags: string[];
  created_at: string;
}

function ConversationDetailContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id') || '';
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState('pending');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    async function load() {
      try {
        const [transcriptsRes, sessionRes] = await Promise.all([
          supabase
            .from('chat_transcripts')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true }),
          supabase
            .from('chat_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single(),
        ]);

        setTranscripts(transcriptsRes.data || []);
        if (sessionRes.data) {
          setSession(sessionRes.data);
          setReviewNotes(sessionRes.data.reviewer_notes || '');
          setReviewStatus(sessionRes.data.review_status || 'pending');
        }

        // Log view event
        supabase.from('admin_events').insert({
          actor_id: 'admin',
          event_type: 'view_transcript',
          target_id: sessionId,
          details: { message_count: transcriptsRes.data?.length || 0 },
        });
      } catch (err) {
        console.error('Failed to load conversation:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sessionId]);

  async function saveReview() {
    setSaving(true);
    try {
      await supabase
        .from('chat_sessions')
        .update({
          review_status: reviewStatus,
          reviewer_notes: reviewNotes,
          reviewer_id: 'admin',
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      await supabase.from('admin_events').insert({
        actor_id: 'admin',
        event_type: 'review_conversation',
        target_id: sessionId,
        details: { new_status: reviewStatus, has_notes: !!reviewNotes },
      });

      setSession((prev) =>
        prev ? { ...prev, review_status: reviewStatus, reviewer_notes: reviewNotes } : prev
      );
    } catch (err) {
      console.error('Failed to save review:', err);
    } finally {
      setSaving(false);
    }
  }

  async function exportConversation() {
    const exportData = {
      session_id: sessionId,
      exported_at: new Date().toISOString(),
      transcripts: transcripts.map((t) => ({
        user_message: t.user_message,
        bot_response: t.bot_response,
        sources_used: t.sources_used,
        timestamp: t.created_at,
      })),
      review: {
        status: reviewStatus,
        notes: reviewNotes,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${sessionId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Log export
    await supabase.from('admin_events').insert({
      actor_id: 'admin',
      event_type: 'export',
      target_id: sessionId,
      details: { format: 'json', scope: 'single_session' },
    });

    await supabase.from('exports').insert({
      scope: 'single_session',
      format: 'json',
      filter_criteria: { session_id: sessionId },
      record_count: transcripts.length,
      requested_by: 'admin',
      status: 'completed',
    });
  }

  if (!sessionId) {
    return <div className="p-12 text-center text-gray-400">No session ID provided.</div>;
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-400">Loading conversation...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/conversations"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Conversations
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Conversation Detail
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Session: {sessionId.slice(0, 16)}... · {transcripts.length} messages
              {session && ` · Started ${new Date(session.created_at).toLocaleString()}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportConversation}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcript Pane */}
        <div className="lg:col-span-2 bg-white border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Transcript</h2>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {transcripts.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No messages in this conversation.</p>
            ) : (
              transcripts.map((t) => (
                <div key={t.id} className="space-y-3">
                  {/* User message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">Employee</span>
                        <span className="text-xs text-gray-400">
                          {new Date(t.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 text-sm text-gray-800">
                        {t.user_message}
                      </div>
                    </div>
                  </div>

                  {/* Bot response */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">Benefits Assistant</span>
                        <span className="text-xs text-gray-400">
                          {new Date(t.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
                        {t.bot_response}
                      </div>
                      {/* Sources */}
                      {t.sources_used && t.sources_used.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {t.sources_used.map((source) => (
                            <span
                              key={source}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-tobie-50 text-tobie-700 text-xs"
                            >
                              <FileText className="w-3 h-3" />
                              {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Review Pane */}
        <div className="space-y-4">
          {/* Review Status */}
          <div className="bg-white border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Review</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-tobie-500"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reviewer Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  placeholder="Add review notes..."
                  className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-tobie-500 resize-none"
                />
              </div>
              <button
                onClick={saveReview}
                disabled={saving}
                className="w-full px-4 py-2 bg-tobie-600 text-white text-sm font-medium hover:bg-tobie-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Session Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Messages</dt>
                <dd className="font-medium text-gray-900">{transcripts.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="font-medium text-gray-900">{session?.status || 'unknown'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Started</dt>
                <dd className="font-medium text-gray-900">
                  {session ? new Date(session.created_at).toLocaleString() : 'N/A'}
                </dd>
              </div>
              {session?.risk_flags && session.risk_flags.length > 0 && (
                <div>
                  <dt className="text-gray-500 mb-1">Risk Flags</dt>
                  <dd className="flex flex-wrap gap-1">
                    {session.risk_flags.map((flag) => (
                      <span
                        key={flag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs"
                      >
                        <Flag className="w-3 h-3" />
                        {flag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConversationDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading...</div>}>
      <ConversationDetailContent />
    </Suspense>
  );
}
