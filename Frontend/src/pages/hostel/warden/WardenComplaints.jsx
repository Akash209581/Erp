import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const WardenComplaints = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/hostel/warden/complaints/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchComplaints();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-amber-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Operations • Maintenance Hub</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Complaint Management</h1>
        </div>
        <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm'>
          <div className='flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl'>
             <ShieldAlert size={16} className='text-amber-600' />
             <span className='text-[10px] font-black text-amber-600 uppercase tracking-widest'>{complaints.filter(c => c.status === 'Pending').length} Pending Tasks</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
        <div className='p-8 border-b border-slate-50 flex items-center justify-between'>
           <h3 className='text-xl font-black text-slate-900'>Ticket Deck</h3>
           <div className='flex items-center gap-2'>
              <div className='relative'>
                 <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                 <input type="text" placeholder="Search by student/category..." className='pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none w-64' />
              </div>
              <button className='p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors'>
                 <Filter size={16} />
              </button>
           </div>
        </div>

        <div className='overflow-x-auto'>
           <table className='w-full text-left border-collapse'>
              <thead className='bg-slate-50/50'>
                 <tr>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Student Details</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Category</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Issue</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Status</th>
                    <th className='px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>Actions</th>
                 </tr>
              </thead>
              <tbody className='divide-y divide-slate-50'>
                 {complaints.length > 0 ? complaints.map((comp, i) => (
                   <tr key={i} className='hover:bg-slate-50/50 transition-colors'>
                      <td className='px-8 py-5'>
                         <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-sm'>
                               {comp.registerno.charAt(0)}
                            </div>
                            <div>
                               <p className='text-sm font-bold text-slate-900'>{comp.registerno}</p>
                               <p className='text-[10px] text-slate-400 font-medium'>Reg No.</p>
                            </div>
                         </div>
                      </td>
                      <td className='px-8 py-5'>
                         <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100'>
                            {comp.category}
                         </span>
                      </td>
                      <td className='px-8 py-5'>
                         <p className='text-xs font-medium text-slate-600 max-w-xs truncate'>{comp.description}</p>
                      </td>
                      <td className='px-8 py-5'>
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                           comp.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                           comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                         }`}>
                           {comp.status}
                         </span>
                      </td>
                      <td className='px-8 py-5'>
                         <div className='flex items-center gap-2'>
                            <button 
                              onClick={() => updateStatus(comp.id, 'Resolved')}
                              className='px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors shadow-sm'
                            >
                               Resolve
                            </button>
                            <button 
                              onClick={() => updateStatus(comp.id, 'In Progress')}
                              className='px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors shadow-sm'
                            >
                               In Progress
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan="5" className='px-8 py-20 text-center opacity-30 grayscale'>
                         <div className='flex flex-col items-center gap-3'>
                            <MessageSquare size={48} />
                            <p className='text-sm font-black text-slate-500 uppercase tracking-widest'>No active complaints</p>
                         </div>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default WardenComplaints;
