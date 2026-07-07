import React from 'react';

export const PurchaseHistory = ({ isOpen, onClose, historyItems, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div
      id="historyPanel"
      className="fixed right-0 top-0 w-full md:w-96 h-full bg-white/95 backdrop-blur-xl border-l border-slate-200 p-8 z-50 overflow-y-auto custom-scrollbar"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Historial</h2>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 cursor-pointer transition"
        >
          Cerrar
        </button>
      </div>

      <ul id="historyList" className="space-y-4">
        {historyItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No hay compras registradas</p>
          </div>
        ) : (
          historyItems.map((h, idx) => {
            const dateObj = h.purchaseDate || h.date;
            const formattedDate = dateObj instanceof Date
              ? dateObj.toLocaleDateString()
              : typeof dateObj === 'string'
                ? new Date(dateObj).toLocaleDateString()
                : '';

            return (
              <li key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-fadeIn">
                <span className="block text-slate-800 font-bold">{h.nombre}</span>
                <span className="text-red-500 font-semibold">-Q{h.precio}</span>
                {formattedDate && (
                  <span className="text-[10px] text-slate-400 block mt-1">{formattedDate}</span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
