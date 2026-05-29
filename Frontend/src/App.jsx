import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentAdmission from './pages/finance/StudentAdmission';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import AdmissionReport from './pages/finance/AdmissionReport';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentHostel from './pages/hostel/student/StudentHostel';
import StudentComplaints from './pages/hostel/student/StudentComplaints';
import StudentVisitors from './pages/hostel/student/StudentVisitors';
import WardenHostel from './pages/hostel/warden/WardenHostel';
import WardenComplaints from './pages/hostel/warden/WardenComplaints';
import WardenVisitors from './pages/hostel/warden/WardenVisitors';
import AdminHostel from './pages/hostel/admin/AdminHostel';
import AdminComplaints from './pages/hostel/admin/AdminComplaints';
import AdminVisitors from './pages/hostel/admin/AdminVisitors';
import AdminStudents from './pages/hostel/admin/AdminStudents';
import WardenAttendance from './pages/hostel/warden/WardenAttendance';
import { ToastProvider } from './context/ToastContext';
import ModulePlaceholder from './pages/ModulePlaceholder';

import { 
  AdminTransportDashboard, 
  StudentTransportDashboard, 
  FacultyTransportDashboard,
  TransportationPage
} from './pages/transportation';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.access_token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading...</div>;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ToastProvider>
      <Router>
        <div className="flex h-screen bg-slate-50">
          <Sidebar user={user} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto ml-80 p-0">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={
                user?.user?.role === 'student' || user?.role === 'student' 
                  ? <StudentDashboard user={user} /> 
                  : <Dashboard user={user} />
              } />
              
              {/* Finance Module */}
              <Route path="/student-admission" element={<StudentAdmission user={user} />} />
              <Route path="/finance-dashboard" element={<FinanceDashboard user={user} />} />
              <Route path="/admission-report" element={<AdmissionReport user={user} />} />
              
              {/* Library Module */}
              <Route path="/library" element={<div className="p-12"><h1 className="text-3xl font-black text-slate-900">Library Module</h1><p className="text-slate-500 mt-4">Coming soon...</p></div>} />
              
              {/* Hostel Module */}
              <Route path="/hostel" element={
                user?.user?.role === 'student' || user?.role === 'student'
                  ? <StudentHostel user={user} />
                  : user?.user?.role === 'warden' || user?.role === 'warden'
                  ? <WardenHostel user={user} />
                  : <AdminHostel user={user} />
              } />
              <Route path="/hostel/attendance" element={
                user?.user?.role === 'warden' || user?.role === 'warden' || user?.user?.role === 'admin' || user?.role === 'admin'
                  ? <WardenAttendance user={user} />
                  : <Navigate to="/dashboard" />
              } />
              <Route path="/hostel/complaints" element={
                user?.user?.role === 'student' || user?.role === 'student'
                  ? <StudentComplaints user={user} />
                  : user?.user?.role === 'warden' || user?.role === 'warden'
                  ? <WardenComplaints user={user} />
                  : <AdminComplaints user={user} />
              } />
              <Route path="/hostel/visitors" element={
                user?.user?.role === 'student' || user?.role === 'student'
                  ? <StudentVisitors user={user} />
                  : user?.user?.role === 'warden' || user?.role === 'warden'
                  ? <WardenVisitors user={user} />
                  : <AdminVisitors user={user} />
              } />
              <Route path="/hostel/admin/students" element={<AdminStudents user={user} />} />
              
              {/* Transportation Module */}
              <Route path="/transportation" element={<TransportRoute />} />
              
              <Route path="/student-master" element={<div className="p-6">Student Master Module Under Construction</div>} />
              <Route path="/course-management" element={<div className="p-6">Course Management Module Under Construction</div>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;