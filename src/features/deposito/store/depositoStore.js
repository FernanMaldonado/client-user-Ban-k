import { create } from 'zustand';
import { getMisCuentas, realizarDeposito, getMisDepositos } from '../../../shared/api/apiMovimientos';

export const useDepositoStore = create((set, get) => ({
    // Data fetching states
    misCuentas: [],
    historial: [],
    loadingCuentas: false,
    loadingHistorial: false,
    loadingAccion: false,

    // Deposito Wizard State
    step: 1,
    depositoData: {
        cuentaId: '',
        account_number: '',
        monto: ''
    },

    // Actions para la UI del Wizard
    setStep: (step) => set({ step }),
    setDepositoData: (data) => set((state) => ({ depositoData: { ...state.depositoData, ...data } })),
    resetDeposito: () => set({ step: 1, depositoData: { cuentaId: '', account_number: '', monto: '' } }),

    // API Actions
    fetchMisCuentas: async () => {
        set({ loadingCuentas: true });
        try {
            const res = await getMisCuentas();
            set({ misCuentas: res.data.data, loadingCuentas: false });
        } catch (error) {
            set({ loadingCuentas: false });
            console.error(error);
        }
    },

    fetchHistorial: async () => {
        set({ loadingHistorial: true });
        try {
            const res = await getMisDepositos();
            set({ historial: res.data.data || [], loadingHistorial: false });
        } catch (error) {
            set({ loadingHistorial: false });
            console.error(error);
        }
    },

    executeDeposito: async () => {
        set({ loadingAccion: true });
        const { cuentaId, account_number, monto } = get().depositoData;
        try {
            const res = await realizarDeposito({
                cuentaId,
                account_number,
                amount: Number(monto),
            });
            set({ loadingAccion: false });
            get().resetDeposito();
            get().fetchMisCuentas(); // Update balances
            return { success: true, message: res.data.message };
        } catch (error) {
            set({ loadingAccion: false });
            return { success: false, message: error.response?.data?.message || 'Error en el depósito' };
        }
    }
}));
