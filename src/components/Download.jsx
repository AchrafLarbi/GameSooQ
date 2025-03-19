import Frame2 from "../assets/Frame2.svg";
import Frame from "../assets/Frame.svg";

import PlayStore from "../assets/PlayStore.svg";
import AppStore from "../assets/AppStore.svg";

export default function Download() {
  return (
    <section
      id="telecharge"
      className="relative w-full max-w-7xl mx-auto py-10 px-6 flex items-center justify-center"
    >
      <div className="relative w-full flex justify-center">
        <img
          src={Frame}
          className="w-full h-auto object-contain rounded-lg"
          alt="Prêt à commencer?"
        />

        <div className="absolute w-full h-full flex flex-col items-center  justify-center text-white text-center sm:text-left sm:px-10 lg:mr-40 ">
          <h2 className="text-sm sm:text-3xl md:text-5xl font-extrabold sm:mb-3 ">
            Prêt à commencer ?
          </h2>
          <p className="text-sm sm:text-lg opacity-80 font-medium mb-5">
            Téléchargez l’application dès maintenant...
          </p>

          <div className="flex flex-row gap-4 justify-center sm:justify-start mt-5">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={PlayStore}
                className="w-36 sm:w-44 md:w-48 h-auto"
                alt="Get it on Google Play"
              />
            </a>

            <div className="flex flex-col items-center">
              <img
                src={AppStore}
                className="w-36 sm:w-44 md:w-48 h-auto opacity-50"
                alt="Download on the App Store"
              />
              <p className="text-[13px] hidden sm:block opacity-80 font-medium my-3">
                Disponible prochainement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
