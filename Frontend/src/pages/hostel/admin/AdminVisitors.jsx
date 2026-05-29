import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  History,
  ShieldCheck,
  Calendar,
  Activity,
  ArrowRight
} from 'lucide-react';

const AdminVisitors = ({ user }) => {
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/warden/visitors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setVisitors(await response.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Chief Warden • Access Analytics</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Global Visitor Logs</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
           <div className='flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl'>
              <ShieldCheck size={16} className='text-emerald-600' />
              <span className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>Security Synchronized</span>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
        <div className='p-8 border-b border-slate-50 flex items-center justify-between'>
           <h3 className='text-xl font-black text-slate-900'>Facility Access History</h3>
           <div className='flex items-center gap-2'>
              <div className='relative'>
                 <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                 <input type="text" placeholder="Search by student reg no..." className='pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none w-64' />
              </div>
           </div>
        </div>

        <div className='overflow-x-auto'>
           <table className='w-full text-left border-collapse'>
              <thead className='bg-slate-50/50'>
                 <tr>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Visitor Name</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Relation</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Student ID</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Check In</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Status</th>
                 </tr>
              </thead>
              <tbody className='divide-y divide-slate-50'>
                 {visitors.length > 0 ? visitors.map((vis, i) => (
                   <tr key={i} className='hover:bg-slate-50/50 transition-colors'>
                      <td className='px-8 py-5 text-sm font-bold text-slate-900'>{vis.visitorName}</td>
                      <td className='px-8 py-5 text-[11px] font-bold text-slate-500 uppercase'>{vis.relation}</td>
                      <td className='px-8 py-5 text-sm font-black text-indigo-600 font-mono'>{vis.registerno}</td>
                      <td className='px-8 py-5 text-[10px] font-bold text-slate-500'>
                         {new Date(vis.checkIn).toLocaleString()}
                      </td>
                      <td className='px-8 py-5'>
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                           vis.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                           vis.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                         }`}>
                           {vis.status}
                         </span>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan="5" className='px-8 py-12 text-center text-slate-400 font-bold'>No access logs found.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVisitors;
