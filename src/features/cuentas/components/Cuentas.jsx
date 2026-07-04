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
        <div className="flex flex-col h-full animate-in fade-in zoom-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Mis <span className="text-cyan-900">Cuentas</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-2">
                        Visualiza tu saldo y el estado de tus cuentas.
                    </p>
                </div>
            </header>

            <div className="mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por tipo o número de cuenta..."
                    className="w-full md:w-1/3 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-900/20 focus:border-cyan-900 transition-all placeholder-slate-400 shadow-sm"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-900"></div>
                </div>
            ) : (
                <>
                    {/* Grid de Cuentas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {filteredCuentas.map((c) => (
                            <div
                                key={c._id}
                                className={`group relative h-64 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl
                                    ${c.isActive
                                        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl shadow-slate-200'
                                        : 'bg-white border-2 border-dashed border-slate-200 shadow-none grayscale'}
                                `}
                            >
                                <div className="w-12 h-10 bg-gradient-to-br from-amber-200 to-amber-500 rounded-lg mb-6 opacity-80 shadow-inner"></div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${c.isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                                            {c.tipoCuenta}
                                        </p>
                                        <h3 className={`text-xl font-bold ${c.isActive ? 'text-white' : 'text-slate-500'}`}>
                                            Estado: {c.isActive ? 'Activa' : 'Inactiva'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className={`font-mono text-lg tracking-widest ${c.isActive ? 'text-white/80' : 'text-slate-400'}`}>
                                        **** **** **** {c.numeroCuenta?.slice(-4) || '0000'}
                                    </p>
                                </div>

                                <div className="absolute bottom-8 right-8 text-right">
                                    <p className={`text-[10px] font-black uppercase mb-1 ${c.isActive ? 'text-slate-400' : 'text-slate-400'}`}>Saldo Disponible</p>
                                    <p className={`text-3xl font-black italic ${c.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        Q{c.saldo?.toLocaleString() || '0.00'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCuentas.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                            <p className="text-slate-500 font-bold">No se encontraron cuentas.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
