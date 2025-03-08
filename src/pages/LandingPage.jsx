import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AcceuilPage from "../components/AcceuilPage";
import Download from "../components/Download";
import FAQsection from "../components/FAQSection";
import Fonctionnalites from "../components/Fonctionnalites";
import Caracteristiques from "../components/Caracteristiques";
import FAQ from "../components/FAQ";
// import Services from "../components/Services";
// import Galerie from "../components/Galerie";
// import FeedbackForm from "../components/FeedbackForm";
// import LocalisationSection from "../components/Localisation";
// import Footer from "../components/layout/Footer";

// // Import custom background image
// import customBg from "../assets/custom_bg.png";

const LandingPage = () => {
  return (
    <div
      className="relative w-full h-full"
      style={{
        backgroundImage: "linear-gradient(to bottom right, #1E1B2C, #2A1F3D)", // Apply the gradient properly
        backgroundSize: "100%", // Ensure it covers the full area
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Keeps background fixed while scrolling
      }}
    >
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main>
        <AcceuilPage />
        <Caracteristiques />
        <Fonctionnalites />
        {/* <Contact /> */}
        {/* <LocalisationSection />  */}
        {/* <FeedbackForm />  */}
      </main>
      <FAQ />
      <FAQsection />
      <Download />
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default LandingPage;
