import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/Dashboard/components/Sidebar";
import { useState, useEffect } from "react";

const Admin = () => {
  const [activePage, setActivePage] = useState("Tableau de Bord");
  const location = useLocation();

  useEffect(() => {
    const pathToPage = {
      "/operation/home": "Tableau de Bord",
      "/operation/users": "Utilisateurs",
      "/operation/games": "Jeux",
      "/operation/consoles": "Consoles",
      "/operation/posts": "Posts",
    };
    setActivePage(pathToPage[location.pathname] || "Tableau de Bord");
  }, [location.pathname]);

  return (
    <div className="flex bg-zinc-950 text-white min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-6 mt-7 ">
        <h1 className="text-3xl font-bold ml-6 ">{activePage}</h1>
        <p className="text-gray-400 ml-6 ">
          Bienvenue sur votre tableau de bord administrateur
        </p>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
