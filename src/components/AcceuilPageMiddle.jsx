"use client";

import { motion as Motion } from "framer-motion";

import bg_acceuil from "../assets/mockup/mockup1.png";
import WaveSvg from "./layout/WaveSvg";
import WaveSvgRight from "./layout/WaveSvgRight";

export default function AcceuilPageMiddle() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center px-4 md:px-0 overflow-hidden py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-20 blur-2xl" />
      </div>

      {/* Large screen: Side-by-side text layout */}
      <div className="hidden md:flex w-full items-center justify-center">
        {/* Left Text */}
        <Motion.h1
          className="hidden md:block text-5xl md:text-[7rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Game
        </Motion.h1>

        {/* Mobile Phone Image */}
        <Motion.div
          className="relative z-10 w-[70%] max-w-[250px] h-[400px] md:h-[600px] rounded-[30px] p-4 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${bg_acceuil})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Right Text */}
        <Motion.h1
          className="hidden md:block text-5xl md:text-[7rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Sooq
        </Motion.h1>
      </div>

      {/* Small & Medium Screens: Stacked text layout */}
      <div className="flex flex-col items-center md:hidden ">
        <Motion.h1
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Game
        </Motion.h1>

        {/* Mobile Phone Image */}
        <Motion.div
          className="relative z-10 w-[70%] max-w-[200px] h-[250px] rounded-[30px] bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${bg_acceuil})`,
            backgroundSize: "100%",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <Motion.h1
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Sooq
        </Motion.h1>
      </div>

      {/* Curved SVG lines - Only on large screens */}
      <div className="hidden lg:block">
        <WaveSvg />
        <WaveSvgRight />
      </div>

      {/* Star decorations - Visible only on large screens */}
      <Motion.svg
        className="absolute hidden lg:block top-1/4 right-1/4"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        initial={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <path
          d="M10 0L12.5 7.5H20L13.75 12.5L16.25 20L10 15L3.75 20L6.25 12.5L0 7.5H7.5L10 0Z"
          fill="#FF69B4"
        />
      </Motion.svg>

      <Motion.svg
        className="absolute hidden lg:block bottom-1/4 left-1/3"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileInView={{ opacity: 1 }}
      >
        <path
          d="M7.5 0L9.5 5.5H15L10.5 9L12.5 15L7.5 11.5L2.5 15L4.5 9L0 5.5H5.5L7.5 0Z"
          fill="#FF69B4"
        />
      </Motion.svg>
    </div>
  );
}
