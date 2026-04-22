import React from 'react';

const ModulePlaceholder = ({ title }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h1 className="text-2xl font-bold text-slate-900">{title} Module</h1>
          <p className="text-slate-500">Official management system for {title}</p>
        </div>
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6 text-slate-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-4 6h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Module is under development</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            The functional components for {title} are currently being integrated with the database. 
            Check back soon for the full feature set.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">Coming Soon</div>
            <div className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">v1.1 Alpha</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePlaceholder;
