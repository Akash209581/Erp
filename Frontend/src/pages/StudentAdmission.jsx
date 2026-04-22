import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  Loader2
} from 'lucide-react';

const InputField = ({ label, name, value, onChange, type = "text", placeholder, options }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-semibold focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none appearance-none"
      >
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-300 focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
      />
    )}
  </div>
);

const StudentAdmission = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedVuid, setGeneratedVuid] = useState('');
  
  const [formData, setFormData] = useState({
    // Academic & Basic
    vuid: '',
    name: '',
    coursecode: '',
    branchcode: '',
    cyear: '1',
    semester: '1',
    sectioncode: 'A',
    batchno: '',
    admission_fee: 'No',
    total_fee_fixed: '',
    scholarship_amount: '',
    
    // Personal
    gender: '',
    dob: '',
    doj: new Date().toISOString().split('T')[0],
    studentmobile: '',
    studentemailid: '',
    mothertongue: '',
    Religion: '',
    caste: '',
    ReserveCategory: '',
    pysicallyhandi: 'No',
    EBC: 'No',
    Hostel: 'No',
    Transportation: 'No',
    country: 'India',
    
    // Family
    fathername: '',
    fathermobile: '',
    fatheroccupation: '',
    fathereducation: '',
    mothername: '',
    motheroccupation: '',
    mothereducation: '',
    parentemailid: '',
    annualincome: '',
    familystatus: '',
    
    // Address
    houseno: '',
    street: '',
    town: '',
    mandal: '',
    district: '',
    state: '',
    pincode: '',
    landline: '',
    
    // Entrance
    entrancetest: '',
    entrancetestrank: '',
    entrancemarks: '',
    seatcategory: '',
    
    // SSC (10th)
    ssctype: '',
    sscpassyear: '',
    sscschool: '',
    ssclocation: '',
    sscdistrict: '',
    tenthpercent: '',
    
    // Inter (12th)
    intertype: '',
    interpassyear: '',
    intercollege: '',
    interlocation: '',
    interdistrict: '',
    interpercent: '',
    
    // UG (Optional)
    ugmainstream: '',
    ugsubstream: '',
    ugpassyear: '',
    ugcollege: '',
    uguniversity: '',
    uglocation: '',
    ugdistrict: '',
    ugpercent: '',
    
    // PG (Optional)
    pgmainstream: '',
    pgsubstream: '',
    pgpassyear: '',
    pgcollege: '',
    pguniversity: '',
    pglocation: '',
    pgdistrict: '',
    pgpercent: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/students/finance', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit admission');
      }

      setGeneratedVuid(data.vuid);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center max-w-md w-full animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-500/20 rotate-3">
             <CheckCircle2 size={48} />
           </div>
           <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admission Confirmed!</h1>
           <div className="inline-block px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">VUID</span>
              <span className="text-xl font-black text-indigo-600 tracking-wider font-mono">{formData.vuid}</span>
           </div>
           <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">The student record has been successfully created and assigned ID <b>{formData.vuid}</b> in the master database.</p>
           <button 
             onClick={() => { setIsSuccess(false); setStep(1); setGeneratedVuid(''); }}
             className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
           >
             Register Another Student
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">New Enrollment</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Student Admission Portal</h1>
        </div>
        <div className="flex items-center gap-2">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-12 bg-indigo-600' : 'w-4 bg-slate-200'}`}></div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-50">
           <button type="button" onClick={() => setStep(1)} className={`flex-1 py-6 font-black text-[11px] uppercase tracking-widest transition-all ${step === 1 ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:bg-slate-50/50'}`}>Basis Docs</button>
           <button type="button" onClick={() => setStep(2)} className={`flex-1 py-6 font-black text-[11px] uppercase tracking-widest transition-all ${step === 2 ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:bg-slate-50/50'}`}>Personal</button>
           <button type="button" onClick={() => setStep(3)} className={`flex-1 py-6 font-black text-[11px] uppercase tracking-widest transition-all ${step === 3 ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:bg-slate-50/50'}`}>Education</button>
           <button type="button" onClick={() => setStep(4)} className={`flex-1 py-6 font-black text-[11px] uppercase tracking-widest transition-all ${step === 4 ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:bg-slate-50/50'}`}>Family</button>
           <button type="button" onClick={() => setStep(5)} className={`flex-1 py-6 font-black text-[11px] uppercase tracking-widest transition-all ${step === 5 ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:bg-slate-50/50'}`}>Review</button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 md:p-14">
          {error && (
            <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 animal-shake">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                   <Info size={24} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Institutional Information</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <InputField label="VUID" name="vuid" value={formData.vuid} onChange={handleChange} placeholder="Unique ID (e.g. VU24-001)" />
                 <InputField label="Student Name" name="name" value={formData.name} onChange={handleChange} placeholder="Full legal name" />
                 <InputField label="Course Code" name="coursecode" value={formData.coursecode} onChange={handleChange} options={['B.Tech', 'M.Tech', 'MBA', 'MCA', 'PHD']} />
                 <InputField label="Branch" name="branchcode" value={formData.branchcode} onChange={handleChange} options={['CSE', 'ECE', 'ME', 'CE', 'IT']} />
                 <InputField label="Current Year" name="cyear" value={formData.cyear} onChange={handleChange} options={['1', '2', '3', '4']} />
                 <InputField label="Semester" name="semester" value={formData.semester} onChange={handleChange} options={['1', '2', '3', '4', '5', '6', '7', '8']} />
                 <InputField label="Section" name="sectioncode" value={formData.sectioncode} onChange={handleChange} placeholder="A/B/C..." />
                 <InputField label="Batch No" name="batchno" value={formData.batchno} onChange={handleChange} placeholder="e.g. 2026-F" />
                 <InputField label="Date of Join" name="doj" value={formData.doj} onChange={handleChange} type="date" />
                 <InputField label="Admission Fee Paid" name="admission_fee" value={formData.admission_fee} onChange={handleChange} options={['Yes', 'No']} />
                 <InputField label="Total Fixed Fee" name="total_fee_fixed" value={formData.total_fee_fixed} onChange={handleChange} type="number" placeholder="0.00" />
                 <InputField label="Scholarship Amount" name="scholarship_amount" value={formData.scholarship_amount} onChange={handleChange} type="number" placeholder="0.00" />
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                   <User size={24} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Personal & Identity</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <InputField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
                 <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} type="date" />
                 <InputField label="Mobile" name="studentmobile" value={formData.studentmobile} onChange={handleChange} placeholder="+91..." />
                 <InputField label="Email ID" name="studentemailid" value={formData.studentemailid} onChange={handleChange} type="email" placeholder="student@example.com" />
                 <InputField label="Mother Tongue" name="mothertongue" value={formData.mothertongue} onChange={handleChange} placeholder="Telugu/Hindi..." />
                 <InputField label="Religion" name="Religion" value={formData.Religion} onChange={handleChange} options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other']} />
                 <InputField label="Caste" name="caste" value={formData.caste} onChange={handleChange} placeholder="General/BC/SC/ST" />
                 <InputField label="Category" name="ReserveCategory" value={formData.ReserveCategory} onChange={handleChange} options={['OC', 'BC-A', 'BC-B', 'BC-D', 'SC', 'ST']} />
                 <InputField label="Physical Handicap" name="pysicallyhandi" value={formData.pysicallyhandi} onChange={handleChange} options={['No', 'Yes']} />
                 <InputField label="Hostel Required" name="Hostel" value={formData.Hostel} onChange={handleChange} options={['No', 'Yes']} />
                 <InputField label="Transportation" name="Transportation" value={formData.Transportation} onChange={handleChange} options={['No', 'Yes']} />
                 <InputField label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="India" />
               </div>
               
               <div className="pt-10 border-t border-slate-50">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                     <MapPin size={20} />
                   </div>
                   <h3 className="font-black text-slate-900 tracking-tight">Contact Address</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="House No" name="houseno" value={formData.houseno} onChange={handleChange} />
                    <InputField label="Street" name="street" value={formData.street} onChange={handleChange} />
                    <InputField label="Town/City" name="town" value={formData.town} onChange={handleChange} />
                    <InputField label="Mandal" name="mandal" value={formData.mandal} onChange={handleChange} />
                    <InputField label="District" name="district" value={formData.district} onChange={handleChange} />
                    <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
                    <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                 </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
               <section>
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                     <GraduationCap size={24} />
                   </div>
                   <h2 className="text-xl font-black text-slate-900 tracking-tight">Academic History</h2>
                 </div>
                 
                 <div className="bg-slate-50/50 p-8 rounded-3xl space-y-8">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">SSC / 10th Standard</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                     <InputField label="SSC Type" name="ssctype" value={formData.ssctype} onChange={handleChange} options={['SSC', 'CBSE', 'ICSE']} />
                     <InputField label="Pass Year" name="sscpassyear" value={formData.sscpassyear} onChange={handleChange} />
                     <InputField label="School Name" name="sscschool" value={formData.sscschool} onChange={handleChange} />
                     <InputField label="Percent/GPA" name="tenthpercent" value={formData.tenthpercent} onChange={handleChange} />
                     <InputField label="District" name="sscdistrict" value={formData.sscdistrict} onChange={handleChange} />
                   </div>
                 </div>

                 <div className="bg-slate-50/50 p-8 rounded-3xl space-y-8 mt-8">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Intermediate / +2</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                     <InputField label="Type" name="intertype" value={formData.intertype} onChange={handleChange} options={['MPC', 'BiPC', 'CEC', 'HEC']} />
                     <InputField label="Pass Year" name="interpassyear" value={formData.interpassyear} onChange={handleChange} />
                     <InputField label="College" name="intercollege" value={formData.intercollege} onChange={handleChange} />
                     <InputField label="Percentage" name="interpercent" value={formData.interpercent} onChange={handleChange} />
                     <InputField label="Entrance Rank" name="entrancetestrank" value={formData.entrancetestrank} onChange={handleChange} />
                   </div>
                 </div>
               </section>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                   <Briefcase size={24} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Family & Occupation</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <InputField label="Father Name" name="fathername" value={formData.fathername} onChange={handleChange} />
                 <InputField label="Father Education" name="fathereducation" value={formData.fathereducation} onChange={handleChange} />
                 <InputField label="Father Occupation" name="fatheroccupation" value={formData.fatheroccupation} onChange={handleChange} />
                 <InputField label="Mother Name" name="mothername" value={formData.mothername} onChange={handleChange} />
                 <InputField label="Mother Education" name="mothereducation" value={formData.mothereducation} onChange={handleChange} />
                 <InputField label="Annual Income" name="annualincome" value={formData.annualincome} onChange={handleChange} placeholder="0.00" />
                 <InputField label="Parent Email" name="parentemailid" value={formData.parentemailid} onChange={handleChange} type="email" />
                 <InputField label="Parent Mobile" name="fathermobile" value={formData.fathermobile} onChange={handleChange} />
                 <InputField label="Family Status" name="familystatus" value={formData.familystatus} onChange={handleChange} options={['Nuclear', 'Joint']} />
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
               <div className="bg-indigo-600 p-10 rounded-[3rem] text-white relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Final Review</h2>
                  <p className="text-indigo-100 font-medium">Please verify all student data before submitting to the master database.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Core Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Full Name</span>
                        <span className="text-sm text-slate-900 font-bold">{formData.name || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Course/Branch</span>
                        <span className="text-sm text-slate-900 font-bold">{formData.coursecode} / {formData.branchcode}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Year/Sem</span>
                        <span className="text-sm text-slate-900 font-bold">{formData.cyear} Year / {formData.semester} Sem</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Contact Detail
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Mobile</span>
                        <span className="text-sm text-slate-900 font-bold">{formData.studentmobile}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Email</span>
                        <span className="text-sm text-slate-900 font-bold">{formData.studentemailid}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Location</span>
                        <span className="text-sm text-slate-900 font-bold">{formData.town}, {formData.district}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Financial Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Admission Fee</span>
                        <span className="text-sm text-slate-900 font-bold">₹{formData.admission_fee || '0.00'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-500 font-medium">Fixed Fee</span>
                        <span className="text-sm text-slate-900 font-bold">₹{formData.total_fee_fixed || '0.00'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-100 font-medium bg-red-500 px-2 rounded">Scholarship</span>
                        <span className="text-sm text-red-600 font-bold">- ₹{formData.scholarship_amount || '0.00'}</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          <div className="mt-16 flex items-center justify-between gap-4 pt-10 border-t border-slate-50">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || isLoading}
              className={`flex items-center gap-2 px-8 py-4 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <ChevronLeft size={16} />
              Back
            </button>
            
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-10 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
              >
                Next Step
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-95 disabled:bg-indigo-300"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} />
                    Submit Master Admission
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAdmission;