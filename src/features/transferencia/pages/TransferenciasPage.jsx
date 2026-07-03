import React, { useState } from 'react';
import { TransferWizard } from '../components/TransferWizard';
import { useTransferStore } from '../store/transferStore';
import { Modal } from '../../../shared/components/ui/Modal';
import { useAuthStore } from '../../auth/store/authStore';
import toast from 'react-hot-toast';

export const TransferenciasPage = () => {
    const {
        historial,
        misContactos,
        fetchHistorial,
        addContacto,
        removeContacto,
        loadingHistorial,
        loadingAccion
    } = useTransferStore();

    const { user } = useAuthStore();
    const [isHistorialOpen, setIsHistorialOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [newContacto, setNewContacto] = useState({ alias: '', numeroCuenta: '' });

    const handleOpenHistorial = () => {
        fetchHistorial();
        setIsHistorialOpen(true);
    };

    const handleAddContacto = async (e) => {
        e.preventDefault();
        const res = await addContacto(newContacto);
        if (res.success) {
            toast.success(res.message);
            setIsAddOpen(false);
            setNewContacto({ alias: '', numeroCuenta: '' });
        } else {
            toast.error(res.message);
        }
    };

    const handleDeleteContacto = async (id) => {
        const res = await removeContacto(id);
        if (res.success) {
            toast.success(res.message);
            if (misContactos.length <= 1) setIsDeleteOpen(false);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in duration-700">
            {/* Header con las 3 opciones requeridas */}
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Módulo de <span className="text-cyan-900">Transferencias</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-2">
                        Envía fondos de forma rápida y segura a tus contactos registrados.
                    </p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleOpenHistorial}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Historial
                    </button>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="px-5 py-2.5 bg-cyan-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-900 transition-colors shadow-md shadow-cyan-950/20"
                    >
                        Agregar Destino
                    </button>
                    <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="px-5 py-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-rose-100 transition-colors shadow-sm"
                    >
                        Eliminar Destino
                    </button>
                </div>
            </header>

            {/* Contenido Principal */}
            <div className="flex-1 flex items-center justify-center pb-12">
                <TransferWizard />
            </div>

            {/* Modal Historial */}
            <Modal isOpen={isHistorialOpen} onClose={() => setIsHistorialOpen(false)} title="Transferencias Realizadas">
                {loadingHistorial ? (
                    <p className="text-slate-400 text-center py-8">Cargando historial...</p>
                ) : historial.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No hay transferencias registradas.</p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {historial.map(t => (
                            <div key={t._id} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">A: {t.numeroCuentaDestino}</p>
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

            {/* Modal Agregar */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Agregar Nuevo Destinatario">
                <form onSubmit={handleAddContacto} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alias del Contacto</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Ej. Juan Pérez"
                            value={newContacto.alias}
                            onChange={(e) => setNewContacto({ ...newContacto, alias: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Número de Cuenta (Ban-k)</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Ej. 123456789"
                            value={newContacto.numeroCuenta}
                            onChange={(e) => setNewContacto({ ...newContacto, numeroCuenta: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loadingAccion}
                        className="w-full py-4 bg-emerald-500 text-emerald-950 font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-colors"
                    >
                        {loadingAccion ? 'Guardando...' : 'Guardar Contacto'}
                    </button>
                </form>
            </Modal>

            {/* Modal Eliminar */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Gestionar Destinatarios">
                {misContactos.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No tienes contactos registrados.</p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {misContactos.map(c => (
                            <div key={c._id} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-white">{c.alias}</p>
                                    <p className="text-xs text-slate-400 mt-1 font-mono">{c.numeroCuenta}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteContacto(c._id)}
                                    disabled={loadingAccion}
                                    className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 font-bold text-xs uppercase tracking-wider transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

        </div>
    );
};
