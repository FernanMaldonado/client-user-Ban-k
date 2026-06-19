import React from 'react';

export const ProductCard = ({ product, onAddClick, onCardClick }) => {
  const isAvailable = product.stock > 0;
  const isActive = product.isActive !== false; // true por defecto si no está definido

  return (
    <div
      onClick={() => onCardClick(product.id)}
      className="cursor-pointer bg-slate-900 p-6 rounded-3xl border border-slate-800 relative hover:border-blue-500/50 transition-all group"
    >
      {/* Badge de estado activo/inactivo */}
      <div
        className={`absolute top-4 left-4 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide ${
          isActive ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/40' : 'bg-red-900/60 text-red-400 border border-red-700/40'
        }`}
      >
        {isActive ? '● Activo' : '○ Inactivo'}
      </div>

      {/* ID badge */}
      <div className="absolute top-4 right-4 bg-slate-800 text-blue-400 text-[10px] px-2 py-1 rounded font-mono border border-slate-700">
        #{String(product.id).slice(-6)}
      </div>

      <h3 className="font-bold text-lg text-white mt-8">{product.nombre}</h3>

      {/* Descripción */}
      {product.desc && product.desc !== 'Sin descripción' && (
        <p className="text-slate-500 text-xs mt-1 mb-2 line-clamp-2">{product.desc}</p>
      )}

      <p className="text-blue-400 font-extrabold text-2xl mt-2">Q{product.precio}</p>
      <p
        className={`text-xs mt-1 mb-6 uppercase tracking-wider font-bold ${
          product.stock === 0 ? 'text-red-500' : product.stock <= 3 ? 'text-amber-400' : 'text-slate-500'
        }`}
      >
        Stock: {product.stock}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isAvailable && isActive) onAddClick(product.id);
        }}
        className={`w-full ${
          isAvailable && isActive
            ? 'bg-slate-800 hover:bg-blue-600'
            : 'bg-slate-950 opacity-50 cursor-not-allowed'
        } text-white py-3 rounded-2xl font-bold transition`}
      >
        {!isActive ? 'Producto inactivo' : isAvailable ? 'Añadir al Carrito' : 'Agotado'}
      </button>
    </div>
  );
};
