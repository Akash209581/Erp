import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useToast } from '../../../context/ToastContext';
import { 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  ArrowRight,
  DoorOpen
} from 'lucide-react';

const WardenHostel = ({ user }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [inhabitants, setInhabitants] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const wardenId = user?.user?.username || user?.username || 'WARDEN';

  useEffect(() => {
    fetchData();
    fetchLeaves();

    const socket = io('http://localhost:3000');
    
    socket.on('complaint_update', (complaint) => {
      setComplaints(prev => {
        // If it already exists, update it, otherwise add it
        const index = prev.findIndex(c => c.id === complaint.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = complaint;
          return next;
        }
        return [complaint, ...prev];
      });
    });

    socket.on('visitor_update', (visitor) => {
      setVisitors(prev => {
        const index = prev.findIndex(v => v.id === visitor.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = visitor;
          return next;
        }
        return [visitor, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [inhRes, compRes, visRes] = await Promise.all([
        fetch('http://localhost:3000/hostel/warden/inhabitants', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3000/hostel/warden/complaints', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3000/hostel/warden/visitors', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (inhRes.ok) setInhabitants(await inhRes.json());
      if (compRes.ok) setComplaints(await compRes.json());
      if (visRes.ok) setVisitors(await visRes.json());
    } catch (error) {
      console.error('Error fetching warden data:', error);
    }
  };

  const fetchLeaves = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/warden/leaves', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setLeaves(await res.json());
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const approvedBy = wardenId;
    try {
      const res = await fetch(`http://localhost:3000/hostel/warden/leaves/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, approvedBy })
      });
      if (res.ok) {
        fetchLeaves();
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const handleCreateBroadcast = async (message, scope, targetId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/warden/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message, scope, targetId: targetId || null, senderId: wardenId })
      });
      if (res.ok) {
        showToast('Broadcast sent successfully!', 'success');
        const textEl = document.getElementById('broadcast-msg');
        if (textEl) textEl.value = '';
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
    }
  };

  const handleVerifyVisitor = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/hostel/warden/visitors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error verifying visitor:', error);
    }
  };

  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Warden Portal • Block Supervision</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Hostel Management</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
          <button 
            onClick={() => navigate('/hostel/attendance')}
            className='px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-900/20 tracking-widest uppercase hover:scale-[1.02] transition-transform flex items-center gap-2'
          >
            <ClipboardCheck size={14} />
            Take Roll Call
          </button>
        </div>
      </div>      {/* Main Grid */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Operations Queue */}
        <div className='xl:col-span-2 space-y-8'>
           {/* Leave Approval Queue (Phase 2) */}
           <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
              <div className='p-8 border-b border-slate-50'>
                 <h3 className='text-xl font-black text-slate-900'>Leave & Outpass Queue</h3>
                 <p className='text-xs text-slate-400 font-medium mt-1'>Action required on pending requests</p>
              </div>
              <div className='p-8 space-y-4'>
                 {leaves.map((l) => (
                   <div key={l.id} className='flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100'>
                      <div className='flex items-center gap-4'>
                         <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm'>
                            <Clock size={24} />
                         </div>
                         <div>
                            <p className='text-sm font-black text-slate-900'>{l.registerno}</p>
                            <p className='text-[10px] text-slate-500 font-bold uppercase tracking-widest'>{l.type} • {l.reason}</p>
                         </div>
                      </div>
                      <div className='flex items-center gap-2'>
                         <button 
                            onClick={() => handleUpdateLeaveStatus(l.id, 'Approved')}
                            className='px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform'
                         >
                            Approve
                         </button>
                         <button 
                            onClick={() => handleUpdateLeaveStatus(l.id, 'Rejected')}
                            className='px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors'
                         >
                            Reject
                         </button>
                      </div>
                   </div>
                 ))}
                 {leaves.length === 0 && (
                    <div className='py-8 text-center opacity-30 grayscale'>
                       <CheckCircle2 size={32} className='mx-auto mb-2' />
                       <p className='text-[10px] font-black uppercase tracking-widest'>Queue clear</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar Operations */}
        <div className='space-y-8'>
           {/* Quick Broadcast Widget */}
           <div className='bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden'>
              <div className='absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl'></div>
              <h3 className='text-xl font-black tracking-tight mb-2'>Quick Broadcast</h3>
              <p className='text-indigo-100 text-xs font-bold mb-6'>Send alerts to all residents in your block</p>
              
              <textarea 
                id="broadcast-msg"
                placeholder="Type your message..." 
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-medium placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 mb-4 h-32"
              ></textarea>
              
              <button 
                onClick={() => {
                  const msg = document.getElementById('broadcast-msg').value;
                  if (msg) handleCreateBroadcast(msg, 'Block', inhabitants[0]?.blockId);
                }}
                className='w-full py-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/40'
              >
                 Push Announcement
              </button>
           </div>
        </div>

        {/* Visitor Verification */}
        <div className='space-y-8'>
           <div className='bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden'>
              <div className='absolute top-[-20%] right-[-20%] w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl'></div>
              <h3 className='text-xl font-black tracking-tight mb-6 flex items-center gap-2'>
                 <UserPlus size={24} className='text-emerald-400' />
                 Visitor Gate
              </h3>
              
              <div className='space-y-4'>
                 {visitors.length > 0 ? visitors.map((vis, i) => (
                   <div key={i} className='p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group'>
                      <div className='flex items-center justify-between mb-3'>
                         <div>
                            <p className='text-sm font-bold text-white'>{vis.visitorName}</p>
                            <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>{vis.relation} of {vis.registerno}</p>
                         </div>
                           <div className='flex items-center gap-2'>
                              <button 
                                 onClick={() => handleVerifyVisitor(vis.id, 'Approved')}
                                 className='px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors shadow-sm'
                              >
                                 Approve
                              </button>
                              <button 
                                 onClick={() => handleVerifyVisitor(vis.id, 'Rejected')}
                                 className='px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors shadow-sm'
                              >
                                 Reject
                              </button>
                           </div>
                      </div>
                      <div className='flex items-center gap-2 text-[10px] font-bold text-slate-500'>
                         <Clock size={10} />
                         <span>Waiting for verification</span>
                      </div>
                   </div>
                 )) : (
                   <div className='py-8 text-center text-slate-600 font-bold text-xs uppercase tracking-widest'>No visitors at gate</div>
                 )}
              </div>

              <button 
                onClick={() => showToast('Establishing connection to live socket stream... Stream initialized.', 'success')}
                className='w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/40'
              >
                 Open Live Logs
              </button>
           </div>

           {/* Quick Stats */}
           <div className='bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm'>
              <h3 className='text-lg font-black text-slate-900 mb-6'>Block HUD</h3>
              <div className='grid grid-cols-2 gap-4'>
                 <div className='p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center'>
                    <p className='text-2xl font-black text-slate-900'>{inhabitants.length}</p>
                    <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1'>Residents</p>
                 </div>
                 <div className='p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center'>
                    <p className='text-2xl font-black text-slate-900'>{complaints.filter(c => c.status === 'Pending').length}</p>
                    <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1'>Pending Fixes</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WardenHostel;
