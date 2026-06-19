import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layout/DashboardPage.jsx";
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx";
import { ProductCatalog } from "../../features/products/pages/ProductCatalog.jsx";

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
            Bienvenido a <span className="text-cyan-900"> BAN-K</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-md text-center">
            Selecciona un activo en el menú lateral para gestionar la red.
        </p>
    </div>
);

export const AppRoutes = () => {

    return (
        <Routes>
            {/* Pública */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Dashboard - Sin protección */}
            <Route path="/dashboard" element={<DashboardPage />}>
                <Route index element={<DashboardIndex />} />
                <Route path="products" element={<ProductCatalog />} />
            </Route>
        </Routes>
    );
};