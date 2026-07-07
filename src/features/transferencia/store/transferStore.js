import { create } from 'zustand';
import { getMisCuentas, getMisContactos, agregarContacto, eliminarContacto, realizarTransferencia, getMisTransacciones } from '../../../shared/api/apiMovimientos';

export const useTransferStore = create((set, get) => ({
    // Data fetching states
    misCuentas: [],
    misContactos: [],
    historial: [],
    loadingCuentas: false,
    loadingContactos: false,
    loadingHistorial: false,
    loadingAccion: false,

    // Transfer Wizard State
    step: 1,
    transferData: {
        cuentaOrigen: '',
        cuentaDestino: '',
        monto: ''
    },

    // Actions para la UI del Wizard
    setStep: (step) => set({ step }),
    setTransferData: (data) => set((state) => ({ transferData: { ...state.transferData, ...data } })),
    resetTransfer: () => set({ step: 1, transferData: { cuentaOrigen: '', cuentaDestino: '', monto: '' } }),

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

    fetchMisContactos: async () => {
        set({ loadingContactos: true });
        try {
            const res = await getMisContactos();
            set({ misContactos: res.data.data, loadingContactos: false });
        } catch (error) {
            set({ loadingContactos: false });
            console.error(error);
        }
    },

    fetchHistorial: async () => {
        set({ loadingHistorial: true });
        try {
            const res = await getMisTransacciones();
            set({ historial: res.data.transacciones, loadingHistorial: false });
        } catch (error) {
            set({ loadingHistorial: false });
            console.error(error);
        }
    },

    addContacto: async (data) => {
        set({ loadingAccion: true });
        try {
            const res = await agregarContacto(data);
            get().fetchMisContactos();
            set({ loadingAccion: false });
            return { success: true, message: res.data.message };
        } catch (error) {
            set({ loadingAccion: false });
            return { success: false, message: error.response?.data?.message || 'Error al agregar contacto' };
        }
    },

    removeContacto: async (id) => {
        set({ loadingAccion: true });
        try {
            const res = await eliminarContacto(id);
            get().fetchMisContactos();
            set({ loadingAccion: false });
            return { success: true, message: res.data.message };
        } catch (error) {
            set({ loadingAccion: false });
            return { success: false, message: error.response?.data?.message || 'Error al eliminar contacto' };
        }
    },

    executeTransfer: async () => {
        set({ loadingAccion: true });
        const { cuentaOrigen, cuentaDestino, monto } = get().transferData;
        try {
            const res = await realizarTransferencia(cuentaOrigen, {
                numeroCuentaDestino: cuentaDestino,
                amount: Number(monto),
                type: 'transferencia',
                description: 'Transferencia desde la web'
            });
            set({ loadingAccion: false });
            get().resetTransfer();
            get().fetchMisCuentas(); // Update balances
            return { success: true, message: res.data.message };
        } catch (error) {
            set({ loadingAccion: false });
            return { success: false, message: error.response?.data?.message || 'Error en la transferencia' };
        }
    }

}));
