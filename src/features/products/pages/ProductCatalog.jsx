import React, { useState } from 'react';
import { StoreNavbar } from '../components/StoreNavbar.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { ShoppingCart } from '../components/ShoppingCart.jsx';
import { PurchaseHistory } from '../components/PurchaseHistory.jsx';
import { ProductDetailModal } from '../components/ProductDetailModal.jsx';
import { useProducts } from '../hooks/useProducts';
import { useShoppingCart } from '../hooks/useShoppingCart';
import { usePurchaseHistory } from '../hooks/usePurchaseHistory';
import { usePaymentCards } from '../hooks/usePaymentCards';
import { updateProduct } from '../../../shared/api/admin';

export const ProductCatalog = () => {
  const PRODUCTS_PER_PAGE = 6;

  // State management using custom hooks
  const { products, loading } = useProducts();
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } = useShoppingCart();
  const { history, addToHistory, filterByPeriod } = usePurchaseHistory();
  const {
    cards,
    selectedCardId,
    setSelectedCardId,
    deductBalance,
    getSelectedCard,
    getTotalBalance
  } = usePaymentCards();

  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', actions: [] });

  // Compute stock dynamically by subtracting cart quantities
  const productsWithStock = products.map(p => {
    const cartCount = cart.filter(item => item.id === p.id).length;
    return {
      ...p,
      stock: Math.max(0, p.stock - cartCount)
    };
  });

  // Filter products based on search
  const filtered = productsWithStock.filter(p =>
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
    const product = productsWithStock.find(p => p.id === productId);
    setSelectedProduct(product);
  };

  const handleAddToCart = (productId) => {
    const product = productsWithStock.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    setConfirmModal({
      show: true,
      title: '¿Estás seguro?',
      message: '¿Quieres agregar este producto al carrito?',
      actions: [
        {
          label: 'Cancelar',
          onClick: () => setConfirmModal({ ...confirmModal, show: false }),
          className: 'bg-slate-800 text-white'
        },
        {
          label: 'Añadir',
          onClick: () => {
            addToCart(product);
            setConfirmModal({ ...confirmModal, show: false });
          },
          className: 'bg-blue-600 text-white hover:bg-blue-500'
        }
      ]
    });
  };

  const handleRemoveFromCart = (index) => {
    setConfirmModal({
      show: true,
      title: '¿Estás seguro?',
      message: '¿Quieres quitar este producto del carrito?',
      actions: [
        {
          label: 'Cancelar',
          onClick: () => setConfirmModal({ ...confirmModal, show: false }),
          className: 'bg-slate-800 text-white'
        },
        {
          label: 'Eliminar',
          onClick: () => {
            removeFromCart(index);
            setConfirmModal({ ...confirmModal, show: false });
          },
          className: 'bg-red-600 text-white hover:bg-red-500'
        }
      ]
    });
  };

  const handleCheckout = () => {
    const cartTotal = getCartTotal();
    if (cartTotal === 0) return;

    const card = getSelectedCard();
    if (!card) {
      setConfirmModal({
        show: true,
        title: 'Error',
        message: 'Por favor selecciona una tarjeta.',
        actions: [
          {
            label: 'Entendido',
            onClick: () => setConfirmModal({ ...confirmModal, show: false }),
            className: 'bg-slate-800 text-white'
          }
        ]
      });
      return;
    }

    if (card.balance < cartTotal) {
      setConfirmModal({
        show: true,
        title: 'Saldo Insuficiente',
        message: 'No tienes suficiente saldo en la tarjeta seleccionada.',
        actions: [
          {
            label: 'Entendido',
            onClick: () => setConfirmModal({ ...confirmModal, show: false }),
            className: 'bg-red-600 text-white'
          }
        ]
      });
      return;
    }

    setConfirmModal({
      show: true,
      title: 'Confirmar Compra',
      message: `¿Deseas finalizar la compra por $${cartTotal}?`,
      actions: [
        {
          label: 'Cancelar',
          onClick: () => setConfirmModal({ ...confirmModal, show: false }),
          className: 'bg-slate-800 text-white'
        },
        {
          label: 'Comprar',
          onClick: async () => {
            // Agrupar items del carrito para calcular la reducción de stock
            const cartGroups = cart.reduce((acc, item) => {
              acc[item.id] = (acc[item.id] || 0) + 1;
              return acc;
            }, {});

            // Actualizar stock en el servidor para cada producto comprado
            for (const [itemId, quantityBought] of Object.entries(cartGroups)) {
              const originalProduct = products.find(p => String(p.id) === itemId);
              if (originalProduct) {
                const newStock = Math.max(0, originalProduct.stock - quantityBought);
                try {
                  await updateProduct(originalProduct.id, {
                    id: originalProduct.id,
                    nombre: originalProduct.nombre,
                    descripcion: originalProduct.desc, // descripcion en el backend admin
                    precio: originalProduct.precio,
                    stock: newStock,
                    isActive: true
                  });
                } catch (err) {
                  console.error("Error actualizando stock en servidor para el producto", itemId, err);
                }
              }
            }

            deductBalance(selectedCardId, cartTotal);
            addToHistory(cart);
            clearCart();
            setCartOpen(false);
            setConfirmModal({ ...confirmModal, show: false });
          },
          className: 'bg-emerald-600 text-white hover:bg-emerald-500'
        }
      ]
    });
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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Navbar */}
      <StoreNavbar
        cartCount={cart.length}
        onCartClick={() => setCartOpen(!cartOpen)}
        onHistoryClick={() => setHistoryOpen(!historyOpen)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={handleSearch} />

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Cargando productos...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {(!loading || products.length > 0) && (
          <>
            {paginated.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">
                  {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginated.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddClick={handleAddToCart}
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

      {/* Shopping Cart Panel */}
      <ShoppingCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        cartTotal={getCartTotal()}
        cards={cards}
        selectedCardId={selectedCardId}
        onCardChange={setSelectedCardId}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

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

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{confirmModal.title}</h3>
            <p className="text-slate-400 mb-6">{confirmModal.message}</p>
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
