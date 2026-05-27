import React, { useEffect, useState } from 'react';
import '../styles/Management.css';

interface FuelEntry {
  id: number;
  bus_id: number;
  amount: number;
  liters: number;
  odometer_km: number;
  notes?: string | null;
  created_at: string;
  delta_km?: number | null;
  mileage?: number | null;
  previous_mileage?: number | null;
}

interface FuelSummary {
  bus_id: number;
  bus_number: string;
  total_liters: number;
  total_amount: number;
  avg_mileage: number | null;
}

const FuelAllocation: React.FC<{ user: any }> = ({ user }) => {
  const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';
  const [buses, setBuses] = useState<any[]>([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [allEntries, setAllEntries] = useState<FuelEntry[]>([]);
  const [summary, setSummary] = useState<FuelSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bus_id: '',
    amount: '',
    liters: '',
    odometer_km: '',
    notes: '',
  });
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    amount: '',
    liters: '',
    odometer_km: '',
  });

  const role = (user?.user?.role || user?.role || '').toLowerCase();
  const isManager = role === 'transport_manager' || role === 'admin';

  useEffect(() => {
    fetchBaseData();
  }, []);


  const fetchBaseData = async () => {
    try {
      setLoading(true);
      const [busRes, summaryRes, allRes] = await Promise.all([
        fetch(`${API_BASE}/transport/buses`),
        fetch(`${API_BASE}/transport/fuel/summary`),
        fetch(`${API_BASE}/transport/fuel`),
      ]);

      const busResult = await busRes.json();
      const summaryResult = await summaryRes.json();
      const allResult = await allRes.json();
      setBuses(Array.isArray(busResult.data) ? busResult.data : []);
      setSummary(Array.isArray(summaryResult.data) ? summaryResult.data : []);
      setAllEntries(Array.isArray(allResult.data) ? allResult.data : []);

      if (Array.isArray(busResult.data) && busResult.data.length && !selectedBusId) {
        setSelectedBusId(String(busResult.data[0].bus_id));
      }
    } catch (err) {
      setError('Failed to load fuel data');
    } finally {
      setLoading(false);
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
      setError('Only Transport Managers can add fuel entries');
      return;
    }

    if (!formData.bus_id || !formData.amount || !formData.liters || !formData.odometer_km) {
      setError('Bus, amount, liters, and odometer are required');
      return;
    }

    try {
      const body = {
        bus_id: parseInt(formData.bus_id, 10),
        amount: parseFloat(formData.amount),
        liters: parseFloat(formData.liters),
        odometer_km: parseFloat(formData.odometer_km),
        notes: formData.notes || null,
      };

      const response = await fetch(`${API_BASE}/transport/fuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save fuel entry');
      }

      setFormData({ bus_id: '', amount: '', liters: '', odometer_km: '', notes: '' });
      await fetchBaseData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save fuel entry');
    }
  };

  const maxLiters = Math.max(...summary.map((s) => s.total_liters), 1);
  const maxMileage = Math.max(...summary.map((s) => s.avg_mileage || 0), 1);
  const formatNumber = (value: number | null | undefined, digits = 2) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '-';
    return Number(value).toFixed(digits);
  };

  const filteredAllEntries = allEntries.filter((entry) => {
    const created = new Date(entry.created_at);
    if (filters.fromDate) {
      const start = new Date(filters.fromDate);
      start.setHours(0, 0, 0, 0);
      if (created < start) return false;
    }
    if (filters.toDate) {
      const end = new Date(filters.toDate);
      end.setHours(23, 59, 59, 999);
      if (created > end) return false;
    }

    const amountMatch = !filters.amount || String(entry.amount).includes(filters.amount);
    const litersMatch = !filters.liters || String(entry.liters).includes(filters.liters);
    const odoMatch = !filters.odometer_km || String(entry.odometer_km).includes(filters.odometer_km);

    return amountMatch && litersMatch && odoMatch;
  });

  const busFilteredEntries = selectedBusId
    ? filteredAllEntries.filter((entry) => String(entry.bus_id) === selectedBusId)
    : [];

  const groupedDaily = Object.values(
    busFilteredEntries.reduce((acc, entry) => {
      const day = new Date(entry.created_at).toISOString().slice(0, 10);
      const key = `${entry.bus_id}-${day}`;
      if (!acc[key]) {
        acc[key] = {
          bus_id: entry.bus_id,
          date: day,
          total_amount: 0,
          total_liters: 0,
          min_odometer: Number(entry.odometer_km),
          max_odometer: Number(entry.odometer_km),
        };
      }
      acc[key].total_amount += Number(entry.amount || 0);
      acc[key].total_liters += Number(entry.liters || 0);
      acc[key].min_odometer = Math.min(acc[key].min_odometer, Number(entry.odometer_km));
      acc[key].max_odometer = Math.max(acc[key].max_odometer, Number(entry.odometer_km));
      return acc;
    }, {} as Record<string, any>),
  ).map((row: any) => {
    const delta = row.max_odometer - row.min_odometer;
    const mileage = row.total_liters > 0 ? Number((delta / row.total_liters).toFixed(2)) : null;
    return { ...row, delta_km: delta, mileage };
  });

  const monthlySummary = Object.values(
    busFilteredEntries.reduce((acc, entry) => {
      const month = new Date(entry.created_at).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = {
          month,
          total_amount: 0,
          total_liters: 0,
          mileages: [] as number[],
        };
      }
      acc[month].total_amount += Number(entry.amount || 0);
      acc[month].total_liters += Number(entry.liters || 0);
      if (entry.mileage !== null && entry.mileage !== undefined) {
        acc[month].mileages.push(Number(entry.mileage));
      }
      return acc;
    }, {} as Record<string, any>),
  ).map((row: any) => ({
    ...row,
    avg_mileage: row.mileages.length
      ? Number((row.mileages.reduce((sum: number, v: number) => sum + v, 0) / row.mileages.length).toFixed(2))
      : null,
  }));

  const exportFuelCsv = () => {
    if (!filteredAllEntries.length) return;
    const headers = [
      'Bus ID',
      'Bus Number',
      'Timestamp',
      'Amount',
      'Liters',
      'Odometer',
      'Delta Km',
      'Mileage',
      'Previous Mileage',
    ];
    const rows = filteredAllEntries.map((entry) => [
      entry.bus_id,
      (entry as any).bus?.bus_number || '',
      entry.created_at,
      entry.amount,
      entry.liters,
      entry.odometer_km,
      entry.delta_km ?? '',
      entry.mileage ?? '',
      entry.previous_mileage ?? '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fuel-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>⛽ Fuel Allocation</h2>
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
          <h3>Add Fuel Entry</h3>
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
                <label>Amount *</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} min="0" step="0.01" required />
              </div>
              <div className="form-group">
                <label>Liters *</label>
                <input type="number" name="liters" value={formData.liters} onChange={handleInputChange} min="0" step="0.01" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Odometer (km) *</label>
                <input type="number" name="odometer_km" value={formData.odometer_km} onChange={handleInputChange} min="0" step="0.1" required />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Optional" />
              </div>
            </div>
            <button type="submit" className="btn btn-success">Save Entry</button>
          </form>
        </div>
      )}

      <div className="form-section" style={{ marginTop: '1rem' }}>
        <h3>Bus Daily Report</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Select Bus</label>
            <select value={selectedBusId} onChange={(e) => setSelectedBusId(e.target.value)}>
              <option value="">Select a bus...</option>
              {buses.map((bus) => (
                <option key={bus.bus_id} value={bus.bus_id}>
                  {bus.bus_number}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>From</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>To</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Amount Search</label>
            <input
              type="text"
              value={filters.amount}
              onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
              placeholder="e.g. 200"
            />
          </div>
          <div className="form-group">
            <label>Liters Search</label>
            <input
              type="text"
              value={filters.liters}
              onChange={(e) => setFilters({ ...filters, liters: e.target.value })}
              placeholder="e.g. 20"
            />
          </div>
          <div className="form-group">
            <label>Odometer Search</label>
            <input
              type="text"
              value={filters.odometer_km}
              onChange={(e) => setFilters({ ...filters, odometer_km: e.target.value })}
              placeholder="e.g. 52000"
            />
          </div>
          <button type="button" className="btn btn-outline" onClick={exportFuelCsv}>
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading fuel entries...</div>
        ) : busFilteredEntries.length === 0 ? (
          <div className="empty-state">
            <p>No fuel entries for this bus yet.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Amount</th>
                  <th>Liters</th>
                  <th>Odometer</th>
                  <th>Delta Km</th>
                  <th>Mileage</th>
                  <th>Prev Mileage</th>
                </tr>
              </thead>
              <tbody>
                {busFilteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.created_at).toLocaleString()}</td>
                    <td>{formatNumber(entry.amount)}</td>
                    <td>{formatNumber(entry.liters)}</td>
                    <td>{formatNumber(entry.odometer_km, 1)}</td>
                    <td>{formatNumber(entry.delta_km, 1)}</td>
                    <td>{formatNumber(entry.mileage)}</td>
                    <td>{formatNumber(entry.previous_mileage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-section" style={{ marginTop: '1rem' }}>
        <h3>Per-Day Summary (Selected Bus)</h3>
        {busFilteredEntries.length === 0 ? (
          <div className="empty-state">
            <p>No daily summary available.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Total Liters</th>
                  <th>Delta Km</th>
                  <th>Mileage</th>
                </tr>
              </thead>
              <tbody>
                {groupedDaily.map((row: any) => (
                  <tr key={`${row.bus_id}-${row.date}`}>
                    <td>{row.date}</td>
                    <td>{formatNumber(row.total_amount)}</td>
                    <td>{formatNumber(row.total_liters)}</td>
                    <td>{formatNumber(row.delta_km, 1)}</td>
                    <td>{formatNumber(row.mileage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-section" style={{ marginTop: '1rem' }}>
        <h3>Monthly Summary (Selected Bus)</h3>
        {busFilteredEntries.length === 0 ? (
          <div className="empty-state">
            <p>No monthly summary available.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Amount</th>
                  <th>Total Liters</th>
                  <th>Avg Mileage</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.map((row: any) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{formatNumber(row.total_amount)}</td>
                    <td>{formatNumber(row.total_liters)}</td>
                    <td>{formatNumber(row.avg_mileage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-section" style={{ marginTop: '1rem' }}>
        <h3>Fleet Summary</h3>
        {summary.length === 0 ? (
          <div className="empty-state">
            <p>No fuel data yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {summary.map((bus) => (
              <div key={bus.bus_id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{bus.bus_number}</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Average Mileage</div>
                    <div style={{ height: 10, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.max((bus.avg_mileage || 0) / maxMileage, 0) * 100}%`,
                          height: '100%',
                          background: '#2563eb',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{bus.avg_mileage ?? '-'} km/l</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Total Liters</div>
                    <div style={{ height: 10, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.max(bus.total_liters / maxLiters, 0) * 100}%`,
                          height: '100%',
                          background: '#f97316',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{bus.total_liters} L</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelAllocation;
