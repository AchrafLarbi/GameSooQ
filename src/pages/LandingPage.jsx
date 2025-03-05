import Header from "../components/layout/Header";
import AcceuilPage from "../components/AcceuilPage";
import AcceuilPageMiddle from "../components/AcceuilPageMiddle";
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
      className="relative w-full h-full bg-black"
      style={{
        backgroundColor: "#1C1B29",
        backgroundSize: "15%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Ensures background stays fixed while scrolling
      }}
    >
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main>
        <AcceuilPage />
        <AcceuilPageMiddle />
        {/* <Services /> */}
        {/* <Galerie />
        {/* <Contact /> */}
        {/* <LocalisationSection />  */}
        {/* <FeedbackForm />  */}
      </main>

      {/* Footer Component */}
      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;
