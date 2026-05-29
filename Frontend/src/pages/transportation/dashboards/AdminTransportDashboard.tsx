import React, { useEffect, useState } from 'react';
import LiveBusMap from '../components/LiveBusMap';
import BusSeatMap from '../components/BusSeatMap';
import '../styles/AdminTransportDashboard.css';

interface TransportStats {
    totalBuses: number;
    totalDrivers: number;
    totalRoutes: number;
    totalStudents: number;
    totalFaculty: number;
}

interface Bus {
    bus_id: number;
    bus_number: string;
    capacity: number;
    status: string;
    staff_seats?: number;
    girl_seats?: number;
    boy_seats?: number;
}

interface Driver {
    driver_id: number;
    name: string;
    phone: string;
    status: string;
}

interface Route {
    route_id: number;
    route_name: string;
    start_point: string;
    end_point: string;
}

// Mock Data for "Frontend Only" Mode
const MOCK_STATS: TransportStats = {
    totalBuses: 8,
    totalDrivers: 10,
    totalRoutes: 5,
    totalStudents: 124,
    totalFaculty: 15,
};

const MOCK_BUSES: Bus[] = [
    { bus_id: 1, bus_number: 'VFSTR-BUS-01', capacity: 52, status: 'active' },
    { bus_id: 2, bus_number: 'VFSTR-BUS-02', capacity: 45, status: 'active' },
    { bus_id: 3, bus_number: 'VFSTR-BUS-03', capacity: 52, status: 'maintenance' },
    { bus_id: 4, bus_number: 'VFSTR-BUS-04', capacity: 50, status: 'active' },
    { bus_id: 5, bus_number: 'VFSTR-BUS-05', capacity: 52, status: 'active' },
];

const MOCK_DRIVERS: Driver[] = [
    { driver_id: 1, name: 'Ravi Kumar', phone: '9848012345', status: 'available' },
    { driver_id: 2, name: 'Srinivas Rao', phone: '9988776655', status: 'on_duty' },
    { driver_id: 3, name: 'M. Sattar', phone: '9440123456', status: 'available' },
    { driver_id: 4, name: 'V. Naidu', phone: '9550123456', status: 'off_duty' },
];

const MOCK_ROUTES: Route[] = [
    { route_id: 1, route_name: 'Guntur - Campus', start_point: 'Guntur', end_point: 'Campus' },
    { route_id: 2, route_name: 'Vijayawada - Campus', start_point: 'Vijayawada', end_point: 'Campus' },
    { route_id: 3, route_name: 'Tenali - Campus', start_point: 'Tenali', end_point: 'Campus' },
];

