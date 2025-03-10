import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  MonitorPlay,
  FileText,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import header_icon from "@/assets/icons/header_icon.png";
import User from "@/assets/animoji.png";

const Sidebar = ({ setActivePage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const menuItems = [
    { path: "home", label: "Tableau de Bord", icon: LayoutDashboard },
    { path: "users", label: "Utilisateurs", icon: Users },
    { path: "games", label: "Jeux", icon: Gamepad2 },
    { path: "consoles", label: "Consoles", icon: MonitorPlay },
    { path: "posts", label: "Posts", icon: FileText },
  ];

  return (
    <div className="flex flex-col h-screen w-80 bg-black border-r border-white border-opacity-10 text-white shadow-xl p-4">
      <div className="p-6 flex items-center justify-center">
        <img
          src={header_icon || "/placeholder.svg"}
          alt="Logo"
          className="w-50 p-5 h-auto mr-4 shadow-lg my-6"
        />
      </div>
      <div className="flex-1 px-2 py-2">
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white text-black shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10"
                }`
              }
              onClick={() => setActivePage(item.label)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-b border-white border-opacity-10 flex flex-row items-center space-x-3">
        <img
          src={User}
          alt="User Avatar"
          className="w-16 h-16 mr-2 rounded-full "
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium">admin@admin.com</p>
          <span className="text-xs text-gray-400">Administrateur</span>
        </div>
      </div>

      <div className="p-4 ">
        <Button
          variant="outline"
          className="w-full flex items-center justify-start text-gray-400 hover:bg-red-600 hover:text-white rounded-xl py-3 border-black"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
