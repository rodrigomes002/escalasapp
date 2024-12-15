// src/components/Dashboard.tsx
import React, { useState } from "react";
import { Calendar, Music, Users, Menu as MenuIcon, X } from "lucide-react";
import RepertorioPage from "./RepertorioPage";
import { MenuItemProps } from "@/types/menuItemProps";

type MenuOption = "escalas" | "repertorio" | "membros";

interface DashboardProps {
  activeMenu: MenuOption;
  setActiveMenu: (menu: MenuOption) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  text,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
      isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon className="mr-2 h-4 w-4" />
    {text}
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ activeMenu, setActiveMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          ) : (
            <p className="pl-8 md:pl-0">Conteúdo da página {activeMenu}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
