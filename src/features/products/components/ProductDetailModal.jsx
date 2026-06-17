import React from 'react';

export const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-2">{product.nombre}</h3>
        <p className="text-slate-400 mb-4 text-sm">{product.desc}</p>
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-blue-500">${product.precio}</span>
          <span className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold">
            Stock: {product.stock}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-slate-800 py-3 rounded-2xl hover:bg-slate-700 transition font-bold text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
