import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileInput,
  Calculator,
  BarChart2,
  NotebookText,
  Lightbulb,
  Users,
  LogOut,
  Settings,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const user = authState.user;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavLink = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => (
    <Link to={to}>
      <Button
        variant={location.pathname === to ? "default" : "ghost"}
        className="flex items-center gap-2 px-4 py-2"
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  );

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 w-full h-16 flex items-center justify-between px-6">
      {/* Gauche : Logo + Liens */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <Calculator className="h-6 w-6" />
          Footprint-TraLIS
        </Link>

        {/* Liens visibles sur desktop */}
        <div className="hidden md:flex gap-2">
  <NavLink to="/home" icon={LayoutDashboard} label="Accueil" />
  <NavLink to="/dashboard" icon={LayoutDashboard} label="Tableau de bord" />
  
  {user?.role === "admin" ? (
    <>
      
      <NavLink to="/user-management" icon={Users} label="Gestion des utilisateurs" />
      <NavLink to="/emission-config" icon={Cog} label="Configuration des émissions" />
    </>
  ) : (
    <>
      <NavLink to="/data-entry" icon={FileInput} label="Saisie des données" />
      <NavLink to="/calculation" icon={Calculator} label="Calcul CO₂" />
      <NavLink to="/visualization" icon={BarChart2} label="Visualisation" />
      <NavLink to="/reports" icon={NotebookText} label="Rapports" />
      <NavLink to="/recommendations" icon={Lightbulb} label="Recommandations" />
    </>
  )}
</div>

      </div>

      {/* Droite : Menu utilisateur avec initiale (A / U) */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full w-8 h-8 p-0 font-semibold uppercase"
              title={user?.name}
            >
              {user?.role === "admin" ? "A" : "U"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="capitalize">{user?.name || "Utilisateur"}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-sm font-normal text-gray-500">
              {user?.role === "admin" ? "Administrateur" : "Utilisateur"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                 <Link to="/account-settings" className="cursor-pointer flex items-center">
                 <Settings className="mr-2 h-4 w-4" />
                 Paramètres du compte
                 </Link>
  </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
