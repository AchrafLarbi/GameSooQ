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

      <div className="flex justify-between items-center backdrop-blur w-full h-[80px] pl-40 ">
        {/* Logo - Positioned to the very left */}
        <div className="absolute left-0 flex items-center pl-20">
          <img
            src={header_icon || "/placeholder.svg"}
            alt="Logo"
            className="w-40 max-w-full"
          />
        </div>

        {/* Hamburger Menu for Mobile and Tablet */}
        <button
          className="lg:hidden text-white p-2 absolute left-[100px]"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu - Centered */}
        <div className="hidden lg:flex justify-center  w-full">
          <MenuBar />
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
