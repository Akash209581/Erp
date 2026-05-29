import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { 
  Building2, 
  Plus, 
  Users, 
  DoorOpen, 
  AlertCircle,
  LayoutGrid,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  UserCheck,
  Activity,
  History
} from 'lucide-react';

const AdminHostel = ({ user }) => {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingComplaints: 0
  });
  const [hostels, setHostels] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // null, 'hostel', 'block', 'room', 'asset', 'reject'
  const [modalForm, setModalForm] = useState({
    name: '',
    type: 'Boys',
    hostelId: '',
    blockId: '',
    roomNumber: '',
    capacity: '4',
    category: '',
    cost: '',
    reason: '',
    rejectId: null
  });

  const adminId = user?.user?.username || user?.username || 'ADMIN';

  useEffect(() => {
    fetchStats();
    fetchHostels();
    fetchAllocations();
    fetchAuditLogs();
    fetchAssets();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setStats(await response.json());
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/admin/hostels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setHostels(await response.json());
    } catch (error) {
      console.error('Error fetching hostels:', error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/admin/allocations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setAllocations(await response.json());
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/admin/audit-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setAuditLogs(await response.json());
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/admin/assets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setAssets(await response.json());
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBroadcast = async (message) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message, senderId: adminId })
      });
      if (res.ok) showToast('Global broadcast sent!', 'success');
    } catch (error) {
      console.error('Error sending broadcast:', error);
      showToast('Error sending broadcast', 'error');
    }
  };

  const handleCreateAsset = async (name, category, cost) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/admin/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, category, replacementCost: cost })
      });
      if (res.ok) fetchAssets();
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  const handleCreateHostel = async (name, type) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/admin/hostels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type })
      });
      if (res.ok) {
        showToast('Hostel created successfully!', 'success');
        fetchHostels();
        fetchStats();
      } else {
        showToast('Failed to create hostel', 'error');
      }
    } catch (error) {
      console.error('Error creating hostel:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const handleCreateBlock = async (name, hostelId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/admin/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, hostelId })
      });
      if (res.ok) {
        showToast('Block created successfully!', 'success');
        fetchHostels();
      } else {
        showToast('Failed to create block', 'error');
      }
    } catch (error) {
      console.error('Error creating block:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const handleCreateRoom = async (roomNumber, capacity, blockId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomNumber, capacity: parseInt(capacity), currentOccupancy: 0, blockId })
      });
      if (res.ok) {
        showToast('Room created successfully!', 'success');
        fetchHostels();
        fetchStats();
      } else {
        showToast('Failed to create room', 'error');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      showToast('Error connecting to server', 'error');
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
        showToast('Allocation approved successfully!', 'success');
        fetchAllocations();
        fetchStats();
        fetchAuditLogs();
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
        showToast('Allocation rejected.', 'warning');
        fetchAllocations();
        fetchAuditLogs();
        setActiveModal(null);
      } else {
        showToast('Failed to reject allocation', 'error');
      }
    } catch (error) {
      console.error('Error rejecting allocation:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const dashboardStats = [
    { label: 'Total Hostels', value: stats.totalHostels, icon: <Building2 size={20} />, color: 'from-blue-600 to-indigo-600' },
    { label: 'System Capacity', value: stats.totalRooms, icon: <DoorOpen size={20} />, color: 'from-emerald-500 to-teal-600' },
    { label: 'Active Occupancy', value: stats.occupiedRooms, icon: <UserCheck size={20} />, color: 'from-amber-500 to-orange-600' },
    { label: 'System Alerts', value: stats.pendingComplaints, icon: <AlertCircle size={20} />, color: 'from-red-500 to-rose-600' },
  ];

  const pendingAllocations = allocations.filter(a => a.status === 'Pending');

  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Chief Warden • Infrastructure Deck</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Hostel Management</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
          <button 
            onClick={() => {
              setModalForm({ name: '', type: 'Boys' });
              setActiveModal('hostel');
            }}
            className='px-6 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-900/20 tracking-widest uppercase hover:scale-[1.02] transition-transform flex items-center gap-2'
          >
            <Plus size={14} />
            New Hostel
          </button>
        </div>
      </div>

      {/* Stats HUD */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {dashboardStats.map((stat, i) => (
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
              <span className='px-2 py-1 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-md border border-emerald-100'>Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Infrastructure & Allocation */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        <div className='xl:col-span-2 space-y-8'>
          {/* Facility Registry (Enhanced) */}
          <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
             <div className='p-8 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4'>
               <div>
                 <h3 className='text-xl font-black text-slate-900 tracking-tight'>Facility Registry</h3>
                 <p className='text-xs text-slate-400 font-medium mt-1'>Real-time inventory of hostels and blocks</p>
               </div>
               <div className='flex items-center gap-2'>
                  <button 
                    onClick={() => {
                      setModalForm({ name: '', type: 'Boys' });
                      setActiveModal('hostel');
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:scale-105 transition-transform"
                  >
                    <Plus size={16} />
                  </button>
               </div>
             </div>
             
             <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
                {hostels.map((hostel) => (
                  <div key={hostel.id} className='p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm'>
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h4 className='text-sm font-black text-slate-900'>{hostel.name}</h4>
                          <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>{hostel.type} Hostel</p>
                        </div>
                      </div>
                      <span className='px-3 py-1 bg-white text-[10px] font-bold text-slate-500 rounded-lg shadow-sm border border-slate-100'>
                        {hostel.blocks?.length || 0} Blocks
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setModalForm({ name: '', roomNumber: '', capacity: '4', hostelId: hostel.id, blockId: hostel.blocks?.[0]?.id || '' });
                        setActiveModal('infra_choice');
                      }}
                      className='w-full py-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-100'
                    >
                      Manage Infrastructure
                    </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Global Asset Master (Phase 5) */}
          <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
             <div className='p-8 border-b border-slate-50 flex items-center justify-between'>
                <div>
                   <h3 className='text-xl font-black text-slate-900 tracking-tight'>Asset Master</h3>
                   <p className='text-xs text-slate-400 font-medium mt-1'>Inventory of resources across all rooms</p>
                </div>
                 <button 
                   onClick={() => {
                     setModalForm({ name: '', category: '', cost: '' });
                     setActiveModal('asset');
                   }}
                   className='px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest'
                 >
                    Add Asset
                 </button>
             </div>
             <div className='p-8 grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {assets.map((asset) => (
                  <div key={asset.id} className='p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center'>
                     <p className='text-sm font-black text-slate-900'>{asset.name}</p>
                     <p className='text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1'>₹{asset.replacementCost}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Global Emergency Command (Phase 6) */}
          <div className='bg-red-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden'>
            <div className='absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/20 rounded-full blur-3xl'></div>
            <div className='relative z-10'>
              <h3 className='text-xl font-black tracking-tight mb-2'>Global Command</h3>
              <p className='text-red-100 text-xs font-bold mb-6'>Push alerts to the entire university ecosystem</p>
              
              <textarea 
                id="global-broadcast-msg"
                placeholder="Type emergency message..." 
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-medium placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 mb-4 h-32"
              ></textarea>
              
              <button 
                onClick={() => {
                  const msg = document.getElementById('global-broadcast-msg').value;
                  if (msg) handleCreateBroadcast(msg);
                }}
                className='w-full py-4 bg-white text-red-600 hover:bg-red-50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/40'
              >
                 Push Global Alert
              </button>
            </div>
          </div>

          {/* Approval Hub (Phase 2) */}
          <div className='bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden'>
            <div className='absolute top-[-20%] right-[-20%] w-48 h-48 bg-amber-500/20 rounded-full blur-3xl'></div>
            <div className='relative z-10'>
              <h3 className='text-xl font-black tracking-tight mb-2'>Approval Hub</h3>
              <p className='text-slate-400 text-xs font-bold mb-6'>Review pending room requests</p>
              
              <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
                {pendingAllocations.map((alloc) => (
                  <div key={alloc.id} className='p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='text-sm font-black'>{alloc.registerno}</p>
                        <p className='text-[10px] text-slate-400 uppercase tracking-widest'>Room Request</p>
                      </div>
                      <span className='px-2 py-1 bg-amber-500/20 text-amber-500 text-[8px] font-black rounded-md uppercase'>Pending</span>
                    </div>
                    <div className='flex gap-2'>
                      <button 
                        onClick={() => handleApprove(alloc.id)}
                        className='flex-1 py-2 bg-emerald-500 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors'
                      >
                        Approve
                      </button>
                      <button 
                         onClick={() => {
                           setModalForm(prev => ({ ...prev, rejectId: alloc.id, reason: '' }));
                           setActiveModal('reject');
                         }}
                         className='flex-1 py-2 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors'
                       >
                         Reject
                       </button>
                    </div>
                  </div>
                ))}
                {pendingAllocations.length === 0 && (
                  <div className='py-10 text-center opacity-30'>
                    <UserCheck size={32} className='mx-auto mb-2' />
                    <p className='text-[10px] font-black uppercase tracking-widest'>All clear</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log (Phase 3) */}
          <div className='bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm'>
             <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-black text-slate-900 tracking-tight'>System History</h3>
                <History size={16} className='text-slate-300' />
             </div>
             <div className='space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'>
                {auditLogs.map((log) => (
                  <div key={log.id} className='flex gap-4 group'>
                    <div className='w-1 h-8 bg-indigo-50 group-hover:bg-indigo-500 rounded-full transition-colors'></div>
                    <div>
                       <p className='text-[11px] font-black text-slate-900'>{log.action.replace('_', ' ')}</p>
                       <p className='text-[10px] text-slate-500 font-medium mb-1'>{log.details}</p>
                       <p className='text-[9px] text-slate-400 font-bold uppercase tracking-wider'>
                        {new Date(log.timestamp).toLocaleTimeString()} • {log.adminId}
                       </p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className='text-center py-4 text-xs text-slate-300 italic'>No activity recorded yet.</p>
                )}
             </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] max-w-md w-full overflow-hidden p-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            {activeModal === 'hostel' && (
              <>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Create New Hostel</h3>
                  <p className="text-xs text-slate-400 mt-1">Register a new residential facility on campus</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Hostel Name</label>
                    <input 
                      type="text"
                      value={modalForm.name}
                      onChange={(e) => setModalForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Gandhi Boys Hostel"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Type</label>
                    <select
                      value={modalForm.type}
                      onChange={(e) => setModalForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-3 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (modalForm.name && modalForm.type) {
                        handleCreateHostel(modalForm.name, modalForm.type);
                        setActiveModal(null);
                      }
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-600/20"
                  >
                    Create
                  </button>
                </div>
              </>
            )}

            {activeModal === 'infra_choice' && (
              <>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Manage Infrastructure</h3>
                  <p className="text-xs text-slate-400 mt-1">Select an entity to add to the hostel facility</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setActiveModal('block')}
                    className="p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl text-left transition-colors border border-indigo-100"
                  >
                    <h4 className="font-black text-sm uppercase tracking-wider">Create New Block</h4>
                    <p className="text-[10px] text-indigo-500 mt-1">Add a new academic/residential block with unique identifiers.</p>
                  </button>
                  <button 
                    onClick={() => {
                      const selectedHostelData = hostels.find(h => h.id === modalForm.hostelId);
                      if (!selectedHostelData?.blocks || selectedHostelData.blocks.length === 0) {
                        showToast('Please create a block first!', 'warning');
                        return;
                      }
                      setActiveModal('room');
                    }}
                    className="p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-2xl text-left transition-colors border border-emerald-100"
                  >
                    <h4 className="font-black text-sm uppercase tracking-wider">Create New Room</h4>
                    <p className="text-[10px] text-emerald-500 mt-1">Add dormitory rooms with bed capacities nested inside blocks.</p>
                  </button>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}

            {activeModal === 'block' && (
              <>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Create New Block</h3>
                  <p className="text-xs text-slate-400 mt-1">Add a new block to the selected hostel</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Block Name</label>
                    <input 
                      type="text"
                      value={modalForm.name}
                      onChange={(e) => setModalForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Block A"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveModal('infra_choice')}
                    className="flex-1 py-3 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (modalForm.name && modalForm.hostelId) {
                        handleCreateBlock(modalForm.name, modalForm.hostelId);
                        setActiveModal(null);
                      }
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-600/20"
                  >
                    Create
                  </button>
                </div>
              </>
            )}

            {activeModal === 'room' && (
              <>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Create New Room</h3>
                  <p className="text-xs text-slate-400 mt-1">Register a room with capacity specifications</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Select Block</label>
                    <select
                      value={modalForm.blockId}
                      onChange={(e) => setModalForm(p => ({ ...p, blockId: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      {hostels.find(h => h.id === modalForm.hostelId)?.blocks?.map(block => (
                        <option key={block.id} value={block.id}>{block.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Room Number</label>
                    <input 
                      type="text"
                      value={modalForm.roomNumber}
                      onChange={(e) => setModalForm(p => ({ ...p, roomNumber: e.target.value }))}
                      placeholder="e.g. 101"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Capacity</label>
                    <input 
                      type="number"
                      value={modalForm.capacity}
                      onChange={(e) => setModalForm(p => ({ ...p, capacity: e.target.value }))}
                      placeholder="e.g. 4"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveModal('infra_choice')}
                    className="flex-1 py-3 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (modalForm.roomNumber && modalForm.capacity && modalForm.blockId) {
                        handleCreateRoom(modalForm.roomNumber, modalForm.capacity, modalForm.blockId);
                        setActiveModal(null);
                      }
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-600/20"
                  >
                    Create
                  </button>
                </div>
              </>
            )}

            {activeModal === 'asset' && (
              <>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Add Global Asset</h3>
                  <p className="text-xs text-slate-400 mt-1">Register dynamic resource specifications</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Asset Name</label>
                    <input 
                      type="text"
                      value={modalForm.name}
                      onChange={(e) => setModalForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Study Chair"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                    <input 
                      type="text"
                      value={modalForm.category}
                      onChange={(e) => setModalForm(p => ({ ...p, category: e.target.value }))}
                      placeholder="e.g. Furniture"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Replacement Cost (INR)</label>
                    <input 
                      type="number"
                      value={modalForm.cost}
                      onChange={(e) => setModalForm(p => ({ ...p, cost: e.target.value }))}
                      placeholder="e.g. 1500"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-3 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (modalForm.name && modalForm.category && modalForm.cost) {
                        handleCreateAsset(modalForm.name, modalForm.category, modalForm.cost);
                        setActiveModal(null);
                      }
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-600/20"
                  >
                    Create
                  </button>
                </div>
              </>
            )}

            {activeModal === 'reject' && (
              <>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight text-rose-600">Reject Allocation</h3>
                  <p className="text-xs text-slate-400 mt-1">Specify rejection comments below</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Rejection Reason</label>
                    <textarea 
                      value={modalForm.reason}
                      onChange={(e) => setModalForm(p => ({ ...p, reason: e.target.value }))}
                      placeholder="Specify why this allocation was rejected..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-rose-500 font-medium h-24 resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-3 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (modalForm.reason) {
                        handleReject(modalForm.rejectId, modalForm.reason);
                      }
                    }}
                    className="flex-1 py-3 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-rose-600/20"
                  >
                    Confirm Reject
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHostel;
