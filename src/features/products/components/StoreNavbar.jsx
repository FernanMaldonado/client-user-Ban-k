import React from 'react';

export const StoreNavbar = ({ cartCount, onCartClick, onHistoryClick }) => {
  return (
    <nav className="sticky top-0 z-40 px-6 py-5 glass border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-white">
          BancoFin<span className="text-blue-500">Store</span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            className="relative p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition cursor-pointer"
          >
            🛒{' '}
            <span
              id="cartCount"
              className="absolute -top-1 -right-1 bg-blue-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold text-white"
            >
              {cartCount}
            </span>
          </button>
          <button
            onClick={onHistoryClick}
            className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-700 transition shadow-sm cursor-pointer"
          >
            Historial
          </button>
        </div>
      </div>
    </nav>
  );
};
