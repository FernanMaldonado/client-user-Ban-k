import React from 'react';

export const StoreNavbar = ({ cartCount, onCartClick, onHistoryClick }) => {
  return (
    <nav className="sticky top-0 z-40 px-6 py-5 bg-white border-b border-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black text-cyan-800 tracking-tighter italic">
          PRODUCTOS <span className="text-cyan-600 font-extrabold not-italic">BAN-K</span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            className="relative p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 text-slate-800 transition cursor-pointer border border-slate-200"
          >
            🛒{' '}
            <span
              id="cartCount"
              className="absolute -top-1 -right-1 bg-cyan-800 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold text-white"
            >
              {cartCount}
            </span>
          </button>
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
