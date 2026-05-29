import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  ExternalLink, 
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  Save
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [admissions, setAdmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/finance/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        setAdmissions(data);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const admissionsToday = admissions.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.createdAt).toDateString() === today;
  }).length;

  const stats = [
    { label: 'My Total Admissions', value: admissions.length.toString(), trend: 'Lifetime', color: 'from-blue-600 to-indigo-600', icon: <UserCheck size={20} /> },
    { label: 'Admissions Today', value: admissionsToday.toString(), trend: 'Real-time', color: 'from-emerald-500 to-teal-600', icon: <Clock size={20} /> },
  ];

  const username = user?.user?.username || user?.username || 'User';
  const role = user?.user?.role || user?.role || 'Guest';

  return (
    <div className='space-y-10'>
      {/* Welcome Section */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Portal Overview • Welcome, {username}</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900 capitalize'>{role} Dashboard</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
          <button 
            onClick={() => navigate('/admission-report')}
            className='px-6 py-2.5 bg-slate-900 text-white text-[11px] font-black rounded-xl shadow-xl shadow-slate-900/20 tracking-widest uppercase hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center gap-2 group'
          >
             <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
             Admission Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, i) => (
          <div key={i} className='bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-xl transition-all duration-300'>
            <div className={'absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ' + stat.color + ' opacity-[0.03] rounded-bl-[4rem]'}></div>
            <div className='flex items-center justify-between mb-4'>
               <p className='text-[11px] font-black text-slate-400 uppercase tracking-widest'>{stat.label}</p>
               <div className='p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-colors'>
                 {stat.icon}
               </div>
            </div>
            <div className='flex items-end justify-between'>
              <h3 className='text-3xl font-black text-slate-900 tracking-tighter'>{stat.value}</h3>
              <span className='px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-md border border-slate-100'>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group text-left">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Search size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 tracking-tight">Student Search</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Find records</p>
          </div>
        </button>
        <button className="flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group text-left">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <Save size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 tracking-tight">Draft Admissions</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">In-progress</p>
          </div>
        </button>
        <button className="flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group text-left">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 tracking-tight">Export Data</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CSV / PDF</p>
          </div>
        </button>
      </div>

      {/* Main Table Section */}
      <div className='bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden'>
         <div className='p-8 md:p-12 border-b border-slate-50 flex items-center justify-between flex-wrap gap-6'>
           <div>
             <h3 className='text-xl font-black text-slate-900 tracking-tight'>My Recent Admissions</h3>
             <p className='text-xs text-slate-400 font-bold uppercase tracking-widest mt-1'>Detailed student enrollment records</p>
           </div>
           <div className='flex items-center gap-4'>
              <div className='relative group'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors' size={16} />
                <input type="text" placeholder="Search VUID..." className='pl-12 pr-6 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500/20 transition-all outline-none w-64' />
              </div>
              <button className='p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors'>
                <Filter size={18} />
              </button>
           </div>
         </div>
         
         <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
               <thead>
                  <tr className='bg-slate-50/50'>
                     <th className='px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Student Details</th>
                     <th className='px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest'>VUID</th>
                     <th className='px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Course/Branch</th>
                     <th className='px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Date</th>
                     <th className='px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Created By</th>
                     <th className='px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center'>Action</th>
                  </tr>
               </thead>
               <tbody className='divide-y divide-slate-50'>
                  {admissions.length > 0 ? (
                    admissions.map((student) => (
                      <tr key={student.vuid} className='hover:bg-slate-50/50 transition-colors group'>
                        <td className='px-10 py-6'>
                           <div className='flex items-center gap-4'>
                              <div className='w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-base shadow-sm group-hover:scale-110 transition-transform'>
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                 <p className='text-sm font-black text-slate-900'>{student.name}</p>
                                 <p className='text-[10px] text-slate-400 font-bold'>{student.studentemailid}</p>
                              </div>
                           </div>
                        </td>
                        <td className='px-10 py-6'>
                           <span className='px-4 py-1.5 bg-white border-2 border-indigo-50 text-indigo-600 rounded-xl text-[11px] font-black font-mono shadow-sm'>
                             {student.vuid}
                           </span>
                        </td>
                        <td className='px-10 py-6'>
                           <p className='text-xs font-black text-slate-700'>{student.coursecode}</p>
                           <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>{student.branchcode}</p>
                        </td>
                        <td className='px-10 py-6'>
                           <p className='text-xs font-black text-slate-700'>{new Date(student.createdAt).toLocaleDateString()}</p>
                           <p className='text-[10px] text-slate-400 font-bold'>{new Date(student.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </td>
                        <td className='px-10 py-6'>
                           <div className='flex items-center gap-2'>
                             <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></div>
                             <div>
                               <p className='text-xs font-black text-slate-700 capitalize'>{student.createdBy}</p>
                               <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Authorized</p>
                             </div>
                           </div>
                        </td>
                        <td className='px-10 py-6 text-center'>
                           <button className='p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all active:scale-90'>
                             <ExternalLink size={18} />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan="6" className='px-10 py-20 text-center'>
                          <div className='flex flex-col items-center gap-4 grayscale opacity-20'>
                            <Users size={64} />
                            <p className='text-base font-black text-slate-500 tracking-tight'>No admissions recorded yet.</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default Dashboard;