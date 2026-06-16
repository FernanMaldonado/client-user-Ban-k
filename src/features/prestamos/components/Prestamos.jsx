import React, { useState, useEffect } from 'react';
import { usePrestamoStore } from '../store/prestamoStore';
import { SolicitarPrestamoModal } from './SolicitarPrestamoModal';

export const Prestamos = () => {
    const { prestamos, loading, getMisPrestamos } = usePrestamoStore();
    const [view, setView] = useState('activos');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getMisPrestamos();
    }, []);

    // Filtramos según el estado para simular pestañas si el backend lo permite
    // En este caso el backend no parece tener "estado" en el modelo mostrado, pero asumiremos "aprobado", "pendiente", "denegado".
    // Si no tiene estado, mostraremos todos como activos/pendientes. Asumiremos que tienen una propiedad `estado`.
    const filteredPrestamos = prestamos.filter((p) => {
        const term = searchTerm.toLowerCase();
        // Fallback para propiedades de cuenta populateadas
        const numeroCuenta = p.cuentaId?.numeroCuenta || '';
        return (
            numeroCuenta.toLowerCase().includes(term) ||
            p.cantidad_prestada?.toString().toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-8 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Mis Préstamos</h1>
                    <p className="text-slate-400 font-medium">Gestiona y solicita nuevos créditos para tus metas.</p>
                </div>
                
                <button
                    onClick={() => setShowModal(true)}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-black shadow-lg shadow-cyan-900/50 hover:-translate-y-1 transition-all"
                >
                    + Solicitar Nuevo Crédito
                </button>
            </header>

            <div className="mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por número de cuenta o monto..."
                    className="w-full md:w-1/3 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredPrestamos.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-900/40 rounded-[2rem] border border-slate-800">
                            <p className="text-slate-500 font-bold italic">No tienes préstamos registrados.</p>
                        </div>
                    ) : (
                        filteredPrestamos.map((p) => (
                            <div key={p._id} className="bg-slate-900/60 rounded-[2.5rem] p-8 border border-slate-700 shadow-xl shadow-cyan-900/10 transition-all hover:shadow-cyan-900/30 hover:-translate-y-2 glass-card">
                                <div className="mb-8 flex justify-between items-start">
                                    <div>
                                        <span className="px-3 py-1 bg-cyan-900/50 text-cyan-400 border border-cyan-800 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            {p.estado || 'Activo'}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mt-4">Cuenta Destino</h3>
                                        <p className="text-slate-400 text-sm font-mono">****{p.cuentaId?.numeroCuenta?.slice(-4)}</p>
                                    </div>
                                    <div className="text-right text-emerald-400 font-black">{p.tasa_interes}% Interés</div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monto Solicitado</p>
                                        <p className="text-2xl font-black text-white">Q{p.cantidad_prestada?.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Saldo Pendiente</p>
                                        <p className="text-2xl font-black text-rose-400">Q{p.cantidad_pendiente?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <p className="text-sm font-medium text-slate-400">Cuotas: <span className="text-white font-bold">{p.plazo_meses} meses</span></p>
                                    <p className="text-sm font-medium text-slate-400">Pago: <span className="text-cyan-400 font-bold">Q{p.monto_cuota?.toFixed(2)}</span>/mes</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <SolicitarPrestamoModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};
