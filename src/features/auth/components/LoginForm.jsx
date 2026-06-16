import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import React, { useState } from 'react';

export const LoginForm = ({ onSwitch }) => {

    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const res = await login(data);

        if (res && res.success) {
            toast.success(`Bienvenido de nuevo ${res.user.name}`);
            navigate("/dashboard");
        } else {
            toast.error("Credenciales incorrectas. Intente de nuevo.");
        }
    }

    return (
        <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl shadow-slate-300 overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-700">
            {/* Header del Formulario estilo BAN-K */}
            <div className="p-12 pb-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-white flex items-center justify-center">
                        <img src="../../../src/assets/img/bank-icon-logo-design-vector-removebg-preview.png" alt="logo_bank" className="w-15 h-15" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-cyan-950 tracking-tighter italic leading-none">BAN-K</h2>
                    </div>
                </div>

                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 text-center">Inicio de Sesión</h1>
            </div>

            <form className="px-12 pb-10 space-y-7" onSubmit={handleSubmit(onSubmit)}>
                {/* Campo de Correo */}
                <div className="group space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5 transition-colors group-focus-within:text-cyan-950">
                        Identificador de Usuario
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ingrese su email de usuario"
                            className="w-full px-7 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-950/5 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
                            required
                            {...register("emailOrUsername", { required: "El email es requerido" })}
                        />
                    </div>
                </div>

                {/* Campo de Contraseña */}
                <div className="group space-y-2">
                    <div className="flex justify-between items-center px-5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-cyan-950">
                            Clave de Seguridad
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-7 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-950/5 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
                            required
                            {...register("password", { required: "La contraseña es requerida" })}
                        />
                    </div>
                </div>

                {/* Botón de Acción Principal */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="group w-full py-5 bg-cyan-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:-translate-y-1 shadow-2xl shadow-cyan-950/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                                <span>Autenticando...</span>
                            </>
                        ) : (
                            <>
                                <span>Validar Credenciales</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer del Formulario */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="text-[10px] font-black text-slate-400 hover:text-cyan-950 uppercase tracking-tighter transition-colors"
                    >
                        ¿Ya tienes cuenta? <span className="text-cyan-800 underline underline-offset-4 decoration-2 decoration-cyan-800/20">Solicitar Acceso</span>
                    </button>
                </div>
            </form>

            {/* Decoración Inferior estilo Glassmorphism */}
            <div className="bg-slate-50/80 p-6 text-center border-t border-slate-100">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">
                        Servidor Activo: Central Node-01
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
            {/* Fondo decorativo similar al de tu Sidebar */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-900/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-900/5 rounded-full blur-3xl"></div>
            </div>

            <LoginForm onSwitch={() => console.log('Cambiar a formulario de registro...')} />
        </div>
    );
}
