"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import emailjs from "emailjs-com";

export default function Form() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Email invalide.";
    if (!formData.telephone.match(/^\+?[0-9]{10,15}$/))
      newErrors.telephone = "Numéro de téléphone invalide.";
    if (!formData.message.trim())
      newErrors.message = "Le message ne peut pas être vide.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          alert("Message envoyé avec succès!");
          setFormData({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            message: "",
          });
          setErrors({});
          setLoading(false);
        },
        (err) => {
          console.log("FAILED...", err);
          alert("Une erreur s'est produite. Veuillez réessayer.");
          setLoading(false);
        }
      );
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center px-4 max-w-7xl mx-auto"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[#ff5e3a] text-sm md:text-base font-medium uppercase tracking-wider">
            Contactez-Nous
          </p>
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
            VOUS AVEZ UNE QUESTION OU UN RETOUR ?
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-2">
            Vous avez une question ou besoin d’assistance ? Remplissez le
            formulaire ci-dessous et notre équipe vous répondra dans les plus
            brefs délais. <br />
            Nous sommes là pour vous aider à chaque étape !
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom"
                className="bg-white text-gray-800 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ff5e3a]"
                required
              />
              {errors.nom && (
                <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Prénom"
                className="bg-white text-gray-800 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ff5e3a]"
                required
              />
              {errors.prenom && (
                <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-white text-gray-800 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ff5e3a]"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Numéro téléphone"
                className="bg-white text-gray-800 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ff5e3a]"
                required
              />
              {errors.telephone && (
                <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
              )}
            </div>
          </div>

          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Laissez-nous votre message..."
              rows={6}
              className="bg-white text-gray-800 rounded px-4 py-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-[#ff5e3a]"
              required
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#ff5e3a] hover:bg-[#e04d2e] text-white font-medium px-6 py-3 rounded-full flex items-center transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Send className="mr-2" />
              )}{" "}
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
