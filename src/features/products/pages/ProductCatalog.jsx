import React, { useState } from 'react';
import { StoreNavbar } from '../components/StoreNavbar.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { PurchaseHistory } from '../components/PurchaseHistory.jsx';
import { ProductDetailModal } from '../components/ProductDetailModal.jsx';
import { useProducts } from '../hooks/useProducts';
import { usePurchaseHistory } from '../hooks/usePurchaseHistory';
import { usePaymentCards } from '../hooks/usePaymentCards';
import { realizarCompra } from '../../../shared/api/apiCompras';

export const ProductCatalog = () => {
  const PRODUCTS_PER_PAGE = 6;

  // State management using custom hooks
  const { products, loading, setProducts } = useProducts();
  const { history, addToHistory, filterByPeriod } = usePurchaseHistory();
  const {
    cards,
    selectedCardId,
    setSelectedCardId,
    deductBalance,
    getSelectedCard,
    refreshCards,
  } = usePaymentCards();

  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', actions: [] });

  // State for Purchase Flow
  const [purchaseModal, setPurchaseModal] = useState({ show: false, product: null });

  // Filter products based on search
  const filtered = products.filter(p =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(p.id) === searchQuery
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
  };

  const handleComprarClick = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0 || product.isActive === false) return;

    if (cards.length === 0) {
      setConfirmModal({
        show: true,
        title: 'Sin cuentas disponibles',
        message: 'No tienes cuentas bancarias registradas para realizar una compra.',
        actions: [
          {
            label: 'Entendido',
            onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
            className: 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }
        ]
      });
      return;
    }

    setPurchaseModal({
      show: true,
      product
    });
  };

  const executePurchase = async () => {
    const { product } = purchaseModal;
    const card = getSelectedCard();

    if (!card) {
      return;
    }

    if (card.balance < product.precio) {
      setConfirmModal({
        show: true,
        title: 'Saldo Insuficiente',
        message: `Tu cuenta "${card.name}" tiene saldo Q${card.balance.toFixed(2)} y el precio es Q${product.precio.toFixed(2)}.`,
        actions: [
          {
            label: 'Entendido',
            onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
            className: 'bg-red-600 text-white'
          }
        ]
      });
      return;
    }

    try {
      // 1. Llamar a la API de compras
      await realizarCompra({
        numeroCuenta: card.numeroCuenta,
        producto: product.id,
        cantidad: 1
      });

      // 2. Actualizar stock y saldo localmente
      const newStock = Math.max(0, product.stock - 1);
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, stock: newStock } : p
        )
      );

      deductBalance(selectedCardId, product.precio);

      // 3. Historial
      addToHistory([{ ...product, precio: product.precio }]);

      // Cerrar modal
      setPurchaseModal({ show: false, product: null });

      setConfirmModal({
        show: true,
        title: 'Compra Exitosa',
        message: `Has comprado "${product.nombre}" exitosamente.`,
        actions: [
          {
            label: 'Cerrar',
            onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
            className: 'bg-emerald-600 text-white hover:bg-emerald-500'
          }
        ]
      });

      // Refrescar para estar sincronizados
      setTimeout(() => refreshCards(), 800);
    } catch (err) {
      console.error('Error al procesar la compra:', err);
      const errorMsg = err.response?.data?.message || 'Hubo un error al procesar el pago. Inténtalo de nuevo.';
      setConfirmModal({
        show: true,
        title: 'Error al procesar',
        message: errorMsg,
        actions: [
          {
            label: 'Cerrar',
            onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
            className: 'bg-red-600 text-white'
          }
        ]
      });
    }
  };

  const handleFilterHistory = (period) => {
    if (period === 'all') {
      setFilteredHistory(history);
    } else {
      const filtered = filterByPeriod(period);
      setFilteredHistory(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 selection:bg-cyan-800/10">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-8 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 gap-6 w-full">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
            Módulo de <span className="text-cyan-900">Productos</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2">
            Compra productos con tus cuentas bancarias.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setHistoryOpen(true)}
            className="bg-cyan-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition shadow-sm cursor-pointer"
          >
            Historial
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={handleSearch} />

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Cargando productos...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {(!loading || products.length > 0) && (
          <>
            {paginated.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginated.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onComprarClick={handleComprarClick}
                    onCardClick={handleProductClick}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      {/* Purchase History Panel */}
      <PurchaseHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        historyItems={filteredHistory.length > 0 ? filteredHistory : history}
        onFilterChange={handleFilterHistory}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Purchase Flow Modal */}
      {purchaseModal.show && purchaseModal.product && (
        <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-350">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Confirmar Compra</h3>
            <p className="text-slate-600 mb-4 text-sm">
              ¿Estás seguro que deseas comprar <span className="font-bold">"{purchaseModal.product.nombre}"</span> por <span className="font-bold text-emerald-600">Q{purchaseModal.product.precio.toFixed(2)}</span>?
            </p>

            <div className="mb-6">
              <label className="block text-slate-500 text-xs font-semibold mb-2">SELECCIONA TU CUENTA BANCARIA</label>
              <select
                value={selectedCardId || ''}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-slate-700 bg-slate-50 font-medium"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - Saldo: Q{c.balance.toFixed(2)}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPurchaseModal({ show: false, product: null })}
                className="flex-1 py-3 rounded-2xl font-bold transition bg-slate-100 hover:bg-slate-200 text-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={executePurchase}
                className="flex-1 py-3 rounded-2xl font-bold transition bg-cyan-800 text-white hover:bg-cyan-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General Confirmation/Alert Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[105] modal-overlay flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-350">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{confirmModal.title}</h3>
            <p className="text-slate-500 mb-6 text-sm">{confirmModal.message}</p>
            <div className="flex gap-3">
              {confirmModal.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`flex-1 py-3 rounded-2xl font-bold transition ${action.className}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
