"use client";

import foncImg1 from "../assets/mockup/mockup2.png";
import FoncSvg from "./layout/FoncSvg";
import foncImg2 from "../assets/mockup/fonc_phone2.png";
import foncImg3 from "../assets/mockup/fonc_phone3.png";
import foncImg4 from "../assets/mockup/fonc_phone4.png";
import foncImg5 from "../assets/mockup/fonc_phone5.png";
import foncImg6 from "../assets/mockup/fonc_phone6.png";

import { motion as Motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      title: "Achat, vente et échange de jeux",
      description:
        "Achetez les derniers jeux à prix réduit, revendez ceux que vous n’utilisez plus ou échangez-les avec d’autres joueurs pour toujours avoir de nouvelles expériences sans dépenser une fortune.",
      icon: "shopping-cart",
      img: foncImg1,
    },
    {
      title: "Achat, vente et échange de consoles",
      description:
        "Trouvez des consoles d’occasion en bon état ou vendez la vôtre facilement. Échangez avec d’autres gamers pour tester différentes plateformes sans contrainte.",
      icon: "users",
      img: foncImg2,
    },
    {
      title: "Système de Chat entre Utilisateurs",
      description:
        "Contactez instantanément les vendeurs et acheteurs via un chat intégré. Posez des questions, négociez les prix et finalisez vos transactions en toute fluidité.",
      icon: "bell",
      img: foncImg3,
    },
    {
      title: "Notifications en Temps Réel",
      description:
        "Recevez des alertes instantanées pour les nouveaux jeux et consoles disponibles, les messages des autres utilisateurs ou les mises à jour importantes de la plateforme.",
      icon: "shield",
      img: foncImg4,
    },
    {
      title: "Suivi des Transactions",
      description:
        "Suivez en temps réel l’état de vos transactions, de la mise en vente à la finalisation de l’échange. Recevez des mises à jour instantanées pour chaque étape afin d’assurer une expérience sécurisée et transparente.",
      icon: "star",
      img: foncImg5,
    },
    {
      title: "Évaluation des Utilisateurs",
      description:
        "Consultez les avis et notes laissés par la communauté pour chaque utilisateur. Laissez un feedback après chaque transaction pour garantir une plateforme sécurisée et fiable où seuls les meilleurs vendeurs et acheteurs se démarquent.",
      icon: "devices",
      img: foncImg6,
    },
  ];

  return (
    <section
      id="fonctionnalites"
      className="min-h-screen py-16 relative overflow-hidden"
    >
      {/* Background stars */}

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-red-500 uppercase text-lg font-medium tracking-wider">
            Les Fonctionnalités
          </h2>
          <h1 className="text-white text-4xl md:text-5xl font-bold mt-2">
            DE GAMESOOQ
          </h1>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col  ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8 md:gap-28`}
            >
              {/* Modified this div to position more to the left on large screens */}
              <div className="relative lg:h-full flex flex-col items-center justify-center mx-auto">
                {/* Phone image with curved lines */}
                <div className="absolute inset-0 flex items-center justify-center ">
                  <FoncSvg className="w-full h-full" />
                </div>

                <div className="relative flex flex-col items-center justify-center">
                  {/* Mobile image with animation */}
                  <Motion.div
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
                    <Motion.div
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
                      <Motion.img
                        src={feature.img || "/placeholder.svg"}
                        alt="GameSooq Mobile App Interface"
                        className="w-6/12 max-w-md mx-auto"
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
                    </Motion.div>
                  </Motion.div>
                </div>
              </div>

              <div className="w-full flex flex-col mx-auto md:w-1/2 text-left">
                <div className="flex items-center mb-4">
                  <div className="bg-red-500 rounded-full p-3 mr-4">
                    {feature.icon === "shopping-cart" && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 21L3 16.5M3 16.5L7.5 12M3 16.5H16.5M16.5 3L21 7.5M21 7.5L16.5 12M21 7.5L7.5 7.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {feature.icon === "users" && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.25 5.65273C5.25 4.79705 6.1674 4.25462 6.91716 4.66698L18.4577 11.0143C19.2349 11.4417 19.2349 12.5584 18.4577 12.9858L6.91716 19.3331C6.1674 19.7455 5.25 19.203 5.25 18.3474V5.65273Z"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {feature.icon === "bell" && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.625 12C8.625 12.2071 8.45711 12.375 8.25 12.375C8.04289 12.375 7.875 12.2071 7.875 12C7.875 11.7929 8.04289 11.625 8.25 11.625C8.45711 11.625 8.625 11.7929 8.625 12ZM8.625 12H8.25M12.375 12C12.375 12.2071 12.2071 12.375 12 12.375C11.7929 12.375 11.625 12.2071 11.625 12C11.625 11.7929 11.7929 11.625 12 11.625C12.2071 11.625 12.375 11.7929 12.375 12ZM12.375 12H12M16.125 12C16.125 12.2071 15.9571 12.375 15.75 12.375C15.5429 12.375 15.375 12.2071 15.375 12C15.375 11.7929 15.5429 11.625 15.75 11.625C15.9571 11.625 16.125 11.7929 16.125 12ZM16.125 12H15.75M21 12C21 16.5563 16.9706 20.25 12 20.25C11.1125 20.25 10.2551 20.1323 9.44517 19.9129C8.47016 20.5979 7.28201 21 6 21C5.80078 21 5.60376 20.9903 5.40967 20.9713C5.25 20.9558 5.0918 20.9339 4.93579 20.906C5.41932 20.3353 5.76277 19.6427 5.91389 18.8808C6.00454 18.4238 5.7807 17.9799 5.44684 17.6549C3.9297 16.1782 3 14.1886 3 12C3 7.44365 7.02944 3.75 12 3.75C16.9706 3.75 21 7.44365 21 12Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {feature.icon === "shield" && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.7324 15.0817C14.627 14.857 16.4539 14.4116 18.1867 13.7719C16.7499 12.177 15.8754 10.0656 15.8754 7.75V7.04919C15.8755 7.03281 15.8756 7.01641 15.8756 7C15.8756 3.68629 13.1893 1 9.87556 1C6.56185 1 3.87556 3.68629 3.87556 7L3.87536 7.75C3.87536 10.0656 3.00084 12.177 1.56404 13.7719C3.29697 14.4116 5.124 14.857 7.0187 15.0818M12.7324 15.0817C11.7955 15.1928 10.8421 15.25 9.87537 15.25C8.90873 15.25 7.95544 15.1929 7.0187 15.0818M12.7324 15.0817C12.8254 15.3711 12.8756 15.6797 12.8756 16C12.8756 17.6569 11.5324 19 9.87556 19C8.21871 19 6.87556 17.6569 6.87556 16C6.87556 15.6797 6.92575 15.3712 7.0187 15.0818M1 5.5C1.28728 3.78764 2.05809 2.23924 3.16724 1M16.5839 1C17.693 2.23924 18.4638 3.78764 18.7511 5.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {feature.icon === "star" && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {feature.icon === "devices" && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4806 3.49883C11.6728 3.03685 12.3272 3.03685 12.5194 3.49883L14.6453 8.61028C14.7263 8.80504 14.9095 8.93811 15.1198 8.95497L20.638 9.39736C21.1368 9.43735 21.339 10.0598 20.959 10.3853L16.7547 13.9867C16.5945 14.1239 16.5245 14.3392 16.5735 14.5444L17.858 19.9293C17.974 20.416 17.4446 20.8007 17.0176 20.5398L12.2932 17.6542C12.1132 17.5443 11.8868 17.5443 11.7068 17.6542L6.98241 20.5398C6.55541 20.8007 6.02596 20.416 6.14205 19.9293L7.42654 14.5444C7.47548 14.3392 7.40553 14.1239 7.24533 13.9867L3.04101 10.3853C2.66102 10.0598 2.86325 9.43735 3.362 9.39736L8.88024 8.95497C9.0905 8.93811 9.27366 8.80504 9.35466 8.61028L11.4806 3.49883Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-white  text-3xl sm:text-4xl font-bold">
                    {feature.title}
                  </h3>
                </div>
                <p className="opacity-50 text-white  text-2xl leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
