import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  AlertCircle, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Activity,
  History
} from 'lucide-react';

const AdminComplaints = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      // Admin sees all complaints
      const response = await fetch('http://localhost:3000/hostel/warden/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setComplaints(await response.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Total Tickets', value: complaints.length, icon: <MessageSquare size={20} />, color: 'from-blue-600 to-indigo-600' },
    { label: 'Pending Help', value: complaints.filter(c => c.status === 'Pending').length, icon: <Clock size={20} />, color: 'from-amber-500 to-orange-600' },
    { label: 'Resolved Tickets', value: complaints.filter(c => c.status === 'Resolved').length, icon: <CheckCircle2 size={20} />, color: 'from-emerald-500 to-teal-600' },
    { label: 'Efficiency Rate', value: '94%', icon: <TrendingUp size={20} />, color: 'from-indigo-600 to-violet-600' },
  ];

  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Chief Warden • Global Analytics</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>System Complaints</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
           <button className='px-6 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-900/20 tracking-widest uppercase hover:scale-[1.02] transition-transform flex items-center gap-2'>
              <BarChart3 size={14} />
              Export Report
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
              <span className='px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-md border border-slate-100'>Live</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
        <div className='p-8 border-b border-slate-50 flex items-center justify-between'>
           <h3 className='text-xl font-black text-slate-900'>Master Ticket Log</h3>
           <div className='flex items-center gap-2'>
              <div className='relative'>
                 <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                 <input type="text" placeholder="Filter by register no..." className='pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none w-64' />
              </div>
           </div>
        </div>

        <div className='overflow-x-auto'>
           <table className='w-full text-left border-collapse'>
              <thead className='bg-slate-50/50'>
                 <tr>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Student</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Category</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Status</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Raised On</th>
                 </tr>
              </thead>
              <tbody className='divide-y divide-slate-50'>
                 {complaints.length > 0 ? complaints.map((comp, i) => (
                   <tr key={i} className='hover:bg-slate-50/50 transition-colors'>
                      <td className='px-8 py-5'>
                         <p className='text-sm font-bold text-slate-900'>{comp.registerno}</p>
                         <p className='text-[10px] text-slate-400 font-medium'>Resident</p>
                      </td>
                      <td className='px-8 py-5'>
                         <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest'>
                            {comp.category}
                         </span>
                      </td>
                      <td className='px-8 py-5'>
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                           comp.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                           comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                         }`}>
                           {comp.status}
                         </span>
                      </td>
                      <td className='px-8 py-5 text-[10px] font-bold text-slate-500'>
                         {new Date(comp.createdAt).toLocaleString()}
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan="4" className='px-8 py-12 text-center text-slate-400'>No tickets registered.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;
