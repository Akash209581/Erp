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

const Dashboard = ({ user }) => {
  const [admissions, setAdmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/students/finance', {
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

  const stats = [
    { label: 'My Total Admissions', value: admissions.length.toString(), trend: 'Real-time', color: 'from-blue-600 to-indigo-600', icon: <UserCheck size={20} /> },
    { label: 'Pending Verification', value: '12', trend: '+2 today', color: 'from-emerald-500 to-teal-600', icon: <Clock size={20} /> },
    { label: 'Recent Success Rate', value: '98%', trend: 'Stable', color: 'from-amber-500 to-orange-600', icon: <TrendingUp size={20} /> },
    { label: 'Active Students', value: '24,582', trend: '+12%', color: 'from-indigo-600 to-violet-600', icon: <Users size={20} /> },
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
          <button className='px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-lg shadow-black/10 tracking-widest uppercase hover:scale-[1.02] transition-transform flex items-center gap-2'>
            <ArrowUpRight size={14} />
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

      {/* Main Content Sections */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        <div className='xl:col-span-2 space-y-6'>
          <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
             <div className='p-8 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4'>
               <div>
                 <h3 className='text-xl font-black text-slate-900 tracking-tight'>My Recent Admissions</h3>
                 <p className='text-xs text-slate-400 font-medium mt-1'>Records you have created in the system</p>
               </div>
               <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                    <input type="text" placeholder="Search VUID..." className='pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none w-48' />
                  </div>
                  <button className='p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors'>
                    <Filter size={16} />
                  </button>
               </div>
             </div>
             
             <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                   <thead>
                      <tr className='bg-slate-50/50'>
                         <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Student Details</th>
                         <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>VUID</th>
                         <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Course/Branch</th>
                         <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Date</th>
                         <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Action</th>
                      </tr>
                   </thead>
                   <tbody className='divide-y divide-slate-50'>
                      {admissions.length > 0 ? (
                        admissions.map((student) => (
                          <tr key={student.vuid} className='hover:bg-slate-50/50 transition-colors group'>
                            <td className='px-8 py-5'>
                               <div className='flex items-center gap-3'>
                                  <div className='w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm'>
                                    {student.name.charAt(0)}
                                  </div>
                                  <div>
                                     <p className='text-sm font-bold text-slate-900'>{student.name}</p>
                                     <p className='text-[10px] text-slate-400 font-medium'>{student.studentemailid}</p>
                                  </div>
                               </div>
                            </td>
                            <td className='px-8 py-5'>
                               <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-black font-mono border border-indigo-100'>
                                 {student.vuid}
                               </span>
                            </td>
                            <td className='px-8 py-5'>
                               <p className='text-xs font-bold text-slate-700'>{student.coursecode}</p>
                               <p className='text-[10px] text-slate-400 font-medium'>{student.branchcode}</p>
                            </td>
                            <td className='px-8 py-5'>
                               <p className='text-xs font-bold text-slate-700'>{new Date(student.createdAt).toLocaleDateString()}</p>
                               <p className='text-[10px] text-slate-400 font-medium'>{new Date(student.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </td>
                            <td className='px-8 py-5'>
                               <button className='p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all'>
                                 <ExternalLink size={16} />
                               </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                           <td colSpan="5" className='px-8 py-12 text-center'>
                              <div className='flex flex-col items-center gap-3 grayscale opacity-30'>
                                <Users size={48} />
                                <p className='text-sm font-bold text-slate-500'>No admissions recorded yet.</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden'>
            <div className='absolute top-[-20%] right-[-20%] w-48 h-48 bg-blue-600/20 rounded-full blur-3xl'></div>
            <h3 className='text-xl font-black tracking-tight mb-2'>Data Sync Status</h3>
            <p className='text-slate-400 text-xs font-bold mb-6'>Master DB synchronized @ just now</p>
            <div className='flex items-center gap-2 mb-8'>
               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className='h-8 flex-1 bg-emerald-500/20 rounded-sm border-b-2 border-emerald-500'></div>
               ))}
            </div>
            <button className='w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors'>Force Database Re-index</button>
          </div>

          <div className='bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm'>
             <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-black text-slate-900 tracking-tight'>Quick Access</h3>
             </div>
             <div className='space-y-4'>
                <button className='w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group'>
                   <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm'>
                        <Search size={18} />
                      </div>
                      <span className='text-xs font-bold text-slate-700'>Student Search</span>
                   </div>
                   <ChevronRight size={14} className='text-slate-300' />
                </button>
                <button className='w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group'>
                   <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm'>
                        <Save size={18} />
                      </div>
                      <span className='text-xs font-bold text-slate-700'>Draft Admissions</span>
                   </div>
                   <ChevronRight size={14} className='text-slate-300' />
                </button>
             </div>
          </div>
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