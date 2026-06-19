import React, { useState } from 'react';
import { axiosAdmin } from '../../../shared/api/api';
import { useAuthStore } from '../../auth/store/authStore';

/**
 * Busca las cuentas bancarias del usuario usando su correo, DPI o número de cuenta.
 * Llama al endpoint del admin para buscar el usuario y luego sus cuentas.
 */
export const AccountLookup = ({ onCuentasFound }) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const loggedInUser = useAuthStore(state => state.user);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError('');

    const searchStr = identifier.trim().toLowerCase();
    const searchNoPunct = searchStr.replace(/\s|-/g, '');

    try {
      // 1. Obtener todas las cuentas del servidor admin
      const resCuentas = await axiosAdmin.get('/cuentas', { params: { limit: 1000 } });
      const allCuentas = resCuentas.data?.data || resCuentas.data?.cuentas || resCuentas.data || [];

      // Filtrar cuentas que coincidan directamente con el identificador ingresado
      let matchedCuentas = allCuentas.filter(c => {
        const numCuenta = (c.numeroCuenta || '').trim().toLowerCase();
        const correoCuenta = (c.correo || c.email || '').trim().toLowerCase();
        const docId = (c.documentoIdentidad || c.dpi || '').trim().replace(/\s|-/g, '');
        const nombre = (c.nombreCompleto || c.nombre || '').trim().toLowerCase();
        const uId = (c.usuarioId || '').toString().toLowerCase();

        return (
          numCuenta.includes(searchStr) ||
          correoCuenta.includes(searchStr) ||
          docId.includes(searchNoPunct) ||
          nombre.includes(searchStr) ||
          uId === searchStr
        );
      });

      // 2. Si no encontramos cuentas directamente, buscar en usuarios
      if (matchedCuentas.length === 0) {
        const resUsuarios = await axiosAdmin.get('/usuarios', { params: { limit: 1000 } });
        const allUsuarios = resUsuarios.data?.data || resUsuarios.data?.usuarios || resUsuarios.data || [];

        const matchedUser = allUsuarios.find(u => {
          const userEmail = (u.email || u.correo || '').trim().toLowerCase();
          const userDpi = (u.dpi || u.documentoIdentidad || '').trim().replace(/\s|-/g, '');
          const userName = (u.name || u.nombreCompleto || u.nombre || '').trim().toLowerCase();
          const userId = (u._id || u.id || '').toString().toLowerCase();

          return (
            userEmail.includes(searchStr) ||
            userDpi.includes(searchNoPunct) ||
            userName.includes(searchStr) ||
            userId === searchStr
          );
        });

        if (matchedUser) {
          const uId = matchedUser._id || matchedUser.id;
          // Intentar obtener cuentas por su usuarioId
          try {
            const resUserCuentas = await axiosAdmin.get(`/cuentas/usuario/${uId}`);
            const userCuentas = resUserCuentas.data?.data?.cuentas || resUserCuentas.data?.data || resUserCuentas.data || [];
            matchedCuentas = userCuentas;
          } catch (_) {
            // Si la ruta específica falla, buscar en las cuentas generales
            matchedCuentas = allCuentas.filter(c => (c.usuarioId || '').toString() === uId.toString());
          }
        }
      }

      if (matchedCuentas.length === 0) {
        setError('No se encontró ninguna cuenta bancaria coincidente con ese identificador.');
        setLoading(false);
        return;
      }

      const mapped = matchedCuentas.map(c => ({
        id: c._id || c.id,
        name: `${c.tipoCuenta} - N° ${c.numeroCuenta}`,
        balance: c.saldo ?? 0,
        isActive: c.isActive !== undefined ? c.isActive : true,
        numeroCuenta: c.numeroCuenta,
      }));

      onCuentasFound(mapped);
    } catch (err) {
      console.error('Error buscando cuentas:', err);
      setError('Error al buscar las cuentas. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-3">
      <input
        type="text"
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
        placeholder="Correo, DPI, N° de cuenta o ID..."
        className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 p-3 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition"
      />
      {error && (
        <p className="text-red-400 text-xs px-1">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !identifier.trim()}
        className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-2xl text-sm font-bold transition"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Buscando...
          </span>
        ) : 'Buscar Cuentas'}
      </button>
    </form>
  );
};
