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

/** Evento padrão do Meta (`Lead`, `CompleteRegistration`…). */
export function trackPixel(event: string, params: Record<string, unknown> = {}): void {
  if (!PIXEL_ID || !window.fbq) return;
  window.fbq('track', event, params);
}

/** Evento próprio (`QuizForaDaArea`): serve para relatório e público de exclusão. */
export function trackPixelCustom(event: string, params: Record<string, unknown> = {}): void {
  if (!PIXEL_ID || !window.fbq) return;
  window.fbq('trackCustom', event, params);
}
