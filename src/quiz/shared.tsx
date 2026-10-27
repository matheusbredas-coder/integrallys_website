/**
 * Peças comuns aos dois quizzes (/avaliacao, corpo; /avaliacao-rosto, rosto): a moldura da
 * página, o esqueleto de pergunta, o formulário de contato e as telas finais. Cada quiz só
 * decide as perguntas e o que fazer com as respostas.
 */
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, CalendarCheck, Clock, Gift, Phone, UserPlus, X } from 'lucide-react';
import logoImg from '../assets/images/logo.jpg';
import { trackEvent } from '../lib/analytics';
import { isValidBrMobile, nationalDigits } from '../lib/phone';
import { RECEPTION_NAME, RECEPTION_PHONE_DISPLAY, whatsappLink } from '../lib/constants';
import { CITIES, type CityId } from './grande-vitoria-map';
import type { Option, Semanal } from './questions';
import { BackButton, ContinueButton, OptionCircle, OptionGrid, ProgressFooter, QuestionHeader, Stepper } from './ui';

export const SEMANAL: Option<Semanal>[] = [
  { value: 'sim', label: 'Sim, consigo', icon: CalendarCheck },
  { value: 'nao', label: 'Não consigo', icon: X },
];

export const cityName = (id: CityId | null | undefined) =>
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

export const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

/**
 * Só em desenvolvimento (`npm run dev`): `?tela=fimQuente&nome=Maria` abre direto numa tela
 * (`&fora` / `&dentro` forçam fora ou dentro do horário comercial), para revisar as telas finais sem preencher o quiz. No build de produção `import.meta.env.DEV`
 * é falso e isto some do código.
 */
export function devStart<S extends string>(): { screen: S; nome: string; horario: 'fora' | 'dentro' | null } | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const tela = q.get('tela') as S | null;
  return tela ? { screen: tela, nome: q.get('nome') ?? '', horario: q.has('fora') ? 'fora' : q.has('dentro') ? 'dentro' : null } : null;
}

export type Contact = { nome: string; whatsapp: string; website: string };

export function contactCheck(contact: Contact) {
  const phoneDigits = nationalDigits(contact.whatsapp);
  const phoneValid = isValidBrMobile(contact.whatsapp);
  return {
    phoneDigits,
    // Só reclama depois do número inteiro digitado, para não piscar erro a cada tecla.
    phoneWrong: phoneDigits.length >= 11 && !phoneValid,
    contactValid: contact.nome.trim().length >= 2 && phoneValid,
  };
}

/**
 * A página inteira cabe na altura da tela (h-dvh): o cartão estica até o fim e cada
 * pergunta divide o espaço que sobra, sem rolar. No computador o cartão volta a ter a
 * altura do conteúdo, centralizado — mas ainda encolhe (flex-initial) se a janela for baixa.
 */
export function QuizShell({
  screen,
  step,
  labels,
  onBack,
  children,
}: {
  screen: string;
  step: number | undefined;
  labels?: string[];
  onBack: () => void;
  children: ReactNode;
}) {
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
            <Stepper current={step} labels={labels} />
            <div className="mt-3 sm:mt-5">
              <BackButton onClick={onBack} />
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
            {children}
          </motion.section>
        </AnimatePresence>

        {step && <ProgressFooter current={step} total={labels?.length} />}
      </main>
    </div>
  );
}

/** Capa: foto + chamada + "Começar". */
export function Cover({ image, imageClassName = '', title, text, onStart }: {
  image: string;
  imageClassName?: string;
  title: string;
  text: string;
  onStart: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 md:grid md:grid-cols-2 md:items-center md:gap-12">
      <img
        src={image}
        alt=""
        className={`min-h-0 w-full flex-1 rounded-3xl object-cover shadow-xl md:order-2 md:aspect-[4/5] md:flex-none ${imageClassName}`}
      />
      <div className="shrink-0 text-center md:order-1 md:text-left">
        <div className="mb-3 flex items-center justify-center gap-2 md:mb-5 md:justify-start">
          <span className="h-px w-8 bg-brand-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Avaliação em 1 minuto</span>
        </div>
        <h1 className="mb-3 font-serif text-3xl font-bold leading-[1.1] tracking-tight text-brand-accent md:mb-5 md:text-5xl">
          {title}
        </h1>
        <p className="mb-5 leading-snug text-brand-muted md:mb-8 md:text-lg md:leading-relaxed">{text}</p>
        <ContinueButton onClick={onStart}>Começar</ContinueButton>
      </div>
    </div>
  );
}

