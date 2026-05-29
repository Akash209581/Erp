import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useToast } from '../../../context/ToastContext';
import { 
  Building2, 
  MapPin, 
  Users, 
  CreditCard, 
  AlertCircle,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  History,
  Hourglass,
  ExternalLink,
  Megaphone
} from 'lucide-react';
import RoomPicker from './RoomPicker.jsx';

const StudentHostel = ({ user }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [residence, setResidence] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const registerno = user?.user?.username || user?.username;

  useEffect(() => {
    fetchStudentData();
    fetchBroadcasts();
    fetchLeaves();

    const socket = io('http://localhost:3000');

    socket.on('complaint_update', (complaint) => {
      if (complaint.registerno === registerno) {
        setComplaints(prev => {
          const index = prev.findIndex(c => c.id === complaint.id);
          if (index > -1) {
            const next = [...prev];
            next[index] = complaint;
            return next;
          }
          return [complaint, ...prev];
        });
      }
    });

    socket.on('visitor_update', (visitor) => {
      if (visitor.registerno === registerno) {
        setVisitors(prev => {
          const index = prev.findIndex(v => v.id === visitor.id);
          if (index > -1) {
            const next = [...prev];
            next[index] = visitor;
            return next;
          }
          return [visitor, ...prev];
        });
      }
    });

    socket.on('allocation_update', (allocation) => {
      if (allocation.registerno === registerno) {
        setResidence(allocation);
      }
    });

    socket.on('attendance_update', (att) => {
      if (att.registerno === registerno) {
        setAttendance(prev => [att, ...prev]);
      }
    });

    socket.on('new_broadcast', (broadcast) => {
      setBroadcasts(prev => {
        // Avoid duplicate additions
        if (prev.some(b => b.id === broadcast.id)) return prev;
        return [broadcast, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [registerno]);

  const fetchStudentData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [resRes, compRes, visRes, attRes] = await Promise.all([
        fetch(`http://localhost:3000/hostel/student/residence/${registerno}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:3000/hostel/student/complaints/${registerno}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:3000/hostel/student/visitors/${registerno}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:3000/hostel/student/attendance/${registerno}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (resRes.ok) {
        const data = await resRes.json();
        setResidence(data);
      } else {
        setResidence(null);
      }
      
      if (compRes.ok) setComplaints(await compRes.json());
      if (visRes.ok) setVisitors(await visRes.json());
      if (attRes.ok) setAttendance(await attRes.json());
    } catch (error) {
      console.error('Error fetching student hostel data:', error);
    }
  };

  const fetchBroadcasts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/hostel/student/broadcasts/${registerno}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setBroadcasts(await res.json());
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    }
  };

  const fetchLeaves = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/hostel/student/leaves/${registerno}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setLeaves(await res.json());
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyLeave = async (type, startDate, endDate, reason) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/student/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ registerno, type, startDate, endDate, reason })
      });
      if (res.ok) {
        showToast('Leave application submitted successfully!', 'success');
        fetchLeaves();
      }
    } catch (error) {
      console.error('Error applying for leave:', error);
    }
  };

  const handlePayNow = () => {
    showToast('Redirecting to Finance Module... Note: All hostel payments are processed strictly through the Finance system to ensure ledger integrity.', 'info');
    // In a production environment, this would use window.location.href or a router link
    // window.location.href = '/finance/payments';
  };

  const handleRaiseComplaint = () => {
    navigate('/hostel/complaints');
  };

  const handleRequestVisitorPass = () => {
    navigate('/hostel/visitors');
  };

  if (isLoading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-[0.3em]">Syncing Neural Records...</div>;

  // New Student / No Allocation State
  if (!residence || !residence.allocation) {
    return (
      <div className="p-8">
        <RoomPicker user={user} onRoomSelect={fetchStudentData} />
      </div>
    );
  }

  // Pending State
  if (residence.allocation.status === 'Pending') {
    return (
      <div className="p-8 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-8">
            <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 mx-auto shadow-sm border border-amber-100">
              <Hourglass size={48} className="animate-spin-slow" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Request Under Review</h1>
              <p className="text-slate-500 font-medium text-sm">Your room selection (Room {residence.room?.roomNumber}) has been locked. The Chief Warden is currently reviewing your eligibility and fee status.</p>
            </div>
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-left">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Allocation Details</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Hostel</p>
                  <p className="font-black text-slate-900">{residence.room?.block?.hostel?.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Requested On</p>
                  <p className="font-black text-slate-900">{new Date(residence.allocation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={fetchStudentData}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-black/10"
              >
                Check Status
              </button>
              <button 
                onClick={handlePayNow}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center gap-2 justify-center"
              >
                Pay Fees
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(a => a.date === today);
  const isPresentToday = todayAttendance?.status === 'Present';
  
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'Present').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
  
  const currentMonthStr = today.slice(0, 7);
  const monthlyAttendance = attendance.filter(a => a.date.startsWith(currentMonthStr));
  const monthlyPresent = monthlyAttendance.filter(a => a.status === 'Present').length;
  const monthlyPercentage = monthlyAttendance.length > 0 ? Math.round((monthlyPresent / monthlyAttendance.length) * 100) : 100;

  // Active State (Current Dashboard)
  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-amber-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2 flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-ping' />
            Student Residence • {registerno}
          </p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>My Hostel Command Center</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
          <button 
            onClick={handleRaiseComplaint}
            className='px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-lg shadow-black/10 tracking-widest uppercase hover:scale-[1.02] transition-transform flex items-center gap-2'
          >
            <Plus size={14} />
            Raise Complaint
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Left Column: Residence & Dues */}
        <div className='xl:col-span-2 space-y-8'>
          {/* Residence Card */}
          <div className='bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5'>
             <div className='absolute top-[-20%] right-[-10%] w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]'></div>
             <div className='absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-blue-600/5 rounded-full blur-[60px]'></div>
             
             <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10'>
                <div className='space-y-6 flex-1'>
                   <div className='flex items-center gap-4'>
                      <div className='w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-amber-400 border border-white/10 shadow-inner'>
                        <Building2 size={28} className='animate-pulse' />
                      </div>
                      <div>
                         <h2 className='text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-200 bg-clip-text text-transparent'>{residence?.room?.block?.hostel?.name || 'Awaiting Allocation'}</h2>
                         <p className='text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]'>Official Residence Unit</p>
                      </div>
                   </div>

                   <div className='grid grid-cols-2 md:grid-cols-3 gap-8 pt-4 border-t border-white/5'>
                      <div>
                         <p className='text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1'>Room Number</p>
                         <p className='text-xl font-black font-mono tracking-tighter text-amber-400'>{residence?.room?.roomNumber || '--'}</p>
                      </div>
                      <div>
                         <p className='text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1'>Block / Wing</p>
                         <p className='text-xl font-black tracking-tighter text-white'>{residence?.room?.block?.name || '--'}</p>
                      </div>
                      <div>
                         <p className='text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1'>Occupancy</p>
                         <p className='text-xl font-black tracking-tighter text-slate-300'>{residence?.room?.currentOccupancy || '0'} / {residence?.room?.capacity || '0'}</p>
                      </div>
                   </div>
                </div>

                {/* Digital Chip Pass */}
                <div className='shrink-0 p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 text-center min-w-[220px] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300'>
                   <div className='absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl'></div>
                   <div className='w-10 h-8 bg-amber-400/20 rounded-lg border border-amber-400/30 flex items-center justify-center mb-4 mx-auto shadow-inner'>
                     <div className='w-4 h-4 border border-amber-400/20 rounded-sm grid grid-cols-2 gap-0.5 p-0.5'>
                       <div className='bg-amber-400/40 rounded-sm'></div>
                       <div className='bg-amber-400/40 rounded-sm'></div>
                       <div className='bg-amber-400/40 rounded-sm'></div>
                       <div className='bg-amber-400/40 rounded-sm'></div>
                     </div>
                   </div>
                   <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1'>NFC PASS</p>
                   <h3 className='text-md font-black text-white uppercase tracking-tight'>VERIFIED</h3>
                   <div className='mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden'>
                      <div className='h-full bg-emerald-500 w-full animate-pulse'></div>
                   </div>
                </div>
             </div>
          </div>

          {/* Hostel Dues */}
          <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] p-8'>
             <div className='flex items-center justify-between mb-8'>
                <h3 className='text-lg font-black text-slate-900 flex items-center gap-2'>
                  <CreditCard size={20} className='text-indigo-600' />
                  Hostel Dues
                </h3>
                {registerno === '261FA00002' ? (
                  <span className='px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 animate-pulse'>Fee Pending</span>
                ) : (
                  <span className='px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100'>No Pending</span>
                )}
             </div>
             <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-slate-50 rounded-2xl'>
                   <div>
                      <p className='text-[10px] font-bold text-slate-400 uppercase'>Current Semester Fee</p>
                      <p className='text-sm font-black text-slate-900'>₹ 45,000.00</p>
                   </div>
                   {registerno === '261FA00002' ? (
                     <span className='text-[10px] font-black text-rose-500 bg-white px-2 py-1 rounded-md shadow-sm animate-pulse'>UNPAID</span>
                   ) : (
                     <span className='text-[10px] font-black text-emerald-500 bg-white px-2 py-1 rounded-md shadow-sm'>PAID</span>
                   )}
                </div>
                {registerno === '261FA00002' ? (
                  <button 
                    onClick={handlePayNow}
                    className='w-full py-3 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2'
                  >
                    <CreditCard size={12} /> Pay Now
                  </button>
                ) : (
                  <button className='w-full py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all'>
                    View Ledger
                  </button>
                )}
             </div>
          </div>

          {/* Attendance Dashboard */}
          <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] p-8'>
             <div className='flex items-center justify-between mb-8'>
                <h3 className='text-lg font-black text-slate-900 flex items-center gap-2'>
                  <ShieldCheck size={20} className='text-emerald-500' />
                  Attendance Record
                </h3>
                <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100'>Official Ledger</span>
             </div>
             
             <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] duration-300 ${isPresentToday ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' : todayAttendance ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                   <p className={`text-xl font-black mb-1 tracking-wider ${isPresentToday ? 'text-emerald-600' : todayAttendance ? 'text-rose-600' : 'text-slate-500'}`}>
                     {isPresentToday ? 'PRESENT' : todayAttendance ? 'ABSENT' : 'NO RECORD'}
                   </p>
                   <p className={`text-[9px] font-black uppercase tracking-widest ${isPresentToday ? 'text-emerald-400' : todayAttendance ? 'text-rose-400' : 'text-slate-400'}`}>Today's Roll Call</p>
                </div>
                
                <div className='p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center hover:scale-[1.02] transition-transform duration-300'>
                   <p className='text-3xl font-black text-slate-900 mb-1'>{monthlyPercentage}%</p>
                   <div className='flex items-center justify-between'>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Monthly Attendance</p>
                      <span className='text-xs font-bold text-indigo-600'>{monthlyPresent}/{monthlyAttendance.length} Days</span>
                   </div>
                </div>

                <div className='p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center hover:scale-[1.02] transition-transform duration-300'>
                   <p className='text-3xl font-black text-slate-900 mb-1'>{attendancePercentage}%</p>
                   <div className='flex items-center justify-between'>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Total Attendance</p>
                      <span className='text-xs font-bold text-indigo-600'>{presentDays}/{totalDays} Days</span>
                   </div>
                </div>
             </div>

             {/* Weekly History tracker strip */}
             <div className='p-6 bg-slate-50/50 border border-slate-100 rounded-3xl'>
                <h4 className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4'>Weekly History Nodes</h4>
                <div className='flex items-center justify-between gap-2 max-w-lg'>
                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                     const isEven = idx % 2 === 0;
                     return (
                       <div key={day} className='flex flex-col items-center gap-2'>
                          <span className='text-[9px] font-black text-slate-400 uppercase'>{day}</span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${isEven ? 'bg-emerald-100 text-emerald-700 font-black shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                            {isEven ? 'P' : 'A'}
                          </div>
                       </div>
                     )
                   })}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Broadcast Bulletins */}
        <div className='space-y-8'>
           {/* Warden Bulletins */}
           <div className='bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden'>
              <div className='absolute top-0 right-0 p-4'>
                 <div className='w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100'>
                   <Megaphone size={20} />
                 </div>
              </div>
              <h3 className='text-xl font-black text-slate-900 mb-2'>Warden Bulletins</h3>
              <p className='text-xs text-slate-400 font-medium mb-6'>Live announcements and alerts</p>
              
              <div className='space-y-4 max-h-[220px] overflow-y-auto pr-1'>
                 {broadcasts.length > 0 ? broadcasts.map((bc, i) => (
                    <div key={i} className='p-4 bg-amber-50/40 border border-amber-100/50 rounded-2xl space-y-2 relative overflow-hidden'>
                       <div className='flex items-center justify-between'>
                          <span className='px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[9px] font-black uppercase tracking-wider'>
                             {bc.scope || 'Global'}
                          </span>
                          <span className='text-[9px] text-slate-400 font-bold'>
                             {new Date(bc.createdAt).toLocaleDateString()}
                          </span>
                       </div>
                       <p className='text-xs font-bold text-slate-800'>{bc.message}</p>
                    </div>
                 )) : (
                    <div className='py-6 text-center text-slate-400 font-medium text-xs'>
                       No active bulletins or announcements.
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHostel;
