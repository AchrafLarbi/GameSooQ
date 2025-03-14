import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AcceuilPage from "../components/AcceuilPage";
import Download from "../components/Download";
import FAQsection from "../components/FAQSection";
import Fonctionnalites from "../components/Fonctionnalites";
import Caracteristiques from "../components/Caracteristiques";
import Form from "../components/Form";
import FAQ from "@/components/FAQ";

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/FAQ") {
      setTimeout(() => {
        const faqSection = document.getElementById("aide");
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.pathname]);

  return (
    <div
      className="relative w-full h-full"
      style={{
        backgroundImage: "linear-gradient(to bottom right, #1E1B2C, #2A1F3D)",
        backgroundSize: "100%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />
      <main>
        <AcceuilPage />
        <Caracteristiques />
        <Fonctionnalites />
        <Form />
        <FAQ />
        <section id="faq">
          <FAQsection />
        </section>
        <Download />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
