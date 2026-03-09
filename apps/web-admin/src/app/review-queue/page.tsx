'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  User,
  Bot,
  FileText,
} from 'lucide-react';

interface ReviewItem {
  session_id: string;
  created_at: string;
  topic_summary: string | null;
  transcripts: Array<{
    user_message: string;
    bot_response: string;
    sources_used: string[];
    created_at: string;
  }>;
}

const verdicts = [
  { value: 'reviewed', label: 'Supported', color: 'bg-green-600 hover:bg-green-700' },
  { value: 'escalated', label: 'Needs Escalation', color: 'bg-amber-600 hover:bg-amber-700' },
  { value: 'resolved', label: 'Resolved', color: 'bg-blue-600 hover:bg-blue-700' },
];

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    setLoading(true);
    try {
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('review_status', 'pending')
        .order('created_at', { ascending: true })
        .limit(50);

      const items: ReviewItem[] = [];
      for (const session of sessions || []) {
        const { data: transcripts } = await supabase
          .from('chat_transcripts')
          .select('user_message, bot_response, sources_used, created_at')
          .eq('session_id', session.session_id)
          .order('created_at', { ascending: true });

        items.push({
          session_id: session.session_id,
          created_at: session.created_at,
          topic_summary: session.topic_summary,
          transcripts: transcripts || [],
        });
      }

      setQueue(items);
    } catch (err) {
      console.error('Failed to load review queue:', err);
    } finally {
      setLoading(false);
    }
  }

  async function submitVerdict(verdict: string) {
    if (!queue[currentIndex]) return;
    setSaving(true);

    const sessionId = queue[currentIndex].session_id;
    try {
      await supabase
        .from('chat_sessions')
        .update({
          review_status: verdict,
          reviewer_notes: notes || null,
          reviewer_id: 'admin',
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      await supabase.from('admin_events').insert({
        actor_id: 'admin',
        event_type: 'review_conversation',
        target_id: sessionId,
        details: { verdict, has_notes: !!notes },
      });

      setCompleted((c) => c + 1);
      setNotes('');
      setCurrentIndex((i) => i + 1);
    } catch (err) {
      console.error('Failed to save verdict:', err);
    } finally {
      setSaving(false);
    }
  }

  const current = queue[currentIndex];
  const totalInQueue = queue.length;
  const remaining = Math.max(0, totalInQueue - currentIndex);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-gray-500 mt-1">
          Review pending conversations one at a time.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {completed} of {totalInQueue} reviewed
          </span>
          <span className="text-sm text-gray-500">{remaining} remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-tobie-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: totalInQueue ? `${(completed / totalInQueue) * 100}%` : '0%',
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading review queue...</div>
      ) : !current ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h2>
          <p className="text-gray-500">
            {completed > 0
              ? `You reviewed ${completed} conversations. Great work!`
              : 'No conversations pending review.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-card">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Session {current.session_id.slice(0, 12)}...
                </h2>
                <p className="text-xs text-gray-500">
                  {new Date(current.created_at).toLocaleString()} · {current.transcripts.length} messages
                </p>
              </div>
            </div>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {current.transcripts.map((t, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-800 flex-1">
                      {t.user_message}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 whitespace-pre-wrap">
                        {t.bot_response}
                      </div>
                      {t.sources_used?.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {t.sources_used.map((s) => (
                            <span key={s} className="text-xs bg-tobie-50 text-tobie-700 px-2 py-0.5 rounded inline-flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 h-fit">
            <h3 className="font-semibold text-gray-900 mb-4">Verdict</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional review notes..."
                  className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tobie-500 resize-none"
                />
              </div>
              <div className="space-y-2">
                {verdicts.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => submitVerdict(v.value)}
                    disabled={saving}
                    className={`w-full px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${v.color}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setCurrentIndex((i) => i + 1); setNotes(''); }}
                className="w-full px-4 py-2 text-gray-600 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                Skip <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
