import acceuil_bg from "../assets/background/bg.png";
import AcceuilPageMiddle from "./AcceuilPageMiddle";

const AcceuilPage = () => {
  return (
    <section
      id="acceuil"
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-white text-center px-4"
      style={{
        backgroundImage: `url(${acceuil_bg})`,
        backgroundSize: "cover", // Ensures full coverage of the container
        backgroundPosition: "right top", // Keeps image aligned to the right
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Optional: Keeps the image fixed on scroll
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0  bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4  sm:mt-20 lg:mt-28 mb-32">
        <div className="w-full text-center mx-auto mt-52 ">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold ">
            Jouez sans limites !
          </h1>
          <p className="text-white text-xl sm:text-lg lg:text-3xl mt-4 leading-relaxed mx-auto sm:px-8 lg:px-0 lg:mx-60">
            Ne laissez plus vos anciens jeux prendre la poussière. Échangez-les,
            vendez-les ou trouvez les derniers titres au meilleur prix. Avec
            GameSooq, le gaming n'a plus de limites !
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-10">
          <a
            href="#telecharge"
            className="group bg-[#FF5733] hover:bg-white hover:text-[#FF5733] hover:border-[#FF5733] text-white font-medium py-3 px-8 sm:px-10 lg:px-16 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[1px] w-full sm:w-auto border-2 border-transparent"
          >
            <span className="transition-colors duration-300">Télécharger</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-300"
            >
              <path
                d="M9 8.25H7.5C6.25736 8.25 5.25 9.25736 5.25 10.5V19.5C5.25 20.7426 6.25736 21.75 7.5 21.75H16.5C17.7426 21.75 18.75 20.7426 18.75 19.5V10.5C18.75 9.25736 17.7426 8.25 16.5 8.25H15M9 12L12 15M12 15L15 12M12 15L12 2.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href=""
            className="group bg-[#FF5733] hover:bg-white hover:text-[#FF5733] hover:border-[#FF5733] text-white font-medium py-3 px-8 sm:px-10 lg:px-16 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[1px] w-full sm:w-auto border-2 border-transparent"
          >
            <span className="transition-colors duration-300 ">
              Regarder la vidéo
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-300"
            >
              <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.9099 11.6722C16.1671 11.8151 16.1671 12.1849 15.9099 12.3278L10.3071 15.4405C10.0572 15.5794 9.75 15.3986 9.75 15.1127V8.88732C9.75 8.60139 10.0572 8.42065 10.3071 8.55951L15.9099 11.6722Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      <AcceuilPageMiddle />
    </section>
  );
};

export default AcceuilPage;
