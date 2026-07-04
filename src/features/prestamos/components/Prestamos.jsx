import React, { useState, useEffect } from 'react';
import { usePrestamoStore } from '../store/prestamoStore';
import { SolicitarPrestamoModal } from './SolicitarPrestamoModal';

export const Prestamos = () => {
    const { prestamos, loading, getMisPrestamos } = usePrestamoStore();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getMisPrestamos();
    }, []);

    const filteredPrestamos = prestamos.filter((p) => {
        const term = searchTerm.toLowerCase();
        const numeroCuenta = p.cuentaId?.numeroCuenta || '';
        return (
            numeroCuenta.toLowerCase().includes(term) ||
            p.cantidad_prestada?.toString().toLowerCase().includes(term)
        );
    });

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Mis <span className="text-cyan-900">Préstamos</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-2">
                        Gestiona y solicita nuevos créditos para tus metas.
                    </p>
                </div>
                
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-cyan-900 text-white rounded-xl font-bold hover:bg-cyan-950 transition-colors shadow-md text-sm uppercase tracking-wider"
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
                    className="w-full md:w-1/3 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-900/20 focus:border-cyan-900 transition-all placeholder-slate-400 shadow-sm"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-900"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                    {filteredPrestamos.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                            <p className="text-slate-500 font-bold">No tienes préstamos registrados.</p>
                        </div>
                    ) : (
                        filteredPrestamos.map((p) => (
                            <div key={p._id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:-translate-y-2 hover:border-cyan-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-cyan-900"></div>
                                <div className="mb-8 flex justify-between items-start">
                                    <div>
                                        <span className="px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            {p.estado || 'Activo'}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-800 mt-4">Cuenta Destino</h3>
                                        <p className="text-slate-500 text-sm font-mono mt-1 font-medium">****{p.cuentaId?.numeroCuenta?.slice(-4) || '0000'}</p>
                                    </div>
                                    <div className="text-right text-emerald-600 font-black bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                        {p.tasa_interes}% <span className="text-[10px] uppercase block">Interés</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monto Solicitado</p>
                                        <p className="text-2xl font-black text-slate-800 tracking-tighter">Q{p.cantidad_prestada?.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saldo Pendiente</p>
                                        <p className="text-2xl font-black text-rose-500 tracking-tighter">Q{p.cantidad_pendiente?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-sm font-bold text-slate-500">
                                        Plazo: <span className="text-slate-800 font-black">{p.plazo_meses} meses</span>
                                    </p>
                                    <p className="text-sm font-bold text-slate-500 text-right">
                                        Cuota: <span className="text-cyan-900 font-black block text-lg leading-none mt-1">Q{p.monto_cuota?.toFixed(2)}</span>
                                    </p>
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
