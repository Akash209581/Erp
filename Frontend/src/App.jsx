import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModulePlaceholder from './pages/ModulePlaceholder';

import { 
  AdminTransportDashboard, 
  StudentTransportDashboard, 
  FacultyTransportDashboard,
  TransportationPage
} from './pages/transportation';

function App() {
  const [user, setUser] = React.useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const TransportRoute = () => {
    const role = (user?.user?.role || user?.role || '').toLowerCase();
    
    switch (role) {
      case 'admin':
      case 'transport_manager':
        return <TransportationPage user={user} />;
      case 'student':
        return <StudentTransportDashboard user={user} />;
      case 'faculty':
        return <FacultyTransportDashboard user={user} />;
      default:
        return (
          <div>
            <ModulePlaceholder title="Transportation" />
            <div style={{ padding: '20px', background: '#fff1f0', border: '1px solid #ffa39e', margin: '20px', borderRadius: '8px' }}>
              <p style={{ color: '#cf1322', fontWeight: 'bold' }}>Debug Info:</p>
              <p>Detected Role: <strong>"{role}"</strong></p>
              <p>User Object Structure: <code>{JSON.stringify(user)}</code></p>
            </div>
          </div>
        );
    }
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/dean-aaa" element={<ModulePlaceholder title="Dean AAA" />} />
          <Route path="/dean-ar" element={<ModulePlaceholder title="Dean AR" />} />
          <Route path="/school-deans" element={<ModulePlaceholder title="School Deans" />} />
          <Route path="/registrar" element={<ModulePlaceholder title="Registrar" />} />
          <Route path="/pcf" element={<ModulePlaceholder title="PCF" />} />
          <Route path="/hostel" element={<ModulePlaceholder title="Hostel" />} />
          <Route path="/transportation" element={<TransportRoute />} />
          <Route path="/finance" element={<ModulePlaceholder title="Finance" />} />
          <Route path="/ipm" element={<ModulePlaceholder title="IPM" />} />
          <Route path="/library" element={<ModulePlaceholder title="Library" />} />
          <Route path="/iqac" element={<ModulePlaceholder title="IQAC" />} />
          <Route path="/examination" element={<ModulePlaceholder title="Examination" />} />
          <Route path="/student-affairs" element={<ModulePlaceholder title="Student Affairs" />} />
          <Route path="/r-and-d" element={<ModulePlaceholder title="R&D" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;