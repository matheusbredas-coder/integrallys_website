import type { ComponentType } from 'react';
import {
  CalendarCheck,
  CalendarDays,
  Search,
  Wallet,
  Gem,
  Crown,
  Coins,
} from 'lucide-react';
import type { CityId } from './grande-vitoria-map';
import gorduraImg from '../assets/images/quiz/gordura.png';
import flacidezImg from '../assets/images/quiz/flacidez.png';
import pesoImg from '../assets/images/quiz/peso.png';
import disposicaoImg from '../assets/images/quiz/disposicao.png';
import barrigaImg from '../assets/images/quiz/barriga.png';
import flancosImg from '../assets/images/quiz/flancos.png';
import bracosImg from '../assets/images/quiz/bracos.png';
import coxasImg from '../assets/images/quiz/coxas.png';
import rostoImg from '../assets/images/quiz/rosto.png';

export type OptionIcon = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

/**
 * Uma opção de resposta. `image` (desenho de traço com fundo transparente) substitui o
 * ícone quando existir.
 */
export type Option<V extends string> = {
  value: V;
  label: string;
  icon?: OptionIcon;
  image?: string;
};

export type Incomodo = 'gordura' | 'flacidez' | 'peso' | 'disposicao';
export const INCOMODO: Option<Incomodo>[] = [
  // Desenhos recortados da referência de design que o Matheus aprovou, no azul do site.
  { value: 'gordura', label: 'Gordura localizada', image: gorduraImg },
  { value: 'flacidez', label: 'Flacidez', image: flacidezImg },
  { value: 'peso', label: 'Peso', image: pesoImg },
  { value: 'disposicao', label: 'Disposição', image: disposicaoImg },
];

export type Regiao = 'barriga' | 'flancos' | 'bracos' | 'coxas' | 'rosto';
export const REGIOES: Option<Regiao>[] = [
  // Mesma origem dos desenhos do passo 1: recortados da referência do Matheus.
  { value: 'barriga', label: 'Barriga', image: barrigaImg },
  { value: 'flancos', label: 'Flancos', image: flancosImg },
  { value: 'bracos', label: 'Braços', image: bracosImg },
  { value: 'coxas', label: 'Coxas e culote', image: coxasImg },
  { value: 'rosto', label: 'Rosto e papada', image: rostoImg },
];

export type Semanal = 'sim' | 'nao';

/**
 * Faixas definidas pelo Matheus. Só "até R$ 100" é lead fria. Na tela as quatro têm o
 * mesmo peso — nenhuma parece a resposta "errada".
 */
export type Verba = 'ate100' | '150a300' | '300a500' | 'mais500';
export const VERBAS: Option<Verba>[] = [
  { value: 'ate100', label: 'Até R$ 100', icon: Coins },
  { value: '150a300', label: 'R$ 150 a R$ 300', icon: Wallet },
  { value: '300a500', label: 'R$ 300 a R$ 500', icon: Gem },
  { value: 'mais500', label: 'Mais de R$ 500', icon: Crown },
];

export type Inicio = 'semana' | 'mes' | 'pesquisando';
export const INICIOS: Option<Inicio>[] = [
  { value: 'semana', label: 'Esta semana', icon: CalendarCheck },
  { value: 'mes', label: 'Este mês', icon: CalendarDays },
  { value: 'pesquisando', label: 'Só estou pesquisando', icon: Search },
];

/** As duas cidades atendidas sem perguntar nada: as outras caem na pergunta da semana. */
export const IN_AREA: ReadonlySet<CityId> = new Set<CityId>(['vila-velha', 'vitoria']);

export type Answers = {
  incomodo: Incomodo[];
  regioes: Regiao[];
  /** `null` = tocou em "Moro em outra cidade". */
  cidade?: CityId | null;
  semanal?: Semanal;
  verba?: Verba;
  inicio?: Inicio;
};

export type Tier = 'quente' | 'fria qualificada' | 'fria';

/**
 * Quem chega ao contato já passou pela área (ou topou vir toda semana). Daí:
 * - até R$ 100 por mês → "fria": não dispara `Lead`;
 * - orçamento ok, mas "só estou pesquisando" → "fria qualificada": DISPARA `Lead` (decisão do
 *   Matheus, 23/10 — ela se qualifica, só não tem pressa), e o CRM mostra a etiqueta para a
 *   equipe saber que não é para hoje;
 * - o resto → "quente".
 * "Fora" não tem tier: termina antes de pedir o contato.
 */
export function tierOf(a: Answers): Tier {
  if (a.verba === 'ate100') return 'fria';
  return a.inicio === 'pesquisando' ? 'fria qualificada' : 'quente';
}

/** Só "fria" fica de fora do `Lead` do Meta. */
export function firesLead(tier: Tier): boolean {
  return tier !== 'fria';
}

export type ProtocolSlug = 'emagrecimento-integrado' | 'rejuvenescimento-facial';

/** Só rosto/papada aponta para o facial; qualquer região do corpo, para o emagrecimento. */
export function protocolOf(a: Answers): { slug: ProtocolSlug; name: string } {
  const soRosto = a.regioes.length > 0 && a.regioes.every((r) => r === 'rosto');
  return soRosto
    ? { slug: 'rejuvenescimento-facial', name: 'Rejuvenescimento Facial' }
    : { slug: 'emagrecimento-integrado', name: 'Emagrecimento Integrado' };
}

/** Rótulo legível de uma resposta, para o CRM mostrar o texto e não o código. */
export function labelOf<V extends string>(options: Option<V>[], value: V | undefined): string {
  return options.find((o) => o.value === value)?.label ?? '';
}
