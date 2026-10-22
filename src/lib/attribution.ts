/**
 * De qual anúncio a pessoa veio — o que o Utmify faz, feito aqui.
 *
 * O Meta põe no link do anúncio as UTMs (o ideal é configurar com os ids:
 * `utm_campaign={{campaign.id}}&utm_term={{adset.id}}&utm_content={{ad.id}}`) e o `fbclid`
 * do clique. Guardamos isso na chegada, porque a pessoa pode recarregar ou voltar depois
 * pelo histórico já sem os parâmetros, e mandamos junto com a lead. O CRM guarda tudo em
 * `raw`, onde dá para cruzar lead → anúncio → gasto → venda.
 *
 * `fbc`/`fbp` são os cookies do Pixel. Não servem para relatório: servem para quando o CRM
 * avisar o Meta de uma etapa mais à frente (agendou, comprou), o Meta saber que é a mesma
 * pessoa do clique.
 *
 * Os nomes das chaves precisam bater com a lista em `site-lead.ts` do CRM; uma chave fora
 * da lista é descartada lá sem erro.
 */

const STORAGE_KEY = 'integrallys_attribution';
/** Janela de clique padrão do Meta. Depois disso o clique já não conta como do anúncio. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const URL_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid'] as const;

type Stored = { at: number; params: Record<string, string> };

/**
 * Chamar no carregamento da página. Só regrava quando a URL traz algum parâmetro: assim um
 * clique novo em outro anúncio substitui o antigo, e uma visita sem parâmetro não apaga nada.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  const search = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  for (const key of URL_PARAMS) {
    const value = search.get(key)?.trim();
    if (value) params[key] = value.slice(0, 200);
  }
  if (Object.keys(params).length === 0) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), params } satisfies Stored));
  } catch {
    // Navegação privada ou armazenamento bloqueado: segue sem, a lead entra do mesmo jeito.
  }
}

function readStored(): Stored | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Stored | null;
    if (!parsed || typeof parsed.at !== 'number' || Date.now() - parsed.at > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function cookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Os campos para juntar ao corpo da lead. Vazio quando a pessoa não veio de anúncio. */
export function attributionFields(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const stored = readStored();
  const fields: Record<string, string> = { ...(stored?.params ?? {}) };

  const fbp = cookie('_fbp');
  if (fbp) fields.fbp = fbp;

  // O Pixel cria o `_fbc` sozinho a partir do `fbclid`. Se ele foi bloqueado, montamos no
  // formato que o Meta documenta: fb.1.<hora do clique em ms>.<fbclid>.
  const fbc = cookie('_fbc') ?? (stored?.params.fbclid ? `fb.1.${stored.at}.${stored.params.fbclid}` : undefined);
  if (fbc) fields.fbc = fbc;

  return fields;
}
