import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  GraduationCap,
  ClipboardCheck,
  Briefcase,
  Book,
  Activity,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  CreditCard,
  Building2,
  Ticket,
  Construction,
  Library,
  BarChart,
  ShieldCheck,
  UserCircle,
  BrainCircuit,
  Lightbulb,
  Package,
  Bus,
  LifeBuoy,
  Clock,
  Search,
  UserPlus,
  DollarSign,
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const currentRole = user?.user?.role || user?.role;

  const menuItems = [
    // General Home
    { title: 'Home', icon: <Home size={20} />, path: '/dashboard', roles: ['admin', 'admission', 'student', 'financer', 'transport_manager'] },
    
    // Admission Specific
    { title: 'Student Admission', icon: <UserPlus size={20} />, path: '/student-admission', roles: ['admin', 'admission'] },
    
    // Finance Specific
    { title: 'Fee Management', icon: <DollarSign size={20} />, path: '/finance-dashboard', roles: ['admin', 'financer'] },

    // Student Specific Modules (Comprehensive List from Images)
    { title: 'Academic Registration', icon: <GraduationCap size={20} />, path: '/academic-registration', roles: ['student'] },
    { title: 'Attendance register', icon: <ClipboardCheck size={20} />, path: '/attendance-register', roles: ['student'] },
    { title: 'Career Choice', icon: <Briefcase size={20} />, path: '/career-choice', roles: ['student'] },
    { title: 'Courses', icon: <Book size={20} />, path: '/courses', roles: ['student'] },
    { title: 'CRT', icon: <Activity size={20} />, path: '/crt', roles: ['student'] },
    { title: 'Counselling Diary', icon: <BookOpen size={20} />, path: '/counselling-diary', roles: ['student'] },
    { title: 'Clubs/Activities', icon: <Users size={20} />, path: '/clubs-activities', roles: ['student'] },
    { title: 'Exam Section', icon: <FileText size={20} />, path: '/exam-section', roles: ['student'] },
    { title: 'Feedback', icon: <MessageSquare size={20} />, path: '/feedback', roles: ['student'] },
    { title: 'Fee Payments', icon: <CreditCard size={20} />, path: '/fee-payments', roles: ['student'] },
    { title: 'Hostel Management', icon: <Building2 size={20} />, path: '/hostel', roles: ['student', 'admin'] },
    { title: 'Hallticket', icon: <Ticket size={20} />, path: '/hallticket', roles: ['student'] },
    { title: 'Infrastructure Related', icon: <Construction size={20} />, path: '/infrastructure-related', roles: ['student'] },
    { title: 'Library', icon: <Library size={20} />, path: '/library', roles: ['student', 'admin'] },
    { title: 'My CGPA', icon: <BarChart size={20} />, path: '/my-cgpa', roles: ['student'] },
    { title: 'Nodue', icon: <ShieldCheck size={20} />, path: '/nodue', roles: ['student'] },
    { title: 'Profile', icon: <UserCircle size={20} />, path: '/profile', roles: ['student'] },
    { title: 'Psychometric Tests', icon: <BrainCircuit size={20} />, path: '/psychometric-tests', roles: ['student'] },
    { title: 'Quizes', icon: <Lightbulb size={20} />, path: '/quizes', roles: ['student'] },
    { title: 'Registrar Office', icon: <Package size={20} />, path: '/registrar-office', roles: ['student'] },
    { title: 'My Transportation', icon: <Bus size={20} />, path: '/transportation', roles: ['student', 'admin', 'transport_manager'] },
    { title: 'Ticketing Support', icon: <LifeBuoy size={20} />, path: '/ticketing-support', roles: ['student'] },
    { title: 'Time Tables', icon: <Clock size={20} />, path: '/time-tables', roles: ['student'] },
    { title: 'Phd Exist Survey Feedback', icon: <Search size={20} />, path: '/phd-survey', roles: ['student'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-slate-100 flex flex-col z-50">
      <div className="p-8 border-b border-slate-50 flex items-center gap-3">
        <div className="w-12 h-12 bg-[#8B1A1A] rounded-[1rem] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-900/20 rotate-3">
          V
        </div>
        <div>
          <h1 className="text-xl font-black text-[#8B1A1A] tracking-tighter leading-tight uppercase">VFSTR ERP</h1>
          <p className="text-[#A16B47] text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-1">E-Governance System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {filteredItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-red-50 text-[#8B1A1A] shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <div className="flex items-center gap-4">
              <span className={`transition-colors duration-300 ${item.roles.includes('student') ? 'text-[#a16b47]' : 'text-slate-400'} group-hover:text-[#8B1A1A]`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-tight">{item.title}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50 bg-slate-50/50">
        <div className="flex items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
             <div className="w-10 h-10 rounded-2xl bg-[#8B1A1A] flex items-center justify-center text-white font-black shrink-0 shadow-md">
               {(user?.user?.username || user?.username || 'U').charAt(0).toUpperCase()}
             </div>
             <div className="min-w-0">
               <p className="text-xs font-black text-slate-900 truncate tracking-tight">{user?.user?.username || user?.username}</p>
               <p className="text-[10px] text-slate-400 truncate uppercase font-black tracking-widest">{currentRole} Portal</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;