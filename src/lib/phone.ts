/**
 * Celular brasileiro que alguém atende: DDD que existe, o 9 que todo celular tem desde 2016,
 * e um número que não seja tecla repetida. A mesma regra mora em `site-lead.ts` do CRM, que
 * recusa o resto; checar aqui antes é o que deixa a pessoa ver o motivo e corrigir.
 *
 * Importa para o Meta: lead quente dispara o `Lead`, e um "(27) 99999-9999" ensinaria o
 * anúncio a procurar mais gente que digita número falso.
 */

const BR_DDDS = new Set(
  '11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '),
);

/** Só os 11 dígitos nacionais (DDD + número), sem o 55. */
export function nationalDigits(input: string): string {
  const digits = input.replace(/\D/g, '');
  return digits.length === 13 && digits.startsWith('55') ? digits.slice(2) : digits;
}

export function isValidBrMobile(input: string): boolean {
  const digits = nationalDigits(input);
  if (digits.length !== 11) return false;
  if (!BR_DDDS.has(digits.slice(0, 2)) || digits[2] !== '9') return false;
  const subscriber = digits.slice(3);
  if (/^(\d)\1+$/.test(subscriber)) return false;
  return subscriber !== '12345678' && subscriber !== '87654321';
}
