import React, { useEffect, useState } from 'react';
import { useCuentaStore } from '../store/cuentaStore';

export const Cuentas = () => {
    const { cuentas, getCuentas, loading } = useCuentaStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getCuentas();
    }, []);

    const filteredCuentas = cuentas.filter((cuenta) => {
        const term = searchTerm.toLowerCase();
        return (
            cuenta.tipoCuenta?.toLowerCase().includes(term) ||
            cuenta.numeroCuenta?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Mis Cuentas</h1>
                    <p className="text-slate-400 font-medium">Visualiza tu saldo y el estado de tus cuentas.</p>
                </div>
            </div>
            
            <div className="mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por tipo o número de cuenta..."
                    className="w-full md:w-1/3 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : (
                <>
                    {/* Grid de Cuentas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCuentas.map((c) => (
                            <div
                                key={c._id}
                                className={`group relative h-64 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl glass-card
                                    ${c.isActive
                                        ? 'shadow-xl shadow-cyan-900/20'
                                        : 'opacity-70 grayscale'}
                                `}
                            >
                                <div className="w-12 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg mb-6 opacity-80 shadow-inner"></div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${c.isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                                            {c.tipoCuenta}
                                        </p>
                                        <h3 className={`text-xl font-bold ${c.isActive ? 'text-white' : 'text-slate-500'}`}>
                                            Estado: {c.isActive ? 'Activa' : 'Inactiva'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className={`font-mono text-lg tracking-widest ${c.isActive ? 'text-white/80' : 'text-slate-500'}`}>
                                        **** **** **** {c.numeroCuenta?.slice(-4)}
                                    </p>
                                </div>

                                <div className="absolute bottom-8 right-8 text-right">
                                    <p className={`text-[10px] font-black uppercase mb-1 ${c.isActive ? 'text-slate-400' : 'text-slate-500'}`}>Saldo Disponible</p>
                                    <p className={`text-3xl font-black italic ${c.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        Q{c.saldo?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCuentas.length === 0 && (
                        <div className="text-center py-12 text-slate-400 font-medium bg-slate-900/40 rounded-3xl border border-slate-800">
                            No se encontraron cuentas...
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
