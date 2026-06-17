import { useState } from 'react';

export const usePurchaseHistory = () => {
  const [history, setHistory] = useState([]);

  const addToHistory = (items) => {
    const newItems = items.map(item => ({
      ...item,
      purchaseDate: new Date()
    }));
    setHistory(prev => [...newItems, ...prev]);
  };

  const filterByPeriod = (period) => {
    const now = new Date();
    return history.filter(h => {
      const diff = now - h.purchaseDate;
      if (period === 'day') return diff < 86400000;
      if (period === 'week') return diff < 604800000;
      if (period === 'month') return diff < 2592000000;
      return true;
    });
  };

  return { history, addToHistory, filterByPeriod };
};
