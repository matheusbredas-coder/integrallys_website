/**
 * Um `Lead` por pessoa. Três travas, da mais forte para a mais fraca:
 *
 * 1. O CRM responde `duplicate` quando o telefone já existe (ver `lead.ts`) — vale entre
 *    navegadores, é a principal.
 * 2. Este navegador já mandou um quiz nos últimos 30 dias → não dispara de novo, nem com
 *    OUTRO telefone. Fecha o truque de cair como fria, recarregar e escolher orçamento maior.
 * 3. `eventID` fixo por telefone: o Meta descarta um segundo `Lead` com o mesmo id.
 */

const SENT_KEY = 'integrallys_quiz_enviado';
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function sentFromThisBrowser(): boolean {
  try {
    const at = Number(localStorage.getItem(SENT_KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < WINDOW_MS;
  } catch {
    return false;
  }
}

export function markSentFromThisBrowser(): void {
  try {
    localStorage.setItem(SENT_KEY, String(Date.now()));
  } catch {
    // Sem armazenamento: sobram as travas 1 e 3.
  }
}

/**
 * Embaralhado (SHA-256), nunca o número em si: o `eventID` vai ao Meta em texto puro, ao
 * contrário dos dados de correspondência, que o Pixel embaralha sozinho.
 */
export async function leadEventId(nationalPhone: string): Promise<string | undefined> {
  try {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`lead:${nationalPhone}`));
    const hex = Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
    return `lead-${hex.slice(0, 32)}`;
  } catch {
    return undefined;
  }
}
