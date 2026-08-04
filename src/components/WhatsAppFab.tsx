import { Phone } from 'lucide-react';
import { whatsappLink } from '../lib/constants';

interface WhatsAppFabProps {
  /** Mensagem pré-preenchida. Cada página passa a sua para o lead chegar já contextualizado. */
  message?: string;
}

export const WhatsAppFab = ({
  message = 'Olá! Gostaria de saber mais sobre os protocolos da Integrallys.',
}: WhatsAppFabProps) => (
  <a
    href={whatsappLink(message)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar com a Integrallys no WhatsApp"
    className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 transition-transform active:scale-95"
  >
    <Phone size={32} />
  </a>
);
