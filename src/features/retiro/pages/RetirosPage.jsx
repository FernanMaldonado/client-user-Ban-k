import React, { useState } from 'react';
import { RetiroWizard } from '../components/RetiroWizard';
import { useRetiroStore } from '../store/retiroStore';
import { Modal } from '../../../shared/components/ui/Modal';
import { useAuthStore } from '../../auth/store/authStore';

export const RetirosPage = () => {
    const {
        historial,
        fetchHistorial,
        loadingHistorial,
    } = useRetiroStore();

    const [isHistorialOpen, setIsHistorialOpen] = useState(false);

    const handleOpenHistorial = () => {
        fetchHistorial();
        setIsHistorialOpen(true);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in duration-700">
            {/* Header con las opciones requeridas */}
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Módulo de <span className="text-cyan-900">Retiros</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-2">
                        Retira fondos de forma rápida y segura desde tus cuentas.
                    </p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleOpenHistorial}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Historial de Retiros
                    </button>
                </div>
            </header>

            {/* Contenido Principal */}
            <div className="flex-1 flex items-center justify-center pb-12">
                <RetiroWizard />
            </div>

            {/* Modal Historial */}
            <Modal isOpen={isHistorialOpen} onClose={() => setIsHistorialOpen(false)} title="Retiros Realizados">
                {loadingHistorial ? (
                    <p className="text-slate-400 text-center py-8">Cargando historial...</p>
                ) : historial.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No hay retiros registrados.</p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {historial.map(t => (
                            <div key={t._id} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">REF: {t.account_number || t.numeroCuentaDestino}</p>
                                    <p className="text-xs text-slate-400 mt-1">{new Date(t.date).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-400 font-black text-lg">Q{t.amount.toFixed(2)}</p>
                                    <span className="text-[10px] uppercase font-bold text-emerald-900 bg-emerald-400/20 px-2 py-0.5 rounded-full">Exitoso</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
};
