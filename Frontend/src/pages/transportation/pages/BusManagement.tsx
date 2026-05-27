import React, { useEffect, useState } from 'react';
import '../styles/Management.css';

interface Bus {
  bus_id: number;
  bus_number: string;
  capacity: number;
  status: string;
  route_id?: number;
  driver_id?: number;
  seating_type?: string;
}

interface Route {
  route_id: number;
  route_name: string;
}

interface Driver {
  driver_id: number;
  name: string;
}

const BusManagement: React.FC<{ user: any }> = ({ user }) => {
  const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bus_number: '',
    capacity: 50,
    route_id: '',
    driver_id: '',
    status: 'active',
    seating_type: '2+2',
  });

  const role = (user?.user?.role || user?.role || '').toLowerCase();
  const isManager = role === 'transport_manager';

  useEffect(() => {
    fetchBuses();
    fetchRoutesAndDrivers();
  }, []);

  const fetchRoutesAndDrivers = async () => {
    try {
      const [routeRes, driverRes] = await Promise.all([
        fetch(`${API_BASE}/transport/routes`),
        fetch(`${API_BASE}/transport/drivers`)
      ]);
      const routeResult = await routeRes.json();
      const driverResult = await driverRes.json();
      setRoutes(Array.isArray(routeResult.data) ? routeResult.data : []);
      setDrivers(Array.isArray(driverResult.data) ? driverResult.data : []);
    } catch (err) {
      console.error('Error fetching dependencies:', err);
    }
  };

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/transport/buses`);
      if (!response.ok) throw new Error('Failed to load buses');
      const result = await response.json();
      setBuses(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to server. Showing local data.');
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

  const resetForm = () => {
    setFormData({
      bus_number: '',
      capacity: 50,
      route_id: '',
      driver_id: '',
      status: 'active',
      seating_type: '2+2',
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      setError('Only Transport Managers can add buses');
      return;
    }

    if (!formData.bus_number.trim()) {
      setError('Bus number is required');
      return;
    }

    try {
      const body = {
        ...formData,
        route_id: formData.route_id ? parseInt(formData.route_id) : null,
        driver_id: formData.driver_id ? parseInt(formData.driver_id) : null,
      };

      const response = await fetch(`${API_BASE}/transport/buses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add bus');
      }

      resetForm();
      fetchBuses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bus');
    }
  };

  const handleDelete = async (busId: number) => {
    if (!isManager) {
      setError('Only Transport Managers can delete buses');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this bus?')) return;

    try {
      const response = await fetch(`${API_BASE}/transport/buses/${busId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete bus');
      fetchBuses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bus');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-inactive';
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>🚍 Bus Management</h2>
        {isManager && (
          <button
            className="btn btn-primary"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add New Bus'}
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="close-btn">
            ✕
          </button>
        </div>
      )}

      {!isManager && (
        <div className="alert alert-info">
          💡 You have <strong>Read-Only</strong> access. Only Transport Managers can modify data.
        </div>
      )}

      {showForm && isManager && (
        <div className="form-section">
          <h3>Add New Bus</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Bus Number *</label>
              <input
                type="text"
                name="bus_number"
                value={formData.bus_number}
                onChange={handleInputChange}
                placeholder="e.g., BUS-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity (seats) *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="10"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Seating Type</label>
              <select name="seating_type" value={formData.seating_type} onChange={handleInputChange}>
                <option value="2+2">2+2</option>
                <option value="2+3">2+3</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assign Route (optional)</label>
                <select name="route_id" value={formData.route_id} onChange={handleInputChange}>
                  <option value="">No route assigned</option>
                  {routes.map(r => (
                    <option key={r.route_id} value={r.route_id}>
                      {r.route_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Assign Driver (optional)</label>
                <select name="driver_id" value={formData.driver_id} onChange={handleInputChange}>
                  <option value="">No driver assigned</option>
                  {drivers.map(d => (
                    <option key={d.driver_id} value={d.driver_id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              Add Bus
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading buses...</div>
      ) : buses.length === 0 ? (
        <div className="empty-state">
          <p>No buses found. Start by adding a new bus.</p>
          {isManager && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add First Bus
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card buses">
              <div className="stat-emoji">🚍</div>
              <div className="stat-content">
                <div className="stat-label">Total Buses</div>
                <div className="stat-value">{buses.length}</div>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-emoji">✅</div>
              <div className="stat-content">
                <div className="stat-label">Active Buses</div>
                <div className="stat-value">{buses.filter((b) => b.status === 'active').length}</div>
              </div>
            </div>
            <div className="stat-card maintenance">
              <div className="stat-emoji">🔧</div>
              <div className="stat-content">
                <div className="stat-label">In Maintenance</div>
                <div className="stat-value">{buses.filter((b) => b.status === 'maintenance').length}</div>
              </div>
            </div>
            <div className="stat-card routes">
              <div className="stat-emoji">💺</div>
              <div className="stat-content">
                <div className="stat-label">Total Seats</div>
                <div className="stat-value">{buses.reduce((sum, b) => sum + b.capacity, 0)}</div>
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bus Number</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Route</th>
                  <th>Seat Type</th>
                  <th>Driver</th>
                  {isManager && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.bus_id}>
                    <td className="bus-number">{bus.bus_number}</td>
                    <td>{bus.capacity} seats</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(bus.status)}`}>
                        {bus.status}
                      </span>
                    </td>
                    <td>
                      {routes.find(r => r.route_id === bus.route_id)?.route_name || '-'}
                    </td>
                    <td>{bus.seating_type || '2+2'}</td>
                    <td>
                      {drivers.find(d => d.driver_id === bus.driver_id)?.name || '-'}
                    </td>
                    {isManager && (
                      <td className="action-buttons">
                        <button className="btn btn-sm btn-info">Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(bus.bus_id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BusManagement;
