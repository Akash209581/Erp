import React, { useEffect, useState } from 'react';
import '../styles/Management.css';

interface Breakdown {
  id: number;
  bus_id: number;
  part: string;
  note?: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'reported' | 'approved';
  reported_by?: string | null;
  approved_by?: string | null;
  reported_at: string;
  approved_at?: string | null;
  bus?: { bus_number: string };
}

const BusBreakdown: React.FC<{ user: any }> = ({ user }) => {
  const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';
  const [buses, setBuses] = useState<any[]>([]);
  const [logs, setLogs] = useState<Breakdown[]>([]);
  const [filters, setFilters] = useState({ bus_id: '', status: 'all', search: '' });
  const [formData, setFormData] = useState({
    bus_id: '',
    part: '',
    note: '',
    priority: 'medium',
    reported_by: '',
  });
  const [error, setError] = useState<string | null>(null);

  const role = (user?.user?.role || user?.role || '').toLowerCase();
  const isManager = role === 'transport_manager' || role === 'admin' || role === 'inventory_manager';

  useEffect(() => {
    fetchBaseData();
  }, []);

  const fetchBaseData = async () => {
    try {
      const [busRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/transport/buses`),
        fetch(`${API_BASE}/transport/breakdowns`),
      ]);

      const busResult = await busRes.json();
      const logResult = await logRes.json();
      setBuses(Array.isArray(busResult.data) ? busResult.data : []);
      setLogs(Array.isArray(logResult.data) ? logResult.data : []);
    } catch (err) {
      setError('Failed to load breakdown data');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      setError('Only authorized users can report breakdowns');
      return;
    }

    if (!formData.bus_id || !formData.part.trim()) {
      setError('Bus and part are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/transport/breakdowns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bus_id: parseInt(formData.bus_id, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to report breakdown');
      }

      setFormData({ bus_id: '', part: '', note: '', priority: 'medium', reported_by: '' });
      fetchBaseData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report breakdown');
    }
  };

  const handleApprove = async (entry: Breakdown) => {
    if (!isManager) {
      setError('Only authorized users can approve');
      return;
    }

    const approver = window.prompt('Approved by (name or ID)', entry.approved_by || '');
    if (approver === null) return;

    try {
      const response = await fetch(`${API_BASE}/transport/breakdowns/${entry.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved_by: approver }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Approval failed');
      }

      fetchBaseData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval failed');
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filters.bus_id && String(log.bus_id) !== filters.bus_id) return false;
    if (filters.status !== 'all' && log.status !== filters.status) return false;
    if (filters.search) {
      const needle = filters.search.toLowerCase();
      const haystack = `${log.part} ${log.note || ''}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  const pendingCount = logs.filter((log) => log.status === 'reported').length;

  const exportCsv = () => {
    if (!filteredLogs.length) return;
    const headers = [
      'Bus',
      'Part',
      'Priority',
      'Note',
      'Status',
      'Reported At',
      'Reported By',
      'Approved At',
      'Approved By',
    ];
    const rows = filteredLogs.map((log) => [
      log.bus?.bus_number || log.bus_id,
      log.part,
      log.priority,
      log.note || '',
      log.status,
      log.reported_at,
      log.reported_by || '',
      log.approved_at || '',
      log.approved_by || '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bus-breakdowns.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>🧰 Bus Break Down</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="status-badge status-warning">Pending: {pendingCount}</span>
          <button type="button" className="btn btn-outline" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="close-btn">
            ✕
          </button>
        </div>
      )}

      {isManager && (
        <div className="form-section">
          <h3>Report Break Down</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Bus *</label>
                <select name="bus_id" value={formData.bus_id} onChange={handleInputChange} required>
                  <option value="">Select a bus...</option>
                  {buses.map((bus) => (
                    <option key={bus.bus_id} value={bus.bus_id}>
                      {bus.bus_number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Part Not Working *</label>
                <input name="part" value={formData.part} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleInputChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Note</label>
                <input name="note" value={formData.note} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Reported By</label>
                <input name="reported_by" value={formData.reported_by} onChange={handleInputChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-success">Save</button>
          </form>
        </div>
      )}

      <div className="form-section" style={{ marginTop: '1rem' }}>
        <h3>Logs</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Bus</label>
            <select
              value={filters.bus_id}
              onChange={(e) => setFilters({ ...filters, bus_id: e.target.value })}
            >
              <option value="">All buses</option>
              {buses.map((bus) => (
                <option key={bus.bus_id} value={bus.bus_id}>
                  {bus.bus_number}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All</option>
              <option value="reported">Reported</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Part or note"
            />
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Part</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported At</th>
                <th>Reported By</th>
                <th>Approved At</th>
                <th>Approved By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.bus?.bus_number || log.bus_id}</td>
                  <td title={log.note || ''}>{log.part}</td>
                  <td>{log.priority}</td>
                  <td>
                    <span className={`status-badge ${log.status === 'approved' ? 'status-active' : 'status-warning'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>{new Date(log.reported_at).toLocaleString()}</td>
                  <td>{log.reported_by || '-'}</td>
                  <td>{log.approved_at ? new Date(log.approved_at).toLocaleString() : '-'}</td>
                  <td>{log.approved_by || '-'}</td>
                  <td>
                    {log.status === 'reported' && (
                      <button className="btn btn-sm btn-success" onClick={() => handleApprove(log)}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={9} className="empty-state">No breakdowns found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusBreakdown;
