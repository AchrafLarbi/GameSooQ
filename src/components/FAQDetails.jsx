
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { faqData } from "../data/faqData";
import { Plus, X, Flame } from "lucide-react";

const FAQDetails = () => {
  const { id } = useParams();
  const section = faqData[id];
  const [openQuestion, setOpenQuestion] = useState(null);

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1C1B29] text-white">
        <h2 className="text-2xl font-semibold">Section introuvable</h2>
      </div>
    );
  }

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="bg-[#1C1B29] text-white min-h-screen py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="text-red-500 text-sm uppercase font-semibold tracking-wider mb-2">
            Notre Support
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">{section.section.toUpperCase()}</h2>
        </motion.div>

        <div className="space-y-4">
          {section.questions.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-[#1a1a24] rounded border-gray-800 hover:bg-[#1e1e28] shadow-md overflow-hidden w-7xl "
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between py-5 px-4 text-left focus:outline-none hover:bg-[#1e1e28] transition"
              >
                <span className="font-medium text-lg">{q.question}</span>
                <motion.div
                  animate={{ rotate: openQuestion === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openQuestion === index ? (
                    <X className="h-6 w-6 text-gray-300" />
                  ) : (
                    <Plus className="h-6 w-6 text-gray-300" />
                  )}
                </motion.div>
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={openQuestion === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pb-5 px-4 text-gray-300 whitespace-pre-line">
                  {index === 0 && q.hasIcon && (
                    <p className="mb-4 flex items-center">
                      <Flame className="h-5 w-5 text-orange-500 mr-2" />
                      {q.answer}
                    </p>
                  )}
                  {(!q.hasIcon || index !== 0) && <p>{q.answer}</p>}
                </div>

              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQDetails;
