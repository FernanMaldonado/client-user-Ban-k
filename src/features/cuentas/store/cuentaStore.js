import { create } from 'zustand';
import { getMisCuentas } from '../../../shared/api/apiCuentas';
import toast from 'react-hot-toast';

export const useCuentaStore = create((set) => ({
    cuentas: [],
    loading: false,
    error: null,

    getCuentas: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await getMisCuentas();
            set({ cuentas: data.data || [], loading: false });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al obtener las cuentas';
            set({ error: errorMsg, loading: false, cuentas: [] });
            toast.error(errorMsg);
        }
    }
}));
