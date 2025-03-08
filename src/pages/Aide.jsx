import { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FAQDetails from "../components/FAQDetails";

const Aide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-black"
      style={{
        backgroundColor: "#1C1B29",
        backgroundSize: "15%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />
      <div className="h-20"></div>

      <div className="flex-grow">
        <FAQDetails />
      </div>

      <Footer />
    </div>
  );
};

export default Aide;
