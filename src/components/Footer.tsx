
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">LocaSimple</h3>
            <p className="text-sm mb-4">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('pages')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">{t('home')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">{t('about')}</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">{t('pricing')}</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">{t('categories')}</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">{t('search')}</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('support')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">{t('faq')}</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">{t('help')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">{t('contactUs')}</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">{t('termsConditions')}</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('contact')}</h3>
            <address className="not-italic text-sm space-y-2">
              <p>LocaSimple</p>
              <p>15 avenue des Champs-Élysées</p>
              <p>75008 Paris, France</p>
              <a href="mailto:contact@locasimple.com" className="hover:text-white transition-colors flex items-center mt-2">
                <Mail className="h-4 w-4 mr-2" />
                contact@locasimple.com
              </a>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} LocaSimple. {t('allRightsReserved')}
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              {t('termsConditions')}
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              {t('privacyPolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
