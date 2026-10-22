import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, CalendarCheck, CheckCircle, Clock, Gift, Heart, MapPin, Phone, UserPlus, X } from 'lucide-react';
import logoImg from '../assets/images/logo.jpg';
import heroImg from '../assets/images/emagrecimento.webp';
import { trackEvent } from '../lib/analytics';
import { trackPixel, trackPixelCustom } from '../lib/pixel';
import { submitQuizLead } from '../lib/lead';
import { RECEPTION_NAME, RECEPTION_PHONE_DISPLAY, whatsappLink } from '../lib/constants';
import { CityMap } from './CityMap';
import { CITIES, type CityId } from './grande-vitoria-map';
import {
  IN_AREA,
  INCOMODO,
  INICIOS,
  REGIOES,
  VERBAS,
  labelOf,
  protocolOf,
  tierOf,
  type Answers,
  type Option,
  type Semanal,
} from './questions';
import { BackButton, ContinueButton, OptionCircle, OptionGrid, ProgressFooter, QuestionHeader, Stepper } from './ui';

type Screen =
  | 'capa'
  | 'incomodo'
  | 'regioes'
  | 'cidade'
  | 'semanal'
  | 'verba'
  | 'inicio'
  | 'contato'
  | 'fimQuente'
  | 'fimFria'
  | 'fimFora';

/** Número da etapa no topo. "semanal" é um desvio da etapa 3, não uma etapa nova. */
const STEP_OF: Partial<Record<Screen, number>> = {
  incomodo: 1,
  regioes: 2,
  cidade: 3,
  semanal: 3,
  verba: 4,
  inicio: 5,
  contato: 6,
};

const SEMANAL: Option<Semanal>[] = [
  { value: 'sim', label: 'Sim, consigo', icon: CalendarCheck },
  { value: 'nao', label: 'Não consigo', icon: X },
];

const cityName = (id: CityId | null | undefined) =>
  id ? CITIES.find((c) => c.id === id)!.name : 'Outra cidade';

/** (27) 99999-9999 enquanto a pessoa digita. */
function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

/**
 * A Gabriela liga em até 10 minutos, mas só em horário comercial: seg. a sex., 9h às 19h,
 * no horário de Brasília (vale para quem abre o quiz de qualquer fuso). Fora disso a tela
 * promete o próximo expediente em vez de deixar a pessoa esperando à noite.
 */
function isBusinessHours(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);
  const day = parts.find((p) => p.type === 'weekday')?.value;
  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  return day !== 'Sat' && day !== 'Sun' && hour >= 9 && hour < 19;
}

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

/**
 * Só em desenvolvimento (`npm run dev`): `?tela=fimQuente&nome=Maria` abre direto numa tela
 * (`&fora` simula fora do horário comercial), para revisar as telas finais sem preencher o quiz. No build de produção `import.meta.env.DEV`
 * é falso e isto some do código.
 */
function devStart(): { screen: Screen; nome: string; foraDoHorario: boolean } | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const tela = q.get('tela') as Screen | null;
  return tela ? { screen: tela, nome: q.get('nome') ?? '', foraDoHorario: q.has('fora') } : null;
}

