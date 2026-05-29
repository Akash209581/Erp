import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { 
  Building2, 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  LayoutGrid, 
  DoorOpen,
  ClipboardCheck,
  Building
} from 'lucide-react';

const AdminStudents = ({ user }) => {
  const { showToast } = useToast();
  const [hostels, setHostels] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('hostels'); // 'hostels' or 'allocations'
  const [isLoading, setIsLoading] = useState(true);
  const [rejectModalId, setRejectModalId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const adminId = user?.user?.username || user?.username || 'ADMIN';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const [hostelsRes, allocationsRes] = await Promise.all([
        fetch('http://localhost:3000/hostel/admin/hostels', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/hostel/admin/allocations', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (hostelsRes.ok) {
        const hostelsData = await hostelsRes.json();
        setHostels(hostelsData);
        if (hostelsData.length > 0) {
          setSelectedHostel(hostelsData[0]);
        }
      }
      if (allocationsRes.ok) {
        setAllocations(await allocationsRes.json());
      }
    } catch (error) {
      console.error('Error fetching admin student data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/hostel/admin/approve/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminId })
      });
      if (res.ok) {
        showToast('Allocation request approved successfully!', 'success');
        fetchData();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to approve allocation', 'error');
      }
    } catch (error) {
      console.error('Error approving allocation:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const handleReject = async (id, reason) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/hostel/admin/reject/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminId, reason })
      });
      if (res.ok) {
        showToast('Allocation request rejected.', 'warning');
        setRejectModalId(null);
        setRejectReason('');
        fetchData();
      } else {
        showToast('Failed to reject allocation request', 'error');
      }
    } catch (error) {
      console.error('Error rejecting allocation:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  // Filter students (allocations) belonging to selected hostel
  const getHostelStudents = () => {
    if (!selectedHostel) return [];
    
    // Find all room IDs for the selected hostel
    const roomIds = new Set();
    selectedHostel.blocks?.forEach(block => {
      block.rooms?.forEach(room => {
        roomIds.add(room.id);
      });
    });

    return allocations.filter(alloc => {
      // Must belong to a room in selected hostel
      const matchesHostel = roomIds.has(alloc.roomId);
      
      // Match Search Query
      const matchesSearch = alloc.registerno.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Match Status Filter
      const matchesStatus = statusFilter === 'All' || alloc.status === statusFilter;

      return matchesHostel && matchesSearch && matchesStatus;
    });
  };

  const pendingAllocations = allocations.filter(a => a.status === 'Pending');
  const activeAllocations = allocations.filter(a => a.status === 'Active');
  const hostelStudents = getHostelStudents();

  if (isLoading) {
    return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-[0.3em]">Syncing Student Directories...</div>;
  }

  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-rose-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Chief Warden Hub • Student Records</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Hostel Students Directory</h1>
        </div>

        {/* Top Allocations Quick Access Button */}
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
          <button 
            onClick={() => setActiveTab('hostels')}
            className={`px-5 py-2.5 text-xs font-black rounded-xl tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'hostels' ? 'bg-slate-900 text-white shadow-lg shadow-black/10' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Building size={14} />
            Hostels Directory
          </button>
          <button 
            onClick={() => setActiveTab('allocations')}
            className={`px-5 py-2.5 text-xs font-black rounded-xl tracking-widest uppercase transition-all flex items-center gap-2 relative ${activeTab === 'allocations' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ClipboardCheck size={14} />
            Room Allocations
            {pendingAllocations.length > 0 && (
              <span className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow-md border-2 border-white'>
                {pendingAllocations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'allocations' ? (
        /* Room Allocations Tab */
        <div className='space-y-8 animate-in fade-in duration-300'>
          <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h3 className='text-xl font-black text-slate-900'>Pending Room Allocations</h3>
                <p className='text-xs text-slate-400 font-medium mt-1'>Review and authorize student check-in requests</p>
              </div>
              <span className='px-4 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-xs font-black uppercase tracking-wider'>
                {pendingAllocations.length} Requests Pending
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {pendingAllocations.map((alloc) => (
                <div key={alloc.id} className='bg-slate-50 border border-slate-100 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Registration No</p>
                        <h4 className='text-lg font-black text-slate-900'>{alloc.registerno}</h4>
                      </div>
                      <span className='px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-wider'>
                        Under Review
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50'>
                      <div>
                        <p className='text-[9px] font-bold text-slate-400 uppercase tracking-wider'>Campus ID</p>
                        <p className='text-xs font-black text-slate-700'>{alloc.campusId || 'VFSTR Main'}</p>
                      </div>
                      <div>
                        <p className='text-[9px] font-bold text-slate-400 uppercase tracking-wider'>Requested On</p>
                        <p className='text-xs font-black text-slate-700'>{new Date(alloc.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-3 mt-6 pt-4 border-t border-slate-200/50'>
                    <button 
                      onClick={() => handleApprove(alloc.id)}
                      className='flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10'
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        setRejectModalId(alloc.id);
                        setRejectReason('');
                      }}
                      className='flex-1 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-rose-100'
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              {pendingAllocations.length === 0 && (
                <div className='col-span-full py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs'>
                  No pending room allocations to review
                </div>
              )}
            </div>
          </div>

          {/* Active Allocations Log */}
          <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8'>
            <h3 className='text-xl font-black text-slate-900 mb-6'>Recent Active Allocations</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    <th className='py-4'>Student Reg No</th>
                    <th className='py-4'>Status</th>
                    <th className='py-4'>Allocated Room ID</th>
                    <th className='py-4'>Approved By</th>
                    <th className='py-4'>Approved At</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-50'>
                  {activeAllocations.slice(0, 10).map((alloc) => (
                    <tr key={alloc.id} className='text-xs font-bold text-slate-700 hover:bg-slate-50/50 transition-colors'>
                      <td className='py-4 font-black text-slate-900'>{alloc.registerno}</td>
                      <td className='py-4'>
                        <span className='px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100'>
                          {alloc.status}
                        </span>
                      </td>
                      <td className='py-4 font-mono text-slate-500'>{alloc.roomId}</td>
                      <td className='py-4 text-slate-500'>{alloc.approvedBy || 'SYSTEM'}</td>
                      <td className='py-4 text-slate-400'>{alloc.approvedAt ? new Date(alloc.approvedAt).toLocaleDateString() : '--'}</td>
                    </tr>
                  ))}
                  {activeAllocations.length === 0 && (
                    <tr>
                      <td colSpan={5} className='py-8 text-center text-slate-400 uppercase tracking-widest text-xs font-bold'>
                        No active allocations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Hostels and Students Directory Tab */
        <div className='grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in duration-300'>
          {/* Hostels Selection List */}
          <div className='xl:col-span-1 space-y-4'>
            <h3 className='text-xs font-black text-slate-400 uppercase tracking-widest pl-2'>Select Hostel</h3>
            <div className='space-y-3'>
              {hostels.map((hostel) => {
                const isSelected = selectedHostel?.id === hostel.id;
                return (
                  <button
                    key={hostel.id}
                    onClick={() => setSelectedHostel(hostel)}
                    className={`w-full p-5 rounded-[2rem] border text-left transition-all ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-black/10' : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300'}`}
                  >
                    <Building2 className={`mb-3 ${isSelected ? 'text-rose-500' : 'text-slate-400'}`} size={24} />
                    <h4 className='font-black tracking-tight text-sm mb-1'>{hostel.name}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                      {hostel.type || 'Residence Unit'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Students Directory Table & Filters */}
          <div className='xl:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100'>
              <div>
                <h3 className='text-xl font-black text-slate-900'>{selectedHostel?.name || 'Students List'}</h3>
                <p className='text-xs text-slate-400 font-medium mt-1'>View and search student records within the hostel</p>
              </div>

              {/* Filters & Search Inputs */}
              <div className='flex flex-col sm:flex-row gap-3 items-stretch'>
                <div className='relative flex items-center'>
                  <Search size={14} className='absolute left-4 text-slate-400' />
                  <input
                    type='text'
                    placeholder='Search Reg No...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400'
                  />
                </div>

                <div className='relative flex items-center'>
                  <Filter size={14} className='absolute left-4 text-slate-400' />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className='pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 focus:outline-none focus:border-slate-400 appearance-none'
                  >
                    <option value='All'>All Statuses</option>
                    <option value='Active'>Active</option>
                    <option value='Pending'>Pending</option>
                    <option value='Rejected'>Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Students List Table */}
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    <th className='py-4'>Registration No</th>
                    <th className='py-4'>Status</th>
                    <th className='py-4'>Room ID</th>
                    <th className='py-4'>Allocated Date</th>
                    <th className='py-4'>Assigned Campus</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-50'>
                  {hostelStudents.map((student) => (
                    <tr key={student.id} className='text-xs font-bold text-slate-700 hover:bg-slate-50/50 transition-colors'>
                      <td className='py-4 font-black text-slate-900'>{student.registerno}</td>
                      <td className='py-4'>
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                          student.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : student.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className='py-4 font-mono text-slate-500'>{student.roomId}</td>
                      <td className='py-4 text-slate-400'>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td className='py-4 text-slate-500'>{student.campusId || 'VFSTR Main'}</td>
                    </tr>
                  ))}

                  {hostelStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className='py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs'>
                        No student records match filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {rejectModalId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] max-w-md w-full overflow-hidden p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight text-rose-600">Reject Room Allocation</h3>
              <p className="text-xs text-slate-400 mt-1">Specify rejection comments below</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Rejection Reason</label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify why this allocation was rejected..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-rose-500 font-medium h-24 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setRejectModalId(null)}
                className="flex-1 py-3 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (rejectReason) {
                    handleReject(rejectModalId, rejectReason);
                  }
                }}
                className="flex-1 py-3 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-rose-600/20"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
