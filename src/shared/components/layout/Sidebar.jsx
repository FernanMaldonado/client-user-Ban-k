import { Link, useLocation } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";
import { AvatarUser } from "../ui/AvatarUser.jsx";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Panel de Administración", to: "/dashboard" },
    { label: "Productos", to: "/dashboard/products", icon: ShoppingBag },
  ];

  return (
    <>
      {/* Overlay: Cierra el menú al hacer clic fuera (Solo visible < 1500px) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 min-[1500px]:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          /* Base: Estilos para pantallas < 1500px (Panel flotante) */
          fixed inset-y-0 left-0 z-50 w-72 bg-white h-screen p-6 border-r border-slate-200 
          flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          /* Desktop: Estilos para pantallas > 1500px (Fijo y visible) */
          min-[1500px]:translate-x-0 min-[1500px]:sticky min-[1500px]:top-0 min-[1500px]:z-20
        `}
      >
        {/* Branding y botón cerrar */}
        <div className="mb-8 px-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-cyan-800 tracking-tighter italic">BAN-K</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="min-[1500px]:hidden text-slate-500 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Menú de Navegación con scroll */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${active ? "bg-cyan-50 text-cyan-800 font-bold" : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {Icon && <Icon size={18} />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* PERFIL - Integrado correctamente al final del aside */}
        <AvatarUser />
      </aside>
    </>
  );
};