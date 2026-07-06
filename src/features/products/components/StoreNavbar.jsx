import React from 'react';

export const StoreNavbar = ({ onHistoryClick }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto px-8 pt-8 pb-5 flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
          Módulo de <span className="text-cyan-900">Productos</span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onHistoryClick}
            className="bg-cyan-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition shadow-sm cursor-pointer"
          >
            Historial
          </button>
        </div>
      </div>
    </nav>
  );
};
