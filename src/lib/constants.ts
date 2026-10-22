export const WHATSAPP_URL = 'https://wa.me/5527999687380';

/** Google Business Profile (CID da ficha verificada da clínica). */
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps?cid=13605826652762968961';

export const PHONE_DISPLAY = '(27) 99968-7380';

/** Abre o WhatsApp da clínica com uma mensagem já preenchida. */
export const whatsappLink = (message: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

/**
 * Quem liga para a lead que termina o quiz (/avaliacao). Aparece na tela final para a pessoa
 * reconhecer a ligação — trocou a recepcionista ou o celular, troque aqui.
 */
export const RECEPTION_NAME = 'Gabriela';
export const RECEPTION_PHONE_DISPLAY = '(28) 99967-6542';
