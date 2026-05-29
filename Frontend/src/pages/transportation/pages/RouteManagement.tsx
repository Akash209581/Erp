import React, { useEffect, useState } from 'react';
import '../styles/Management.css';

interface Route {
  route_id: number;
  route_name: string;
  start_point: string;
  end_point: string;
  status: string;
  routes_distance?: number;
  estimated_time?: number;
}

const MOCK_ROUTES: Route[] = [
  { route_id: 1, route_name: 'Guntur - Campus', start_point: 'Guntur RTC', end_point: 'VFSTR Campus', status: 'active', routes_distance: 15.5, estimated_time: 45 },
  { route_id: 2, route_name: 'Vijayawada - Campus', start_point: 'Benz Circle', end_point: 'VFSTR Campus', status: 'active', routes_distance: 35.0, estimated_time: 75 },
  { route_id: 3, route_name: 'Tenali - Campus', start_point: 'Tenali BS', end_point: 'VFSTR Campus', status: 'active', routes_distance: 25.0, estimated_time: 50 },
  { route_id: 4, route_name: 'Old Guntur - Campus', start_point: 'Old Guntur', end_point: 'VFSTR Campus', status: 'active', routes_distance: 12.0, estimated_time: 35 },
  { route_id: 5, route_name: 'Mangalagiri - Campus', start_point: 'Mangalagiri', end_point: 'VFSTR Campus', status: 'inactive', routes_distance: 18.0, estimated_time: 40 },
];

const RouteManagement: React.FC<{ user: any }> = ({ user }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    route_name: '',
    start_point: '',
    end_point: '',
    routes_distance: '',
    estimated_time: '',
    status: 'active',
  });

  const role = (user?.user?.role || user?.role || '').toLowerCase();
  const isManager = role === 'transport_manager';

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/transport/routes');
      if (!response.ok) throw new Error('Failed to load routes');
      const result = await response.json();
      setRoutes(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setRoutes(MOCK_ROUTES);
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
      route_name: '',
      start_point: '',
      end_point: '',
      routes_distance: '',
      estimated_time: '',
      status: 'active',
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      setError('Only Transport Managers can create routes');
      return;
    }

    if (!formData.route_name.trim() || !formData.start_point.trim() || !formData.end_point.trim()) {
      setError('Route name, start point, and end point are required');
      return;
    }

    try {
      const body = {
        ...formData,
        routes_distance: formData.routes_distance ? parseFloat(formData.routes_distance) : null,
        estimated_time: formData.estimated_time ? parseInt(formData.estimated_time) : null,
      };

      const response = await fetch('http://localhost:3000/transport/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to add route');

      resetForm();
      fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add route');
    }
  };

  const handleDelete = async (routeId: number) => {
    if (!isManager) {
      setError('Only Transport Managers can delete routes');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this route?')) return;

    try {
      const response = await fetch(`http://localhost:3000/transport/routes/${routeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete route');
      fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete route');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>🗺️ Route Management</h2>
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
            {showForm ? 'Cancel' : 'Create New Route'}
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
          <h3>Create New Route</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Route Name *</label>
              <input
                type="text"
                name="route_name"
                value={formData.route_name}
                onChange={handleInputChange}
                placeholder="e.g., City to University"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Point *</label>
                <input
                  type="text"
                  name="start_point"
                  value={formData.start_point}
                  onChange={handleInputChange}
                  placeholder="e.g., Bus Stand"
                  required
                />
              </div>

              <div className="form-group">
                <label>End Point *</label>
                <input
                  type="text"
                  name="end_point"
                  value={formData.end_point}
                  onChange={handleInputChange}
                  placeholder="e.g., University Gate"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Distance (km)</label>
                <input
                  type="number"
                  name="routes_distance"
                  value={formData.routes_distance}
                  onChange={handleInputChange}
                  placeholder="e.g., 15"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Est. Time (mins)</label>
                <input
                  type="number"
                  name="estimated_time"
                  value={formData.estimated_time}
                  onChange={handleInputChange}
                  placeholder="e.g., 45"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              Create Route
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading routes...</div>
      ) : routes.length === 0 ? (
        <div className="empty-state">
          <p>No routes found. Start by creating a new route.</p>
          {isManager && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add First Route
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card routes">
              <div className="stat-emoji">🗺️</div>
              <div className="stat-content">
                <div className="stat-label">Total Routes</div>
                <div className="stat-value">{routes.length}</div>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-emoji">✅</div>
              <div className="stat-content">
                <div className="stat-label">Active Routes</div>
                <div className="stat-value">{routes.filter((r) => r.status === 'active').length}</div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-emoji">📏</div>
              <div className="stat-content">
                <div className="stat-label">Avg Distance</div>
                <div className="stat-value">
                  {routes.length > 0 ? (routes.reduce((sum, r) => sum + (r.routes_distance || 0), 0) / routes.length).toFixed(1) : 0} km
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-emoji">⏱️</div>
              <div className="stat-content">
                <div className="stat-label">Avg Time</div>
                <div className="stat-value">
                  {routes.length > 0 ? (routes.reduce((sum, r) => sum + (r.estimated_time || 0), 0) / routes.length).toFixed(0) : 0} mins
                </div>
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Route Name</th>
                  <th>Start Point</th>
                  <th>End Point</th>
                  <th>Distance (km)</th>
                  <th>Est. Time</th>
                  <th>Status</th>
                  {isManager && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.route_id}>
                    <td className="route-name">{route.route_name}</td>
                    <td>{route.start_point}</td>
                    <td>{route.end_point}</td>
                    <td>{route.routes_distance || '-'}</td>
                    <td>{route.estimated_time ? `${route.estimated_time} mins` : '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(route.status)}`}>
                        {route.status}
                      </span>
                    </td>
                    {isManager && (
                      <td className="action-buttons">
                        <button className="btn btn-sm btn-info">Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(route.route_id)}
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

export default RouteManagement;
