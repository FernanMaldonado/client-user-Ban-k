import React from 'react';

export const ShoppingCart = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  cards,
  selectedCardId,
  onCardChange,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="cartPanel"
      className="fixed right-0 top-0 w-full md:w-96 h-full bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 p-8 z-50 overflow-y-auto custom-scrollbar"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Carrito</h2>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white cursor-pointer transition"
        >
          Cerrar
        </button>
      </div>

      <div id="cartItems" className="space-y-4 mb-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Tu carrito está vacío</p>
          </div>
        ) : (
          cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-slate-900 rounded-xl border border-slate-800"
            >
              <div>
                <span className="text-white block font-bold">{item.nombre}</span>
                <span className="text-emerald-400">${item.precio}</span>
              </div>
              <button
                onClick={() => onRemoveItem(index)}
                className="text-red-500 hover:text-red-400 bg-red-950 p-2 rounded-lg cursor-pointer transition"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-800 pt-6">
        <label className="block text-slate-400 mb-2 text-sm">Seleccionar Tarjeta:</label>
        <select
          value={selectedCardId || ''}
          onChange={(e) => onCardChange(Number(e.target.value))}
          className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
        >
          {cards.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} - Saldo: ${c.balance}
            </option>
          ))}
        </select>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400">Total:</span>
          <span id="cartTotal" className="text-2xl font-bold text-white">
            ${cartTotal}
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-500 transition cursor-pointer"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};
