import React, { useState, useEffect } from 'react';
import { useCuentaStore } from '../../cuentas/store/cuentaStore';
import { usePrestamoStore } from '../store/prestamoStore';
import toast from 'react-hot-toast';

export const SolicitarPrestamoModal = ({ isOpen, onClose }) => {
    const { cuentas, getCuentas } = useCuentaStore();
    const { solicitarPrestamo, loading } = usePrestamoStore();

    const [formData, setFormData] = useState({
        cuentaId: '',
        cantidad_prestada: '',
        plazo_meses: ''
    });

    useEffect(() => {
        if (isOpen) {
            getCuentas();
            setFormData({
                cuentaId: '',
                cantidad_prestada: '',
                plazo_meses: ''
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Solo cuentas activas pueden solicitar préstamos
    const cuentasActivas = cuentas.filter(c => c.isActive);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cuentaId || !formData.cantidad_prestada || !formData.plazo_meses) {
            return toast.error("Todos los campos son obligatorios");
        }

        const dataToSend = {
            cuentaId: formData.cuentaId,
            cantidad_prestada: Number(formData.cantidad_prestada),
            plazo_meses: Number(formData.plazo_meses)
        };

        const res = await solicitarPrestamo(dataToSend);
        if (res.success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60">
            <div className="bg-slate-900 rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-300">
                <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-8 text-white">
                    <h2 className="text-2xl font-black italic tracking-tighter">SOLICITUD DE PRÉSTAMO</h2>
                    <p className="text-cyan-200 mt-2 font-medium">Completa los datos para tu nuevo crédito.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide">
                                Seleccionar Cuenta
                            </label>
                            <select
                                name="cuentaId"
                                value={formData.cuentaId}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            >
                                <option value="">Selecciona una cuenta destino...</option>
                                {cuentasActivas.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.tipoCuenta} - ****{c.numeroCuenta?.slice(-4)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide">
                                Monto a Solicitar (Q)
                            </label>
                            <input
                                type="number"
                                name="cantidad_prestada"
                                value={formData.cantidad_prestada}
                                onChange={handleChange}
                                placeholder="Ej: 5000"
                                min="100"
                                className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide">
                                Plazo (Meses)
                            </label>
                            <select
                                name="plazo_meses"
                                value={formData.plazo_meses}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            >
                                <option value="">Selecciona un plazo...</option>
                                <option value="6">6 Meses</option>
                                <option value="12">12 Meses</option>
                                <option value="24">24 Meses</option>
                                <option value="36">36 Meses</option>
                                <option value="48">48 Meses</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all border border-slate-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/50 disabled:opacity-50"
                        >
                            {loading ? 'Procesando...' : 'Solicitar Crédito'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
