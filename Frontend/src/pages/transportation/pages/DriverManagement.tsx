import React, { useEffect, useState } from 'react';
import '../styles/Management.css';

interface Driver {
  driver_id: number;
  name: string;
  phone: string;
  license_number: string;
  status: string;
}

const MOCK_DRIVERS: Driver[] = [
  { driver_id: 1, name: 'Ravi Kumar', phone: '9848012345', license_number: 'DL-12345-AP', status: 'active' },
  { driver_id: 2, name: 'Srinivas Rao', phone: '9988776655', license_number: 'DL-67890-AP', status: 'active' },
  { driver_id: 3, name: 'M. Sattar', phone: '9440123456', license_number: 'DL-11223-TS', status: 'active' },
  { driver_id: 4, name: 'V. Naidu', phone: '9550123456', license_number: 'DL-44556-AP', status: 'active' },
  { driver_id: 5, name: 'John Doe', phone: '9876543210', license_number: 'DL-99887-AP', status: 'inactive' },
];

const DriverManagement: React.FC<{ user: any }> = ({ user }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license_number: '',
    status: 'active',
  });

  const role = (user?.user?.role || user?.role || '').toLowerCase();
  const isManager = role === 'transport_manager';

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/transport/drivers');
      if (!response.ok) throw new Error('Failed to load drivers');
      const result = await response.json();
      setDrivers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setDrivers(MOCK_DRIVERS);
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
      name: '',
      phone: '',
      license_number: '',
      status: 'active',
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      setError('Only Transport Managers can add drivers');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.license_number.trim()) {
      setError('Name, phone, and license number are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/transport/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add driver');

      resetForm();
      fetchDrivers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add driver');
    }
  };

  const handleDelete = async (driverId: number) => {
    if (!isManager) {
      setError('Only Transport Managers can delete drivers');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      const response = await fetch(`http://localhost:3000/transport/drivers/${driverId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete driver');
      fetchDrivers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete driver');
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
        <h2>👨‍✈️ Driver Management</h2>
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
            {showForm ? 'Cancel' : 'Add New Driver'}
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
          <h3>Add New Driver</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Rajesh Kumar"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., 9876543210"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>License Number *</label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  placeholder="e.g., DL-2024-001"
                  required
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
              Add Driver
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading drivers...</div>
      ) : drivers.length === 0 ? (
        <div className="empty-state">
          <p>No drivers found. Start by adding a new driver.</p>
          {isManager && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add First Driver
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card drivers">
              <div className="stat-emoji">👨‍✈️</div>
              <div className="stat-content">
                <div className="stat-label">Total Drivers</div>
                <div className="stat-value">{drivers.length}</div>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-emoji">✅</div>
              <div className="stat-content">
                <div className="stat-label">Active Drivers</div>
                <div className="stat-value">{drivers.filter((d) => d.status === 'active').length}</div>
              </div>
            </div>
            <div className="stat-card maintenance">
              <div className="stat-emoji">❌</div>
              <div className="stat-content">
                <div className="stat-label">Inactive Drivers</div>
                <div className="stat-value">{drivers.filter((d) => d.status === 'inactive').length}</div>
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Phone</th>
                  <th>License Number</th>
                  <th>Status</th>
                  {isManager && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.driver_id}>
                    <td className="driver-name">{driver.name}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.license_number}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(driver.status)}`}>
                        {driver.status}
                      </span>
                    </td>
                    {isManager && (
                      <td className="action-buttons">
                        <button className="btn btn-sm btn-info">Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(driver.driver_id)}
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

export default DriverManagement;
