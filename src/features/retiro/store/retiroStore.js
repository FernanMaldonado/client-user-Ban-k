import { create } from 'zustand';
import { getMisCuentas, realizarRetiro, getMisRetiros } from '../../../shared/api/apiMovimientos';

export const useRetiroStore = create((set, get) => ({
    // Data fetching states
    misCuentas: [],
    historial: [],
    loadingCuentas: false,
    loadingHistorial: false,
    loadingAccion: false,

    // Retiro Wizard State
    step: 1,
    retiroData: {
        account_number: '',
        monto: ''
    },

    // Actions para la UI del Wizard
    setStep: (step) => set({ step }),
    setRetiroData: (data) => set((state) => ({ retiroData: { ...state.retiroData, ...data } })),
    resetRetiro: () => set({ step: 1, retiroData: { account_number: '', monto: '' } }),

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
            const res = await getMisRetiros();
            set({ historial: res.data.retiros || [], loadingHistorial: false });
        } catch (error) {
            set({ loadingHistorial: false });
            console.error(error);
        }
    },

    executeRetiro: async () => {
        set({ loadingAccion: true });
        const { account_number, monto } = get().retiroData;
        try {
            const res = await realizarRetiro({
                account_number,
                amount: Number(monto),
            });
            set({ loadingAccion: false });
            get().resetRetiro();
            get().fetchMisCuentas(); // Update balances
            return { success: true, message: res.data.message };
        } catch (error) {
            set({ loadingAccion: false });
            return { success: false, message: error.response?.data?.message || 'Error en el retiro' };
        }
    }
}));
