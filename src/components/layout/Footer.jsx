import { 
    FaFacebook, 
    FaInstagram, 
    FaTwitter, 
    FaYoutube 
  } from "react-icons/fa";
  import header_icon from "../../assets/icons/header_icon.png";


function Footer() {
  return (
    <footer className="bg-[#171721] text-white py-12 font-poppins">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-6 text-left">
            <img
              src={header_icon || "/placeholder.svg"}
              alt="Logo"
              className="w-36 block mx-0"
            />
            </div>
            <p className="text-gray-300 mb-6 text-sm text-left">
              GameSooq est une marketplace dédiée aux gamers en Algérie pour acheter, vendre et échanger des jeux vidéo
              et des consoles en toute simplicité et sécurité. Connectez-vous avec d'autres joueurs et trouvez les
              meilleures offres près de chez vous !
            </p>
            <div className="flex justify-left space-x-4 mb-6">
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaFacebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <FaYoutube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm">© 2025 Gamesooq - Tous Droits Réservés</p>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center">
            <h3 className="text-[#FF6B35] font-bold mb-4 text-lg">Caractéristiques</h3>
            <ul className="space-y-2 text-sm">
              <li>Interfaces convivial</li>
              <li>Rapidité et Performance</li>
              <li>Sécurité et Fiabilité</li>
            </ul>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center">
            <h3 className="text-[#FF6B35] font-bold mb-4 text-lg ">Fonctionnalités</h3>
            <ul className="space-y-2 text-sm">
              <li>Jeux et consoles</li>
              <li>Notifications</li>
              <li>Discussion et evaluation</li>
              <li>Suivi de transactions</li>
            </ul>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center">
            <h3 className="text-[#FF6B35] font-bold mb-4 text-lg ">Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li>Formulaire</li>
              <li>+213 (0) 23 22 65 75</li>
              <li>Contact@gamesooq.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

