"use client";

import { useState, useEffect } from "react";
import header_icon from "../../assets/icons/header_icon.png";
import MenuBar from "./MenuBar";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280); // Detect mobile mode (<1280px)
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Blur Background */}
      <div className="absolute inset-0 backdrop-blur shadow-md z-[-1]"></div>

      <div
        className={`flex justify-center items-center backdrop-blur w-full transition-all duration-300 ${
          isMobile ? "h-[60px]" : "h-[80px]"
        }`} // Reduce height in mobile mode
      >
        <div className="relative flex items-center w-full px-4 xl:px-0">
          {/* Logo - Scales Down in Mobile View */}
          <div className="p-2 xl:ml-10 flex items-center justify-center xl:justify-start w-full">
            <img
              src={header_icon || "/placeholder.svg"}
              alt="Logo"
              className={`transition-all duration-300 ${
                isMobile ? "w-40" : "w-60" // Reduce logo size on mobile
              }`}
            />
          </div>

          {/* Hamburger Menu (Hidden on 1280px+) */}
          <button
            className="xl:hidden text-white p-2 absolute left-4"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu (Only Visible on 1280px+) */}
          <div className="hidden xl:block xl:mr-16">
            <MenuBar />
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Menu (Visible <1280px) */}
      {isMenuOpen && (
        <div className="xl:hidden fixed top-[60px] backdrop-blur left-0 w-full z-50">
          <MenuBar isMobile={true} closeMenu={() => setIsMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
