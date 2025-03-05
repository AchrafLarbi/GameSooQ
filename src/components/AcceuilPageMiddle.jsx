import bg_acceuil from "../assets/mockup/mockup.png";

export default function AcceuilPageMiddle() {
  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#0A0A10] px-4 md:px-0">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-20 blur-2xl" />
      </div>

      {/* Left Text */}
      <h1 className="absolute md:left-[17%] top-[12%] md:top-1/2  -translate-y-1/2  text-5xl md:text-[7rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        Game
      </h1>

      {/* Right Text */}
      <h1 className="absolute md:right-[23%] top-3/4 md:top-1/2 -translate-y-1/2 text-5xl md:text-[7rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        sooQ
      </h1>

      {/* Mobile Phone Container */}
      <div
        className="relative z-10 w-[90%] max-w-[350px] h-[600px] md:h-[800px] rounded-[30px] shadow-2xl p-4 xl:ml-16  sm:ml-24 ml-20 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${bg_acceuil})`,
          backgroundSize: "130%",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
