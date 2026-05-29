import React, { useState } from 'react';
import { UserCircle2, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Dummy credentials bypass for development
    if (username === 'hostel_warden' && password === 'Warden@2026') {
      onLogin({ access_token: 'dummy-token', user: { username: 'hostel_warden', role: 'warden' } });
      setIsLoading(false);
      return;
    }
    if (username === 'chief_warden' && password === 'Admin@2026') {
      onLogin({ access_token: 'dummy-token', user: { username: 'chief_warden', role: 'admin' } });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 antialiased">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[480px] w-full">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] border border-slate-100 p-10 md:p-14 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B1A1A] rounded-3xl mb-8 shadow-xl shadow-red-900/20 rotate-3 ring-4 ring-red-50">
              <span className="text-white font-black text-3xl italic">V</span>
            </div>
            <h1 className="text-[32px] font-black tracking-tight text-slate-900 leading-tight uppercase">VFSTR Portal</h1>
            <p className="text-[#A16B47] font-black uppercase tracking-widest mt-3 text-[10px]">Access the e-governance system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#8B1A1A] transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-300 focus:bg-white focus:border-[#8B1A1A]/20 focus:ring-4 focus:ring-red-50 transition-all outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#8B1A1A] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-300 focus:bg-white focus:border-[#8B1A1A]/20 focus:ring-4 focus:ring-red-50 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-5 bg-[#8B1A1A] hover:bg-[#701414] disabled:bg-red-300 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-red-900/25 active:scale-[0.98] uppercase tracking-tighter"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Institutional Single Sign-On</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
