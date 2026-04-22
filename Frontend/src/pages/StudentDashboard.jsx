import React from 'react';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Briefcase,
  Search,
  Bell,
  Settings,
  ChevronDown
} from 'lucide-react';

const StudentDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const registerNo = user.username || 'Student';

    const cards = [
        {
            title: 'Journals & Conferences',
            icon: <BookOpen size={40} />,
            count: 0,
            iconClass: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        {
            title: 'Awards & Recognitions',
            icon: <Trophy size={40} />,
            count: 0,
            iconClass: 'bg-cyan-400',
            textColor: 'text-cyan-500'
        },
        {
            title: 'Workshops, Seminars & Guest Lectures',
            icon: <Users size={40} />,
            count: 0,
            iconClass: 'bg-emerald-500',
            textColor: 'text-emerald-500'
        },
        {
            title: 'Projects & Consultancy',
            icon: <Briefcase size={40} />,
            count: 0,
            iconClass: 'bg-indigo-600',
            textColor: 'text-indigo-600'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F3F6F9]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-8 flex-1">
                    <div className="hidden md:flex items-center gap-2 text-slate-400">
                        <div className="w-10 h-1bg-slate-100 rounded-lg"></div>
                        <div className="w-10 h-1bg-slate-100 rounded-lg"></div>
                    </div>
                    <div className="relative max-w-2xl w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search...(Beta version)"
                            className="block w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Settings size={20} />
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">{registerNo}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Portal</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                            {registerNo.charAt(0)}
                        </div>
                        <ChevronDown size={16} className="text-slate-400 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8 md:p-12 max-w-7xl mx-auto">
                <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-2xl font-medium text-slate-600">
                        Welcome <span className="text-slate-900 font-black">{registerNo}</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.map((card, index) => (
                        <div 
                            key={index}
                            className="group bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 transition-all duration-500 flex items-center justify-between relative overflow-hidden"
                        >
                            {/* Decorative Background Element */}
                            <div className={`absolute -right-4 -bottom-4 w-32 h-32 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-700 ${card.iconClass}`}></div>
                            
                            <div className="flex items-center gap-8 relative z-10">
                                <div className={`w-20 h-20 rounded-[1.5rem] ${card.iconClass} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                                    {card.icon}
                                </div>
                                <h3 className={`text-lg font-bold ${card.textColor} group-hover:translate-x-2 transition-transform duration-500 max-w-[200px] leading-snug`}>
                                    {card.title}
                                </h3>
                            </div>
                            
                            <div className="bg-[#FFC107] px-6 py-2 rounded-xl text-slate-900 font-black text-xl shadow-lg shadow-amber-500/20 relative z-10">
                                {card.count}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
