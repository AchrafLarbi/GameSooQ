import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
    {children}
  </section>
);

const ListItem = ({ children }) => (
  <li className="text-white mb-2">{children}</li>
);

const PolitiqueConfidentialite = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const location = useLocation();

  useEffect(() => {
    // Force re-render when the route changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#1E1B2C]">
      <div className="container mx-auto px-4 py-12 max-w-4xl ">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-[#FF5733] mb-6 hover:underline hover:text-white "
        >
          <ArrowLeft className="mr-2 h-4 w-4 " />
          Retour à l'accueil
        </button>

        <div className="bg-[#1a1a24] rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-red-500">
            Politique de Confidentialité
          </h1>

          <Section title="1. Introduction">
            <p className="text-white leading-relaxed">
              Bienvenue sur GameSooq. Nous accordons une grande importance à la
              confidentialité de vos données et nous nous engageons à les
              protéger. Cette politique explique quelles informations nous
              collectons, comment nous les utilisons et quels sont vos droits.
            </p>
          </Section>

          <Section title="2. Informations collectées">
            <p className="text-white leading-relaxed mb-4">
              Lorsque vous utilisez GameSooq, nous collectons et stockons les
              informations suivantes :
            </p>
            <ul className="list-disc pl-6 text-white space-y-2">
              {[
                "Nom et prénom (pour l'identification sur l'application).",
                "Adresse e-mail (pour la création de compte et la récupération de mot de passe).",
                "Date de naissance (pour s'assurer que l'utilisateur a l'âge requis pour utiliser l'application).",
                "Numéro de téléphone (pour la vérification de compte et la communication).",
              ].map((item, index) => (
                <ListItem key={index}>{item}</ListItem>
              ))}
            </ul>
            <p className="text-white leading-relaxed mt-4">
              Ces données sont stockées en toute sécurité sur Firebase, un
              service de Google.
            </p>
          </Section>

          <Section title="3. Utilisation des données">
            <p className="text-white leading-relaxed mb-4">
              Nous utilisons ces informations uniquement pour :
            </p>
            <ul className="list-disc pl-6 text-white space-y-2">
              {[
                "Permettre la création et la gestion de votre compte utilisateur.",
                "Améliorer les fonctionnalités de l'application.",
                "Développer de nouvelles fonctionnalités adaptées à nos utilisateurs.",
                "Vous contacter si nécessaire (par exemple, pour des notifications importantes liées à l'application).",
              ].map((item, index) => (
                <ListItem key={index}>{item}</ListItem>
              ))}
            </ul>
          </Section>

          <Section title="4. Stockage et sécurité des données">
            <p className="text-white leading-relaxed">
              Toutes les données utilisateur sont stockées de manière sécurisée
              sur Firebase. Nous appliquons des mesures de protection pour
              éviter tout accès non autorisé, perte ou modification de vos
              informations.
            </p>
          </Section>

          <Section title="5. Partage des données">
            <p className="text-white leading-relaxed">
              Nous ne partageons pas vos informations avec des tiers. Vos
              données restent strictement utilisées pour le fonctionnement et
              l'amélioration de l'application.
            </p>
          </Section>

          <Section title="6. Vos droits">
            <p className="text-white leading-relaxed mb-4">
              Vous avez les droits suivants concernant vos données personnelles
              :
            </p>
            <ul className="list-disc pl-6 text-white space-y-2">
              {[
                "Accéder à vos informations.",
                "Corriger ou mettre à jour vos informations.",
                "Supprimer votre compte et vos données personnelles.",
              ].map((item, index) => (
                <ListItem key={index}>{item}</ListItem>
              ))}
            </ul>
          </Section>

          <Section title="7. Modifications de la politique">
            <p className="text-white leading-relaxed">
              Nous pouvons mettre à jour cette politique de confidentialité à
              tout moment. La version la plus récente sera toujours disponible à
              l'adresse suivante :
              <a
                href="https://gamesooq.com/politique-confidentialite"
                className="hover:underline text-[#FF5733]"
              >
                https://gamesooq.com/politique-confidentialite
              </a>
              .
            </p>
          </Section>

          <Section title="8. Contact">
            <p className="text-white leading-relaxed">
              Si vous avez des questions ou souhaitez exercer vos droits, vous
              pouvez nous contacter à
              <a
                href="mailto:contact@gamesooq.com"
                className="text-primary hover:underline"
              >
                contact@gamesooq.com
              </a>
              .
            </p>
          </Section>

          <div className="text-center text-sm text-gray-500 mt-12">
            <p>© {currentYear} GameSooq. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
