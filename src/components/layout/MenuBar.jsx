import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MenuBar = ({ isMobile = false, closeMenu }) => {
  const [activeIndex, setActiveIndex] = useState(-1); // Start with no active item
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(
    () => [
      { label: "Accueil", sectionId: "acceuil", path: "/" },
      { label: "Caractéristiques", sectionId: "caracteristiques", path: "/" },
      { label: "Fonctionnalités", sectionId: "fonctionnalites", path: "/" },
      { label: "Contactez-Nous", sectionId: "contact", path: "/" },
      { label: "FAQ", sectionId: "faq", path: "/" },
      { label: "Aide", sectionId: "aide", path: "/" },
    ],
    []
  );

  // When location changes, check if we're on the home page
  useEffect(() => {
    if (location.pathname !== "/") {
      // If not on home page, no section should be highlighted
      setActiveIndex(-1);
    }
  }, [location.pathname]);

  const handleMenuClick = (item, index) => {
    // Always navigate to the home page with the specific section
    navigate("/", { replace: true });

    // Set timeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const section = document.getElementById(item.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setActiveIndex(index); // Only set active index after navigating to home
      }
    }, 100);

    if (isMobile && closeMenu) {
      closeMenu();
    }
  };

  useEffect(() => {
    // Only observe sections if we're on the home page
    if (location.pathname === "/") {
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
    }
  }, [menuItems, location.pathname]);

  return (
    <div>
      <nav
        className={`${
          isMobile
            ? "flex flex-col items-center space-y-6 py-8 px-6 text-white "
            : "flex items-center space-x-16 text-white text-lg md:text-xl"
        }`}
        style={
          isMobile
            ? {
                border: "2px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                backdropFilter: "blur(80px)",
                backgroundColor: "rgba(200, 200, 200, 0.3)",
                padding: "20px 30px",
                width: "100%",
                margin: "0 auto",
              }
            : {}
        }
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMenuClick(item, index)}
            className={`relative transition-colors ${
              isMobile ? "w-full" : "text-lg"
            } text-center p-2 ${
              location.pathname === "/" && activeIndex === index
                ? "text-[#FF5733]"
                : "text-white"
            } hover:text-[#FF5733]`}
          >
            <span className="relative">
              {item.label}
              <span
                className={`absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#FF5733] transition-transform ${
                  location.pathname === "/" && activeIndex === index
                    ? "scale-x-100"
                    : "scale-x-0"
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
