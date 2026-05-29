import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { 
  ClipboardCheck, 
  Search,
  CheckCircle2,
  XCircle,
  DoorOpen,
  ArrowLeft,
  Filter,
  RefreshCw
} from 'lucide-react';

const WardenAttendance = ({ user }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [inhabitants, setInhabitants] = useState([]);
  const [markedAttendance, setMarkedAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Pending', 'Present', 'Absent'
  const [isLoading, setIsLoading] = useState(true);
  const wardenId = user?.user?.username || user?.username || 'WARDEN';

  useEffect(() => {
    fetchInhabitants();
  }, []);

  const fetchInhabitants = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/warden/inhabitants', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInhabitants(await res.json());
      } else {
        showToast('Failed to fetch occupants list.', 'error');
      }
    } catch (error) {
      console.error('Error fetching occupants:', error);
      showToast('Network error while loading occupants.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendance = async (registerno, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/warden/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          registerno,
          status,
          date: new Date().toISOString().split('T')[0],
          markedBy: wardenId
        })
      });
      if (res.ok) {
        setMarkedAttendance(prev => ({ ...prev, [registerno]: status }));
        showToast(`Attendance marked as ${status} for ${registerno}`, 'success');
      } else {
        showToast('Failed to log attendance.', 'error');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      showToast('Error connecting to attendance server.', 'error');
    }
  };

  // Filter and Search Logic
  const filteredInhabitants = inhabitants.filter(inh => {
    const matchesSearch = inh.registerno.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = markedAttendance[inh.registerno] || 'Pending';
    const matchesFilter = 
      filterType === 'All' || 
      (filterType === 'Pending' && status === 'Pending') ||
      (filterType === 'Present' && status === 'Present') ||
      (filterType === 'Absent' && status === 'Absent');

    return matchesSearch && matchesFilter;
  });

  // Group by Room
  const roomsMap = filteredInhabitants.reduce((acc, inh) => {
    const roomId = inh.roomId || 'Unknown';
    if (!acc[roomId]) acc[roomId] = [];
    acc[roomId].push(inh);
    return acc;
  }, {});

  // Compute Stats
  const totalCount = inhabitants.length;
  const presentCount = Object.values(markedAttendance).filter(s => s === 'Present').length;
  const absentCount = Object.values(markedAttendance).filter(s => s === 'Absent').length;
  const pendingCount = totalCount - presentCount - absentCount;

  return (
    <div className='p-8 space-y-8 animate-in fade-in duration-500'>
      {/* Header with Navigation */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='flex items-center gap-4'>
          <button 
            onClick={() => navigate('/hostel')}
            className='p-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center'
            title='Back to Residence Dashboard'
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className='text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-1'>Warden Operations</p>
            <h1 className='text-3xl font-black tracking-tight text-slate-900'>Daily Student Attendance</h1>
          </div>
        </div>
        
        <div className='flex items-center gap-3'>
          <button 
            onClick={fetchInhabitants}
            className='p-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center'
            title='Refresh List'
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between'>
          <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Total Occupants</p>
          <div className='flex items-end justify-between mt-4'>
            <p className='text-3xl font-black text-slate-900'>{totalCount}</p>
            <span className='w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs'>
              {totalCount}
            </span>
          </div>
        </div>
        
        <div className='bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between'>
          <p className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>Present</p>
          <div className='flex items-end justify-between mt-4'>
            <p className='text-3xl font-black text-emerald-700'>{presentCount}</p>
            <span className='w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20'>
              {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className='bg-rose-50/50 p-6 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between'>
          <p className='text-[10px] font-black text-rose-600 uppercase tracking-widest'>Absent</p>
          <div className='flex items-end justify-between mt-4'>
            <p className='text-3xl font-black text-rose-700'>{absentCount}</p>
            <span className='w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-rose-500/20'>
              {totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className='bg-amber-50/50 p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between'>
          <p className='text-[10px] font-black text-amber-600 uppercase tracking-widest'>Pending Verification</p>
          <div className='flex items-end justify-between mt-4'>
            <p className='text-3xl font-black text-amber-700'>{pendingCount}</p>
            <span className='w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/20'>
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search toolbar */}
      <div className='bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4'>
        {/* Search */}
        <div className='relative w-full lg:max-w-md'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
          <input 
            type="text" 
            placeholder="Search by student register number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500/20 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none' 
          />
        </div>

        {/* Filter buttons */}
        <div className='flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar'>
          {['All', 'Pending', 'Present', 'Absent'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                filterType === type 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-50 text-slate-500 hover:text-slate-950 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center'>
          <RefreshCw size={40} className='text-emerald-500 animate-spin mb-4' />
          <p className='text-sm font-bold text-slate-500'>Synchronizing operational records...</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {Object.entries(roomsMap).map(([roomId, students]) => (
            <div key={roomId} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                    <DoorOpen size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">Room {roomId.slice(0, 4).toUpperCase()}</h4>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5'>Floor Allocation Group</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-500 bg-white border border-slate-100 px-4 py-1.5 rounded-xl uppercase tracking-widest self-start sm:self-auto">
                  {students.length} Occupants Listed
                </span>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse min-w-[500px]'>
                  <thead>
                    <tr className='border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/20'>
                      <th className='px-8 py-4'>Student Identifier</th>
                      <th className='px-8 py-4'>Verification Status</th>
                      <th className='px-8 py-4 text-right'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-50'>
                    {students.map((inh, i) => {
                      const currentStatus = markedAttendance[inh.registerno] || 'Pending';
                      return (
                        <tr key={i} className='hover:bg-slate-50/50 transition-colors duration-200'>
                          <td className='px-8 py-5'>
                            <div className='flex items-center gap-4'>
                              <div className='w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center font-black text-sm border border-slate-100'>
                                {inh.registerno.charAt(0)}
                              </div>
                              <div>
                                <p className='text-sm font-bold text-slate-900'>{inh.registerno}</p>
                                <p className='text-[10px] text-slate-400 font-medium mt-0.5'>VIGNAN UNIVERSITY STUDENT</p>
                              </div>
                            </div>
                          </td>
                          <td className='px-8 py-5'>
                            <div className='flex items-center gap-2'>
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                currentStatus === 'Present' ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' :
                                currentStatus === 'Absent' ? 'bg-rose-500 shadow-md shadow-rose-500/20' : 
                                'bg-slate-300'
                              }`}></div>
                              <span className={`text-xs font-bold uppercase tracking-wider ${
                                currentStatus === 'Present' ? 'text-emerald-600' :
                                currentStatus === 'Absent' ? 'text-rose-600' : 
                                'text-slate-400'
                              }`}>
                                {currentStatus}
                              </span>
                            </div>
                          </td>
                          <td className='px-8 py-5 text-right'>
                            <div className='flex items-center justify-end gap-3'>
                              <button 
                                onClick={() => handleAttendance(inh.registerno, 'Present')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                                  currentStatus === 'Present'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                                    : 'bg-white text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 shadow-sm active:scale-95'
                                }`}
                              >
                                <CheckCircle2 size={12} />
                                Present
                              </button>
                              
                              <button 
                                onClick={() => handleAttendance(inh.registerno, 'Absent')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                                  currentStatus === 'Absent'
                                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/10'
                                    : 'bg-white text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 shadow-sm active:scale-95'
                                }`}
                              >
                                <XCircle size={12} />
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {Object.keys(roomsMap).length === 0 && (
            <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center'>
              <ClipboardCheck size={48} className='text-slate-300 mb-4' />
              <p className='text-base font-black text-slate-900'>No Occupants Listed</p>
              <p className='text-xs text-slate-400 font-medium mt-2 max-w-sm'>
                No student records matched your current query or filters. Clear your filters or try a different search.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterType('All'); }}
                className='mt-6 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-colors'
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WardenAttendance;
