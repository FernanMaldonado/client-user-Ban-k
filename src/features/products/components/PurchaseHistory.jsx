import React from 'react';

export const PurchaseHistory = ({ isOpen, onClose, historyItems, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div
      id="historyPanel"
      className="fixed right-0 top-0 w-full md:w-96 h-full bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 p-8 z-50 overflow-y-auto custom-scrollbar"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Historial</h2>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white cursor-pointer transition"
        >
          Cerrar
        </button>
      </div>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => onFilterChange('day')}
          className="flex-1 py-2 text-xs bg-slate-800 rounded-lg hover:bg-slate-700 text-white font-semibold cursor-pointer transition"
        >
          Día
        </button>
        <button
          onClick={() => onFilterChange('week')}
          className="flex-1 py-2 text-xs bg-slate-800 rounded-lg hover:bg-slate-700 text-white font-semibold cursor-pointer transition"
        >
          Semana
        </button>
        <button
          onClick={() => onFilterChange('month')}
          className="flex-1 py-2 text-xs bg-slate-800 rounded-lg hover:bg-slate-700 text-white font-semibold cursor-pointer transition"
        >
          Mes
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
              <li key={idx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 animate-fadeIn">
                <span className="block text-white font-bold">{h.nombre}</span>
                <span className="text-emerald-400">-${h.precio}</span>
                {formattedDate && (
                  <span className="text-[10px] text-slate-500 block mt-1">{formattedDate}</span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
