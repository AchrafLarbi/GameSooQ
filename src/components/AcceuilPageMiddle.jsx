"use client";

import { motion } from "framer-motion";
import bg_acceuil from "../assets/mockup/mockup.png";
import WaveSvg from "./layout/WaveSvg";
import WaveSvgRight from "./layout/WaveSvgRight";

export default function AcceuilPageMiddle() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center px-4 md:px-0 overflow-hidden py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-20 blur-2xl" />
      </div>

      {/* Mobile Phone Container - Centered with animation */}
      <motion.div
        className="relative z-10 w-[90%] max-w-[350px] h-[600px] md:h-[800px] rounded-[30px] p-4 xl:ml-16 sm:ml-24 ml-20 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${bg_acceuil})`,
          backgroundSize: "130%",
          backgroundPosition: "center",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Phone Content */}
      </motion.div>

      {/* Curved SVG lines */}
      <WaveSvg />
      <WaveSvgRight />

      {/* Star decorations */}
      <motion.svg
        className="absolute top-1/4 right-1/4"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <path
          d="M10 0L12.5 7.5H20L13.75 12.5L16.25 20L10 15L3.75 20L6.25 12.5L0 7.5H7.5L10 0Z"
          fill="#FF69B4"
        />
      </motion.svg>

      <motion.svg
        className="absolute bottom-1/4 left-1/3"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <path
          d="M7.5 0L9.5 5.5H15L10.5 9L12.5 15L7.5 11.5L2.5 15L4.5 9L0 5.5H5.5L7.5 0Z"
          fill="#FF69B4"
        />
      </motion.svg>

      {/* Left Text with animation */}
      <motion.h1
        className="absolute md:left-[17%] top-[12%] md:top-1/2 -translate-y-1/2 text-5xl md:text-[7rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Game
      </motion.h1>

      {/* Right Text with animation */}
      <motion.h1
        className="absolute md:right-[23%] top-3/4 md:top-1/2 -translate-y-1/2 text-5xl md:text-[7rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        sooQ
      </motion.h1>
    </div>
  );
}
