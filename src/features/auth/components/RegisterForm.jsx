import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRegisterUser } from "../hooks/useRegister"

const RegisterForm = ({ onSwitch }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {registerUser, loading, error} = useRegisterUser();
    const onSubmit = async (data) => {
        try {
            const resultRegister = await registerUser(data);
            if (resultRegister){
                toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
            }else{
                toast.error("Error en el registro. Intenta nuevamente.");
            }
        } catch (error) {
            toast.error("Error en el registro. Intenta nuevamente.");
        }
    }

  return (
    <div className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-2xl shadow-slate-300 overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-700 flex flex-col my-4">
      {/* Header del Formulario BAN-K */}
      <div className="p-8 md:p-12 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white flex items-center justify-center">
            <div className="w-14 h-14 bg-white flex items-center justify-center">
              <img src="../../../src/assets/img/bank-icon-logo-design-vector-removebg-preview.png" alt="logo_bank" className="w-15 h-15" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-cyan-950 tracking-tighter italic leading-none">BAN-K</h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Apertura de Credenciales Virtuales</p>
          </div>
        </div>
        <div className="text-left md:text-right">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight">Registrar Cuenta</h1>
          <p className="text-[10px] text-cyan-800 font-extrabold uppercase tracking-widest">Paso Único: Registro Legal</p>
        </div>
      </div>

      {/* Formulario con Scroll Interno elegante para no romper vistas cortas */}
      <form className="px-8 md:px-12 py-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar" onSubmit={handleSubmit(onSubmit)}>
        
        {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-cyan-900 uppercase tracking-widest border-b border-slate-100 pb-1">
            I. Información de Identidad Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Juan Alberto Pérez"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.name ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("name", { required: "El nombre completo es obligatorio" })}
              />
              {errors.name && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.name.message}</p>}
            </div>

            {/* Fecha de Nacimiento */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.birthDate ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all shadow-inner`}
                {...register("birthDate", { required: "La fecha de nacimiento es obligatoria" })}
              />
              {errors.birthDate && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.birthDate.message}</p>}
            </div>

            {/* DPI */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Documento de Identificación (DPI)
              </label>
              <input
                type="text"
                placeholder="2450 12548 0101"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.dpi ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("dpi", { 
                  required: "El número de DPI es obligatorio",
                  pattern: { value: /^[0-9\s-]{13,18}$/, message: "Formato de DPI inválido" }
                })}
              />
              {errors.dpi && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.dpi.message}</p>}
            </div>

            {/* Teléfono */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Número Telefónico
              </label>
              <input
                type="tel"
                placeholder="+502 4587 9625"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.phone ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("phone", { required: "El teléfono es obligatorio" })}
              />
              {errors.phone && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.phone.message}</p>}
            </div>

            {/* Dirección Completa (Ocupa dos columnas) */}
            <div className="group space-y-1.5 md:col-span-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Dirección de Domicilio Habitual
              </label>
              <input
                type="text"
                placeholder="Avenida Reforma 10-15 Zona 9, Ciudad de Guatemala"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.address ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("address", { required: "La dirección de domicilio es obligatoria" })}
              />
              {errors.address && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: INFORMACIÓN LABORAL Y FINANCIERA */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-cyan-900 uppercase tracking-widest border-b border-slate-100 pb-1">
            II. Perfil Económico Declarado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del Puesto/Trabajo */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Puesto de Trabajo / Oficio
              </label>
              <input
                type="text"
                placeholder="Analista de Datos Financieros"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.jobName ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("jobName", { required: "El puesto de trabajo es obligatorio" })}
              />
              {errors.jobName && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.jobName.message}</p>}
            </div>

            {/* Ingreso Mensual */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Rango de Ingresos Mensuales (GTQ)
              </label>
              <input
                type="number"
                placeholder="12500"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.monthlyIncome ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("monthlyIncome", { 
                  required: "La declaración de ingresos es obligatoria",
                  min: { value: 1, message: "El ingreso debe ser mayor a cero" }
                })}
              />
              {errors.monthlyIncome && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.monthlyIncome.message}</p>}
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: CREDENCIALES DE ACCESO */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-cyan-900 uppercase tracking-widest border-b border-slate-100 pb-1">
            III. Credenciales de Seguridad del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Correo Electrónico */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Dirección de Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@bancobank.com"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.email ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("email", { 
                  required: "El correo es obligatorio",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Correo electrónico no válido" }
                })}
              />
              {errors.email && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div className="group space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 transition-colors group-focus-within:text-cyan-950">
                Establecer Clave BAN-K
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-5 py-3 text-sm bg-slate-50 border ${errors.password ? 'border-red-300 focus:ring-red-500/5' : 'border-slate-100 focus:ring-cyan-950/5'} rounded-[1.5rem] text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:border-cyan-950 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner`}
                {...register("password", { 
                  required: "La clave es obligatoria", 
                  minLength: { value: 6, message: "La contraseña debe tener mínimo 6 caracteres" } 
                })}
              />
              {errors.password && <p className="text-[9px] text-red-500 font-bold ml-3">{errors.password.message}</p>}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="group w-full py-4 bg-cyan-950 hover:bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-cyan-950/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      {/* Acciones principales fijas al pie de la tarjeta */}
      <div className="px-8 md:px-12 pb-8 pt-4 space-y-4 border-t border-slate-50 bg-white">

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitch}
            className="text-[10px] font-black text-slate-400 hover:text-cyan-950 uppercase tracking-widest transition-colors cursor-pointer"
          >
            ¿Ya eres cliente? <span className="text-cyan-800 underline underline-offset-4 decoration-2 decoration-cyan-800/20">Identificarse en Terminal</span>
          </button>
        </div>
      </div>

      {/* Decoración Inferior de Seguridad */}
      <div className="bg-slate-50/80 p-5 text-center border-t border-slate-100">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">
            PROCESADO BAJO ENCRIPTACIÓN AES-256-GCM Y REGISTRO LEGAL GUATEMALA
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;