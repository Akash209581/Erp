import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentAdmission from './pages/finance/StudentAdmission';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import AdmissionReport from './pages/finance/AdmissionReport';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';

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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading...</div>;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
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
            <Route path="/hostel" element={<div className="p-12"><h1 className="text-3xl font-black text-slate-900">Hostel Module</h1><p className="text-slate-500 mt-4">Coming soon...</p></div>} />
            
            {/* Transportation Module */}
            <Route path="/transportation" element={<div className="p-12"><h1 className="text-3xl font-black text-slate-900">Transportation Module</h1><p className="text-slate-500 mt-4">Coming soon...</p></div>} />
            
            <Route path="/student-master" element={<div className="p-6">Student Master Module Under Construction</div>} />
            <Route path="/course-management" element={<div className="p-6">Course Management Module Under Construction</div>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;