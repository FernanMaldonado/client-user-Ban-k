import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react"; // Solo para el botón

export const DashboardContainers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isProductPage = location.pathname === '/dashboard/products';

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-gray-50">
      {/* Botón Toggle: Solo visible cuando la pantalla es MENOR a 1500px */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-45 p-2 text-white rounded-lg min-[1500px]:hidden shadow-lg transition-colors bg-cyan-800 hover:bg-cyan-750"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar: Recibe el estado para saber si abrirse en móvil */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className={`flex-1 ${isProductPage ? 'p-0 overflow-x-hidden' : 'p-6'}`}>
        <Outlet />
      </main>
    </div>
  );
};