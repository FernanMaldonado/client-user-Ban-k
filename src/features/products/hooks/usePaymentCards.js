import { useState, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { getMisCuentas } from '../../../shared/api/apiCuentas';

export const usePaymentCards = () => {
  const user = useAuthStore(state => state.user);

  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loadingCards, setLoadingCards] = useState(true);

  const fetchCuentas = async () => {
    // El usuario puede tener el id como _id, id o uid
    const userId = user?._id || user?.id || user?.uid;
    if (!userId) {
      setCards([]);
      setLoadingCards(false);
      return;
    }

    try {
      const response = await getMisCuentas();
      const responseData = response.data;
      // La respuesta tiene { success, data: [...] }
      const cuentasArray = responseData?.data?.cuentas || responseData?.data || responseData?.cuentas || [];

      const mapped = cuentasArray.map(c => ({
        id: c._id || c.id,
        name: `${c.tipoCuenta} - N° ${c.numeroCuenta}`,
        balance: c.saldo ?? 0,
        isActive: c.isActive !== undefined ? c.isActive : true,
        numeroCuenta: c.numeroCuenta,
      }));

      setCards(mapped);
      if (mapped.length > 0 && !selectedCardId) {
        setSelectedCardId(mapped[0].id);
      }
    } catch (err) {
      console.error('Error cargando cuentas del usuario:', err);
      setCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, [user?._id, user?.id, user?.uid]);

  // Actualiza el saldo localmente después de una compra exitosa
  const deductBalance = (cardId, amount) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, balance: Math.max(0, card.balance - amount) }
          : card
      )
    );
  };

  const getSelectedCard = () => cards.find(c => c.id === selectedCardId);

  const getTotalBalance = () => cards.reduce((sum, c) => sum + c.balance, 0);

  const refreshCards = () => {
    setLoadingCards(true);
    fetchCuentas();
  };

  const setCuentas = (nuevasCuentas) => {
    setCards(nuevasCuentas);
    if (nuevasCuentas.length > 0) {
      setSelectedCardId(nuevasCuentas[0].id);
    } else {
      setSelectedCardId(null);
    }
  };

  return {
    cards,
    selectedCardId,
    setSelectedCardId,
    setCuentas,
    deductBalance,
    getSelectedCard,
    getTotalBalance,
    loadingCards,
    refreshCards,
  };
};
