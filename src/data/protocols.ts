import type { LucideIcon } from 'lucide-react';
import { Sparkles, Layers, Syringe, Droplet, Flame, Waves, Gauge, Pill } from 'lucide-react';
// Imagens escolhidas por resolução: harmonizacao-facial.jpeg (275×183) e lipo.jpeg (300×168)
// são pequenas demais para os cards e ficariam borradas ao serem ampliadas.
import facialImg from '../assets/images/preenchimento-labial.jpg';
import emagrecimentoImg from '../assets/images/emagrecimento.webp';

/**
 * Fonte única de verdade dos dois protocolos da clínica.
 * A seção da home e as páginas de detalhe leem daqui, então a copy nunca diverge.
 *
 * Regra de negócio: NÃO exibir preços, valores de pacote ou preço por sessão.
 * A tabela de pacotes é usada apenas como roteiro do que precisa ser explicado.
 */

export interface ProtocolPillar {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ProtocolProcedure {
  name: string;
  /** O que o procedimento é / como funciona. */
  what: string;
  /** O que a paciente ganha com ele. */
  delivers: string;
}

export interface Protocol {
  slug: string;
  eyebrow: string;
  name: string;
  /** Blurb curto do card na home. */
  tagline: string;
  image: string;
  imageAlt: string;
  /** Gradiente do card — facial usa navy, corporal usa um tom mais quente. */
  cardGradient: string;
  pillars: ProtocolPillar[];
  intro: string;
  forWhom: string[];
  procedures: ProtocolProcedure[];
  journey: { step: string; detail: string }[];
  /** Intensidade do protocolo (nº de sessões). Sem preço. */
  tiers?: { title: string; body: string };
  faq: { q: string; a: string }[];
  whatsappMessage: string;
  seo: { title: string; description: string };
}

const rejuvenescimentoFacial: Protocol = {
  slug: 'rejuvenescimento-facial',
  eyebrow: 'Protocolo',
  name: 'Rejuvenescimento Facial',
  tagline: 'Realce sua beleza natural, suavize sinais do tempo e conquiste uma pele mais jovem, firme e radiante.',
  image: facialImg,
  imageAlt: 'Protocolo de rejuvenescimento facial na Integrallys Estética Avançada, Vila Velha - ES',
  cardGradient: 'from-brand-accent via-brand-accent/95 to-transparent',
  pillars: [
    {
      icon: Sparkles,
      title: 'Toxina Botulínica',
      desc: 'Suaviza rugas e linhas de expressão preservando a naturalidade do seu olhar.',
    },
    {
      icon: Layers,
      title: 'Bioestimulador de Colágeno',
      desc: 'Estimula a produção do próprio colágeno para uma pele mais firme e densa.',
    },
    {
      icon: Syringe,
      title: 'Microagulhamento com PDRN',
      desc: 'Regenera a pele em profundidade, melhorando textura, viço e cicatrizes.',
    },
    {
      icon: Droplet,
      title: 'Preenchimento',
      desc: 'Devolve volume e contorno onde o tempo levou, com proporção e harmonia.',
    },
  ],
  intro:
    'O Rejuvenescimento Facial da Integrallys não é um procedimento isolado — é um protocolo. Combinamos toxina botulínica, bioestimulação de colágeno, regeneração celular e preenchimento em uma sequência planejada, para que cada etapa potencialize a seguinte. O objetivo nunca é mudar o seu rosto: é devolver a ele firmeza, viço e frescor, mantendo a sua expressão intacta.',
  forWhom: [
    'Você começou a notar linhas de expressão na testa, entre as sobrancelhas ou ao redor dos olhos',
    'Sua pele perdeu firmeza, densidade ou aquele viço que tinha antes',
    'Você quer um resultado natural — nada de rosto “congelado” ou artificial',
    'Você já fez procedimentos pontuais, mas sente que falta um plano completo',
    'Você prefere um protocolo planejado a tratamentos avulsos e sem sequência',
  ],
  procedures: [
    {
      name: 'Botox — Terço Superior ou Full Face',
      what:
        'Aplicação de toxina botulínica nos músculos responsáveis pelas linhas de expressão. O terço superior trata testa, glabela (entre as sobrancelhas) e pés de galinha. A versão full face amplia a cobertura para o rosto inteiro, incluindo linhas do nariz, sorriso gengival e contorno mandibular.',
      delivers:
        'Rugas dinâmicas suavizadas em poucos dias, com movimento natural preservado. A cobertura ideal é definida na avaliação, de acordo com a força da sua musculatura e o resultado que você deseja.',
    },
    {
      name: 'Bioestimulador de Colágeno',
      what:
        'Substância injetável que atua como um estímulo controlado: em vez de preencher, ela induz o seu próprio organismo a produzir colágeno novo ao longo das semanas seguintes.',
      delivers:
        'Ganho gradual de firmeza, densidade e sustentação da pele. O resultado se constrói progressivamente, o que o torna especialmente discreto — as pessoas notam que você está bem, sem saber exatamente o porquê.',
    },
    {
      name: 'Microagulhamento com PDRN',
      what:
        'Microagulhas criam canais de estímulo na pele e, por eles, aplicamos PDRN — um ativo regenerador derivado de polinucleotídeos, conhecido pela ação reparadora e hidratante profunda.',
      delivers:
        'Melhora visível de textura, poros, cicatrizes de acne e qualidade geral da pele. É a etapa que dá o "brilho de pele saudável" ao protocolo, complementando o que a toxina e o bioestimulador fazem na estrutura.',
    },
    {
      name: 'Preenchimento com Ácido Hialurônico',
      what:
        'Aplicação precisa de ácido hialurônico para repor volume e redesenhar contornos — lábios, olheiras, malar ou mandíbula, conforme a sua anatomia e o planejamento.',
      delivers:
        'Volume e definição restaurados no mesmo dia, respeitando as proporções do seu rosto. Trabalhamos sempre em direção ao equilíbrio, não ao excesso.',
    },
  ],
  journey: [
    {
      step: 'Avaliação sem custo',
      detail:
        'Conversamos sobre o que te incomoda e o que você espera. Analisamos sua pele, sua anatomia e sua rotina antes de qualquer indicação.',
    },
    {
      step: 'Plano personalizado',
      detail:
        'Definimos quais etapas do protocolo fazem sentido para você, em qual ordem e em qual intensidade. Nada é vendido em pacote fechado sem avaliação.',
    },
    {
      step: 'Aplicação',
      detail:
        'Procedimentos realizados em ambiente clínico, com anestésico tópico e agulhas finas. O desconforto é mínimo e o retorno às atividades é imediato.',
    },
    {
      step: 'Acompanhamento',
      detail:
        'Retorno para avaliar a evolução e ajustar o que for necessário. Os resultados são acompanhados ao longo do tempo, não entregues e esquecidos.',
    },
  ],
  faq: [
    {
      q: 'O procedimento dói?',
      a: 'A aplicação é feita com agulhas extremamente finas e utilizamos anestésico tópico, tornando o desconforto mínimo e totalmente suportável.',
    },
    {
      q: 'Em quanto tempo vejo o resultado?',
      a: 'A toxina botulínica começa a agir em poucos dias, com efeito pleno em cerca de 15 dias. O preenchimento é visível imediatamente. Já o bioestimulador e o microagulhamento trabalham de forma progressiva, com resultado se construindo ao longo das semanas.',
    },
    {
      q: 'Vou ficar com o rosto artificial?',
      a: 'Não. O protocolo é planejado justamente para o oposto: preservar a sua expressão. Trabalhamos com doses e pontos calculados para o seu rosto, buscando naturalidade — esse é o nosso critério de sucesso.',
    },
    {
      q: 'Posso voltar a trabalhar no mesmo dia?',
      a: 'Sim. A maioria dos procedimentos permite retorno imediato às atividades sociais, com apenas algumas recomendações básicas nas primeiras horas.',
    },
    {
      q: 'Preciso fazer todas as etapas do protocolo?',
      a: 'Não necessariamente. O protocolo completo entrega o melhor resultado porque as etapas se complementam, mas o plano final é montado na avaliação, de acordo com a sua necessidade e o seu momento.',
    },
  ],
  whatsappMessage:
    'Olá! Vim pelo site e gostaria de saber mais sobre o protocolo de Rejuvenescimento Facial.',
  seo: {
    title: 'Protocolo de Rejuvenescimento Facial — Integrallys Estética Avançada, Vila Velha ES',
    description:
      'Protocolo completo de rejuvenescimento facial em Vila Velha (ES): toxina botulínica, bioestimulador de colágeno, microagulhamento com PDRN e preenchimento. Avaliação inicial sem custo.',
  },
};

const emagrecimentoIntegrado: Protocol = {
  slug: 'emagrecimento-integrado',
  eyebrow: 'Protocolo',
  name: 'Emagrecimento Integrado',
  tagline: 'Tratamento completo e personalizado para perda de peso saudável, definição do corpo e mais disposição.',
  image: emagrecimentoImg,
  imageAlt: 'Protocolo de emagrecimento integrado na Integrallys Estética Avançada, Vila Velha - ES',
  cardGradient: 'from-[#3a2f24] via-[#3a2f24]/95 to-transparent',
  pillars: [
    {
      icon: Flame,
      title: 'Lipo Enzimática',
      desc: 'Reduz gordura localizada sem cirurgia e sem tempo de recuperação.',
    },
    {
      icon: Waves,
      title: 'Radiofrequência com Drenagem',
      desc: 'Trata flacidez e celulite enquanto elimina líquidos retidos.',
    },
    {
      icon: Gauge,
      title: 'Acelerador Metabólico',
      desc: 'Ativa o metabolismo para que seu corpo queime gordura com mais eficiência.',
    },
    {
      icon: Pill,
      title: 'Vitaminas B12 e D',
      desc: 'Repõe o que falta para sustentar energia, disposição e resultado.',
    },
  ],
  intro:
    'Emagrecer não é só perder número na balança. O Emagrecimento Integrado da Integrallys trata o corpo por inteiro: reduz a gordura localizada, cuida da flacidez e da retenção que aparecem no caminho, acelera o metabolismo e repõe o que o seu organismo precisa para sustentar o resultado. É um protocolo de sessões — porque transformação real acontece em sequência, não em uma visita.',
  forWhom: [
    'Você tem gordura localizada que não sai com dieta e treino',
    'Você já emagreceu antes, mas o peso sempre volta',
    'Além do peso, te incomodam a celulite, a flacidez ou o inchaço',
    'Você sente cansaço e falta de disposição no dia a dia',
    'Você quer um plano acompanhado por profissionais, não uma solução milagrosa',
  ],
  procedures: [
    {
      name: 'Lipo Enzimática',
      what:
        'Aplicação de enzimas que atuam diretamente na quebra das células de gordura nas áreas tratadas — abdômen, flancos, culote, braços ou papada. Sem cortes, sem anestesia geral e sem afastamento.',
      delivers:
        'Redução progressiva de medidas e da gordura localizada, sessão após sessão, com contorno corporal mais definido nas regiões trabalhadas.',
    },
    {
      name: 'Radiofrequência com Drenagem Linfática',
      what:
        'A radiofrequência aquece as camadas profundas da pele e estimula colágeno; a drenagem manual, na sequência, mobiliza a linfa e elimina os líquidos retidos.',
      delivers:
        'Pele mais firme, aparência de celulite reduzida e menos inchaço. É a dupla que garante que o corpo não fique flácido conforme as medidas diminuem.',
    },
    {
      name: 'Acelerador Metabólico',
      what:
        'Protocolo aplicado para estimular o metabolismo, favorecendo a mobilização das reservas de gordura e o aproveitamento energético pelo organismo.',
      delivers:
        'O corpo passa a trabalhar a favor do tratamento, potencializando o efeito das demais etapas e ajudando a sustentar o resultado no médio prazo.',
    },
    {
      name: 'Vitaminas Injetáveis — B12 e D',
      what:
        'Reposição vitamínica aplicada em sessões ao longo do protocolo. A B12 participa do metabolismo energético; a vitamina D atua em funções amplas do organismo, da imunidade ao desempenho muscular.',
      delivers:
        'Mais energia e disposição para acompanhar o processo. Quem se sente bem mantém a rotina — e é a rotina mantida que consolida o emagrecimento.',
    },
    {
      name: 'Massagem Relaxante com Ventosa',
      what:
        'Terapia por sucção que mobiliza tecidos, estimula a circulação local e libera tensões musculares acumuladas.',
      delivers:
        'Melhora da circulação nas áreas tratadas, alívio de tensão e uma pausa de bem-estar dentro do protocolo. Emagrecer também depende de reduzir o estresse.',
    },
  ],
  journey: [
    {
      step: 'Avaliação sem custo',
      detail:
        'Entendemos seu histórico, sua rotina e seus objetivos. Avaliamos as áreas que te incomodam antes de propor qualquer plano.',
    },
    {
      step: 'Protocolo montado para você',
      detail:
        'Definimos quais etapas entram, quais áreas serão tratadas e em qual intensidade o protocolo será conduzido.',
    },
    {
      step: 'Sessões acompanhadas',
      detail:
        'As sessões seguem um calendário definido, sempre em ambiente clínico e com a mesma equipe acompanhando a sua evolução.',
    },
    {
      step: 'Resultado sustentado',
      detail:
        'Medidas e evolução são acompanhadas ao longo do protocolo, com ajustes de rota e orientações para manter o que foi conquistado.',
    },
  ],
  tiers: {
    title: 'Protocolos de 5 ou 10 sessões',
    body:
      'O Emagrecimento Integrado é conduzido em duas intensidades. A versão de 5 sessões funciona bem para objetivos mais pontuais e para quem quer começar. A de 10 sessões é indicada quando a meta é uma transformação mais ampla, com mais tempo de estímulo em cada etapa. Qual delas faz sentido para você é definido na avaliação — junto com as áreas a tratar e as etapas que entram no seu plano.',
  },
  faq: [
    {
      q: 'A lipo enzimática substitui a lipoaspiração?',
      a: 'Não. São procedimentos diferentes. A lipo enzimática é um tratamento estético não cirúrgico, feito em sessões, indicado para gordura localizada — não para grandes volumes. A vantagem é não exigir cirurgia, anestesia geral nem afastamento das atividades.',
    },
    {
      q: 'Em quantas sessões começo a ver resultado?',
      a: 'A maioria das pacientes percebe diferença nas medidas e na disposição já nas primeiras semanas do protocolo. Como o tratamento é progressivo, o resultado se acumula ao longo das sessões.',
    },
    {
      q: 'Preciso fazer dieta durante o protocolo?',
      a: 'O protocolo funciona melhor quando acompanhado de bons hábitos alimentares e atividade física. Na avaliação orientamos o que faz sentido no seu caso — o tratamento potencializa o seu esforço, não o substitui.',
    },
    {
      q: 'As sessões doem?',
      a: 'O desconforto é leve e passageiro. A radiofrequência e a drenagem são confortáveis, e as aplicações injetáveis usam agulhas finas. Todas as sessões são conduzidas em ambiente clínico.',
    },
    {
      q: 'O peso volta depois que o protocolo termina?',
      a: 'O protocolo entrega a transformação e as orientações para mantê-la. A manutenção depende dos hábitos que você leva daqui — e é exatamente por isso que trabalhamos metabolismo e disposição, e não apenas gordura localizada.',
    },
  ],
  whatsappMessage:
    'Olá! Vim pelo site e gostaria de saber mais sobre o protocolo de Emagrecimento Integrado.',
  seo: {
    title: 'Protocolo de Emagrecimento Integrado — Integrallys Estética Avançada, Vila Velha ES',
    description:
      'Protocolo de emagrecimento em Vila Velha (ES): lipo enzimática, radiofrequência com drenagem, acelerador metabólico, vitaminas B12 e D e ventosa. Avaliação inicial sem custo.',
  },
};

export const protocols: Protocol[] = [rejuvenescimentoFacial, emagrecimentoIntegrado];

export { rejuvenescimentoFacial, emagrecimentoIntegrado };
