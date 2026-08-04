import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Menu, X } from 'lucide-react';
import logoImg from '../assets/images/logo.jpg';
import { PHONE_DISPLAY, whatsappLink } from '../lib/constants';

// Âncoras absolutas: o mesmo Navbar é usado na home e nas páginas de protocolo.
const navLinks = [
  { name: 'Protocolos', href: '/#protocolos' },
  { name: 'A clínica', href: '/#about' },
  { name: 'Resultados', href: '/#results' },
  { name: 'Contato', href: '/#contact' },
];

const AGENDAR_MESSAGE = 'Olá! Gostaria de agendar uma avaliação na Integrallys.';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
           <img src={logoImg} alt="Integrallys Logo" className="w-12 h-12 object-contain" />
           <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-tight">Integrallys</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Estética Avançada</span>
           </div>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium hover:text-brand-accent transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-muted">
            <Phone size={16} className="text-brand-accent" />
            <span>{PHONE_DISPLAY}</span>
          </div>
          <a
            href={whatsappLink(AGENDAR_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-accent text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-slate-200"
          >
            Agendar Consulta
          </a>
        </div>

        <button
          className="md:hidden text-slate-900 p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t md:hidden flex flex-col p-6 gap-4"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-serif py-2">
                {link.name}
              </a>
            ))}
            <hr />
            <a
              href={whatsappLink(AGENDAR_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-accent text-white w-full py-4 rounded-xl font-semibold text-center"
            >
              Agendar Agora
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
