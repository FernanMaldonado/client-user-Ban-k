import { useState } from 'react';

export const usePaymentCards = () => {
  const [cards, setCards] = useState([
    { id: 1, name: 'Visa Oro', balance: 2500 },
    { id: 2, name: 'Mastercard Platinum', balance: 5000 },
    { id: 3, name: 'Débito BancoFin', balance: 1200 }
  ]);

  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || null);

  const deductBalance = (cardId, amount) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, balance: Math.max(0, card.balance - amount) }
          : card
      )
    );
  };

  const getSelectedCard = () => {
    return cards.find(c => c.id === selectedCardId);
  };

  const getTotalBalance = () => {
    return cards.reduce((sum, card) => sum + card.balance, 0);
  };

  return {
    cards,
    selectedCardId,
    setSelectedCardId,
    deductBalance,
    getSelectedCard,
    getTotalBalance
  };
};
