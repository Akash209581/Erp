import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModulePlaceholder from './pages/ModulePlaceholder';

function App() {
  const [user, setUser] = React.useState<any>(null);

  const handleLogin = (role: string) => {
    setUser({ role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dean-aaa" element={<ModulePlaceholder title="Dean AAA" />} />
          <Route path="/dean-ar" element={<ModulePlaceholder title="Dean AR" />} />
          <Route path="/school-deans" element={<ModulePlaceholder title="School Deans" />} />
          <Route path="/registrar" element={<ModulePlaceholder title="Registrar" />} />
          <Route path="/pcf" element={<ModulePlaceholder title="PCF" />} />
          <Route path="/hostel" element={<ModulePlaceholder title="Hostel" />} />
          <Route path="/transportation" element={<ModulePlaceholder title="Transportation" />} />
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
