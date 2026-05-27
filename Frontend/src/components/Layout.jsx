import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden antialiased">
      {/* Sidebar - fixed and non-collapsible for ERP */}
      <Sidebar user={user} onLogout={onLogout} />
      
      {/* Main Content Area - Shifted right by the sidebar width (w-80 = 320px) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] ml-80">
        {/* Module Header */}
        <header className="h-20 bg-white border-b border-slate-200/60 flex items-center justify-between px-10 shadow-[0_1px_15px_-4px_rgba(0,0,0,0.05)] z-40">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-[17px] font-black tracking-tight text-[#1e293b]">
              VFSTR Management System
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session</p>
              <p className="text-[13px] font-bold text-slate-700 leading-none tracking-tight">2026-2027 (Active)</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ring-offset-2 hover:ring-2 hover:ring-slate-100">
              <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
          </div>
        </header>

        {/* Dynamic Content Scrollable */}
        <main className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar scroll-smooth">
          <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
