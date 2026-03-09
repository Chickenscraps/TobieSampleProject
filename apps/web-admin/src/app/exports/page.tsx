'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, Plus, FileJson, FileSpreadsheet, Clock } from 'lucide-react';

interface ExportRecord {
  id: string;
  scope: string;
  format: string;
  filter_criteria: Record<string, unknown> | null;
  requested_by: string;
  status: string;
  record_count: number;
  created_at: string;
}

export default function ExportsPage() {
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [format, setFormat] = useState('json');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadExports();
  }, []);

  async function loadExports() {
    setLoading(true);
    const { data } = await supabase
      .from('exports')
      .select('*')
      .order('created_at', { ascending: false });
    setExports(data || []);
    setLoading(false);
  }

  async function createExport() {
    setExporting(true);
    try {
      // Build query for transcripts
      let query = supabase.from('chat_transcripts').select('*');
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59');

      const { data: transcripts } = await query.order('created_at', { ascending: true });

      const exportData = {
        exported_at: new Date().toISOString(),
        filters: { dateFrom, dateTo, status: statusFilter },
        record_count: transcripts?.length || 0,
        transcripts: (transcripts || []).map((t) => ({
          session_id: t.session_id,
          user_message: t.user_message,
          bot_response: t.bot_response,
          sources_used: t.sources_used,
          timestamp: t.created_at,
        })),
      };

      // Generate file
      let blob: Blob;
      let filename: string;

      if (format === 'csv') {
        const headers = 'session_id,user_message,bot_response,sources_used,timestamp\n';
        const rows = exportData.transcripts
          .map((t) => `"${t.session_id}","${t.user_message.replace(/"/g, '""')}","${t.bot_response.replace(/"/g, '""')}","${(t.sources_used || []).join('; ')}","${t.timestamp}"`)
          .join('\n');
        blob = new Blob([headers + rows], { type: 'text/csv' });
        filename = `tobie-export-${new Date().toISOString().slice(0, 10)}.csv`;
      } else {
        blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        filename = `tobie-export-${new Date().toISOString().slice(0, 10)}.json`;
      }

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Record export
      await supabase.from('exports').insert({
        scope: dateFrom || dateTo ? 'date_range' : 'all',
        format,
        filter_criteria: { dateFrom, dateTo, status: statusFilter },
        record_count: exportData.record_count,
        requested_by: 'admin',
        status: 'completed',
      });

      await supabase.from('admin_events').insert({
        actor_id: 'admin',
        event_type: 'export',
        details: { format, record_count: exportData.record_count },
      });

      setShowForm(false);
      loadExports();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Exports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export chat transcripts for review and compliance.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-tobie-600 dark:bg-tobie-500 text-white text-sm font-medium hover:bg-tobie-700 dark:hover:bg-tobie-600 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          New Export
        </button>
      </div>

      {/* Export Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Export</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tobie-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tobie-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tobie-500"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={createExport}
              disabled={exporting}
              className="px-4 py-2 bg-tobie-600 dark:bg-tobie-500 text-white text-sm font-medium rounded-lg hover:bg-tobie-700 dark:hover:bg-tobie-600 disabled:opacity-50 transition-colors"
            >
              {exporting ? 'Exporting...' : 'Generate & Download'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Export History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Export History</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">Loading...</div>
        ) : exports.length === 0 ? (
          <div className="p-8 text-center">
            <Download className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No exports yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Scope</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Format</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Records</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Requested By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {exports.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          {new Date(exp.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{exp.scope.replace('_', ' ')}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {exp.format === 'json' ? (
                            <><FileJson className="w-3 h-3 text-blue-500" /> JSON</>
                          ) : (
                            <><FileSpreadsheet className="w-3 h-3 text-green-500" /> CSV</>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{exp.record_count}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{exp.requested_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-700">
              {exports.map((exp) => (
                <div key={exp.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {exp.format === 'json' ? (
                        <><FileJson className="w-3 h-3 text-blue-500" /> JSON</>
                      ) : (
                        <><FileSpreadsheet className="w-3 h-3 text-green-500" /> CSV</>
                      )}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{exp.scope.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{exp.record_count} records</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>by {exp.requested_by}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(exp.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
