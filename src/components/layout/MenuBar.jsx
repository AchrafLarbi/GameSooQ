import { useState, useEffect, useMemo } from "react";

const MenuBar = ({ isMobile = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = useMemo(
    () => [
      { label: "Accueil", sectionId: "acceuil", path: "/" },
      { label: "Caractéristiques", sectionId: "caracteristiques" },
      { label: "Fonctionnalités", sectionId: "fonctionnalites" },
      { label: "Contactez-nous", sectionId: "contactez-nous" },
      { label: "FAQ", sectionId: "faq" },
      { label: "Télécharger", sectionId: "télécharger" },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const activeItemIndex = menuItems.findIndex(
              (item) => item.sectionId === sectionId
            );
            if (activeItemIndex !== -1) {
              setActiveIndex(activeItemIndex);
            }
          }
        });
      },
      {
        rootMargin: "-50% 0px",
      }
    );

    menuItems.forEach((item) => {
      const section = document.getElementById(item.sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [menuItems]);

  return (
    <div>
      <nav
        className={`${
          isMobile
            ? "flex flex-col items-center space-y-6 py-8 px-6 text-white "
            : "flex items-center space-x-16 text-white text-lg md:text-xl" // Increased text size
        }`}
        style={
          isMobile
            ? {
                border: "2px solid rgba(255, 255, 255, 0.2)", // Subtle border for mobile
                borderRadius: "20px", // Rounded corners
                backdropFilter: "blur(80px)", // Blur effect for mobile
                backgroundColor: "rgba(200, 200, 200, 0.3)",
                padding: "20px 30px", // Padding for mobile
                width: "100%", // Reduce width to leave some space on the sides
                margin: "0 auto", // Shadow for depth
              }
            : {}
        }
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`relative transition-colors ${
              isMobile ? "w-full" : "text-lg" // Make the font size larger on desktop as well
            } text-center p-2 ${
              activeIndex === index ? "text-[#FF5733]" : "text-white"
            } hover:text-[#FF5733]`}
          >
            <span className="relative">
              {item.label}
              <span
                className={`absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#FF5733]  text-[#FF5733] transition-transform ${
                  activeIndex === index ? "scale-x-100" : "scale-x-0"
                } hover:scale-x-100 origin-left`}
              ></span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MenuBar;
