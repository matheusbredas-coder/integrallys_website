import { Instagram, Facebook, Phone } from 'lucide-react';
import logoImg from '../assets/images/logo.jpg';
import { WHATSAPP_URL } from '../lib/constants';
import { protocols } from '../data/protocols';

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/integrallys/', icon: <Instagram size={18} /> },
  { name: 'WhatsApp', href: WHATSAPP_URL, icon: <Phone size={18} /> },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100066375682865', icon: <Facebook size={18} /> },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
            <img src={logoImg} alt="Integrallys Logo" className="w-20 h-20 object-contain mb-4" />
            <h2 className="text-3xl font-bold font-serif italic mb-2 italic-small tracking-tight">Integrallys Estética</h2>
            <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">Beleza, Ciência e Harmonia</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 mb-12">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-600">Protocolos</span>
          {protocols.map((protocol) => (
            <a
              key={protocol.slug}
              href={`/protocolos/${protocol.slug}/`}
              className="text-slate-300 hover:text-brand-gold transition-colors text-sm font-medium"
            >
              {protocol.name}
            </a>
          ))}
        </div>

        <div className="flex gap-10 mb-12">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Integrallys no ${social.name}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-[0.2em]"
            >
               {social.icon}
               {social.name}
            </a>
          ))}
        </div>

        <div className="w-full border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-widest gap-6">
          <div>© {new Date().getFullYear()} Integrallys Estética Avançada. Todos os direitos reservados.</div>
          <div className="flex gap-8">
            <a href="/privacidade.html" className="hover:text-white transition-colors">Privacidade</a>
          </div>
          <div className="text-nowrap">Desenvolvido com sofisticação</div>
        </div>
      </div>
    </footer>
  );
};
