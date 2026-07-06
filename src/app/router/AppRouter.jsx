import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layout/DashboardPage.jsx";
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx";
import { TransferenciasPage } from "../../features/transferencia/pages/TransferenciasPage.jsx";
import { RetirosPage } from "../../features/retiro/pages/RetirosPage.jsx";
import { DepositosPage } from "../../features/deposito/pages/DepositosPage.jsx";
import { ProductCatalog } from "../../features/products/pages/ProductCatalog.jsx";

import { Cuentas } from "../../features/cuentas/components/Cuentas.jsx";
import { Prestamos } from "../../features/prestamos/components/Prestamos.jsx";
import { useAuthStore } from "../../features/auth/store/authStore.js";
import { DivisasPage } from "../../features/divisas/pages/DivisasPage.jsx"

const DashboardIndex = () => (
    <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-700">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-[120px] opacity-20 rounded-full"></div>
            <img src="../../../src/assets/img/bank-icon-logo-design-vector-removebg-preview.png"
                className="w-48 h-48 relative z-10 mb-8 drop-shadow-2xl"
                alt="Bank Logo"
            />
        </div>
        <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">
            Bienvenido a <span className="text-cyan-900"> BAN-K </span>
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-2">
            Selecciona una opción del menú lateral para comenzar
        </p>
    </div>
);

export const AppRoutes = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <Routes>
            {/* Pública */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={
                isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />
            }>
                <Route index element={<DashboardIndex />} />
                <Route path="transferencias" element={<TransferenciasPage />} />
                <Route path="retiros" element={<RetirosPage />} />
                <Route path="depositos" element={<DepositosPage />} />
                <Route path="cuentas" element={<Cuentas />} />
                <Route path="prestamos" element={<Prestamos />} />
                <Route path="products" element={<ProductCatalog />} />
                <Route path="divisas" element={<DivisasPage />} />
            </Route >
        </Routes >
    );
};