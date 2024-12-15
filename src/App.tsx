// src/App.tsx
import React, { useState } from "react";
import { MenuItemProps } from "./types/menuItemProps";
import { Calendar, MenuIcon, Music, Users, X } from "lucide-react";
import RepertorioPage from "./components/RepertorioPage";
import PWAUpdater from "./components/PWAUpdater";

const LoginScreen: React.FC<{
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ email, setEmail, password, setPassword, onSubmit }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-gray-600">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
);

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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<MenuOption>("escalas");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  return isLoggedIn ? (
    <Dashboard activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
  ) : (
    <>
      <LoginScreen
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
      <PWAUpdater />
    </>
  );
};

export default App;