/** A pergunta "consegue vir?" de quem mora fora de Vila Velha e Vitória. */
export function SemanalQuestion({ title, hint, value, onChange, onNext }: {
  title: string;
  hint: string;
  value: Semanal | undefined;
  onChange: (v: Semanal) => void;
  onNext: () => void;
}) {
  return (
    <Question title={title} hint={hint} disabled={!value} onNext={onNext}>
      <div className="flex w-full max-w-md flex-col items-center gap-[clamp(0.75rem,3dvh,2rem)]">
        <div className="flex w-full items-center gap-3 rounded-2xl border border-brand-gold/50 bg-brand-gold/10 px-4 py-3 text-sm leading-snug text-slate-900">
          <Clock size={20} className="shrink-0 text-brand-gold" />
          <span>A clínica atende até as 19h nos dias de semana: dá para vir depois do trabalho.</span>
        </div>
        <OptionGrid>
          {SEMANAL.map((o) => (
            <OptionCircle key={o.value} option={o} selected={value === o.value} onClick={() => onChange(o.value)} />
          ))}
        </OptionGrid>
      </div>
    </Question>
  );
}

export function ContactForm({
  contact,
  setContact,
  status,
  onSubmit,
  whatsappMessage,
}: {
  contact: Contact;
  setContact: Dispatch<SetStateAction<Contact>>;
  status: 'idle' | 'sending' | 'error';
  onSubmit: (e: FormEvent) => void;
  /** Mensagem pronta do link de WhatsApp que aparece se o envio falhar. */
  whatsappMessage: string;
}) {
  const { phoneWrong, contactValid } = contactCheck(contact);
  return (
    <form onSubmit={onSubmit} className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-[clamp(0.75rem,2.5dvh,1.5rem)]">
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
            aria-invalid={phoneWrong}
            aria-describedby={phoneWrong ? 'quiz-whatsapp-erro' : undefined}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-lg outline-none transition-all focus:ring-2 focus:ring-brand-accent/20"
          />
          {phoneWrong && (
            <p id="quiz-whatsapp-erro" className="text-sm text-red-600">
              Confira o número: precisa ser um celular com DDD, como (27) 99876-5432.
            </p>
          )}
        </div>
      </div>
      {status === 'error' && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Não conseguimos enviar agora.{' '}
          <a href={whatsappLink(whatsappMessage)} className="font-semibold underline">
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
}

/** Tela final de quem a recepção vai ligar: o protocolo indicado e de qual número vem a ligação. */
export function HotEnding({ firstName, protocolName, icon }: { firstName: string; protocolName: string; icon: ReactNode }) {
  const horario = devStart()?.horario;
  const dentro = horario ? horario === 'dentro' : isBusinessHours();
  return (
    <Ending icon={icon} eyebrow="Tudo certo" title={`Parabéns${firstName ? `, ${firstName}` : ''}!`}>
      <p className="mb-2 text-sm text-brand-muted sm:mb-5 sm:text-base">Pelas suas respostas, o protocolo indicado para você é:</p>
      <div className="mb-4 rounded-3xl bg-brand-accent px-6 pb-5 pt-3 text-white sm:mb-6 sm:py-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">Protocolo indicado</span>
        <p className="mt-1 font-serif text-[1.75rem] font-bold leading-tight sm:mt-2 sm:text-4xl">{protocolName}</p>
      </div>
      <div className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 px-4 py-3 text-left sm:px-5 sm:py-4">
        <div className="flex items-start gap-3">
          <BellRing size={24} className="mt-0.5 shrink-0 text-brand-gold" />
          <p className="text-sm leading-snug text-slate-900 sm:text-base">
            <strong>Deixe o celular com o som ligado.</strong> A {RECEPTION_NAME}, da nossa recepção, vai te
            ligar {!dentro ? 'no próximo horário comercial (seg. a sex., das 9h às 19h)' : 'em até 10 minutos'}{' '}
            deste número:
          </p>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white">
            <Phone size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{RECEPTION_NAME} · Integrallys</p>
            <p className="text-[1.35rem] font-bold leading-tight tabular-nums tracking-tight text-brand-accent sm:text-2xl">{RECEPTION_PHONE_DISPLAY}</p>
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
}

/**
 * Esqueleto de uma pergunta: título, respostas e botão juntos, centralizados na altura que
 * sobra (como na referência). Só o mapa (`fill`) estica para ocupar todo o espaço livre.
 * `note` vai logo acima do botão (a confirmação da cidade, por exemplo).
 */
export function Question({
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
    <div className="flex h-full min-h-0 flex-col justify-center-safe gap-[clamp(1rem,3.5dvh,2.5rem)]">
      <QuestionHeader title={title} hint={hint} />
      <div className={`flex justify-center ${fill ? 'min-h-0 flex-1' : 'shrink-0'}`}>{children}</div>
      <div className="flex shrink-0 flex-col items-center gap-2">
        {note && <p className="text-sm text-brand-muted">{note}</p>}
        <ContinueButton disabled={disabled} onClick={onNext} />
      </div>
    </div>
  );
}

export function Ending({
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
