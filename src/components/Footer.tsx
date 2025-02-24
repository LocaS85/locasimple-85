
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">À propos</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-gray-300">À propos de nous</Link></li>
              <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-gray-300">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-300">Politique de confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Menu</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:text-gray-300">S'inscrire</Link></li>
              <li><Link to="/login" className="hover:text-gray-300">Se connecter</Link></li>
              <li><Link to="/logout" className="hover:text-gray-300">Se déconnecter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-gray-300">Twitter</a>
              <a href="#" className="hover:text-gray-300">Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} LocaSimple. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
