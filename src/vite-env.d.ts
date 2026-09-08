/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Id de medição do GA4 ("G-XXXXXXXXXX"). Sem ele o site não mede nada. */
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  /** Webhook do n8n que recebe o formulário e o repassa ao CRM com o segredo. */
  readonly VITE_LEAD_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
