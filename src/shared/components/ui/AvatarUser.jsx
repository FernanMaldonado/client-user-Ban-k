import React from 'react';
import UserIcon from "../../../assets/img/User.png";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/authStore.js";
import { LayoutDashboard, Users, LogOut, ChevronDown } from 'lucide-react';
import { Cuentas } from '../../../features/cuentas/components/Cuentas.jsx';

export const AvatarUser = () => {
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => setOpen((prev) => !prev);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    // Lógica de imagen de perfil
    const avatarSrc = user?.profilePincture && user.profilePincture.trim() !== ""
        ? user.profilePincture
        : UserIcon;

    return (
        <div className="relative mt-auto pt-6" ref={dropdownRef}>

            {/* BOTÓN / TARJETA (Estilo original del Sidebar) */}
            <button
                onClick={toggleMenu}
                className="w-full flex-shrink-0 p-4 bg-slate-900 rounded-[2rem] flex items-center gap-3 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 group"
            >
                <div className="relative flex-shrink-0">
                    <img
                        src={avatarSrc}
                        alt={user?.username}
                        className="w-10 h-10 rounded-xl object-cover border border-cyan-800/50"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = UserIcon;
                        }}
                    />
                    {/* Indicador Online */}
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                </div>

                <div className="flex flex-col items-start overflow-hidden flex-1">
                    <p className="text-xs font-black text-white truncate w-full text-left">
                        {user?.name || 'Admin Principal'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        En línea
                    </p>
                </div>

                <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''} group-hover:text-white`}
                />
            </button>

            {/* MENU DESPLEGABLE (Glassmorphism hacia arriba) */}
            {open && (
                <div className="absolute bottom-full left-0 mb-4 w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-200 z-50 overflow-hidden">

                    {/* Header Info */}
                    <div className="px-5 py-4 bg-white/5 border-b border-white/5">
                        <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Sesión activa</p>
                        <p className="text-xs text-slate-300 truncate font-medium">{user?.email}</p>
                    </div>

                    {/* Lista de Links */}
                    <ul className="p-2 space-y-1">
                        <li>
                            <Link
                                to="/dashboard/cuentas"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 w-full p-3 rounded-2xl text-slate-300 hover:bg-cyan-600 hover:text-white transition-all duration-200 group"
                            >
                                <LayoutDashboard size={16} className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Cuentas</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full p-3 rounded-2xl text-rose-400 hover:bg-rose-500/20 hover:text-rose-500 transition-all duration-200 group"
                            >
                                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                <span className="text-xs font-black uppercase">Cerrar sesión</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};