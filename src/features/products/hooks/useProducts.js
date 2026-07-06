import { useState, useEffect } from 'react';
import { getProducts } from '../../../shared/api/apiProductos';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar productos
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      const data = response.data;
      
      // Transformar productos del servidor al formato esperado
      let productsArray = [];
      
      if (data && Array.isArray(data.data)) {
        productsArray = data.data;
      } else if (data && Array.isArray(data)) {
        productsArray = data;
      } else if (data && data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      }

      if (productsArray && productsArray.length > 0) {
        const transformedProducts = productsArray.map(product => ({
          id: product.id || product._id || product.productId,
          nombre: product.name || product.nombre || product.title || 'Sin nombre',
          precio: product.price || product.precio || product.cost || 0,
          stock: product.stock !== undefined ? product.stock : (product.quantity !== undefined ? product.quantity : 0),
          desc: product.descripcion || product.description || product.desc || product.details || 'Sin descripción',
          isActive: product.isActive !== undefined ? product.isActive : true
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error cargando productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
    
    // Actualizar productos cada 10 segundos para ver nuevos productos del admin
    const interval = setInterval(fetchProducts, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const decreaseStock = (productId) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - 1) } : p
      )
    );
  };

  const increaseStock = (productId) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, stock: p.stock + 1 } : p
      )
    );
  };

  const refreshProducts = () => {
    setLoading(true);
    fetchProducts();
  };

  return { products, decreaseStock, increaseStock, setProducts, loading, error, refreshProducts };
};
