import acceuil_bg from "../assets/background/acceuil_bg.png";
import AcceuilPageMiddle from "./AcceuilPageMiddle";

const AcceuilPage = () => {
  return (
    <section
      id="acceuil"
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-white text-center px-4"
      style={{
        backgroundImage: `url(${acceuil_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 mt-16 sm:mt-20 lg:mt-28">
        <div className="w-full text-center mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
            ACHETEZ, VENDEZ & ÉCHANGEZ DES JEUX ET CONSOLES
          </h1>
          <p className="text-white text-lg sm:text-lg lg:text-2xl mt-4 leading-relaxed text-balance mx-auto px-4 sm:px-8 lg:px-0 lg:mx-60 ">
            Trouvez de bonnes affaires, échangez vos jeux et connectez-vous avec
            d'autres joueurs en Algérie. Vendez votre ancienne console, échangez
            des jeux ou discutez avec d'autres joueurs, tout en un seul endroit
            !
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-10">
          <a
            href="#download-android"
            className="group bg-[#FF5733] hover:bg-white hover:text-[#FF5733] hover:border-[#FF5733] text-white font-medium py-3 px-8 sm:px-10 lg:px-16 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[1px] w-full sm:w-auto border-2 border-transparent"
          >
            <span className="transition-colors duration-300">Google Play</span>
            <svg
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-300"
            >
              <path
                d="M0.839437 1.1056C0.624429 1.32504 0.5 1.6667 0.5 2.10916V17.8914C0.5 18.3338 0.624429 18.6755 0.839437 18.8949L0.892504 18.9431L9.96309 10.1029V9.89412L0.892504 1.05386L0.839437 1.1056Z"
                className="fill-white group-hover:fill-[#FF5733] transition-colors duration-300"
              />
              <path
                d="M14.0811 13.0511L11.0609 10.1028V9.89411L14.0847 6.94587L14.1525 6.98423L17.7335 8.97083C18.7555 9.53461 18.7555 10.4623 17.7335 11.0297L14.1525 13.0127L14.0811 13.0511Z"
                className="fill-white group-hover:fill-[#FF5733] transition-colors duration-300"
              />
              <path
                d="M13.6036 13.5617L10.512 10.5475L1.38837 19.4439C1.7278 19.7918 2.28134 19.8337 2.91081 19.4858L13.6036 13.5617Z"
                className="fill-white group-hover:fill-[#FF5733] transition-colors duration-300"
              />
              <path
                d="M13.6036 6.43527L2.91081 0.511143C2.28134 0.16681 1.7278 0.208735 1.38837 0.556636L10.512 9.44952L13.6036 6.43527Z"
                className="fill-white group-hover:fill-[#FF5733] transition-colors duration-300"
              />
            </svg>
          </a>

          <a
            href="#download-ios"
            className="group bg-[#FF5733] hover:bg-white hover:text-[#FF5733] hover:border-[#FF5733] text-white font-medium py-3 px-8 sm:px-10 lg:px-16 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[1px] w-full sm:w-auto border-2 border-transparent"
          >
            <span className="transition-colors duration-300">App Store</span>
            <svg
              width="18"
              height="22"
              viewBox="0 0 18 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-300"
            >
              <path
                d="M15.0341 11.6859C15.009 8.96075 17.3227 7.63495 17.4285 7.57323C16.1181 5.71051 14.0871 5.45601 13.3734 5.43571C11.6676 5.26069 10.0129 6.43091 9.144 6.43091C8.2577 6.43091 6.91959 5.45263 5.47741 5.48137C3.62157 5.50928 1.88541 6.55689 0.933206 8.1837C-1.0319 11.5007 0.433691 16.3752 2.31641 19.0564C3.25821 20.3695 4.35871 21.8357 5.79915 21.7841C7.20837 21.7275 7.73477 20.9082 9.43538 20.9082C11.1204 20.9082 11.6147 21.7841 13.0838 21.7512C14.5962 21.7275 15.5484 20.4321 16.4572 19.1072C17.5456 17.6021 17.9827 16.1199 18 16.0438C17.9644 16.032 15.0627 14.9522 15.0341 11.6859Z"
                className="fill-white group-hover:fill-[#FF5733] transition-colors duration-300"
              />
              <path
                d="M12.259 3.67193C13.017 2.74776 13.5356 1.49045 13.3916 0.214539C12.2946 0.261889 10.9227 0.954382 10.1326 1.85826C9.43365 2.65475 8.80925 3.96026 8.97056 5.18797C10.2029 5.2776 11.4681 4.58172 12.259 3.67193Z"
                className="fill-white group-hover:fill-[#FF5733] transition-colors duration-300"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AcceuilPage;
