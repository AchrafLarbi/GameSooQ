import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Gamepad2, Monitor, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import header_icon from "@/assets/icons/header_icon.png";

const Sidebar = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const menuItems = [
    { index: 0, path: "home", label: "Tableau de Bord", icon: <LayoutDashboard size={20} /> },
    { index: 1, path: "users", label: "Utilisateurs", icon: <Users size={20} /> },
    { index: 2, path: "games", label: "Jeux", icon: <Gamepad2 size={20} /> },
    { index: 3, path: "consoles", label: "Consoles", icon: <Monitor size={20} /> },
    { index: 4, path: "posts", label: "Posts", icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-black text-white p-6 flex flex-col justify-between">
      <div className="flex flex-col items-center mb-16 mt-10">
        <img
          src={header_icon || "/placeholder.svg"}
          alt="Logo"
          className="w-40 h-auto mr-4"
        />
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "text-white font-bold" : "text-gray-400"
            }
            onClick={() => setActivePage(item.label)}
          >
            <Button variant="ghost" className="w-full flex justify-start gap-2 px-3 py-2 rounded-lg hover:bg-gray-800">
              {item.icon} {item.label}
            </Button>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-5 left-5">
        <Button variant="destructive" className="flex gap-2 hover:text-[#ff0000]" onClick={handleLogout}>
          <LogOut size={20} /> Déconnexion
        </Button>
      </div>
      
    </div>
  );
};

export default Sidebar;
