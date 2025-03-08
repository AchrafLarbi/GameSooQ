import { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import header_icon from "../../assets/icons/header_icon.png";

function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const communityRules = `📜 RÈGLES DE LA COMMUNAUTÉ GAMESOOQ

  Bienvenue sur GameSooq, la plateforme dédiée aux passionnés de jeux vidéo ! 🎮🔥
  Nous voulons offrir un espace sûr, respectueux et agréable pour tous nos membres. Voici nos règles de communauté que chaque utilisateur doit respecter.
  
  1- Respect et bienveillance avant tout
  La communauté GameSooq repose sur le respect et la courtoisie entre ses membres.
  ✅ Sois poli(e) et bienveillant(e) dans tes échanges.
  ✅ Accepte les différences et respecte les avis de chacun.
  ❌ Les insultes, propos haineux, racistes, sexistes, homophobes, ou discriminatoires sont interdits.
  ❌ Le harcèlement, le spam ou toute tentative d'arnaque entraînera des sanctions immédiates.
  
  2- Annonces et contenu autorisés
  Pour garantir une place de marché fiable, chaque annonce doit respecter les règles suivantes :
  ✅ Publie uniquement des jeux vidéo, consoles et accessoires gaming.
  ✅ Décris honnêtement l’état de ton article (ne cache pas les défauts).
  ✅ Ajoute des photos claires et réelles de l’article (pas d’images trouvées sur Internet).
  ❌ Il est interdit de vendre des produits piratés, contrefaits ou illégaux.
  ❌ Toute annonce mensongère, incomplète ou douteuse sera supprimée.
  
  3- Transactions sécurisées
  Sur GameSooq, chaque utilisateur est responsable de ses transactions. Pour éviter les mauvaises surprises :
  ✅ Vérifie bien les détails avant d’acheter, vendre ou échanger un article.
  ✅ Favorise les rencontres en main propre dans un lieu public sécurisé.
  ✅ Si tu optes pour la livraison, utilise un service de confiance et exige un suivi.
  ❌ Ne partage jamais tes informations personnelles sensibles (numéro de carte bancaire, adresse complète, mots de passe).
  ❌ Évite les paiements douteux (ex : virements non sécurisés, chèques sans garantie).
  
  4- Comportement sur la plateforme
  GameSooq est un espace d’échange sain et convivial. Voici quelques règles de bon usage :
  ✅ Utilise un langage clair et courtois dans tes messages et discussions.
  ✅ N’hésite pas à signaler les comportements suspects (annonce frauduleuse, membre malhonnête…).
  ✅ Fais des offres raisonnables et respecte les décisions des vendeurs.
  ❌ Le spam, la publicité non autorisée et les tentatives d’arnaque sont interdits.
  ❌ Le non-respect des règles peut entraîner une suspension temporaire ou définitive du compte.
  
  5- Signalement et modération
  Nous faisons de notre mieux pour assurer un environnement sûr, mais nous comptons aussi sur toi !
  🚨 Si tu repères une annonce frauduleuse, un comportement inapproprié ou un abus, signale-le immédiatement via l’option "Signaler" ou contacte notre support : contact@gamesooq.com.
  🚨 Les récidivistes et les personnes ne respectant pas les règles pourront voir leur compte suspendu ou supprimé.
  🔹 En utilisant GameSooq, tu acceptes ces règles et t’engages à les respecter.
  🔹 Merci de faire de GameSooq une communauté sûre, honnête et passionnée ! 🎮🔥
  `;

  const catalogueRules = `📜 RÈGLES DU CATALOGUE GAMESOOQ
  
  GameSooq est une marketplace dédiée aux passionnés de jeux vidéo. Pour garantir une expérience fluide et sécurisée, chaque utilisateur doit respecter les règles suivantes lors de la publication d’une annonce.
  
  🎮 1. Produits autorisés à la vente
  Sur GameSooq, tu peux vendre les articles suivants :
  ✅ Jeux vidéo physiques et numériques (originaux et en bon état)
  ✅ Consoles de jeux (neuves ou d’occasion, avec accessoires inclus si précisé)
  ✅ Accessoires gaming (manettes, câbles, casques, volants, etc.)
  ✅ Cartes cadeaux et abonnements gaming (PSN, Xbox Live, Nintendo eShop, etc.)
  ✅ Produits dérivés liés aux jeux vidéo (figurines, posters, artbooks, etc.)
  
  🚫 2. Produits interdits à la vente
  Les articles suivants ne sont pas autorisés sur GameSooq :
  ❌ Comptes de jeux (PSN, Xbox, Steam, etc.), clés d’activation non officielles
  ❌ Jeux et consoles volés ou obtenus illégalement
  ❌ Produits en mauvais état ou non fonctionnels sans mention explicite dans l’annonce
  ❌ Contenus à caractère haineux, raciste, discriminatoire ou incitant à la violence
  ❌ Matériel ne respectant pas les lois en vigueur en Algérie
  Tout manquement à ces règles entraînera la suppression de l’annonce et peut mener à la suspension du compte du vendeur.
  
  📝 3. Règles pour la création d’une annonce
  Pour publier une annonce de qualité et attirer plus d’acheteurs, suis ces directives :
  📷 Photos de l’article
  Ajoute au moins 3 photos réelles de l’article, prises sous différents angles.
  Les images doivent être claires, nettes et sans filtres.
  Évite les images génériques prises sur Internet.
  Pour les consoles et accessoires électroniques, montre bien les câbles, manettes et éventuels défauts.
  🖊️ Titre et description
  Utilise un titre précis et clair (exemple : "PS5 – Édition Digitale avec 2 manettes – Bon état").
  Dans la description, mentionne :
  ✔️ L’état général de l’article (neuf, très bon état, bon état, usé)
  ✔️ Les éventuels défauts ou dysfonctionnements
  ✔️ Les accessoires inclus (ex : boîte, câbles, manettes)
  ✔️ La raison de la vente (facultatif mais recommandé)
  Sois honnête et transparent pour éviter tout malentendu avec l’acheteur.
  💰 Prix et négociation
  Fixe un prix réaliste en fonction du marché et de l’état du produit.
  Si tu acceptes les négociations, précise-le dans l’annonce.
  Les prix doivent être clairement affichés (pas de "Prix à discuter" sans indication).
  📍 Localisation et livraison
  Indique ton emplacement exact pour faciliter les transactions locales.
  Précise le mode de livraison accepté :
  ✔️ Main à main : Fixe un lieu de rendez-vous sécurisé pour l’échange.
  ✔️ Livraison via un transporteur : Précise si les frais de livraison sont à la charge de l’acheteur.
  
  ⚠️ 4. Règles de modération et sanctions
  GameSooq se réserve le droit de supprimer toute annonce ne respectant pas ces règles, notamment si :
  🚫 L’annonce contient des informations fausses ou trompeuses.
  🚫 L’article proposé est interdit par nos conditions d’utilisation.
  🚫 L’annonce présente un prix abusif ou une escroquerie manifeste.
  🚫 Le vendeur est signalé par plusieurs utilisateurs pour comportement frauduleux.
  En cas d’infraction répétée, GameSooq peut suspendre ou bannir définitivement le compte concerné.
  
  💡 Conseils pour une vente réussie
  ✔️ Soigne ton annonce : Des photos de qualité et une description détaillée attirent plus d’acheteurs.
  ✔️ Reste réactif : Réponds rapidement aux messages pour conclure plus vite ta vente.
  ✔️ Négocie avec respect : Accepte les offres raisonnables et reste courtois(e) dans tes échanges.
  ✔️ Privilégie les transactions sécurisées : Évite les paiements douteux et favorise les rencontres en lieux publics.
  
  Avec ces règles, GameSooq assure une plateforme sécurisée et agréable pour tous ses membres. Bonne vente et bon gaming ! 🎮🚀`;

  const handleOpenModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <footer className="bg-[#171721] text-white py-12 font-poppins">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Section principale */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-6 text-left">
              <img
                src={header_icon || "/placeholder.svg"}
                alt="Logo"
                className="w-36 block mx-0"
              />
            </div>
            <p className="text-gray-300 mb-6 text-sm text-left">
              GameSooq est une marketplace dédiée aux gamers en Algérie pour
              acheter, vendre et échanger des jeux vidéo et des consoles en
              toute simplicité et sécurité. Connectez-vous avec d'autres joueurs
              et trouvez les meilleures offres près de chez vous !
            </p>
            <div className="flex justify-left space-x-4 mb-6">
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center">
            <h3 className="text-[#FF6B35] font-bold mb-4 text-lg">
              Caractéristiques
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Interface conviviale</li>
              <li>Rapidité et Performance</li>
              <li>Sécurité et Fiabilité</li>
            </ul>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center">
            <h3 className="text-[#FF6B35] font-bold mb-4 text-lg">
              Fonctionnalités
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Achat, vente et échanges de jeux vidéos et de consoles</li>
              <li>Notifications</li>
              <li>Discussion et évaluation</li>
              <li>Suivi de transactions</li>
            </ul>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center">
            <h3 className="text-[#FF6B35] font-bold mb-4 text-lg">Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li>Formulaire</li>
              <li>+213 (0) 23 22 65 75</li>
              <li>Contact@gamesooq.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 flex justify-between text-gray-400 text-sm">
          <p>© 2025 Gamesooq - Tous droits réservés</p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleOpenModal(catalogueRules)}
              className="text-gray-300 hover:text-white underline"
            >
              Règles du catalogue
            </button>
            <button
              onClick={() => handleOpenModal(communityRules)}
              className="text-gray-300 hover:text-white underline"
            >
              Règles de la communauté
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#1E1E2E] p-6 rounded-lg max-w-2xl w-full text-left text-gray-300 overflow-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Règles</h2>
            <p className="whitespace-pre-line">{modalContent}</p>
            <button
              className="mt-4 text-red-500 hover:underline"
              onClick={handleCloseModal}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
