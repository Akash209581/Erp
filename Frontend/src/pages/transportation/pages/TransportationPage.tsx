import React from 'react';
import StudentTransportDashboard from '../dashboards/StudentTransportDashboard';
import FacultyTransportDashboard from '../dashboards/FacultyTransportDashboard';
import AdminTransportDashboard from '../dashboards/AdminTransportDashboard';
import BusManagement from './BusManagement';
import DriverManagement from './DriverManagement';
import RouteManagement from './RouteManagement';
import SeatAllocation from './SeatAllocation';
import DocumentManagement from './DocumentManagement';
import FuelAllocation from './FuelAllocation';
import BusBreakdown from './BusBreakdown';
import '../styles/TransportationPage.css';

const TransportationPage: React.FC<{ user: any }> = ({ user }) => {
  const role = (user?.user?.role || user?.role || '').toLowerCase();
  const [activeSection, setActiveSection] = React.useState<'dashboard' | 'buses' | 'drivers' | 'routes' | 'allocations' | 'documents' | 'fuel' | 'breakdowns'>(
    'dashboard'
  );

  if (!user) {
    return <div className="transportation-page">Please log in to access transportation information.</div>;
  }

  const isTransportAdmin = role === 'transport_manager' || role === 'admin';
  const isFaculty = role === 'faculty';
  const isStudent = role === 'student';

  return (
    <div className="transportation-page">
      {isTransportAdmin && (
        <>
          <nav className="admin-nav">
            <button 
              className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-btn ${activeSection === 'buses' ? 'active' : ''}`}
              onClick={() => setActiveSection('buses')}
            >
              🚍 Buses
            </button>
            <button 
              className={`nav-btn ${activeSection === 'drivers' ? 'active' : ''}`}
              onClick={() => setActiveSection('drivers')}
            >
              👨‍✈️ Drivers
            </button>
            <button 
              className={`nav-btn ${activeSection === 'routes' ? 'active' : ''}`}
              onClick={() => setActiveSection('routes')}
            >
              🗺️ Routes
            </button>
            <button 
              className={`nav-btn ${activeSection === 'allocations' ? 'active' : ''}`}
              onClick={() => setActiveSection('allocations')}
            >
              🎫 Allocations
            </button>
            <button 
              className={`nav-btn ${activeSection === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveSection('documents')}
            >
              📄 Documents
            </button>
            <button 
              className={`nav-btn ${activeSection === 'fuel' ? 'active' : ''}`}
              onClick={() => setActiveSection('fuel')}
            >
              ⛽ Fuel Allocation
            </button>
            <button 
              className={`nav-btn ${activeSection === 'breakdowns' ? 'active' : ''}`}
              onClick={() => setActiveSection('breakdowns')}
            >
              🧰 Bus Break Down
            </button>
          </nav>

          <div className="admin-content">
            {activeSection === 'dashboard' && <AdminTransportDashboard user={user} />}
            {activeSection === 'buses' && <BusManagement user={user} />}
            {activeSection === 'drivers' && <DriverManagement user={user} />}
            {activeSection === 'routes' && <RouteManagement user={user} />}
            {activeSection === 'allocations' && <SeatAllocation user={user} />}
            {activeSection === 'documents' && <DocumentManagement user={user} />}
            {activeSection === 'fuel' && <FuelAllocation user={user} />}
            {activeSection === 'breakdowns' && <BusBreakdown user={user} />}
          </div>
        </>
      )}

      {isFaculty && (
        <div className="faculty-content">
          <FacultyTransportDashboard user={user} />
        </div>
      )}

      {isStudent && (
        <div className="student-content">
          <StudentTransportDashboard user={user} />
        </div>
      )}
    </div>
  );
};

export default TransportationPage;
