"use client";

import { useState } from "react";
import header_icon from "../../assets/icons/header_icon.png";
import MenuBar from "./MenuBar";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Blur Background */}
      <div className="absolute inset-0 backdrop-blur shadow-md z-[-1]"></div>

      <div className="flex justify-center items-center backdrop-blur w-full h-[80px]  gap-10">
        <div className="relative flex items-center w-full px-4 xl:px-0">
          {/* Logo - Increased Size */}
          <div className=" p-4 xl:ml-10 flex items-center justify-center xl:justify-start w-full">
            <img
              src={header_icon || "/placeholder.svg"}
              alt="Logo"
              className="w-60 max-w-[150%] " // Increased the size
            />
          </div>

          {/* Hamburger Menu (Now Hidden on 1280px+) */}
          <button
            className="xl:hidden text-white p-2 absolute left-4"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu (Visible Only on 1280px+) */}
          <div className="hidden xl:block xl:mr-16">
            <MenuBar />
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Menu (Now Applies to <1280px) */}
      {isMenuOpen && (
        <div className="xl:hidden fixed top-[80px] backdrop-blur left-0 w-full z-50">
          <MenuBar isMobile={true} closeMenu={() => setIsMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