const AdminTransportDashboard: React.FC<{ user: any }> = ({ user }) => {
    const [stats, setStats] = useState<TransportStats | null>(null);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeDemand, setRouteDemand] = useState<any[]>([]);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [busAllocations, setBusAllocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [documentAlerts, setDocumentAlerts] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
        fetchDocumentAlerts();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            // Base URL for the backend API
            const API_BASE = 'http://localhost:3000/transport';

            // Live Data Fetching
            const [busesRes, driversRes, routesRes, statsRes] = await Promise.all([
                fetch(`${API_BASE}/buses`),
                fetch(`${API_BASE}/drivers`),
                fetch(`${API_BASE}/routes`),
                fetch(`${API_BASE}/dashboard/admin-stats`)
            ]);

            const [busesResult, driversResult, routesResult, statsResult, demandRes] = await Promise.all([
                busesRes.json(),
                driversRes.json(),
                routesRes.json(),
                statsRes.json(),
                fetch(`${API_BASE}/route-demand`).then(r => r.json()).catch(() => ({ data: [] }))
            ]);

            setBuses(Array.isArray(busesResult.data) ? busesResult.data : []);
            setDrivers(Array.isArray(driversResult.data) ? driversResult.data : []);
            setRoutes(Array.isArray(routesResult.data) ? routesResult.data : []);
            setRouteDemand(Array.isArray(demandRes.data) ? demandRes.data : []);
            
            if (statsResult.data) {
                setStats(statsResult.data);
            } else {
                setStats({
                    totalBuses: busesResult.data?.length || 0,
                    totalDrivers: driversResult.data?.length || 0,
                    totalRoutes: routesResult.data?.length || 0,
                    totalStudents: 0,
                    totalFaculty: 0,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
            console.error('Transport Dashboard Error:', err);

            // Fallback to mock data for demonstration if backend is down
            setBuses(MOCK_BUSES);
            setDrivers(MOCK_DRIVERS);
            setRoutes(MOCK_ROUTES);
            setStats(MOCK_STATS);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocumentAlerts = async () => {
        try {
            const res = await fetch('http://localhost:3000/transport/documents/alerts');
            const data = await res.json();
            setDocumentAlerts(Array.isArray(data.data) ? data.data : []);
        } catch {
            // Silently ignore — not critical
        }
    };

    const handleAutoAllocate = async (busId: number) => {
        try {
            const res = await fetch(`http://localhost:3000/transport/auto-allocate/${busId}`, {
                method: 'POST'
            });
            const result = await res.json();
            alert(result.message);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to run auto-allocation');
        }
    };

    const fetchBusAllocations = async (busId: number) => {
        try {
            const res = await fetch(`http://localhost:3000/transport/allocations/bus/${busId}`);
            const data = await res.json();
            setBusAllocations(data.data || []);
        } catch (err) {
            console.error('Failed to fetch allocations');
        }
    };

    const openBusMap = (bus: Bus) => {
        setSelectedBus(bus);
        fetchBusAllocations(bus.bus_id);
    };

    if (loading) {
        return <div className="admin-dashboard loading">Loading admin dashboard...</div>;
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="error-box">
                    <p className="error-message">{error}</p>
                    <button className="retry-btn" onClick={fetchDashboardData}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h1>🚌 Transportation Admin Dashboard</h1>

            {/* ===== COMPLIANCE ALERTS BANNER ===== */}
            {documentAlerts.length > 0 && (
                <div className="compliance-alerts-panel">
                    <div className="compliance-alerts-header">
                        <span className="alerts-icon">⚠️</span>
                        <strong>Compliance Alerts</strong>
                        <span className="alerts-count">{documentAlerts.length} document{documentAlerts.length > 1 ? 's' : ''} require attention</span>
                    </div>
                    <div className="alerts-list">
                        {documentAlerts.map((alert, i) => (
                            <div key={i} className={`alert-item ${alert.daysUntilExpiry < 0 ? 'alert-expired' : alert.daysUntilExpiry <= 2 ? 'alert-critical' : 'alert-warning'}`}>
                                <span className="alert-bus">🚍 {alert.bus?.bus_number || `Bus #${alert.bus_id}`}</span>
                                <span className="alert-doc">{alert.documentType?.name}</span>
                                <span className="alert-days">
                                    {alert.daysUntilExpiry < 0
                                        ? `Expired ${Math.abs(alert.daysUntilExpiry)} day${Math.abs(alert.daysUntilExpiry) > 1 ? 's' : ''} ago!`
                                        : alert.daysUntilExpiry === 0
                                        ? 'Expires TODAY!'
                                        : `Expires in ${alert.daysUntilExpiry} day${alert.daysUntilExpiry > 1 ? 's' : ''}`
                                    }
                                </span>
                                <span className="alert-expiry">{new Date(alert.expiry_date).toLocaleDateString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card buses">
                    <div className="stat-icon">🚍</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Buses</div>
                        <div className="stat-number">{stats?.totalBuses || 0}</div>
                    </div>
                </div>

                <div className="stat-card drivers">
                    <div className="stat-icon">👨‍✈️</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Drivers</div>
                        <div className="stat-number">{stats?.totalDrivers || 0}</div>
                    </div>
                </div>

                <div className="stat-card routes">
                    <div className="stat-icon">🗺️</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Routes</div>
                        <div className="stat-number">{stats?.totalRoutes || 0}</div>
                    </div>
                </div>

                <div className="stat-card students">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <div className="stat-label">Students Using Transport</div>
                        <div className="stat-number">{stats?.totalStudents || 0}</div>
                    </div>
                </div>

                <div className="stat-card faculty">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-content">
                        <div className="stat-label">Faculty Using Transport</div>
                        <div className="stat-number">{stats?.totalFaculty || 0}</div>
                    </div>
                </div>
            </div>

            {/* Quick Overview Tables */}
            <div className="overview-section">
                <div className="overview-card">
                    <h2>Recent Buses</h2>
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Bus Number</th>
                                    <th>Capacity</th>
                                    <th>Staff/Girls/Boys</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buses.slice(0, 5).map((bus) => (
                                    <tr key={bus.bus_id}>
                                        <td>{bus.bus_number}</td>
                                        <td>{bus.capacity} seats</td>
                                        <td>
                                            <div className="seat-splits">
                                                <span>S: {bus.staff_seats || 5}</span>
                                                <span>G: {bus.girl_seats || 20}</span>
                                                <span>B: {bus.boy_seats || 20}</span>
                                            </div>
                                        </td>
                                        <td><span className={`status-badge ${bus.status}`}>{bus.status}</span></td>
                                        <td>
                                            <div className="action-cell">
                                                <button 
                                                    className="auto-allocate-btn"
                                                    onClick={() => handleAutoAllocate(bus.bus_id)}
                                                >
                                                    Auto-Allocate
                                                </button>
                                                <button 
                                                    className="view-map-btn"
                                                    onClick={() => openBusMap(bus)}
                                                >
                                                    💺 View Map
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {buses.length === 0 && (
                            <div className="empty-state">No buses found</div>
                        )}
                    </div>
                </div>

                <div className="overview-card wide">
                    <h2>🌍 Bird's Eye View (Live Tracking)</h2>
                    <LiveBusMap busId={0} busNumber="" isBirdEye={true} />
                </div>

                <div className="overview-card">
                    <h2>📉 Route Demand (Unallocated Students)</h2>
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Route</th>
                                    <th>Count</th>
                                    <th>Potential Bus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routeDemand.length > 0 ? routeDemand.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.route_name}</td>
                                        <td><span className="demand-count">{d.count} students</span></td>
                                        <td>{d.count > 50 ? 'Requires 2nd Bus' : 'Standard Bus OK'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="empty-state">No unallocated students found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="overview-card">
                    <h2>Recent Drivers</h2>
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.slice(0, 5).map((driver) => (
                                    <tr key={driver.driver_id}>
                                        <td>{driver.name}</td>
                                        <td>{driver.phone}</td>
                                        <td><span className={`status-badge ${driver.status}`}>{driver.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {drivers.length === 0 && (
                            <div className="empty-state">No drivers found</div>
                        )}
                    </div>
                </div>

                <div className="overview-card">
                    <h2>Routes Overview</h2>
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Route Name</th>
                                    <th>Start</th>
                                    <th>End</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routes.slice(0, 5).map((route) => (
                                    <tr key={route.route_id}>
                                        <td>{route.route_name}</td>
                                        <td>{route.start_point}</td>
                                        <td>{route.end_point}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {routes.length === 0 && (
                            <div className="empty-state">No routes found</div>
                        )}
                    </div>
                </div>
            </div>
            {selectedBus && (
                <div className="modal-overlay" onClick={() => setSelectedBus(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Seat Map: {selectedBus.bus_number}</h3>
                            <button className="close-modal" onClick={() => setSelectedBus(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <BusSeatMap 
                                capacity={selectedBus.capacity}
                                staffSeats={selectedBus.staff_seats || 5}
                                girlSeats={selectedBus.girl_seats || 20}
                                boySeats={selectedBus.boy_seats || 20}
                                allocations={busAllocations}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTransportDashboard;
