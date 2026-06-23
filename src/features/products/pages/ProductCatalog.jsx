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
import { updateProduct, updateCuenta } from '../../../shared/api/admin';

export const ProductCatalog = () => {
  const PRODUCTS_PER_PAGE = 6;

  // State management using custom hooks
  const { products, loading, setProducts } = useProducts();
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } = useShoppingCart();
  const { history, addToHistory, filterByPeriod } = usePurchaseHistory();
  const {
    cards,
    selectedCardId,
    setSelectedCardId,
    deductBalance,
    getSelectedCard,
    loadingCards,
    refreshCards,
  } = usePaymentCards();

  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', actions: [] });

  // El stock ya se actualiza localmente en setProducts al añadir/quitar del carrito,
  // y también se persiste en el backend. No restamos cart items aquí para evitar doble descuento.
  const productsWithStock = products;

  // Filter products based on search (todos los productos, activos e inactivos)
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
    if (!product || product.stock <= 0 || product.isActive === false) return;

    setConfirmModal({
      show: true,
      title: '¿Estás seguro?',
      message: `¿Quieres agregar "${product.nombre}" al carrito?`,
      actions: [
        {
          label: 'Cancelar',
          onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
          className: 'bg-slate-100 hover:bg-slate-200 text-slate-800'
        },
        {
          label: 'Añadir',
          onClick: async () => {
            // 1. Agregar al carrito local
            addToCart(product);

            // 2. Reducir stock en la DB del admin INMEDIATAMENTE
            const originalProduct = products.find(p => p.id === productId);
            if (originalProduct) {
              const newStock = Math.max(0, originalProduct.stock - 1);
              try {
                await updateProduct(originalProduct.id, {
                  nombre: originalProduct.nombre,
                  descripcion: originalProduct.desc,
                  precio: originalProduct.precio,
                  stock: newStock,
                  isActive: originalProduct.isActive !== false,
                });
                // Actualizar el estado local de productos también para reflejar la baja
                setProducts(prev =>
                  prev.map(p =>
                    p.id === productId ? { ...p, stock: newStock } : p
                  )
                );
              } catch (err) {
                console.error('Error actualizando stock en el servidor:', err);
              }
            }

            setConfirmModal(prev => ({ ...prev, show: false }));
          },
          className: 'bg-cyan-800 text-white hover:bg-cyan-700'
        }
      ]
    });
  };

  const handleRemoveFromCart = (index) => {
    const itemToRemove = cart[index];

    setConfirmModal({
      show: true,
      title: '¿Estás seguro?',
      message: '¿Quieres quitar este producto del carrito?',
      actions: [
        {
          label: 'Cancelar',
          onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
          className: 'bg-slate-100 hover:bg-slate-200 text-slate-800'
        },
        {
          label: 'Eliminar',
          onClick: async () => {
            // 1. Quitar del carrito local
            removeFromCart(index);

            // 2. Devolver stock en la DB del admin
            if (itemToRemove) {
              const originalProduct = products.find(p => p.id === itemToRemove.id);
              if (originalProduct) {
                const restoredStock = originalProduct.stock + 1;
                try {
                  await updateProduct(originalProduct.id, {
                    nombre: originalProduct.nombre,
                    descripcion: originalProduct.desc,
                    precio: originalProduct.precio,
                    stock: restoredStock,
                    isActive: originalProduct.isActive !== false,
                  });
                  // Actualizar el estado local también
                  setProducts(prev =>
                    prev.map(p =>
                      p.id === itemToRemove.id ? { ...p, stock: restoredStock } : p
                    )
                  );
                } catch (err) {
                  console.error('Error restaurando stock en el servidor:', err);
                }
              }
            }

            setConfirmModal(prev => ({ ...prev, show: false }));
          },
          className: 'bg-red-600 text-white hover:bg-red-700'
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
        title: 'Sin cuenta seleccionada',
        message: 'Por favor selecciona una cuenta bancaria.',
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

    if (card.balance < cartTotal) {
      setConfirmModal({
        show: true,
        title: 'Saldo Insuficiente',
        message: `Tu cuenta "${card.name}" tiene saldo Q${card.balance.toFixed(2)} y el total es Q${cartTotal.toFixed(2)}.`,
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

    setConfirmModal({
      show: true,
      title: 'Confirmar Compra',
      message: `¿Confirmas la compra de Q${cartTotal.toFixed(2)} con la cuenta "${card.name}"?`,
      actions: [
        {
          label: 'Cancelar',
          onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
          className: 'bg-slate-800 text-white'
        },
        {
          label: 'Comprar',
          onClick: async () => {
            try {
              // Descontar saldo de la cuenta bancaria real en el backend
              const newBalance = Math.max(0, card.balance - cartTotal);
              await updateCuenta(card.id, { saldo: newBalance });

              // Actualizar saldo en el estado local del hook
              deductBalance(selectedCardId, cartTotal);

              // El stock ya fue reducido en el momento de añadir al carrito
              // Agregar al historial y limpiar carrito
              addToHistory(cart);
              clearCart();
              setCartOpen(false);
              setConfirmModal(prev => ({ ...prev, show: false }));

              // Refrescar cuentas para ver el saldo actualizado desde el servidor
              setTimeout(() => refreshCards(), 800);
            } catch (err) {
              console.error('Error al procesar la compra:', err);
              setConfirmModal({
                show: true,
                title: 'Error al procesar',
                message: 'Hubo un error al procesar el pago. Inténtalo de nuevo.',
                actions: [
                  {
                    label: 'Cerrar',
                    onClick: () => setConfirmModal(prev => ({ ...prev, show: false })),
                    className: 'bg-red-600 text-white'
                  }
                ]
              });
            }
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
    <div className="min-h-screen bg-gray-50 text-slate-800 selection:bg-cyan-800/10">
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
        loadingCards={loadingCards}
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
        <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
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