export function Quiz() {
  const [history, setHistory] = useState<Screen[]>(() => {
    const dev = devStart();
    return dev ? ['capa', dev.screen] : ['capa'];
  });
  const screen = history[history.length - 1];
  const [answers, setAnswers] = useState<Answers>({ incomodo: [], regioes: [] });
  const [contact, setContact] = useState(() => ({ nome: devStart()?.nome ?? '', whatsapp: '', website: '' }));
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  const go = (next: Screen) => setHistory((h) => [...h, next]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((a) => ({ ...a, [key]: value }));

  // Uma tela vista = um evento no GA4: é o que mostra em qual pergunta as pessoas desistem.
  useEffect(() => {
    trackEvent('quiz_step', { step: screen });
  }, [screen]);

  const step = STEP_OF[screen];

  const afterCidade = () => go(answers.cidade && IN_AREA.has(answers.cidade) ? 'verba' : 'semanal');

  const afterSemanal = () => {
    if (answers.semanal === 'sim') return go('verba');
    trackPixelCustom('QuizForaDaArea', { cidade: cityName(answers.cidade) });
    trackEvent('quiz_fora_da_area', { cidade: cityName(answers.cidade) });
    go('fimFora');
  };

  const phoneDigits = contact.whatsapp.replace(/\D/g, '');
  const contactValid = contact.nome.trim().length >= 2 && phoneDigits.length >= 10;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactValid || status === 'sending') return;
    setStatus('sending');

    const tier = tierOf(answers);
    const protocol = protocolOf(answers);
    const result = await submitQuizLead({
      nome: contact.nome.trim(),
      whatsapp: contact.whatsapp,
      protocolo: protocol.slug,
      qualificacao: tier,
      website: contact.website,
      respostas: {
        'O que mais incomoda': answers.incomodo.map((v) => labelOf(INCOMODO, v)).join(', '),
        'Regiões': answers.regioes.map((r) => labelOf(REGIOES, r)).join(', '),
        Cidade: cityName(answers.cidade),
        'Vem toda semana': answers.semanal ? labelOf(SEMANAL, answers.semanal) : 'Mora na área',
        'Investimento por mês': labelOf(VERBAS, answers.verba),
        'Quando quer começar': labelOf(INICIOS, answers.inicio),
      },
    });

    if (!result.ok) {
      // A lead não pode morrer aqui: o erro oferece o WhatsApp da clínica.
      setStatus('error');
      return;
    }

    trackEvent('generate_lead', { method: 'quiz', qualificacao: tier, protocolo: protocol.slug });
    if (tier === 'quente') {
      trackPixel('Lead', { content_name: protocol.name });
      go('fimQuente');
    } else {
      trackPixelCustom('QuizLeadFria');
      go('fimFria');
    }
    setStatus('idle');
  };

  const firstName = contact.nome.trim().split(/\s+/)[0] ?? '';

  const body = (() => {
    switch (screen) {
      case 'capa':
        return (
          <div className="flex h-full min-h-0 flex-col gap-5 md:grid md:grid-cols-2 md:items-center md:gap-12">
            <img
              src={heroImg}
              alt=""
              className="min-h-0 w-full flex-1 rounded-3xl object-cover shadow-xl md:order-2 md:aspect-[4/5] md:flex-none"
            />
            <div className="shrink-0 text-center md:order-1 md:text-left">
              <div className="mb-3 flex items-center justify-center gap-2 md:mb-5 md:justify-start">
                <span className="h-px w-8 bg-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Avaliação em 1 minuto</span>
              </div>
              <h1 className="mb-3 font-serif text-3xl font-bold leading-[1.1] tracking-tight text-brand-accent md:mb-5 md:text-5xl">
                Descubra o protocolo ideal para o seu corpo
              </h1>
              <p className="mb-5 leading-snug text-brand-muted md:mb-8 md:text-lg md:leading-relaxed">
                Responda 6 perguntas rápidas e receba a indicação da equipe Integrallys feita para você.
              </p>
              <ContinueButton onClick={() => go('incomodo')}>Começar</ContinueButton>
            </div>
          </div>
        );

      case 'incomodo':
        return (
          <Question
            title="O que mais te incomoda hoje?"
            hint="Escolha uma ou mais opções que mais combinam com você. Você pode selecionar mais de uma opção."
            disabled={answers.incomodo.length === 0}
            onNext={() => go('regioes')}
          >
            <OptionGrid>
              {INCOMODO.map((o) => (
                <OptionCircle
                  key={o.value}
                  option={o}
                  selected={answers.incomodo.includes(o.value)}
                  onClick={() => set('incomodo', toggle(answers.incomodo, o.value))}
                />
              ))}
            </OptionGrid>
          </Question>
        );

      case 'regioes':
        return (
          <Question
            title="Onde mais incomoda?"
            hint="Você pode selecionar mais de uma opção."
            disabled={answers.regioes.length === 0}
            onNext={() => go('cidade')}
          >
            <OptionGrid cols={3}>
              {REGIOES.map((o) => (
                <OptionCircle
                  key={o.value}
                  option={o}
                  selected={answers.regioes.includes(o.value)}
                  onClick={() => set('regioes', toggle(answers.regioes, o.value))}
                />
              ))}
            </OptionGrid>
          </Question>
        );

      case 'cidade':
        return (
          <Question
            title="Clique na cidade onde você mora"
            hint="Escolha uma das cidades no mapa para continuar."
            disabled={!answers.cidade}
            onNext={afterCidade}
            fill
            note={
              answers.cidade ? (
                <span>
                  Você mora em <strong className="text-brand-accent">{cityName(answers.cidade)}</strong>?
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    set('cidade', null);
                    go('semanal');
                  }}
                  className="font-semibold text-brand-accent underline decoration-brand-gold decoration-2 underline-offset-4"
                >
                  Moro em outra cidade
                </button>
              )
            }
          >
            <div className="h-full w-full max-w-md md:h-[44dvh]">
              <CityMap selected={answers.cidade} onSelect={(id) => set('cidade', id)} />
            </div>
          </Question>
        );

      case 'semanal':
        return (
          <Question
            title="Você conseguiria vir a Vila Velha toda semana?"
            hint="O tratamento é presencial, com sessões semanais na clínica da Praia da Costa."
            disabled={!answers.semanal}
            onNext={afterSemanal}
          >
            <div className="flex w-full max-w-md flex-col items-center gap-[clamp(0.75rem,3dvh,2rem)]">
              <div className="flex w-full items-center gap-3 rounded-2xl border border-brand-gold/50 bg-brand-gold/10 px-4 py-3 text-sm leading-snug text-slate-900">
                <Clock size={20} className="shrink-0 text-brand-gold" />
                <span>A clínica atende até as 19h nos dias de semana: dá para vir depois do trabalho.</span>
              </div>
              <OptionGrid>
                {SEMANAL.map((o) => (
                  <OptionCircle key={o.value} option={o} selected={answers.semanal === o.value} onClick={() => set('semanal', o.value)} />
                ))}
              </OptionGrid>
            </div>
          </Question>
        );

      case 'verba':
        return (
          <Question
            title="Quanto cabe por mês no seu tratamento?"
            hint="Para montar um plano que caiba no seu bolso. Parcelamos em até 10x no cartão."
            disabled={!answers.verba}
            onNext={() => go('inicio')}
          >
            <OptionGrid cols={4}>
              {VERBAS.map((o) => (
                <OptionCircle key={o.value} option={o} sublabel="por mês" selected={answers.verba === o.value} onClick={() => set('verba', o.value)} />
              ))}
            </OptionGrid>
          </Question>
        );

      case 'inicio':
        return (
          <Question title="Quando você quer começar?" disabled={!answers.inicio} onNext={() => go('contato')}>
            <div className="flex flex-col items-center gap-[clamp(0.25rem,1.5dvh,1rem)]">
              {INICIOS.map((o) => (
                <OptionCircle key={o.value} stacked option={o} selected={answers.inicio === o.value} onClick={() => set('inicio', o.value)} />
              ))}
            </div>
          </Question>
        );

      case 'contato':
        return (
          <form onSubmit={submit} className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-[clamp(0.75rem,2.5dvh,1.5rem)]">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-gold/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                <Gift size={14} className="text-brand-gold" /> Promoção deste mês
              </span>
            </div>
            <QuestionHeader title="Falta pouco! Seu plano está pronto" hint="Preencha para garantir o acesso à promoção deste mês." />
            {/* Armadilha de spam, igual à do formulário de contato: só robô preenche. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={contact.website}
              onChange={(e) => setContact((c) => ({ ...c, website: e.target.value }))}
              className="pointer-events-none absolute -m-px h-px w-px overflow-hidden opacity-0"
            />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="quiz-nome" className="text-xs font-bold uppercase tracking-widest text-slate-500">Seu nome</label>
                <input
                  id="quiz-nome"
                  type="text"
                  autoComplete="name"
                  required
                  value={contact.nome}
                  onChange={(e) => setContact((c) => ({ ...c, nome: e.target.value }))}
                  placeholder="Como você se chama?"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-lg outline-none transition-all focus:ring-2 focus:ring-brand-accent/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="quiz-whatsapp" className="text-xs font-bold uppercase tracking-widest text-slate-500">WhatsApp</label>
                <input
                  id="quiz-whatsapp"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  value={contact.whatsapp}
                  onChange={(e) => setContact((c) => ({ ...c, whatsapp: maskPhone(e.target.value) }))}
                  placeholder="(27) 99999-9999"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-lg outline-none transition-all focus:ring-2 focus:ring-brand-accent/20"
                />
              </div>
            </div>
            {status === 'error' && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Não conseguimos enviar agora.{' '}
                <a
                  href={whatsappLink('Olá! Fiz o quiz de avaliação no site e quero saber da promoção deste mês.')}
                  className="font-semibold underline"
                >
                  Fale com a gente pelo WhatsApp
                </a>
                .
              </p>
            )}
            <div className="flex flex-col items-center gap-3">
              <ContinueButton type="submit" disabled={!contactValid || status === 'sending'}>
                {status === 'sending' ? 'Enviando…' : 'Garantir minha promoção'}
              </ContinueButton>
              <p className="text-center text-xs text-brand-muted">
                Seus dados ficam só com a Integrallys e servem para falarmos com você sobre o tratamento.
              </p>
            </div>
          </form>
        );

      case 'fimQuente':
        return (
          <Ending icon={<CheckCircle size={34} />} eyebrow="Tudo certo" title={`Parabéns${firstName ? `, ${firstName}` : ''}!`}>
            <p className="mb-3 text-sm text-brand-muted sm:mb-5 sm:text-base">Pelas suas respostas, o protocolo indicado para você é:</p>
            <div className="mb-4 rounded-3xl bg-brand-accent px-6 py-3 text-white sm:mb-6 sm:py-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">Protocolo indicado</span>
              <p className="mt-1 font-serif text-xl font-bold sm:mt-2 sm:text-3xl">{protocolOf(answers).name}</p>
            </div>
            <div className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 px-4 py-3 text-left sm:px-5 sm:py-4">
              <div className="flex items-start gap-3">
                <BellRing size={24} className="mt-0.5 shrink-0 text-brand-gold" />
                <p className="text-sm leading-snug text-slate-900 sm:text-base">
                  <strong>Deixe o celular com o som ligado.</strong> A {RECEPTION_NAME}, da nossa recepção, vai te
                  ligar {devStart()?.foraDoHorario || !isBusinessHours()
                    ? 'no próximo horário comercial (seg. a sex., das 9h às 19h)'
                    : 'em até 10 minutos'}{' '}
                  deste número:
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent font-serif text-lg font-bold text-white">
                  {RECEPTION_NAME[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{RECEPTION_NAME} · Integrallys</p>
                  <p className="flex items-center gap-1.5 text-lg font-bold tabular-nums tracking-tight text-brand-accent">
                    <Phone size={16} className="shrink-0" /> {RECEPTION_PHONE_DISPLAY}
                  </p>
                </div>
              </div>
            </div>
            {/* Salva o número na agenda como "Integrallys": a ligação já chega com o nome.
                O nginx entrega o .vcf como text/vcard (nginx/vcard.conf) — é o que faz o
                iPhone abrir "Adicionar contato" em vez de baixar um arquivo. Sem `download`
                de propósito, pelo mesmo motivo. */}
            <a
              href="/integrallys.vcf"
              onClick={() => trackEvent('save_contact', { method: 'quiz' })}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent py-3 text-sm font-semibold text-white shadow-lg shadow-brand-accent/20 transition-all hover:brightness-125 sm:mt-4"
            >
              <UserPlus size={16} /> Salvar Contato
            </a>
          </Ending>
        );

      case 'fimFria':
        return (
          <Ending icon={<Heart size={30} />} eyebrow="Respostas recebidas" title={`Obrigada${firstName ? `, ${firstName}` : ''}!`}>
            <p className="leading-relaxed text-brand-muted">
              Recebemos as suas respostas. Vamos te avisar pelo WhatsApp sobre a promoção deste mês e as condições de
              pagamento.
            </p>
          </Ending>
        );

      case 'fimFora':
        return (
          <Ending icon={<MapPin size={30} />} eyebrow="Obrigada pelo interesse" title="Por enquanto, só em Vila Velha">
            <p className="leading-relaxed text-brand-muted">
              Nossos tratamentos são feitos presencialmente na clínica, com sessões semanais. Se um dia ficar mais fácil
              vir até Vila Velha, vamos adorar te receber.
            </p>
          </Ending>
        );
    }
  })();

  // A página inteira cabe na altura da tela (h-dvh): o cartão estica até o fim e cada
  // pergunta divide o espaço que sobra, sem rolar. No computador o cartão volta a ter a
  // altura do conteúdo, centralizado — mas ainda encolhe (flex-initial) se a janela for baixa.
  return (
    <div className="flex h-dvh flex-col items-center px-3 py-3 sm:px-4 sm:py-8">
      {/* Marca sem link: nesta página não há para onde sair. No celular ela só aparece fora
          das perguntas, para não roubar altura delas. */}
      <div className={`mb-3 shrink-0 items-center gap-2 text-brand-accent sm:mb-6 ${step ? 'hidden sm:flex' : 'flex'}`}>
        {/* O logo é um JPG de fundo branco; o multiply some com o branco sobre o bege. */}
        <img src={logoImg} alt="" className="h-9 w-9 object-contain mix-blend-multiply" />
        <div className="flex flex-col">
          <span className="font-serif text-lg font-bold leading-tight">Integrallys</span>
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-70">Estética Avançada</span>
        </div>
      </div>

      <main className="flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 sm:my-auto sm:flex-initial">
        {step && (
          <div className="shrink-0 px-4 pt-4 sm:px-10 sm:pt-8">
            <Stepper current={step} />
            <div className="mt-3 sm:mt-5">
              <BackButton onClick={back} />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.section
            key={screen}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className={`min-h-0 flex-1 overflow-y-auto px-5 sm:px-10 ${step ? 'pb-4 pt-1 sm:pb-8' : 'py-5 sm:py-12'}`}
          >
            {body}
          </motion.section>
        </AnimatePresence>

        {step && <ProgressFooter current={step} />}
      </main>
    </div>
  );
}

/**
 * Esqueleto de uma pergunta: título, respostas e botão juntos, centralizados na altura que
 * sobra (como na referência). Só o mapa (`fill`) estica para ocupar todo o espaço livre.
 * `note` vai logo acima do botão (a confirmação da cidade, por exemplo).
 */
function Question({
  title,
  hint,
  disabled,
  onNext,
  note,
  fill,
  children,
}: {
  title: ReactNode;
  hint?: ReactNode;
  disabled: boolean;
  onNext: () => void;
  note?: ReactNode;
  fill?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-[clamp(1rem,3.5dvh,2.5rem)]">
      <QuestionHeader title={title} hint={hint} />
      <div className={`flex justify-center ${fill ? 'min-h-0 flex-1' : 'shrink-0'}`}>{children}</div>
      <div className="flex shrink-0 flex-col items-center gap-2">
        {note && <p className="text-sm text-brand-muted">{note}</p>}
        <ContinueButton disabled={disabled} onClick={onNext} />
      </div>
    </div>
  );
}

function Ending({
  icon,
  eyebrow,
  title,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mx-auto mb-3 flex h-14 w-14 shrink-0 items-center sm:mb-5 sm:h-16 sm:w-16 justify-center rounded-full bg-brand-gold text-white shadow-lg shadow-brand-gold/30"
      >
        {icon}
      </motion.div>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">{eyebrow}</span>
      <h2 className="mb-3 mt-1 font-serif text-[1.75rem] font-bold leading-tight tracking-tight text-brand-accent sm:mb-4 sm:mt-2 sm:text-4xl">{title}</h2>
      {children}
    </div>
  );
}
