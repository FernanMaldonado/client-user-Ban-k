import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token");

  const handleFinish = useCallback(() => {
    // Esperar a que se perciba el toast antes de redirigir al login.
    setTimeout(() => navigate("/"), 2000);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const displayMessage =
    status === "loading" ? "Verificando correo, por favor espera..." : message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-2xl shadow-slate-300 overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-700 flex flex-col my-8">

        {/* Header - matches RegisterForm style */}
        <div className="p-8 md:p-12 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white flex items-center justify-center">
              <div className="w-14 h-14 bg-white flex items-center justify-center">
                <img src="../../../src/assets/img/bank-icon-logo-design-vector-removebg-preview.png" alt="logo_bank" className="w-15 h-15" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-cyan-950 tracking-tighter italic leading-none">BAN-K</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verificación de Correo Electrónico</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight">Verificar Email</h1>
            <p className="text-[10px] text-cyan-800 font-extrabold uppercase tracking-widest">Paso Único: Confirmación</p>
          </div>
        </div>

        {/* Message body */}
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <p className="text-base text-slate-700 max-w-xl">
            {displayMessage}
          </p>

          <div className="mt-6 w-full max-w-sm">
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={status === "loading"}
              className="group w-full py-4 bg-cyan-950 hover:bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-cyan-950/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 md:px-12 pb-8 pt-4 space-y-4 border-t border-slate-50 bg-white">
          <div className="text-center">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Si el enlace expira, solicita uno nuevo desde la pantalla de inicio.</span>
          </div>
        </div>

      </div>
    </div>
  );
};