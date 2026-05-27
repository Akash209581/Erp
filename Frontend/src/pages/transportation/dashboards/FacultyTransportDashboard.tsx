import React, { useEffect, useState } from 'react';
import '../styles/FacultyTransportDashboard.css';

interface FacultyTransport {
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
    route_id?: number;
}

interface RouteStop {
    stop_id: number;
    stop_name: string;
    stop_order: number;
}

const MOCK_FACULTY_TRANSPORT: FacultyTransport = {
    allocation_id: 201,
    bus_id: 2,
    bus_number: 'VFSTR-BUS-02',
    route_name: 'Vijayawada - Campus',
    seat_number: 3,
    pickup_stop: 'Benz Circle',
    driver_name: 'Srinivas Rao',
    driver_phone: '9988776655',
    capacity: 45,
    status: 'active',
};

const MOCK_ROUTE_STOPS: RouteStop[] = [
    { stop_id: 1, stop_name: 'Benz Circle', stop_order: 1 },
    { stop_id: 2, stop_name: 'Manipal Hospital', stop_order: 2 },
    { stop_id: 3, stop_name: 'Campus', stop_order: 3 },
];

const FacultyTransportDashboard: React.FC<{ user: any }> = ({ user }) => {
    const [transportData, setTransportData] = useState<FacultyTransport | null>(null);
    const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.user_id || user?.id) {
            fetchFacultyTransport();
        }
    }, [user?.user_id, user?.id]);

    const fetchFacultyTransport = async () => {
        try {
            setLoading(true);
            setError('');

            // Using Mock Data for now as requested for frontend demo
            setTimeout(() => {
                setTransportData(MOCK_FACULTY_TRANSPORT);
                setRouteStops(MOCK_ROUTE_STOPS);
                setLoading(false);
            }, 500);
        } catch (err) {
            setTransportData(MOCK_FACULTY_TRANSPORT);
            setRouteStops(MOCK_ROUTE_STOPS);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="faculty-dashboard loading">Loading transport information...</div>;
    }

    if (!transportData || error) {
        return (
            <div className="faculty-dashboard">
                <div className="no-allocation">
                    <div className="no-allocation-icon">🚌</div>
                    <h2>Transport Information</h2>
                    <p className="info-message">
                        {error || 'You haven\'t been assigned to any transport yet. Please contact the transport admin for allocation.'}
                    </p>
                    <button className="retry-btn" onClick={fetchFacultyTransport}>
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="faculty-dashboard">
            <h1>My Transport Details - Faculty</h1>

            <div className="dashboard-grid">
                <div className="info-card bus-info">
                    <div className="card-header">
                        <h3>🚍 Bus Information</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-row">
                            <span className="label">Bus Number:</span>
                            <span className="value">{transportData.bus_number}</span>
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
                        <div className="seat-badge faculty-seat">SEAT {transportData.seat_number}</div>
                        <div className="seat-note">Faculty Reserved Seat</div>
                    </div>
                </div>

                <div className="info-card driver-info">
                    <div className="card-header">
                        <h3>👨‍✈️ Driver Information</h3>
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
                        <h3>🗺️ Route Information</h3>
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
                <div className="bus-pass-card" id="digital-bus-pass">
                    <div className="pass-header">
                        <div className="university-logo">VFSTR</div>
                        <div className="pass-title">FACULTY BUS PASS</div>
                    </div>
                    <div className="pass-body">
                        <div className="pass-photo">
                            <span className="photo-placeholder">👤</span>
                        </div>
                        <div className="pass-details">
                            <div className="pass-row">
                                <span className="pass-label">Name:</span>
                                <span className="pass-value">{`${user?.first_name || ''} ${user?.last_name || ''}`}</span>
                            </div>
                            <div className="pass-row">
                                <span className="pass-label">ID:</span>
                                <span className="pass-value">{user?.user_id}</span>
                            </div>
                            <div className="pass-row">
                                <span className="pass-label">Bus No:</span>
                                <span className="pass-value">{transportData.bus_number}</span>
                            </div>
                            <div className="pass-row">
                                <span className="pass-label">Route:</span>
                                <span className="pass-value">{transportData.route_name}</span>
                            </div>
                            <div className="pass-row">
                                <span className="pass-label">Designation:</span>
                                <span className="pass-value">Faculty</span>
                            </div>
                        </div>
                        <div className="pass-qr">
                            <div className="qr-code">
                                <div className="qr-box"></div>
                                <div className="qr-label">SCAN TO VERIFY</div>
                            </div>
                        </div>
                    </div>
                    <div className="pass-footer">
                        VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY AND RESEARCH
                    </div>
                </div>
                <button
                    className="download-btn"
                    onClick={() => {
                        alert('Downloading Digital Bus Pass... Your pass will be saved as a PDF/Image.');
                    }}
                >
                    📥 Download Digital Pass
                </button>
            </div>

            <div className="live-tracking-section">
                <h2>📡 Live Bus Tracking</h2>
                <div className="tracking-map-container">
                    <div className="mock-map">
                        <div className="route-path"></div>
                        {routeStops.map((stop, index) => (
                            <div
                                key={stop.stop_id}
                                className={`stop-marker stop-${index + 1}`}
                                title={stop.stop_name}
                            >
                                <div className="marker-dot"></div>
                                <div className="marker-label">{stop.stop_name}</div>
                            </div>
                        ))}
                        <div className="bus-live-indicator">
                            <div className="bus-icon">🚌</div>
                            <div className="bus-pulse"></div>
                            <div className="bus-status">On the way to Campus</div>
                        </div>
                    </div>
                    <div className="tracking-info">
                        <div className="track-stat">
                            <span className="t-label">Last Updated:</span>
                            <span className="t-value">Just Now</span>
                        </div>
                        <div className="track-stat">
                            <span className="t-label">Estimated Arrival:</span>
                            <span className="t-value text-success">12 mins</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyTransportDashboard;
