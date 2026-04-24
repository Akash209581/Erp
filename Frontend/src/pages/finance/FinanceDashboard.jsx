import React, { useState } from 'react';
import { 
  Search, 
  DollarSign, 
  User, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  CreditCard,
  Target
} from 'lucide-react';

const FinanceDashboard = () => {
    const [vuid, setVuid] = useState('');
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        setStudent(null);

        try {
            const trimmedVuid = vuid.trim();
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/finance/vuid/${trimmedVuid}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Student not found';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    // Fallback to default message
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            setStudent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        setIsUpdating(true);
        setError('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/finance/update-payment`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vuid: student.vuid })
            });

            if (!response.ok) throw new Error('Failed to update payment');
            const updatedStudent = await response.json();
            setStudent(updatedStudent);
            setSuccessMessage(`Payment confirmed! Register Number ${updatedStudent.registerno} has been assigned.`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Finance Department</p>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Admission Fee Management</h1>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <Target size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                        <p className="text-sm font-bold text-slate-900 leading-tight">Live Terminal</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search size={22} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={vuid}
                                onChange={(e) => setVuid(e.target.value)}
                                placeholder="Enter Student VUID..."
                                className="block w-full pl-16 pr-32 py-6 bg-slate-50 border-2 border-slate-50 rounded-3xl text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500/20 focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <button
                                    type="submit"
                                    disabled={isLoading || !vuid}
                                    className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Fetch Details'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="max-w-xl mx-auto mb-8 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 animal-shake transition-all animate-in slide-in-from-top-2">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="max-w-xl mx-auto mb-8 flex items-center gap-3 p-6 bg-emerald-50 text-emerald-700 rounded-3xl text-sm font-bold border-2 border-emerald-100 transition-all animate-in zoom-in-95 duration-300">
                            <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {student && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto border border-slate-50 rounded-[3rem] p-8 md:p-12 bg-slate-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                                            <User size={30} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{student.name}</h2>
                                            <p className="text-slate-500 font-bold text-sm tracking-tight">{student.vuid}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Course / Branch</span>
                                            <span className="text-sm font-bold text-slate-900">{student.coursecode} / {student.branchcode}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Fixed Annual Fee</span>
                                            <span className="text-lg font-black text-slate-900 font-mono">₹{student.total_fee_fixed}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Scholarship</span>
                                            <span className="text-md font-black text-red-500">- ₹{student.scholarship_amount || '0.00'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center gap-8">
                                    <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${student.admission_fee === 'Yes' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100 animate-pulse'}`}>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${student.admission_fee === 'Yes' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'}`}>
                                                <ShieldCheck size={24} />
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${student.admission_fee === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {student.admission_fee === 'Yes' ? 'Paid' : 'Pending Payment'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 mb-2">Admission Fee Status</h3>
                                        <p className="text-slate-500 text-sm font-medium mb-6">Student must pay the admission fee to unlock the Register Number and create their portal account.</p>
                                        
                                        {student.admission_fee !== 'Yes' ? (
                                            <button
                                                onClick={handleConfirmPayment}
                                                disabled={isUpdating}
                                                className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Confirm Payment & Register'}
                                            </button>
                                        ) : (
                                            <div className="p-4 bg-white rounded-2xl border border-emerald-100 flex items-center justify-between">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Assigned Reg No</span>
                                                <span className="text-lg font-black text-indigo-600 font-mono tracking-wider">{student.registerno}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;
