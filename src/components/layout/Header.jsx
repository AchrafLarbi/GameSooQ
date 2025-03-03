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

      <div className="flex justify-center items-center backdrop-blur w-full h-[80px] px-4">
        <div className="relative flex justify-between items-center w-full max-w-[1200px]">
          {/* Logo */}
          <div className="ml-4 lg:ml-16 flex items-center lg:relative lg:left-0 lg:transform-none absolute left-1/2 transform -translate-x-1/2">
            <img
              src={header_icon || "/placeholder.svg"}
              alt="Logo"
              className="w-28"
            />
          </div>

          {/* Hamburger Menu for Mobile and Tablet */}
          <button
            className="lg:hidden text-white p-2 absolute left-4"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <MenuBar />
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-[80px] backdrop-blur left-0 w-full z-50">
          <MenuBar isMobile={true} closeMenu={() => setIsMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
