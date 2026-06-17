import React from 'react';

export const ProductCard = ({ product, onAddClick, onCardClick }) => {
  const isAvailable = product.stock > 0;

  return (
    <div
      onClick={() => onCardClick(product.id)}
      className="cursor-pointer bg-slate-900 p-6 rounded-3xl border border-slate-800 relative hover:border-blue-500/50 transition-all group"
    >
      <div className="absolute top-4 right-4 bg-slate-800 text-blue-400 text-[10px] px-2 py-1 rounded font-mono border border-slate-700">
        #{product.id}
      </div>
      <h3 className="font-bold text-lg text-white mt-4">{product.nombre}</h3>
      <p className="text-blue-400 font-extrabold text-2xl mt-2">${product.precio}</p>
      <p className="text-xs text-slate-500 mt-1 mb-6 uppercase tracking-wider font-bold">
        Stock: {product.stock}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          isAvailable && onAddClick(product.id);
        }}
        className={`w-full ${
          isAvailable
            ? 'bg-slate-800 hover:bg-blue-600'
            : 'bg-slate-950 opacity-50 cursor-not-allowed'
        } text-white py-3 rounded-2xl font-bold transition`}
      >
        {isAvailable ? 'Añadir al Carrito' : 'Agotado'}
      </button>
    </div>
  );
};
