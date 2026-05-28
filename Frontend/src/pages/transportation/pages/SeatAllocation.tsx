import React, { useEffect, useState } from 'react';
import BusSeatMap from '../components/BusSeatMap';
import '../styles/Management.css';

interface Allocation {
  allocation_id: number;
  user_id: string;
  role: 'student' | 'faculty';
  bus_id: number;
  route_id: number;
  seat_number: number;
  pickup_stop: string;
  status: string;
  rider?: any | null;
}

interface Rider {
  person_id: string;
  role: 'student' | 'faculty';
  name?: string;
  gender?: string;
  year?: string;
  section?: string;
  graduation?: string;
  branch?: string;
  program?: string;
  stop_name?: string;
  route_name?: string;
  route_id?: number | null;
  bus_fees_paid?: boolean | null;
  academic_year?: string;
  designation?: string;
  qualification?: string;
  dept?: string;
  extra_fields?: Record<string, any> | null;
}

const MOCK_ALLOCATIONS: Allocation[] = [
  { allocation_id: 1, user_id: '209581', role: 'student', bus_id: 1, route_id: 1, seat_number: 12, pickup_stop: 'Old Guntur', status: 'active' },
  { allocation_id: 2, user_id: '209582', role: 'student', bus_id: 1, route_id: 1, seat_number: 15, pickup_stop: 'Old Guntur', status: 'active' },
  { allocation_id: 3, user_id: '5012', role: 'faculty', bus_id: 2, route_id: 2, seat_number: 3, pickup_stop: 'Benz Circle', status: 'active' },
  { allocation_id: 4, user_id: '209585', role: 'student', bus_id: 3, route_id: 1, seat_number: 8, pickup_stop: 'Narakodur', status: 'active' },
];

const MOCK_BUSES = [
  { bus_id: 1, bus_number: 'VFSTR-BUS-01', capacity: 52, staff_seats: 5, girl_seats: 20, boy_seats: 20, seating_type: '2+2' },
  { bus_id: 2, bus_number: 'VFSTR-BUS-02', capacity: 45, staff_seats: 5, girl_seats: 20, boy_seats: 20, seating_type: '2+2' },
  { bus_id: 3, bus_number: 'VFSTR-BUS-03', capacity: 52, staff_seats: 5, girl_seats: 20, boy_seats: 20, seating_type: '2+2' },
];

const MOCK_ROUTES = [
  { route_id: 1, route_name: 'Guntur - Campus' },
  { route_id: 2, route_name: 'Vijayawada - Campus' },
  { route_id: 3, route_name: 'Tenali - Campus' },
];

