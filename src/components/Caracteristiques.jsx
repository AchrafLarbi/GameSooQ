import mobileApp from "../assets/mockup/cara_phone.png";
import CaraSvg from "./layout/CaraSvg";
import { motion } from "framer-motion";

const Caracteristiques = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B2C] to-[#2A1F3D] flex flex-col gap-32 py-20">
      {/* About Section */}
      <div className="px-6 md:px-20">
        <div className="max-w-5xl">
          <h2 className="text-3xl md:text-5xl text-white font-bold font-josefin max-w-3xl mb-6">
            À PROPOS GAMESOOQ
          </h2>
          <p className="opacity-50 text-white text-base md:text-lg leading-relaxed">
            GameSooq est une marketplace multiplateforme disponible sur iOS et
            Android, conçue pour les gamers en Algérie. Elle permet aux
            utilisateurs d'acheter, de vendre et d'échanger des jeux vidéo et
            des consoles facilement et en toute sécurité. L'application dispose
            également d'un chat intégré, offrant une communication directe entre
            acheteurs et vendeurs. Avec des filtres de recherche avancés, des
            avis utilisateurs et un système d'échange sécurisé, GameSooq
            simplifie et sécurise les transactions. Que vous souhaitiez vendre
            une ancienne console, échanger un jeu ou discuter avec d'autres
            gamers, GameSooq est la plateforme idéale. Téléchargez dès
            maintenant et profitez d'une nouvelle façon de jouer !
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section id="caracteristiques" className="px-6 md:px-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <div className="space-y-12">
            {/* Title */}
            <div className="space-y-2">
              <h3 className="text-[#FF5733] uppercase text-lg tracking-wider">
                Les caractéristiques
              </h3>
              <h2 className="text-white text-xl md:text-5xl font-bold whitespace-nowrap ">
                DE NOTRE APPLICATION MOBILE
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-10">
              {/* Feature 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    color="#FF5733"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L10.6985 7.20599C10.4445 8.22185 10.3176 8.72978 10.0531 9.14309C9.81915 9.50868 9.50868 9.81915 9.14309 10.0531C8.72978 10.3176 8.22185 10.4445 7.20599 10.6985L2 12L7.20599 13.3015C8.22185 13.5555 8.72978 13.6824 9.14309 13.9469C9.50868 14.1808 9.81915 14.4913 10.0531 14.8569C10.3176 15.2702 10.4445 15.7782 10.6985 16.794L12 22L13.3015 16.794C13.5555 15.7782 13.6824 15.2702 13.9469 14.8569C14.1808 14.4913 14.4913 14.1808 14.8569 13.9469C15.2702 13.6824 15.7782 13.5555 16.794 13.3015L22 12L16.794 10.6985C15.7782 10.4445 15.2702 10.3176 14.8569 10.0531C14.4913 9.81915 14.1808 9.50868 13.9469 9.14309C13.6824 8.72978 13.5555 8.22185 13.3015 7.20599L12 2Z"
                      stroke="#FF5733"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <h3 className="text-white text-xl font-semibold">
                    Interfaces convivial
                  </h3>
                </div>
                <p className="text-white opacity-50 text-lg leading-relaxed ">
                  Une application facile à utiliser, avec une navigation fluide
                  et une expérience utilisateur optimisée pour tous les gamers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="22"
                    viewBox="0 0 20 22"
                    color="#FF5733"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 1.50008V11.0001M10 11.0001L18.5 6.27779M10 11.0001L1.5 6.27779M10 11.0001V20.5001M18.5 15.7223L10.777 11.4318C10.4934 11.2742 10.3516 11.1954 10.2015 11.1645C10.0685 11.1372 9.93146 11.1372 9.79855 11.1645C9.64838 11.1954 9.50658 11.2742 9.22297 11.4318L1.5 15.7223M19 15.0586V6.94153C19 6.59889 19 6.42757 18.9495 6.27477C18.9049 6.13959 18.8318 6.01551 18.7354 5.91082C18.6263 5.79248 18.4766 5.70928 18.177 5.54288L10.777 1.43177C10.4934 1.27421 10.3516 1.19543 10.2015 1.16454C10.0685 1.13721 9.93146 1.13721 9.79855 1.16454C9.64838 1.19543 9.50658 1.27421 9.22297 1.43177L1.82297 5.54288C1.52345 5.70928 1.37369 5.79248 1.26463 5.91082C1.16816 6.01551 1.09515 6.13959 1.05048 6.27477C1 6.42757 1 6.59889 1 6.94153V15.0586C1 15.4013 1 15.5726 1.05048 15.7254C1.09515 15.8606 1.16816 15.9847 1.26463 16.0893C1.37369 16.2077 1.52345 16.2909 1.82297 16.4573L9.22297 20.5684C9.50658 20.726 9.64838 20.8047 9.79855 20.8356C9.93146 20.863 10.0685 20.863 10.2015 20.8356C10.3516 20.8047 10.4934 20.726 10.777 20.5684L18.177 16.4573C18.4766 16.2909 18.6263 16.2077 18.7354 16.0893C18.8318 15.9847 18.9049 15.8606 18.9495 15.7254C19 15.5726 19 15.4013 19 15.0586Z"
                      stroke="#FF5733"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <h3 className="text-white text-xl font-semibold">
                    Rapidité et Performance
                  </h3>
                </div>

                <p className="text-white opacity-50 text-lg leading-relaxed">
                  L'application est rapide, légère et optimisée pour un
                  chargement instantané, que ce soit sur iOS ou Android.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    color="#FF5733"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.5 14H6M6 14V1.5M6 14L1.5 18.5M1.5 6H14M14 6V18.5M14 6L18.5 1.5M19 13.3373V1.8C19 1.51997 19 1.37996 18.9455 1.273C18.8976 1.17892 18.8211 1.10243 18.727 1.0545C18.62 1 18.48 1 18.2 1H6.66274C6.41815 1 6.29586 1 6.18077 1.02763C6.07873 1.05213 5.98119 1.09253 5.89172 1.14736C5.7908 1.2092 5.70432 1.29568 5.53137 1.46863L1.46863 5.53137C1.29568 5.70432 1.2092 5.7908 1.14736 5.89172C1.09253 5.98119 1.05213 6.07873 1.02763 6.18077C1 6.29586 1 6.41815 1 6.66274V18.2C1 18.48 1 18.62 1.0545 18.727C1.10243 18.8211 1.17892 18.8976 1.273 18.9455C1.37996 19 1.51997 19 1.8 19H13.3373C13.5818 19 13.7041 19 13.8192 18.9724C13.9213 18.9479 14.0188 18.9075 14.1083 18.8526C14.2092 18.7908 14.2957 18.7043 14.4686 18.5314L18.5314 14.4686C18.7043 14.2957 18.7908 14.2092 18.8526 14.1083C18.9075 14.0188 18.9479 13.9213 18.9724 13.8192C19 13.7041 19 13.5818 19 13.3373Z"
                      stroke="#FF5733"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <h3 className="text-white text-xl font-semibold">
                    Sécurité et Fiabilité
                  </h3>
                </div>
                <p className="text-white opacity-50 text-lg leading-relaxed">
                  Achetez, vendez et échangez en toute confiance grâce à un
                  système de vérification des utilisateurs et des évaluations
                  pour garantir des transactions sécurisées.
                </p>
              </div>
            </div>
          </div>

          {/* Right content - Mobile App Image */}
          <div className="relative lg:h-full flex flex-col items-center justify-center">
            {/* Decorative curved lines */}

            <CaraSvg />

            <div className="relative lg:h-full flex flex-col items-center justify-center">
              {/* Mobile image with animation */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 0.5, // Delay other elements so this animation happens first
                    },
                  },
                }}
              >
                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 30,
                    transition: { duration: 0.8, ease: "easeOut" },
                  }}
                  whileInView={{
                    y: [0, -10, 0],
                    transition: {
                      y: {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        ease: "easeInOut",
                      },
                    },
                  }}
                >
                  <motion.img
                    src={mobileApp || "/placeholder.svg"}
                    alt="GameSooq Mobile App Interface"
                    className="w-10/12 max-w-md mx-auto"
                    initial={{ scale: 0.95, rotate: -2 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.8, ease: "easeOut" },
                    }}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Caracteristiques;
