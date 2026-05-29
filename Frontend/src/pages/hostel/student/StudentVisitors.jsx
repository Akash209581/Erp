import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus,
  Calendar,
  User,
  Heart,
  History,
  Send
} from 'lucide-react';

import { useToast } from '../../../context/ToastContext';

const StudentVisitors = ({ user }) => {
  const { showToast } = useToast();
  const [visitors, setVisitors] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visitors'); // 'visitors' or 'outings'
  const [showModal, setShowModal] = useState(false);
  const [showOutingModal, setShowOutingModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ visitorName: '', relation: '', checkIn: '' });
  const [newOuting, setNewOuting] = useState({ type: 'Outpass', startDate: '', endDate: '', reason: '' });

  const registerno = user?.user?.username || user?.username;

  useEffect(() => {
    fetchData();
  }, [registerno]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const [visitorsRes, leavesRes] = await Promise.all([
        fetch(`http://localhost:3000/hostel/student/visitors/${registerno}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/hostel/student/leaves/${registerno}`, {
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

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/student/visitor-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ...newVisitor, registerno })
      });
      if (response.ok) {
        setShowModal(false);
        setNewVisitor({ visitorName: '', relation: '', checkIn: '' });
        showToast('Visitor request submitted successfully.', 'success');
        fetchData();
      } else {
        showToast('Failed to submit visitor request', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const handleOutingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/student/leave', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ...newOuting, registerno })
      });
      if (response.ok) {
        setShowOutingModal(false);
        setNewOuting({ type: 'Outpass', startDate: '', endDate: '', reason: '' });
        showToast('Outpass / Leave request submitted successfully.', 'success');
        fetchData();
      } else {
        showToast('Failed to submit outing request', 'error');
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
          <p className='text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Safety & Access • Gate Passes Hub</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Passes & Gate Logs</h1>
        </div>
        <div className='flex gap-3'>
          <button 
            onClick={() => setShowModal(true)}
            className='px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-xl shadow-sm tracking-widest uppercase hover:bg-slate-50 transition-colors flex items-center gap-2'
          >
            <Plus size={14} />
            Request Visitor Pass
          </button>
          <button 
            onClick={() => setShowOutingModal(true)}
            className='px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-900/20 tracking-widest uppercase hover:scale-[1.02] transition-transform flex items-center gap-2'
          >
            <Plus size={14} />
            Apply For Outing
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        <div className='xl:col-span-2 space-y-6'>
           <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
              <div className='p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                 <div className='flex gap-4 border-b border-slate-100 pb-0 sm:border-none sm:pb-0'>
                    <button 
                      onClick={() => setActiveTab('visitors')}
                      className={`pb-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'visitors' ? 'border-emerald-600 text-slate-900' : 'border-transparent text-slate-400'}`}
                    >
                      Visitor Entry Passes
                    </button>
                    <button 
                      onClick={() => setActiveTab('outings')}
                      className={`pb-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'outings' ? 'border-emerald-600 text-slate-900' : 'border-transparent text-slate-400'}`}
                    >
                      Outing & Leave Passes
                    </button>
                 </div>
                 <div className='flex items-center gap-2'>
                    <div className='relative'>
                       <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                       <input type="text" placeholder="Search passes..." className='pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none w-48' />
                    </div>
                 </div>
              </div>
              <div className='overflow-x-auto'>
                {activeTab === 'visitors' ? (
                  <table className='w-full text-left border-collapse'>
                     <thead className='bg-slate-50/50'>
                        <tr>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Visitor Name</th>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Relation</th>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Check In</th>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Status</th>
                        </tr>
                     </thead>
                     <tbody className='divide-y divide-slate-50'>
                        {visitors.length > 0 ? visitors.map((vis, i) => (
                         <tr key={i} className='hover:bg-slate-50/50 transition-colors'>
                            <td className='px-8 py-5'>
                               <div className='flex items-center gap-3'>
                                  <div className='w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm'>
                                    {vis.visitorName.charAt(0)}
                                  </div>
                                  <p className='text-sm font-bold text-slate-900'>{vis.visitorName}</p>
                               </div>
                            </td>
                            <td className='px-8 py-5'>
                               <span className='px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest'>
                                 {vis.relation}
                               </span>
                            </td>
                            <td className='px-8 py-5'>
                               <p className='text-xs font-bold text-slate-700'>{new Date(vis.checkIn).toLocaleDateString()}</p>
                               <p className='text-[10px] text-slate-400 font-medium'>{new Date(vis.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
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
                            <td colSpan="4" className='px-8 py-12 text-center text-slate-400 font-bold text-sm opacity-30 uppercase tracking-widest'>No records found</td>
                          </tr>
                        )}
                     </tbody>
                  </table>
                ) : (
                  <table className='w-full text-left border-collapse'>
                     <thead className='bg-slate-50/50'>
                        <tr>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Outing Type</th>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Reason</th>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Schedule</th>
                           <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Status</th>
                        </tr>
                     </thead>
                     <tbody className='divide-y divide-slate-50'>
                        {leaves.length > 0 ? leaves.map((leave, i) => (
                          <tr key={i} className='hover:bg-slate-50/50 transition-colors'>
                             <td className='px-8 py-5'>
                                <div className='flex items-center gap-3'>
                                   <div className='w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm'>
                                     {leave.type.charAt(0)}
                                   </div>
                                   <p className='text-sm font-bold text-slate-900'>{leave.type}</p>
                                </div>
                             </td>
                             <td className='px-8 py-5'>
                                <p className='text-xs font-bold text-slate-700 max-w-xs truncate'>{leave.reason}</p>
                             </td>
                             <td className='px-8 py-5'>
                                <p className='text-xs font-bold text-slate-700'>
                                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </p>
                                <p className='text-[10px] text-slate-400 font-medium'>
                                  {new Date(leave.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                             </td>
                             <td className='px-8 py-5'>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                  leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                                  leave.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                  {leave.status}
                                </span>
                             </td>
                          </tr>
                        )) : (
                          <tr>
                             <td colSpan="4" className='px-8 py-12 text-center text-slate-400 font-bold text-sm opacity-30 uppercase tracking-widest'>No outing requests found</td>
                          </tr>
                        )}
                     </tbody>
                  </table>
                )}
              </div>
           </div>
        </div>

        <div className='space-y-6'>
           <div className='bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden'>
              <div className='absolute top-[-20%] right-[-20%] w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl'></div>
              <h3 className='text-xl font-black tracking-tight mb-2'>Security Note</h3>
              <p className='text-slate-400 text-xs font-bold mb-6'>Visitor policy guidelines</p>
              <ul className='space-y-4 text-[11px] font-bold text-slate-400 leading-relaxed'>
                 <li className='flex gap-3'><CheckCircle2 size={14} className='text-emerald-500 shrink-0' /> Visitors must carry valid Govt ID proof.</li>
                 <li className='flex gap-3'><CheckCircle2 size={14} className='text-emerald-500 shrink-0' /> Entry restricted after 08:00 PM.</li>
                 <li className='flex gap-3'><CheckCircle2 size={14} className='text-emerald-500 shrink-0' /> Maximum 2 visitors per student allowed.</li>
              </ul>
           </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm'>
           <div className='bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
              <div className='p-8 bg-emerald-600 text-white'>
                 <h3 className='text-xl font-black tracking-tight'>Visitor Entry Request</h3>
                 <p className='text-emerald-200 text-xs font-bold mt-1'>Fill in the visitor details</p>
              </div>
              <form onSubmit={handleVisitorSubmit} className='p-8 space-y-6'>
                 <div className='space-y-2'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Visitor Full Name</label>
                    <div className='relative'>
                       <User className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                       <input 
                         type="text" 
                         placeholder="e.g. John Doe"
                         className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none'
                         value={newVisitor.visitorName}
                         onChange={(e) => setNewVisitor({...newVisitor, visitorName: e.target.value})}
                         required
                       />
                    </div>
                 </div>
                 <div className='space-y-2'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Relation</label>
                    <div className='relative'>
                       <Heart className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                       <input 
                         type="text" 
                         placeholder="e.g. Father, Friend"
                         className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none'
                         value={newVisitor.relation}
                         onChange={(e) => setNewVisitor({...newVisitor, relation: e.target.value})}
                         required
                       />
                    </div>
                 </div>
                 <div className='space-y-2'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Expected Check-in</label>
                    <div className='relative'>
                       <Calendar className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                       <input 
                         type="datetime-local" 
                         className='w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none'
                         value={newVisitor.checkIn}
                         onChange={(e) => setNewVisitor({...newVisitor, checkIn: e.target.value})}
                         required
                       />
                    </div>
                 </div>
                 <div className='flex gap-3 pt-4'>
                    <button type="button" onClick={() => setShowModal(false)} className='flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors'>Cancel</button>
                    <button type="submit" className='flex-2 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2'>
                       <Send size={14} /> Send Request
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Outing / Leave Modal */}
      {showOutingModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200'>
           <div className='bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
              <div className='p-8 bg-emerald-600 text-white'>
                 <h3 className='text-xl font-black tracking-tight'>Outing & Leave Request</h3>
                 <p className='text-emerald-200 text-xs font-bold mt-1'>Fill in the outpass or leave details</p>
              </div>
              <form onSubmit={handleOutingSubmit} className='p-8 space-y-6'>
                 <div className='space-y-2'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Request Type</label>
                    <select 
                      className='w-full px-4 py-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none'
                      value={newOuting.type}
                      onChange={(e) => setNewOuting({...newOuting, type: e.target.value})}
                      required
                    >
                      <option value="Outpass">Day Outpass</option>
                      <option value="Leave">Home Leave</option>
                    </select>
                 </div>
                 <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                       <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Start Date & Time</label>
                       <input 
                         type="datetime-local" 
                         className='w-full px-4 py-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none'
                         value={newOuting.startDate}
                         onChange={(e) => setNewOuting({...newOuting, startDate: e.target.value})}
                         required
                       />
                    </div>
                    <div className='space-y-2'>
                       <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>End Date & Time</label>
                       <input 
                         type="datetime-local" 
                         className='w-full px-4 py-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none'
                         value={newOuting.endDate}
                         onChange={(e) => setNewOuting({...newOuting, endDate: e.target.value})}
                         required
                       />
                    </div>
                 </div>
                 <div className='space-y-2'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Reason for Outing</label>
                    <textarea 
                      placeholder="Please specify a valid reason..."
                      rows="3"
                      className='w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none'
                      value={newOuting.reason}
                      onChange={(e) => setNewOuting({...newOuting, reason: e.target.value})}
                      required
                    ></textarea>
                 </div>
                 <div className='flex gap-3 pt-4'>
                    <button type="button" onClick={() => setShowOutingModal(false)} className='flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors'>Cancel</button>
                    <button type="submit" className='flex-2 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2'>
                       <Send size={14} /> Submit Request
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default StudentVisitors;
