import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Send
} from 'lucide-react';

const StudentComplaints = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ category: 'Maintenance', description: '' });

  const registerno = user?.user?.username || user?.username;

  useEffect(() => {
    fetchComplaints();
  }, [registerno]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/hostel/student/complaints/${registerno}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setComplaints(await response.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/hostel/student/complaint', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ...newComplaint, registerno })
      });
      if (response.ok) {
        setShowModal(false);
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='p-8 space-y-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <p className='text-rose-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2'>Support Hub • Ticket Management</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>Hostel Complaints</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className='px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-lg shadow-black/10 tracking-widest uppercase hover:scale-[1.02] transition-transform flex items-center gap-2'
        >
          <Plus size={14} />
          Raise New Ticket
        </button>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden'>
        <div className='p-8 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4'>
           <div>
             <h3 className='text-xl font-black text-slate-900'>Active Tickets</h3>
             <p className='text-xs text-slate-400 font-medium mt-1'>Track your maintenance and service requests</p>
           </div>
           <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                <input type="text" placeholder="Search tickets..." className='pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none w-48' />
              </div>
           </div>
        </div>

        <div className='p-8'>
           {complaints.length > 0 ? (
             <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {complaints.map((comp, i) => (
                  <div key={i} className='p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-rose-200 transition-all group relative'>
                     <div className='flex items-center justify-between mb-4'>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          comp.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                          comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {comp.status}
                        </span>
                        <div className='p-2 bg-white rounded-lg shadow-sm text-slate-400'>
                           <MessageSquare size={14} />
                        </div>
                     </div>
                     <h4 className='text-sm font-black text-slate-900 mb-2'>{comp.category}</h4>
                     <p className='text-[11px] text-slate-500 leading-relaxed mb-6 h-12 overflow-hidden line-clamp-3'>{comp.description}</p>
                     
                     <div className='flex items-center justify-between pt-4 border-t border-slate-200/50'>
                        <div className='flex items-center gap-2 text-[10px] font-bold text-slate-400'>
                           <Clock size={12} />
                           <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button className='text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all'>
                           Details <ArrowRight size={12} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className='py-20 flex flex-col items-center gap-4 opacity-30 grayscale text-center'>
                <AlertCircle size={48} />
                <div>
                   <p className='text-sm font-black text-slate-500 uppercase tracking-widest'>No Tickets Found</p>
                   <p className='text-xs font-medium text-slate-400 mt-1'>Raise a complaint to get assistance.</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm'>
           <div className='bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
              <div className='p-8 bg-slate-900 text-white'>
                 <h3 className='text-xl font-black tracking-tight'>Raise New Ticket</h3>
                 <p className='text-slate-400 text-xs font-bold mt-1'>Provide details about the issue</p>
              </div>
              <form onSubmit={handleSubmit} className='p-8 space-y-6'>
                 <div className='space-y-2'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Category</label>
                    <select 
                      className='w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none'
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                    >
                       <option>Maintenance</option>
                       <option>Electrical</option>
                       <option>Plumbing</option>
                       <option>Internet/Network</option>
                       <option>Cleaning</option>
                       <option>Other</option>
                    </select>
                 </div>
                 <div className='space-y-2'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Description</label>
                    <textarea 
                      rows={4}
                      placeholder="Explain the issue in detail..."
                      className='w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none'
                      value={newComplaint.description}
                      onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                      required
                    ></textarea>
                 </div>
                 <div className='flex gap-3 pt-4'>
                    <button type="button" onClick={() => setShowModal(false)} className='flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors'>Cancel</button>
                    <button type="submit" className='flex-2 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2'>
                       <Send size={14} /> Submit Ticket
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;
