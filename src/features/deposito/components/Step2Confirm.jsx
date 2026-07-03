import React, { useState } from 'react';
import { useDepositoStore } from '../store/depositoStore';
import { useAuthStore } from '../../auth/store/authStore';
import { login } from '../../../shared/api/auth';
import toast from 'react-hot-toast';

export const Step2Confirm = () => {
    const { depositoData, setStep, executeDeposito, loadingAccion } = useDepositoStore();
    const { user } = useAuthStore();
    const [password, setPassword] = useState('');
    const [validating, setValidating] = useState(false);

    const handleConfirm = async (e) => {
        e.preventDefault();
        setValidating(true);

        try {
            // Validate password by calling login endpoint with current user's email
            // (Assuming user object has email or username)
            const credentials = {
                emailOrUsername: user.name || user.email || user.username, // El Auth Service en .NET devuelve el usuario en user.name
                password: password
            };

            const authRes = await login(credentials);

            if (authRes && authRes.data && authRes.data.success) {
                // Password is correct, proceed with deposito
                const depositoRes = await executeDeposito();
                if (depositoRes.success) {
                    toast.success(depositoRes.message);
                } else {
                    toast.error(depositoRes.message);
                }
            } else {
                toast.error('Contraseña incorrecta. Operación cancelada.');
                setStep(1);
            }
        } catch (error) {
            toast.error('Contraseña incorrecta o error de autenticación. Operación cancelada.');
            setStep(1);
        } finally {
            setValidating(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button
                onClick={() => setStep(1)}
                className="text-[10px] font-black text-slate-400 hover:text-cyan-950 uppercase tracking-widest mb-6 flex items-center gap-1 transition-colors"
                disabled={validating || loadingAccion}
            >
                ← Volver a Edición
            </button>

            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Confirmar Deposito</h2>

            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 mb-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Origen</span>
                        <span className="font-black text-cyan-950">{depositoData.cuentaId}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destino</span>
                        <span className="font-black text-cyan-950">{depositoData.account_number}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monto</span>
                        <span className="font-black text-2xl text-emerald-600">Q{Number(depositoData.monto).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleConfirm} className="space-y-6">
                <div className="group space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5 transition-colors group-focus-within:text-rose-600">
                        Clave de Seguridad requerida
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Ingrese su contraseña"
                            className="w-full px-7 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all placeholder:text-slate-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-5">
                        Por seguridad, necesitamos validar su identidad antes de realizar la transacción.
                    </p>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={validating || loadingAccion}
                        className="w-1/3 py-5 bg-white text-slate-600 border border-slate-200 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={validating || loadingAccion}
                        className="flex-1 py-5 bg-cyan-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 shadow-2xl shadow-cyan-950/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {(validating || loadingAccion) ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <span>Autorizar Deposito</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
