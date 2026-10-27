import { Sparkles, ThumbsUp } from 'lucide-react';
import type { CityId } from './grande-vitoria-map';
import type { Inicio, Option, Semanal } from './questions';
import testaImg from '../assets/images/quiz/testa.jpg';
import glabelaImg from '../assets/images/quiz/glabela.jpg';
import olhosImg from '../assets/images/quiz/olhos.jpg';
import narizImg from '../assets/images/quiz/nariz.jpg';

/**
 * Quiz do rosto (/avaliacao-rosto), para os anúncios de toxina. Mesma ideia do quiz do corpo,
 * mas sem a pergunta de quanto a pessoa quer investir (decisão do Matheus, 27/10): o preço
 * da toxina é conhecido, e quem chega aqui já veio de um anúncio de rosto.
 */

/** As 4 áreas do pacote de toxina. Fotos escolhidas pelo Matheus (27/10). */
export type AreaRosto = 'testa' | 'glabela' | 'olhos' | 'nariz';
export const AREAS_ROSTO: Option<AreaRosto>[] = [
  { value: 'testa', label: 'Linhas da testa', image: testaImg, photo: true },
  { value: 'glabela', label: 'Entre as sobrancelhas', image: glabelaImg, photo: true },
  { value: 'olhos', label: 'Ao redor dos olhos', image: olhosImg, photo: true },
  { value: 'nariz', label: 'Linhas do nariz', image: narizImg, photo: true },
];

export type JaFez = 'sim' | 'nao';
export const JA_FEZ: Option<JaFez>[] = [
  { value: 'sim', label: 'Sim, já fiz', icon: ThumbsUp },
  { value: 'nao', label: 'Nunca fiz', icon: Sparkles },
];

export type RostoAnswers = {
  areas: AreaRosto[];
  jaFez?: JaFez;
  /** `null` = tocou em "Moro em outra cidade". */
  cidade?: CityId | null;
  semanal?: Semanal;
  inicio?: Inicio;
};

export type RostoTier = 'quente' | 'fria qualificada';

/**
 * Sem a pergunta do orçamento, ninguém que chega ao contato é "fria": todo mundo dispara o
 * `Lead`. "Só estou pesquisando" vira "fria qualificada", igual ao quiz do corpo, para a
 * equipe saber que não é para hoje.
 */
export function rostoTierOf(a: RostoAnswers): RostoTier {
  return a.inicio === 'pesquisando' ? 'fria qualificada' : 'quente';
}

/** O protocolo facial que já existe no site. Não dizer "Botox": é marca de remédio de receita. */
export const ROSTO_PROTOCOL = { slug: 'rejuvenescimento-facial', name: 'Rejuvenescimento Facial' } as const;
