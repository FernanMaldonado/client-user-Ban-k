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
  onCheckout,
  loadingCards,
}) => {
  if (!isOpen) return null;

  const selectedCard = cards.find(c => c.id === selectedCardId);

  return (
    <div
      id="cartPanel"
      className="fixed right-0 top-0 w-full md:w-96 h-full bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 p-8 z-50 overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Carrito</h2>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white cursor-pointer transition"
        >
          Cerrar
        </button>
      </div>

      {/* Items */}
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
                <span className="text-emerald-400 text-sm">Q{Number(item.precio).toFixed(2)}</span>
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

      {/* Account Section */}
      <div className="border-t border-slate-800 pt-6 space-y-4">
        {loadingCards ? (
          <div className="flex items-center gap-2 py-2 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
            Cargando cuentas...
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-4 text-center">
            <p className="text-slate-500 text-sm mb-2">No se encontraron cuentas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map(c => (
              <div
                key={c.id}
                onClick={() => onCardChange(c.id)}
                className={`p-3 rounded-xl cursor-pointer border ${c.id === selectedCardId ? 'bg-blue-900 border-blue-500' : 'bg-slate-900 border-slate-800'} hover:bg-slate-800`}
              >
                <span className="text-white">{c.name}</span>
                <span className="text-gray-400 block text-sm">Saldo: Q{Number(c.balance).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {selectedCard && (
          <div
            className={`rounded-2xl p-3 border flex justify-between items-center ${
              selectedCard.balance >= cartTotal
                ? 'bg-emerald-950/40 border-emerald-800/50'
                : 'bg-red-950/40 border-red-800/50'
            }`}
          >
            <span className="text-slate-400 text-xs">Saldo disponible</span>
            <span className={`font-bold text-sm ${selectedCard.balance >= cartTotal ? 'text-emerald-400' : 'text-red-400'}`}>
              Q{Number(selectedCard.balance).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Total and Checkout */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-slate-400">Total:</span>
        <span id="cartTotal" className="text-2xl font-bold text-white">
          Q{Number(cartTotal).toFixed(2)}
        </span>
      </div>

      <button
        onClick={onCheckout}
        disabled={cartItems.length === 0 || cards.length === 0}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-500 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Finalizar Compra
      </button>
    </div>
  );
};
