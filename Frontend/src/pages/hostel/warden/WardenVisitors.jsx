import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck,
  ShieldX,
  History,
  MoreVertical,
  Calendar
} from 'lucide-react';

import { useToast } from '../../../context/ToastContext';

const WardenVisitors = ({ user }) => {
  const { showToast } = useToast();
  const [visitors, setVisitors] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visitors'); // 'visitors' or 'outings'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const [visitorsRes, leavesRes] = await Promise.all([
        fetch('http://localhost:3000/hostel/warden/visitors', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/hostel/warden/leaves', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (visitorsRes.ok) setVisitors(await visitorsRes.json());
      if (leavesRes.ok) setLeaves(await leavesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error connecting to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisitorStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/hostel/warden/visitors/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        showToast(`Visitor status updated to ${status}.`, 'success');
        fetchData();
      } else {
        showToast('Failed to update visitor status', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/hostel/warden/leaves/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        showToast(`Outing request ${status} successfully.`, 'success');
        fetchData();
      } else {
        showToast('Failed to update outing status', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  return (
    <div className='p-8 space-y-10 animate-in fade-in duration-300'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Security Portal • Gate Control</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Passes & Gate Approvals</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
           <div className='flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl'>
              <ShieldCheck size={16} className='text-emerald-600' />
              <span className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>
                {activeTab === 'visitors' 
                  ? `${visitors.filter(v => v.status === 'Pending').length} Pending Visitors`
                  : `${leaves.filter(l => l.status === 'Pending').length} Pending Outings`
                }
              </span>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
        <div className='p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
           <div className='flex gap-4 border-b border-slate-100 pb-0 sm:border-none sm:pb-0'>
              <button 
                onClick={() => setActiveTab('visitors')}
                className={`pb-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'visitors' ? 'border-emerald-600 text-slate-900' : 'border-transparent text-slate-400'}`}
              >
                Visitor Passes
              </button>
              <button 
                onClick={() => setActiveTab('outings')}
                className={`pb-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'outings' ? 'border-emerald-600 text-slate-900' : 'border-transparent text-slate-400'}`}
              >
                Student Outings
              </button>
           </div>
           <div className='flex items-center gap-2'>
              <div className='relative'>
                 <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                 <input type="text" placeholder="Search passes..." className='pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none w-64' />
              </div>
           </div>
        </div>

        <div className='overflow-x-auto'>
          {activeTab === 'visitors' ? (
            <table className='w-full text-left border-collapse'>
               <thead className='bg-slate-50/50'>
                  <tr>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Visitor Info</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Resident Info</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Schedule</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Status</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Verification</th>
                  </tr>
               </thead>
               <tbody className='divide-y divide-slate-50'>
                  {visitors.length > 0 ? visitors.map((vis, i) => (
                   <tr key={i} className='hover:bg-slate-50/50 transition-colors'>
                      <td className='px-8 py-5'>
                         <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm'>
                               {vis.visitorName.charAt(0)}
                            </div>
                            <div>
                               <p className='text-sm font-bold text-slate-900'>{vis.visitorName}</p>
                               <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>{vis.relation}</p>
                            </div>
                         </div>
                      </td>
                      <td className='px-8 py-5'>
                         <p className='text-xs font-bold text-slate-700'>{vis.registerno}</p>
                         <p className='text-[10px] text-slate-400 font-medium'>Hostel Inhabitant</p>
                      </td>
                      <td className='px-8 py-5'>
                         <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-2 text-xs font-bold text-slate-700'>
                               <Calendar size={12} className='text-slate-400' />
                               {new Date(vis.checkIn).toLocaleDateString()}
                            </div>
                            <div className='flex items-center gap-2 text-[10px] font-medium text-slate-400'>
                               <Clock size={12} className='text-slate-400' />
                               {new Date(vis.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                         </div>
                      </td>
                      <td className='px-8 py-5'>
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                           vis.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                           vis.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                         }`}>
                           {vis.status}
                         </span>
                      </td>
                      <td className='px-8 py-5'>
                         <div className='flex items-center gap-2'>
                            <button 
                              onClick={() => updateVisitorStatus(vis.id, 'Approved')}
                              className='px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors shadow-sm'
                            >
                               Approve
                            </button>
                            <button 
                              onClick={() => updateVisitorStatus(vis.id, 'Rejected')}
                              className='px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors shadow-sm'
                            >
                               Reject
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan="5" className='px-8 py-20 text-center opacity-30 grayscale'>
                         <div className='flex flex-col items-center gap-3'>
                            <UserPlus size={48} />
                            <p className='text-sm font-black text-slate-500 uppercase tracking-widest'>No visitor requests</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
          ) : (
            <table className='w-full text-left border-collapse'>
               <thead className='bg-slate-50/50'>
                  <tr>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Student Info</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Outing Type & Reason</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Schedule</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Status</th>
                     <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Verification</th>
                  </tr>
               </thead>
               <tbody className='divide-y divide-slate-50'>
                  {leaves.length > 0 ? leaves.map((leave, i) => (
                    <tr key={i} className='hover:bg-slate-50/50 transition-colors'>
                       <td className='px-8 py-5'>
                          <div className='flex items-center gap-3'>
                             <div className='w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm'>
                                {leave.registerno.charAt(0)}
                             </div>
                             <div>
                                <p className='text-sm font-bold text-slate-900'>{leave.registerno}</p>
                                <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>Inhabitant</p>
                             </div>
                          </div>
                       </td>
                       <td className='px-8 py-5'>
                          <p className='text-xs font-bold text-slate-700'>{leave.type}</p>
                          <p className='text-[10px] text-slate-400 font-medium max-w-xs truncate'>{leave.reason}</p>
                       </td>
                       <td className='px-8 py-5'>
                          <div className='flex flex-col gap-1'>
                             <div className='flex items-center gap-2 text-xs font-bold text-slate-700'>
                                <Calendar size={12} className='text-slate-400' />
                                {new Date(leave.startDate).toLocaleDateString()}
                             </div>
                             <div className='flex items-center gap-2 text-[10px] font-medium text-slate-400'>
                                <Clock size={12} className='text-slate-400' />
                                {new Date(leave.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                          </div>
                       </td>
                       <td className='px-8 py-5'>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                            leave.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {leave.status}
                          </span>
                       </td>
                       <td className='px-8 py-5'>
                          <div className='flex items-center gap-2'>
                             <button 
                               onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                               className='px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors shadow-sm'
                             >
                                Approve
                             </button>
                             <button 
                               onClick={() => updateLeaveStatus(leave.id, 'Rejected')}
                               className='px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors shadow-sm'
                             >
                                Reject
                             </button>
                          </div>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan="5" className='px-8 py-20 text-center opacity-30 grayscale'>
                          <div className='flex flex-col items-center gap-3'>
                             <UserPlus size={48} />
                             <p className='text-sm font-black text-slate-500 uppercase tracking-widest'>No outing requests</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
          )}
         </div>
      </div>
    </div>
  );
};

export default WardenVisitors;
