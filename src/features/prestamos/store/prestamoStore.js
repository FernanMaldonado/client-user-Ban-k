import { create } from 'zustand';
import { getMisPrestamos, solicitarPrestamo as apiSolicitarPrestamo } from '../../../shared/api/apiPrestamos';
import toast from 'react-hot-toast';

export const usePrestamoStore = create((set, get) => ({
    prestamos: [],
    loading: false,
    error: null,

    getMisPrestamos: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await getMisPrestamos();
            set({ prestamos: data.data || [], loading: false });
        } catch (error) {
            // Si el error es 404 de "No se encontraron préstamos", podemos dejarlo vacío sin mostrar error feo
            if (error.response?.status === 404) {
                set({ prestamos: [], loading: false });
            } else {
                const errorMsg = error.response?.data?.message || 'Error al obtener los préstamos';
                set({ error: errorMsg, loading: false, prestamos: [] });
                toast.error(errorMsg);
            }
        }
    },

    solicitarPrestamo: async (prestamoData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await apiSolicitarPrestamo(prestamoData);
            toast.success('Préstamo solicitado exitosamente');

            // Recargar préstamos después de solicitar
            get().getMisPrestamos();
            return { success: true, data: data.data };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al solicitar el préstamo';
            set({ error: errorMsg, loading: false });
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    }
}));
