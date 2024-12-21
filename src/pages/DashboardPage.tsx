// src/components/Dashboard.tsx
import React, { useState } from "react";
import { Calendar, Music, Users, Menu as MenuIcon, X } from "lucide-react";
import RepertorioPage from "./RepertorioPage";
import MenuItem from "@/components/MenuItem";
import { MenuOption } from "@/types/MenuOption";
import MembrosPage from "./MembrosPage";
import EscalasPage from "./EscalasPage";

const DashboardPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("escalas");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (menu: MenuOption) => {
    setActiveMenu(menu);
    // Em telas menores, fecha o menu após a seleção
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Overlay para telas menores */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Botão Hamburguer */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-white shadow-lg"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MenuIcon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static w-64 bg-white shadow-lg h-full z-30
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 mt-8 md:mt-0">Menu</h2>
          <nav className="space-y-2">
            <MenuItem
              icon={Calendar}
              text="Escalas"
              isActive={activeMenu === "escalas"}
              onClick={() => handleMenuClick("escalas")}
            />
            <MenuItem
              icon={Music}
              text="Repertório"
              isActive={activeMenu === "repertorio"}
              onClick={() => handleMenuClick("repertorio")}
            />
            <MenuItem
              icon={Users}
              text="Membros"
              isActive={activeMenu === "membros"}
              onClick={() => handleMenuClick("membros")}
            />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 md:p-8 pt-20 md:pt-8">
          <h1 className="text-2xl font-bold mb-4 pl-8 md:pl-0">
            {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
          </h1>

          {activeMenu === "repertorio" ? (
            <RepertorioPage />
          ) : activeMenu === "membros" ? (
            <MembrosPage />
          ) : activeMenu === "escalas" ? (
            <EscalasPage />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