const SeatAllocationManagement: React.FC<{ user: any }> = ({ user }) => {
  const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [autoBusId, setAutoBusId] = useState('');
  const [importRole, setImportRole] = useState<'student' | 'faculty'>('student');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [reportRole, setReportRole] = useState<'all' | 'student' | 'faculty'>('all');
  const [reportFilters, setReportFilters] = useState({
    name: '',
    person_id: '',
    seat_number: '',
    branch: '',
    year: '',
    gender: '',
    academic_year: '',
    program: '',
    graduation: '',
  });
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    role: 'student' as 'student' | 'faculty',
    bus_id: '',
    route_id: '',
    seat_number: '',
    pickup_stop: '',
  });
  const [riderForm, setRiderForm] = useState({
    role: 'student' as 'student' | 'faculty',
    person_id: '',
    name: '',
    gender: '',
    year: '',
    section: '',
    graduation: '',
    branch: '',
    program: '',
    stop_name: '',
    route_name: '',
    route_id: '',
    bus_fees_paid: '',
    academic_year: '',
    designation: '',
    qualification: '',
    dept: '',
  });
  const [extraFields, setExtraFields] = useState<Array<{ key: string; value: string }>>([]);

  const role = (user?.user?.role || user?.role || '').toLowerCase();
  const isManager = role === 'transport_manager';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [allocRes, busRes, routeRes] = await Promise.all([
        fetch(`${API_BASE}/transport/allocations`),
        fetch(`${API_BASE}/transport/buses`),
        fetch(`${API_BASE}/transport/routes`),
      ]);

      if (!allocRes.ok || !busRes.ok || !routeRes.ok)
        throw new Error('Failed to load data');

      const allocResult = await allocRes.json();
      const busResult = await busRes.json();
      const routeResult = await routeRes.json();

      setAllocations(Array.isArray(allocResult.data) ? allocResult.data : []);
      setBuses(Array.isArray(busResult.data) ? busResult.data : []);
      setRoutes(Array.isArray(routeResult.data) ? routeResult.data : []);

      const [studentsRes, staffRes] = await Promise.all([
        fetch(`${API_BASE}/transport/riders?role=student`),
        fetch(`${API_BASE}/transport/riders?role=faculty`),
      ]);

      const studentsResult = await studentsRes.json().catch(() => ({ data: [] }));
      const staffResult = await staffRes.json().catch(() => ({ data: [] }));
      setRiders([
        ...(Array.isArray(studentsResult.data) ? studentsResult.data : []),
        ...(Array.isArray(staffResult.data) ? staffResult.data : []),
      ]);
    } catch (err) {
      console.error('Fetch error:', err);
      setAllocations(MOCK_ALLOCATIONS);
      setBuses(MOCK_BUSES);
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

  const handleRiderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'route_id') {
      const route = routes.find((r) => String(r.route_id) === value);
      setRiderForm({
        ...riderForm,
        route_id: value,
        route_name: route?.route_name || '',
      });
      return;
    }

    setRiderForm({
      ...riderForm,
      [name]: value,
    });
  };

  const addExtraField = () => {
    setExtraFields([...extraFields, { key: '', value: '' }]);
  };

  const updateExtraField = (index: number, key: string, value: string) => {
    const updated = [...extraFields];
    updated[index] = { key, value };
    setExtraFields(updated);
  };

  const removeExtraField = (index: number) => {
    const updated = [...extraFields];
    updated.splice(index, 1);
    setExtraFields(updated);
  };

  const parseCSVLine = (line: string) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result.map((value) => value.trim());
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (!lines.length) return [];
    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? '';
      });
      return row;
    });
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      role: 'student',
      bus_id: '',
      route_id: '',
      seat_number: '',
      pickup_stop: '',
    });
    setShowForm(false);
  };

  const resetRiderForm = () => {
    setRiderForm({
      role: 'student',
      person_id: '',
      name: '',
      gender: '',
      year: '',
      section: '',
      graduation: '',
      branch: '',
      program: '',
      stop_name: '',
      route_name: '',
      route_id: '',
      bus_fees_paid: '',
      academic_year: '',
      designation: '',
      qualification: '',
      dept: '',
    });
    setExtraFields([]);
  };

  const handleRiderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      setError('Only Transport Managers can add riders');
      return;
    }

    if (!riderForm.person_id || !riderForm.name) {
      setError('ID and Name are required');
      return;
    }

    const extra_fields = extraFields.reduce((acc, item) => {
      if (item.key) acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);

    try {
      const body = {
        ...riderForm,
        route_id: riderForm.route_id ? parseInt(riderForm.route_id, 10) : null,
        bus_fees_paid:
          riderForm.bus_fees_paid.trim().toLowerCase() === 'yes'
            ? true
            : riderForm.bus_fees_paid.trim().toLowerCase() === 'no'
            ? false
            : null,
        extra_fields,
      };

      const response = await fetch(`${API_BASE}/transport/riders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save rider');
      }

      resetRiderForm();
      fetchAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rider');
    }
  };

  const handleImport = async (file: File) => {
    try {
      setImportStatus('Reading file...');
      const text = await file.text();
      const rows = parseCSV(text);

      setImportStatus('Uploading...');
      const response = await fetch(`${API_BASE}/transport/riders/import?role=${importRole}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Import failed');
      }

      const result = await response.json();
      const stats = result?.data || {};
      setImportStatus(`Import complete. Created: ${stats.created || 0}, Updated: ${stats.updated || 0}`);
      fetchAllData();
    } catch (err) {
      setImportStatus(err instanceof Error ? err.message : 'Import failed');
    }
  };

  const handleAutoAllocate = async () => {
    if (!autoBusId) {
      setError('Select a bus for auto allocation');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/transport/auto-allocate/${autoBusId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Auto allocation failed');
      }
      fetchAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auto allocation failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      setError('Only Transport Managers can allocate seats');
      return;
    }

    if (!formData.user_id || !formData.bus_id || !formData.seat_number) {
      setError('User ID, Bus ID, and Seat Number are required');
      return;
    }

    try {
      const body = {
        ...formData,
        user_id: formData.user_id.trim(),
        bus_id: parseInt(formData.bus_id, 10),
        route_id: formData.route_id ? parseInt(formData.route_id, 10) : null,
        seat_number: parseInt(formData.seat_number, 10),
      };

      const response = await fetch(`${API_BASE}/transport/allocate-seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to allocate seat');
      }

      resetForm();
      fetchAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to allocate seat');
    }
  };

  const handleDelete = async (allocationId: number) => {
    if (!isManager) {
      setError('Only Transport Managers can deallocate seats');
      return;
    }

    if (!window.confirm('Are you sure you want to deallocate this seat?')) return;

    try {
      const response = await fetch(`${API_BASE}/transport/allocations/${allocationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to deallocate seat');
      fetchAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deallocate seat');
    }
  };

  const handleEditSeat = async (allocation: Allocation) => {
    if (!isManager) {
      setError('Only Transport Managers can edit seats');
      return;
    }

    const newSeat = window.prompt('Enter new seat number', String(allocation.seat_number));
    if (!newSeat) return;

    try {
      const response = await fetch(`${API_BASE}/transport/allocations/${allocation.allocation_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seat_number: parseInt(newSeat, 10) }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update seat');
      }
      fetchAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update seat');
    }
  };

  const getSeatHoverText = (allocation: Allocation) => {
    const rider = allocation.rider as Rider | null | undefined;
    if (!rider) return '';

    const lines = [
      `Name: ${rider.name || '-'}`,
      `ID: ${rider.person_id || allocation.user_id}`,
      `Role: ${rider.role === 'faculty' ? 'Staff' : 'Student'}`,
      `Branch: ${rider.branch || '-'}`,
      `Year: ${rider.year || '-'}`,
      `Program: ${rider.program || '-'}`,
      `Route: ${rider.route_name || '-'}`,
      `Stop: ${rider.stop_name || allocation.pickup_stop || '-'}`,
    ];

    return lines.join('\n');
  };

  const filteredRiders = riders.filter((rider) => {
    if (reportRole !== 'all' && rider.role !== reportRole) return false;
    const matches = (field: string | undefined, value: string) =>
      !value || String(field || '').toLowerCase().includes(value.toLowerCase());

    const allocation = allocations.find(
      (a) => a.user_id === rider.person_id && a.role === rider.role,
    );
    const seatMatches = !reportFilters.seat_number
      || String(allocation?.seat_number || '').includes(reportFilters.seat_number);

    return (
      matches(rider.name, reportFilters.name) &&
      matches(rider.person_id, reportFilters.person_id) &&
      seatMatches &&
      matches(rider.branch, reportFilters.branch) &&
      matches(rider.year, reportFilters.year) &&
      matches(rider.gender, reportFilters.gender) &&
      matches(rider.academic_year, reportFilters.academic_year) &&
      matches(rider.program, reportFilters.program) &&
      matches(rider.graduation, reportFilters.graduation)
    );
  });

  const exportRidersCsv = () => {
    if (!filteredRiders.length) return;
    const extraKeys = Array.from(
      new Set(
        filteredRiders.flatMap((rider) =>
          rider.extra_fields ? Object.keys(rider.extra_fields) : [],
        ),
      ),
    );

    const headers = [
      'Role',
      'ID',
      'Name',
      'Seat Number',
      'Gender',
      'Year',
      'Branch',
      'Program',
      'Graduation',
      'Academic Year',
      'Route',
      'Stop Name',
      'Bus Fees Paid',
      ...extraKeys,
    ];

    const rows = filteredRiders.map((rider) => {
      const allocation = allocations.find(
        (a) => a.user_id === rider.person_id && a.role === rider.role,
      );
      return [
        rider.role === 'faculty' ? 'staff' : rider.role,
        rider.person_id,
        rider.name || '',
        allocation?.seat_number ?? '',
        rider.gender || '',
        rider.year || '',
        rider.branch || '',
        rider.program || '',
        rider.graduation || '',
        rider.academic_year || '',
        rider.route_name || '',
        rider.stop_name || '',
        rider.bus_fees_paid === true ? 'Yes' : rider.bus_fees_paid === false ? 'No' : '',
        ...extraKeys.map((key) => (rider.extra_fields && rider.extra_fields[key] ? rider.extra_fields[key] : '')),
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transport-riders-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>🎫 Seat Allocation</h2>
        {isManager && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
              {showForm ? 'Cancel' : 'Allocate Seat'}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowImport(!showImport)}
            >
              {showImport ? 'Close Rider Tools' : 'Rider Import / Entry'}
            </button>
          </div>
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

      {isManager && showImport && (
        <div className="form-section" style={{ marginTop: '1rem' }}>
          <h3>Rider Import (CSV)</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Import Role</label>
              <select
                value={importRole}
                onChange={(e) => setImportRole(e.target.value as 'student' | 'faculty')}
              >
                <option value="student">Student CSV</option>
                <option value="faculty">Staff CSV</option>
              </select>
            </div>
            <div className="form-group">
              <label>CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport(file);
                }}
              />
            </div>
          </div>
          {importStatus && <div className="alert alert-info">{importStatus}</div>}
          <div className="form-section" style={{ marginTop: '1rem' }}>
            <h4>Manual Rider Entry</h4>
            <form onSubmit={handleRiderSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={riderForm.role} onChange={handleRiderChange}>
                    <option value="student">Student</option>
                    <option value="faculty">Staff</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{riderForm.role === 'student' ? 'Reg No' : 'Staff ID'} *</label>
                  <input
                    type="text"
                    name="person_id"
                    value={riderForm.person_id}
                    onChange={handleRiderChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" name="name" value={riderForm.name} onChange={handleRiderChange} required />
                </div>
              </div>

              {riderForm.role === 'student' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Gender</label>
                      <input type="text" name="gender" value={riderForm.gender} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <input type="text" name="year" value={riderForm.year} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Section</label>
                      <input type="text" name="section" value={riderForm.section} onChange={handleRiderChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Graduation (UG/PG)</label>
                      <input type="text" name="graduation" value={riderForm.graduation} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Branch</label>
                      <input type="text" name="branch" value={riderForm.branch} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Program</label>
                      <input type="text" name="program" value={riderForm.program} onChange={handleRiderChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Stop Name</label>
                      <input type="text" name="stop_name" value={riderForm.stop_name} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Route</label>
                      <select name="route_id" value={riderForm.route_id} onChange={handleRiderChange}>
                        <option value="">Select a route...</option>
                        {routes.map((route) => (
                          <option key={route.route_id} value={route.route_id}>
                            {route.route_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Academic Year</label>
                      <input type="text" name="academic_year" value={riderForm.academic_year} onChange={handleRiderChange} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Designation</label>
                      <input type="text" name="designation" value={riderForm.designation} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <input type="text" name="gender" value={riderForm.gender} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Qualification</label>
                      <input type="text" name="qualification" value={riderForm.qualification} onChange={handleRiderChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Department</label>
                      <input type="text" name="dept" value={riderForm.dept} onChange={handleRiderChange} />
                    </div>
                    <div className="form-group">
                      <label>Stop Name</label>
                      <input type="text" name="stop_name" value={riderForm.stop_name} onChange={handleRiderChange} />
                    </div>
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Bus Fees Paid (Yes/No)</label>
                  <input
                    type="text"
                    name="bus_fees_paid"
                    value={riderForm.bus_fees_paid}
                    onChange={handleRiderChange}
                    placeholder="Yes / No"
                  />
                </div>
              </div>

              <div className="form-section" style={{ marginTop: '1rem' }}>
                <h4>Extra Fields</h4>
                {extraFields.map((field, index) => (
                  <div className="form-row" key={`${field.key}-${index}`}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Field name"
                        value={field.key}
                        onChange={(e) => updateExtraField(index, e.target.value, field.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) => updateExtraField(index, field.key, e.target.value)}
                      />
                    </div>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeExtraField(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={addExtraField}>
                  Add Field
                </button>
              </div>

              <button type="submit" className="btn btn-success" style={{ marginTop: '1rem' }}>
                Save Rider
              </button>
            </form>
          </div>
        </div>
      )}

      {isManager && (
        <div className="form-section" style={{ marginTop: '1rem' }}>
          <h3>Auto Allocation</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Select Bus</label>
              <select value={autoBusId} onChange={(e) => setAutoBusId(e.target.value)}>
                <option value="">Select a bus...</option>
                {buses.map((bus) => (
                  <option key={bus.bus_id} value={bus.bus_id}>
                    {bus.bus_number}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn btn-warning" onClick={handleAutoAllocate}>
              Auto Allocate
            </button>
          </div>
        </div>
      )}

      {showForm && isManager && (
        <div className="form-section">
          <h3>Allocate Seat to User</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Reg No / Staff ID *</label>
                <input
                  type="text"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  placeholder="Enter reg no or staff ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="student">Student</option>
                  <option value="faculty">Staff</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bus ID *</label>
                <select
                  name="bus_id"
                  value={formData.bus_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a bus...</option>
                  {buses.map((bus) => (
                    <option key={bus.bus_id} value={bus.bus_id}>
                      {bus.bus_number} (Capacity: {bus.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Route ID</label>
                <select name="route_id" value={formData.route_id} onChange={handleInputChange}>
                  <option value="">Select a route...</option>
                  {routes.map((route) => (
                    <option key={route.route_id} value={route.route_id}>
                      {route.route_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Seat Number *</label>
                <input
                  type="number"
                  name="seat_number"
                  value={formData.seat_number}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pickup Stop ID</label>
                <input
                  type="number"
                  name="pickup_stop"
                  value={formData.pickup_stop}
                  onChange={handleInputChange}
                  placeholder="Enter Stop ID"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              Allocate Seat
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading allocations...</div>
      ) : allocations.length === 0 ? (
        <div className="empty-state">
          <p>No seat allocations yet. Start by allocating a seat.</p>
          {isManager && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Allocate First Seat
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card allocations">
              <div className="stat-emoji">🎫</div>
              <div className="stat-content">
                <div className="stat-label">Total Allocations</div>
                <div className="stat-value">{allocations.length}</div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-emoji">👥</div>
              <div className="stat-content">
                <div className="stat-label">Student Seats</div>
                <div className="stat-value">{allocations.filter((a) => a.role === 'student').length}</div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-emoji">👨‍🏫</div>
              <div className="stat-content">
                <div className="stat-label">Faculty Seats</div>
                <div className="stat-value">{allocations.filter((a) => a.role === 'faculty').length}</div>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-emoji">✅</div>
              <div className="stat-content">
                <div className="stat-label">Active Allocations</div>
                <div className="stat-value">{allocations.filter((a) => a.status === 'active').length}</div>
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Role</th>
                  <th>Bus ID</th>
                  <th>Seat #</th>
                  <th>Route ID</th>
                  <th>Pickup Stop</th>
                  <th>Status</th>
                  {isManager && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation) => (
                  <tr key={allocation.allocation_id}>
                    <td>&nbsp;{allocation.user_id}</td>
                    <td className="capitalize">{allocation.role === 'faculty' ? 'staff' : allocation.role}</td>
                    <td>{allocation.bus_id}</td>
                    <td className="bus-number" title={getSeatHoverText(allocation)}>
                      #{allocation.seat_number}
                    </td>
                    <td>{allocation.route_id || '-'}</td>
                    <td>{allocation.pickup_stop || '-'}</td>
                    <td>
                      <span className="status-badge status-active">{allocation.status}</span>
                    </td>
                    {isManager && (
                      <td className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditSeat(allocation)}
                        >
                          Edit Seat
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(allocation.allocation_id)}
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-section" style={{ marginTop: '1.5rem' }}>
            <h3>Bus Seat Maps</h3>
            <div className="form-row">
              {buses.map((bus) => (
                <button
                  key={bus.bus_id}
                  className="btn btn-outline"
                  type="button"
                  onClick={() => setSelectedBusId(bus.bus_id)}
                >
                  View {bus.bus_number}
                </button>
              ))}
            </div>
            {selectedBusId && (
              <div style={{ marginTop: '1rem' }}>
                {(() => {
                  const selectedBus = buses.find((bus) => bus.bus_id === selectedBusId);
                  if (!selectedBus) return null;
                  const busAllocations = allocations.filter((a) => a.bus_id === selectedBusId);
                  return (
                    <BusSeatMap
                      capacity={selectedBus.capacity}
                      staffSeats={selectedBus.staff_seats || 0}
                      girlSeats={selectedBus.girl_seats || 0}
                      boySeats={selectedBus.boy_seats || 0}
                      seatingType={selectedBus.seating_type || '2+2'}
                      allocations={busAllocations}
                    />
                  );
                })()}
              </div>
            )}
          </div>

          <div className="form-section" style={{ marginTop: '1.5rem' }}>
            <h3>Rider Report</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select value={reportRole} onChange={(e) => setReportRole(e.target.value as any)}>
                  <option value="all">All</option>
                  <option value="student">Students</option>
                  <option value="faculty">Staff</option>
                </select>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={reportFilters.name}
                  onChange={(e) => setReportFilters({ ...reportFilters, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Reg No / Staff ID</label>
                <input
                  type="text"
                  value={reportFilters.person_id}
                  onChange={(e) => setReportFilters({ ...reportFilters, person_id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Seat #</label>
                <input
                  type="text"
                  value={reportFilters.seat_number}
                  onChange={(e) => setReportFilters({ ...reportFilters, seat_number: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>
                <input
                  type="text"
                  value={reportFilters.branch}
                  onChange={(e) => setReportFilters({ ...reportFilters, branch: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={reportFilters.year}
                  onChange={(e) => setReportFilters({ ...reportFilters, year: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input
                  type="text"
                  value={reportFilters.gender}
                  onChange={(e) => setReportFilters({ ...reportFilters, gender: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input
                  type="text"
                  value={reportFilters.academic_year}
                  onChange={(e) => setReportFilters({ ...reportFilters, academic_year: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Program</label>
                <input
                  type="text"
                  value={reportFilters.program}
                  onChange={(e) => setReportFilters({ ...reportFilters, program: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Graduation</label>
                <input
                  type="text"
                  value={reportFilters.graduation}
                  onChange={(e) => setReportFilters({ ...reportFilters, graduation: e.target.value })}
                />
              </div>
              <button type="button" className="btn btn-outline" onClick={exportRidersCsv}>
                Export CSV
              </button>
            </div>

            <div className="data-table-container" style={{ marginTop: '1rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Seat #</th>
                    <th>Gender</th>
                    <th>Year</th>
                    <th>Branch</th>
                    <th>Program</th>
                    <th>Graduation</th>
                    <th>Academic Year</th>
                    <th>Route</th>
                    <th>Stop</th>
                    <th>Bus Fees Paid</th>
                    <th>Extra Fields</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRiders.map((rider) => {
                    const allocation = allocations.find(
                      (a) => a.user_id === rider.person_id && a.role === rider.role,
                    );
                    return (
                      <tr key={`${rider.role}-${rider.person_id}`}>
                        <td>{rider.role === 'faculty' ? 'staff' : rider.role}</td>
                        <td>{rider.person_id}</td>
                        <td>{rider.name || '-'}</td>
                        <td>{allocation?.seat_number ?? '-'}</td>
                        <td>{rider.gender || '-'}</td>
                        <td>{rider.year || '-'}</td>
                        <td>{rider.branch || '-'}</td>
                        <td>{rider.program || '-'}</td>
                        <td>{rider.graduation || '-'}</td>
                        <td>{rider.academic_year || '-'}</td>
                        <td>{rider.route_name || '-'}</td>
                        <td>{rider.stop_name || '-'}</td>
                        <td>{rider.bus_fees_paid === true ? 'Yes' : rider.bus_fees_paid === false ? 'No' : '-'}</td>
                        <td>{rider.extra_fields ? JSON.stringify(rider.extra_fields) : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SeatAllocationManagement;
