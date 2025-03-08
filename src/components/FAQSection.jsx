import { useNavigate } from "react-router-dom"
import { faqData } from "../data/faqData"
import { ChevronRight } from "lucide-react"

const FAQSection = () => {
  const navigate = useNavigate()

  const handleNavigation = (index) => {
    navigate(`/faq/${index}`);
  };

  return (
    <div className="text-white flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-red-500 text-sm uppercase font-medium tracking-wider mb-1">NOTRE SUPPORT</p>
          <h2 className="text-4xl font-bold mb-4">BESOIN D'AIDE ?</h2>
          <p className="text-gray-400 text-sm max-w-7xl mx-auto">
            Vous avez une question ou un souci ? Consultez notre support d'aide pour trouver des réponses rapides.
            <br />
            Notre support est disponible pour vous accompagner à chaque étape !
          </p>
        </div>

        <div className="w-full">
          {faqData.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(index)}
              className="group flex items-center justify-between w-full text-left py-5 px-4  mb-3 bg-[#1a1a24] rounded border-b border-gray-800 hover:bg-[#1e1e28] transition-all"
            >
              <span>{item.section}</span>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQSection
