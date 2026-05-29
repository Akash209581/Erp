import React, { useState, useEffect } from 'react';
import { Building2, Home, CheckCircle2, ChevronRight, Lock, UserCheck } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const RoomPicker = ({ user, onRoomSelect }) => {
  const { showToast } = useToast();
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerno = user?.user?.username || user?.username;

  useEffect(() => {
    fetchInfrastructure();
  }, []);

  const fetchInfrastructure = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/student/infrastructure', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setHostels(await res.json());
      }
    } catch (error) {
      console.error('Error fetching infrastructure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockRoom = async () => {
    if (!selectedRoom) return;
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/hostel/student/request-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          registerno,
          roomId: selectedRoom.id,
          campusId: selectedHostel.campusId || '00000000-0000-0000-0000-000000000000', // Default if not set
          hostelId: selectedHostel.id,
          blockId: selectedBlock.id
        })
      });

      if (res.ok) {
        onRoomSelect(); // Trigger refresh in parent
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to lock room', 'error');
      }
    } catch (error) {
      console.error('Error locking room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase tracking-widest">Scanning Available Units...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full border border-amber-100 shadow-sm">
          <Lock size={14} className="animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest">Tactical Booking Active</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Select Your Residence</h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">Pick your preferred hostel and room. Your selection will be locked for review by the Chief Warden.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1: Select Hostel */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
            Choose Hostel
          </h3>
          <div className="space-y-3">
            {hostels.map(h => (
              <button
                key={h.id}
                onClick={() => { setSelectedHostel(h); setSelectedBlock(null); setSelectedRoom(null); }}
                className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between group ${selectedHostel?.id === h.id ? 'border-slate-900 bg-slate-900 text-white shadow-xl translate-x-2' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedHostel?.id === h.id ? 'bg-white/10' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <p className={`font-black text-sm tracking-tight ${selectedHostel?.id === h.id ? 'text-white' : 'text-slate-900'}`}>{h.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedHostel?.id === h.id ? 'text-slate-400' : 'text-slate-400'}`}>{h.type} Only</p>
                  </div>
                </div>
                {selectedHostel?.id === h.id && <CheckCircle2 size={20} className="text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Block */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
            Select Wing
          </h3>
          <div className="space-y-3">
            {selectedHostel ? (
              selectedHostel.blocks.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBlock(b); setSelectedRoom(null); }}
                  className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between group ${selectedBlock?.id === b.id ? 'border-slate-900 bg-slate-900 text-white shadow-xl translate-x-2' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedBlock?.id === b.id ? 'bg-white/10' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                      <Home size={24} />
                    </div>
                    <div>
                      <p className={`font-black text-sm tracking-tight ${selectedBlock?.id === b.id ? 'text-white' : 'text-slate-900'}`}>{b.name}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedBlock?.id === b.id ? 'text-slate-400' : 'text-slate-400'}`}>{b.rooms.length} Units Available</p>
                    </div>
                  </div>
                  {selectedBlock?.id === b.id && <CheckCircle2 size={20} className="text-emerald-400" />}
                </button>
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Select Hostel First</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Select Room Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
            Pick Room
          </h3>
          {selectedBlock ? (
            <div className="grid grid-cols-4 gap-3 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              {selectedBlock.rooms.map(r => {
                const occupancy = r.currentOccupancy;
                const capacity = r.capacity;
                const isFull = occupancy >= capacity;
                const isLimited = capacity - occupancy === 1;
                const isAvailable = capacity - occupancy > 1;

                let statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300';
                if (isFull) statusColor = 'bg-rose-50 text-rose-600 border-rose-100 cursor-not-allowed opacity-60';
                else if (isLimited) statusColor = 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300';

                if (selectedRoom?.id === r.id) {
                  statusColor = 'bg-slate-900 border-slate-900 text-white shadow-xl scale-110';
                }

                return (
                  <button
                    key={r.id}
                    disabled={isFull}
                    onClick={() => setSelectedRoom(r)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${statusColor}`}
                  >
                    <span className="text-xs font-black">{r.roomNumber}</span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(capacity)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${i < occupancy ? 'bg-current' : 'bg-current opacity-20'}`}></div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Select Wing First</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Area */}
      {selectedRoom && (
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                      <UserCheck size={32} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black tracking-tight">Lock Room {selectedRoom.roomNumber}?</h2>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Wing: {selectedBlock.name} • {selectedHostel.name}</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 <button 
                  onClick={() => { setSelectedRoom(null); }}
                  className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                 >
                    Reset
                 </button>
                 <button 
                  onClick={handleLockRoom}
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-amber-500 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? 'Processing...' : 'Lock & Confirm Request'}
                    {!isSubmitting && <ChevronRight size={14} />}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RoomPicker;
