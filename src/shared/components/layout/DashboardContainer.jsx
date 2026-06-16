import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react"; // Solo para el botón

export const DashboardContainers = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Botón Toggle: Solo visible cuando la pantalla es MENOR a 1500px */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-cyan-800 text-white rounded-lg min-[1500px]:hidden shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar: Recibe el estado para saber si abrirse en móvil */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};