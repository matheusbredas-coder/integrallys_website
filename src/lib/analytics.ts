/**
 * Google Analytics 4.
 *
 * O site é estático e servido por nginx, então não há de onde ler configuração em tempo de
 * execução: o id de medição entra no bundle no momento do build, por
 * `VITE_GA4_MEASUREMENT_ID`. Ele é público por natureza (fica visível no HTML de qualquer
 * site que use GA4), então não há segredo aqui.
 *
 * Sem a variável, nada é carregado e `trackEvent` vira no-op — um build de desenvolvimento
 * não polui os números de produção, e o site funciona igual.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

type GtagArgs = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: GtagArgs[];
    gtag?: (...args: GtagArgs) => void;
  }
}

let started = false;

/** Carrega o gtag.js e registra o pageview. Chamar uma vez por entrada do site. */
export function initAnalytics(): void {
  if (started || !MEASUREMENT_ID) return;
  if (typeof window === "undefined") return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  // O gtag oficial empurra os `arguments` crus, não um array — daí não usar arrow function.
  window.gtag = function gtag(...args: GtagArgs) {
    window.dataLayer!.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(tag);
}

/**
 * Um evento nomeado. Silencioso quando o GA4 não está configurado ou ainda não carregou —
 * medir nunca pode ser motivo de um clique não funcionar.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
