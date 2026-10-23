/**
 * Meta Pixel — carregado só na página do quiz.
 *
 * Mesmo esquema do GA4 em `analytics.ts`: o id entra no BUILD por `VITE_META_PIXEL_ID` e é
 * público por natureza. Sem a variável nada é carregado e as chamadas viram no-op, então
 * um teste local não manda evento nenhum para o Meta.
 *
 * Só a lead quente dispara `Lead`. É nele que a campanha otimiza, então disparar para
 * quem mora longe ou não tem orçamento ensinaria o Meta a trazer mais gente assim.
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: Fbq;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let started = false;

/** O snippet oficial do Meta, reescrito sem o IIFE minificado. */
export function initPixel(): void {
  if (started || !PIXEL_ID || typeof window === 'undefined') return;
  started = true;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(tag);
  }

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

/**
 * Correspondência avançada manual: diz ao Pixel quem é a pessoa ANTES do `Lead`, para o Meta
 * ligar o evento a uma conta e aprender com ela. Sem isso o `Lead` chega só com cookie, e no
 * navegador do Instagram muitas vezes nem isso. O próprio Pixel embaralha (SHA-256) antes de
 * enviar; o formato esperado é minúsculo, sem acento nem espaço, telefone com o 55.
 */
export function identifyPixelUser(user: { phone: string; name: string; city?: string }): void {
  if (!PIXEL_ID || !window.fbq) return;
  const clean = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
  const [first = '', ...rest] = user.name.trim().split(/\s+/);
  const data: Record<string, string> = { ph: `55${user.phone}`, fn: clean(first), country: 'br', st: 'es' };
  const last = rest.length ? clean(rest[rest.length - 1]) : '';
  if (last) data.ln = last;
  const city = user.city ? clean(user.city) : '';
  if (city) data.ct = city;
  window.fbq('init', PIXEL_ID, data);
}

/**
 * Evento padrão do Meta (`Lead`, `CompleteRegistration`…). `eventID` é a chave de
 * desduplicação: o mesmo id duas vezes conta uma vez só.
 */
export function trackPixel(event: string, params: Record<string, unknown> = {}, eventID?: string): void {
  if (!PIXEL_ID || !window.fbq) return;
  if (eventID) window.fbq('track', event, params, { eventID });
  else window.fbq('track', event, params);
}

/** Evento próprio (`QuizForaDaArea`): serve para relatório e público de exclusão. */
export function trackPixelCustom(event: string, params: Record<string, unknown> = {}): void {
  if (!PIXEL_ID || !window.fbq) return;
  window.fbq('trackCustom', event, params);
}
