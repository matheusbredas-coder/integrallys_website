/**
 * Envio do formulário de contato.
 *
 * O destino é um webhook do n8n, e NÃO a rota do CRM diretamente: a rota exige o
 * FORM_LEADS_SECRET, e qualquer segredo colocado aqui iria junto no bundle, à vista de
 * quem abrir o site. O n8n guarda o segredo e repassa — é o mesmo caminho que as leads do
 * Meta já percorrem hoje.
 */

const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined;

export type LeadPayload = {
  nome: string;
  whatsapp: string;
  protocolo: string;
  mensagem: string;
  /** Campo-armadilha: fica escondido, então só um robô preenche. */
  website: string;
};

export type LeadResult = { ok: true } | { ok: false; reason: "spam" | "config" | "network" };

/**
 * Os rótulos vão em português porque é assim que o CRM os reconhece: ele normaliza a chave
 * e compara com a lista de apelidos em `form-leads/mapping.ts` ("nome completo" → name,
 * "whatsapp" → phone). Renomear uma chave aqui faz o campo cair só no `raw`, sem erro
 * nenhum — o lead entra, mas com a coluna vazia no quadro.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  // Robô que preencheu a armadilha: respondemos sucesso e não enviamos nada, para ele não
  // ficar tentando outra vez com outro preenchimento.
  if (payload.website.trim() !== "") return { ok: true };

  if (!WEBHOOK_URL) return { ok: false, reason: "config" };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "site_form",
        protocolo: payload.protocolo,
        "Nome completo": payload.nome,
        WhatsApp: payload.whatsapp,
        "Nome do formulário": "Site — formulário de contato",
        "Protocolo de interesse": payload.protocolo,
        Mensagem: payload.mensagem,
        submitted_at: new Date().toISOString(),
      }),
    });
    return res.ok ? { ok: true } : { ok: false, reason: "network" };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export type QuizLeadPayload = {
  nome: string;
  whatsapp: string;
  protocolo: string;
  /** "quente" ou "fria" — o CRM guarda em `raw`, e é por ele que a equipe prioriza. */
  qualificacao: string;
  /** Cada resposta do quiz, já com o texto que a pessoa viu, rótulo → resposta. */
  respostas: Record<string, string>;
  website: string;
};

/**
 * Envio do quiz de qualificação (/avaliacao). Mesmo webhook do formulário de contato, com
 * `source: "site_quiz"`. As respostas vão como colunas soltas: o CRM não reconhece esses
 * rótulos, e por isso mesmo guarda cada um em `raw`, onde a equipe lê.
 */
export async function submitQuizLead(payload: QuizLeadPayload): Promise<LeadResult> {
  if (payload.website.trim() !== "") return { ok: true };

  if (!WEBHOOK_URL) return { ok: false, reason: "config" };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "site_quiz",
        protocolo: payload.protocolo,
        "Nome completo": payload.nome,
        WhatsApp: payload.whatsapp,
        "Nome do formulário": "Site — quiz de avaliação",
        "Protocolo de interesse": payload.protocolo,
        Qualificação: payload.qualificacao,
        ...payload.respostas,
        submitted_at: new Date().toISOString(),
      }),
    });
    return res.ok ? { ok: true } : { ok: false, reason: "network" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
