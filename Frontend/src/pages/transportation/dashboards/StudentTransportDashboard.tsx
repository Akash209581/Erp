import React, { useEffect, useState } from 'react';
import DigitalBusPass, { printBusPassOnly } from '../components/DigitalBusPass';
import LiveBusMap from '../components/LiveBusMap';
import '../styles/StudentTransportDashboard.css';

interface StudentTransport {
    allocation_id: number;
    bus_id: number;
    bus_number: string;
    route_name: string;
    seat_number: number;
    pickup_stop: string;
    driver_name: string;
    driver_phone: string;
    capacity: number;
    status: string;
}

interface RouteStop {
    stop_id: number;
    stop_name: string;
    stop_order: number;
}

// Helper: extract user info from whatever shape the auth gives us
function extractUser(user: any) {
    // After login, shape is: { access_token, user: { id, username, role } }
    // OR it might just be: { id, username, role }
    const inner = user?.user || user;
    return {
        id: inner?.id,
        username: inner?.username,
        role: inner?.role,
        firstName: inner?.first_name || inner?.firstName || '',
        lastName: inner?.last_name || inner?.lastName || '',
        name: inner?.name || `${inner?.first_name || ''} ${inner?.last_name || ''}`.trim(),
        // The allocation key - use username (registration number) as stored in transport_allocations
        userId: inner?.username || inner?.registerno || String(inner?.id || ''),
    };
}

const StudentTransportDashboard: React.FC<{ user: any }> = ({ user }) => {
    const [transportData, setTransportData] = useState<StudentTransport | null>(null);
    const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    const extracted = extractUser(user);

    useEffect(() => {
        fetchStudentTransport();
    }, []);

    const fetchStudentTransport = async () => {
        setLoading(true);
        setError('');

        const { userId, username } = extractUser(user);
        setDebugInfo(`userId="${userId}"`);

        if (!userId) {
            setError('Could not determine your user ID. Please log out and log in again.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/transport/dashboard/student/${userId}`);
            const result = await res.json();

            if (!result.data) {
                setError(`No transport allocation found for "${userId}". Please contact the transport admin.`);
                setLoading(false);
                return;
            }

            const d = result.data;
            setTransportData({
                allocation_id: d.allocation?.allocation_id ?? 0,
                bus_id: d.bus?.bus_id ?? d.allocation?.bus_id ?? 0,
                bus_number: d.bus?.bus_number ?? 'N/A',
                route_name: d.route?.route_name ?? 'Campus Route',
                seat_number: d.allocation?.seat_number ?? 0,
                pickup_stop: d.allocation?.pickup_stop ?? 'Campus',
                driver_name: d.bus?.driver?.driver_name ?? 'N/A',
                driver_phone: d.bus?.driver?.phone_number ?? 'N/A',
                capacity: d.bus?.capacity ?? 0,
                status: d.allocation?.status ?? 'active',
            });
            setRouteStops(Array.isArray(d.stops) ? d.stops : []);
        } catch (err: any) {
            setError('Failed to connect to the server. Please check your connection.');
            console.error('Transport fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="student-dashboard loading">
                <div className="loading-spinner">🚌</div>
                <p>Loading your transport details...</p>
            </div>
        );
    }

    if (!transportData || error) {
        return (
            <div className="student-dashboard">
                <div className="no-allocation">
                    <div className="no-allocation-icon">🚌</div>
                    <h2>Transport Information</h2>
                    <p className="info-message">
                        {error || 'You have not been assigned to any transport yet. Please contact the transport admin.'}
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: 12, marginTop: 16, fontSize: 12 }}>
                            <strong>Debug:</strong> {debugInfo} | User: {JSON.stringify(extractUser(user))}
                        </div>
                    )}
                    <button className="retry-btn" onClick={fetchStudentTransport}>
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    const displayName = extracted.name || extracted.username || 'Student';
    const displayId = extracted.username || String(extracted.id) || 'N/A';

    return (
        <div className="student-dashboard">
            <h1>🚌 My Transport Details</h1>

            <div className="dashboard-grid">
                <div className="info-card bus-info">
                    <div className="card-header">
                        <h3>🚍 Bus Information</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-row">
                            <span className="label">Bus Number:</span>
                            <span className="value highlight">{transportData.bus_number}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Capacity:</span>
                            <span className="value">{transportData.capacity} seats</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Status:</span>
                            <span className={`status-badge ${transportData.status}`}>{transportData.status}</span>
                        </div>
                    </div>
                </div>

                <div className="info-card seat-info">
                    <div className="card-header">
                        <h3>🎫 Your Seat</h3>
                    </div>
                    <div className="card-content">
                        <div className="seat-badge">SEAT {transportData.seat_number}</div>
                        <div className="seat-note">
                            {transportData.seat_number <= 5 ? '(Faculty Reserved)' : '(Student Seat)'}
                        </div>
                    </div>
                </div>

                <div className="info-card driver-info">
                    <div className="card-header">
                        <h3>👨‍✈️ Driver</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-row">
                            <span className="label">Name:</span>
                            <span className="value">{transportData.driver_name}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Contact:</span>
                            <a href={`tel:${transportData.driver_phone}`} className="value phone">
                                📱 {transportData.driver_phone}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="info-card route-info">
                    <div className="card-header">
                        <h3>🗺️ Route</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-row">
                            <span className="label">Route:</span>
                            <span className="value">{transportData.route_name}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Pickup Stop:</span>
                            <span className="value">{transportData.pickup_stop}</span>
                        </div>
                    </div>
                </div>
            </div>

            {routeStops.length > 0 && (
                <div className="route-stops-section">
                    <h2>📍 Route Stops</h2>
                    <div className="timeline">
                        {routeStops.map((stop, index) => (
                            <div
                                key={stop.stop_id}
                                className={`timeline-item ${index === 0 ? 'start' : index === routeStops.length - 1 ? 'end' : ''} ${stop.stop_name === transportData.pickup_stop ? 'pickup' : ''}`}
                            >
                                <div className="timeline-marker">
                                    {stop.stop_name === transportData.pickup_stop ? '📍' : '○'}
                                </div>
                                <div className="timeline-content">
                                    <div className="stop-name">{stop.stop_name}</div>
                                    <div className="stop-order">Stop {stop.stop_order}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bus-pass-section">
                <h2>🪪 Digital Bus Pass</h2>
                <DigitalBusPass
                    studentName={displayName}
                    registerno={displayId}
                    busNumber={transportData.bus_number}
                    seatNumber={transportData.seat_number}
                    routeName={transportData.route_name}
                />
                <button className="download-btn" onClick={() => printBusPassOnly('digital-bus-pass-card')}>
                    📥 Download / Print Pass
                </button>
            </div>

            <div className="live-tracking-section">
                <h2>📡 Live Bus Tracking</h2>
                <LiveBusMap busId={transportData.bus_id} busNumber={transportData.bus_number} />
            </div>

            <div className="fee-status-section">
                <h2>💳 Transport Fee Status</h2>
                <div className="fee-card">
                    <div className="fee-status pending">
                        <span className="fee-label">Monthly Fee</span>
                        <span className="fee-amount">₹500</span>
                        <span className="fee-indicator">Pending Payment</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTransportDashboard;
