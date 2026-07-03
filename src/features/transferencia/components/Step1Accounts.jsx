import React from 'react';
import { useTransferStore } from '../store/transferStore';

export const Step1Accounts = () => {
    const { misCuentas, misContactos, transferData, setTransferData, setStep } = useTransferStore();

    const handleNext = (e) => {
        e.preventDefault();
        if (transferData.cuentaOrigen && transferData.cuentaDestino && transferData.monto) {
            setStep(2);
        }
    };

    return (
        <form onSubmit={handleNext} className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Detalles de la Transferencia</h2>
            
            <div className="space-y-6">
                {/* Cuenta Origen */}
                <div className="group space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5 transition-colors group-focus-within:text-cyan-950">
                        Cuenta Origen
                    </label>
                    <div className="relative">
                        <select
                            className="w-full px-7 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-950/5 focus:border-cyan-950 focus:bg-white transition-all appearance-none cursor-pointer"
                            value={transferData.cuentaOrigen}
                            onChange={(e) => setTransferData({ cuentaOrigen: e.target.value })}
                            required
                        >
                            <option value="" disabled>Selecciona tu cuenta origen</option>
                            {misCuentas.map(cuenta => (
                                <option key={cuenta._id} value={cuenta.numeroCuenta}>
                                    {cuenta.numeroCuenta} - Saldo: Q{cuenta.saldo.toFixed(2)}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Cuenta Destino */}
                <div className="group space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5 transition-colors group-focus-within:text-cyan-950">
                        Cuenta Destino (Contactos)
                    </label>
                    <div className="relative">
                        <select
                            className="w-full px-7 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-950/5 focus:border-cyan-950 focus:bg-white transition-all appearance-none cursor-pointer"
                            value={transferData.cuentaDestino}
                            onChange={(e) => setTransferData({ cuentaDestino: e.target.value })}
                            required
                        >
                            <option value="" disabled>Selecciona el destinatario</option>
                            {misContactos.map(contacto => (
                                <option key={contacto._id} value={contacto.numeroCuenta}>
                                    {contacto.alias} - {contacto.numeroCuenta}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Monto */}
                <div className="group space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5 transition-colors group-focus-within:text-cyan-950">
                        Monto a Transferir
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-7 text-slate-400 font-bold">Q</span>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full pl-12 pr-7 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-950/5 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300"
                            value={transferData.monto}
                            onChange={(e) => setTransferData({ monto: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="pt-8">
                <button
                    type="submit"
                    className="group w-full py-5 bg-cyan-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 shadow-2xl shadow-cyan-950/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <span>Continuar a Confirmación</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </form>
    );
};
