import { useState, useEffect } from 'react';
import { getMisCompras } from '../../../shared/api/apiCompras';

export const usePurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await getMisCompras();
      // La respuesta esperada de tu API
      const comprasDB = response.data?.compras || [];

      const mapped = comprasDB.map(c => ({
        id: c._id,
        nombre: c.descripcion || c.producto?.nombre || 'Compra',
        precio: (c.precioMejor || c.producto?.precio || 0) * (c.cantidad || 1),
        purchaseDate: c.createdAt || c.fechaSolicitud || new Date()
      }));

      setHistory(mapped);
    } catch (error) {
      console.error("Error al obtener historial de compras:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const addToHistory = (items) => {
    const newItems = items.map(item => ({
      ...item,
      purchaseDate: new Date()
    }));
    setHistory(prev => [...newItems, ...prev]);
  };

  return { history, addToHistory, fetchHistory, loadingHistory };
};
