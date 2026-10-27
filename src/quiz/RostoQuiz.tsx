import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import heroImg from '../assets/images/hero.jpg';
import antesImg from '../assets/images/quiz/rosto-antes.jpg';
import depoisImg from '../assets/images/quiz/rosto-depois.jpg';
import { trackEvent } from '../lib/analytics';
import { identifyPixelUser, trackPixel, trackPixelCustom } from '../lib/pixel';
import { leadEventId, markSentFromThisBrowser, sentFromThisBrowser } from '../lib/leadOnce';
import { submitQuizLead } from '../lib/lead';
import { RECEPTION_NAME } from '../lib/constants';
import { CityMap } from './CityMap';
import { IN_AREA, INICIOS, labelOf } from './questions';
import { AREAS_ROSTO, JA_FEZ, ROSTO_PROTOCOL, rostoTierOf, type RostoAnswers } from './questions-rosto';
import {
  SEMANAL,
  ContactForm,
  Cover,
  Ending,
  HotEnding,
  Question,
  QuizShell,
  SemanalQuestion,
  cityName,
  contactCheck,
  devStart,
  toggle,
  type Contact,
} from './shared';
import { OptionCircle, OptionGrid } from './ui';

type Screen = 'capa' | 'areas' | 'jaFez' | 'cidade' | 'semanal' | 'inicio' | 'contato' | 'fimQuente' | 'fimFora';

const STEP_LABELS = ['Objetivo', 'Experiência', 'Cidade', 'Início', 'Contato'];

/** Número da etapa no topo. "semanal" é um desvio da etapa 3, não uma etapa nova. */
const STEP_OF: Partial<Record<Screen, number>> = {
  areas: 1,
  jaFez: 2,
  cidade: 3,
  semanal: 3,
  inicio: 4,
  contato: 5,
};

/** Separa este quiz do quiz do corpo no GA4 e nos eventos próprios do Pixel. */
const QUIZ = 'rosto';

export function RostoQuiz() {
  const [history, setHistory] = useState<Screen[]>(() => {
    const dev = devStart<Screen>();
    return dev ? ['capa', dev.screen] : ['capa'];
  });
  const screen = history[history.length - 1];
  const [answers, setAnswers] = useState<RostoAnswers>({ areas: [] });
  const [contact, setContact] = useState<Contact>(() => ({ nome: devStart()?.nome ?? '', whatsapp: '', website: '' }));
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  const go = (next: Screen) => setHistory((h) => [...h, next]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const set = <K extends keyof RostoAnswers>(key: K, value: RostoAnswers[K]) => setAnswers((a) => ({ ...a, [key]: value }));

  // Uma tela vista = um evento no GA4: é o que mostra em qual pergunta as pessoas desistem.
  useEffect(() => {
    trackEvent('quiz_step', { step: screen, quiz: QUIZ });
  }, [screen]);

  const step = STEP_OF[screen];

  const afterCidade = () => go(answers.cidade && IN_AREA.has(answers.cidade) ? 'inicio' : 'semanal');

  const afterSemanal = () => {
    if (answers.semanal === 'sim') return go('inicio');
    trackPixelCustom('QuizForaDaArea', { cidade: cityName(answers.cidade), quiz: QUIZ });
    trackEvent('quiz_fora_da_area', { cidade: cityName(answers.cidade), quiz: QUIZ });
    go('fimFora');
  };

  const { phoneDigits, contactValid } = contactCheck(contact);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactValid || status === 'sending') return;
    setStatus('sending');

    const tier = rostoTierOf(answers);
    const result = await submitQuizLead({
      nome: contact.nome.trim(),
      whatsapp: contact.whatsapp,
      protocolo: ROSTO_PROTOCOL.slug,
      qualificacao: tier,
      website: contact.website,
      formulario: 'Site — quiz de rosto',
      respostas: {
        Tratamento: 'Toxina botulínica',
        'O que mais incomoda': answers.areas.map((v) => labelOf(AREAS_ROSTO, v)).join(', '),
        'Já fez toxina': labelOf(JA_FEZ, answers.jaFez),
        Cidade: cityName(answers.cidade),
        'Consegue vir à clínica': answers.semanal ? labelOf(SEMANAL, answers.semanal) : 'Mora na área',
        'Quando quer começar': labelOf(INICIOS, answers.inicio),
      },
    });

    if (!result.ok) {
      // A lead não pode morrer aqui: o erro oferece o WhatsApp da clínica.
      setStatus('error');
      return;
    }

    trackEvent('generate_lead', { method: 'quiz', quiz: QUIZ, qualificacao: tier, protocolo: ROSTO_PROTOCOL.slug, repetida: result.duplicate });
    // Um Lead por pessoa: ver leadOnce.ts. A checagem do navegador vem ANTES de marcar.
    // Sem a pergunta do orçamento não existe lead "fria" aqui: toda lead dispara o `Lead`.
    const repeat = result.duplicate || sentFromThisBrowser();
    markSentFromThisBrowser();
    if (!repeat) {
      identifyPixelUser({
        phone: phoneDigits,
        name: contact.nome,
        city: answers.cidade && IN_AREA.has(answers.cidade) ? cityName(answers.cidade) : undefined,
      });
      trackPixel('Lead', { content_name: ROSTO_PROTOCOL.name, content_category: tier }, await leadEventId(phoneDigits));
    }
    go('fimQuente');
    setStatus('idle');
  };

  const firstName = contact.nome.trim().split(/\s+/)[0] ?? '';

  const body = (() => {
    switch (screen) {
      case 'capa':
        return (
          <Cover
            image={heroImg}
            imageClassName="object-[75%_center]"
            title="Descubra o tratamento ideal para o seu rosto"
            text="Responda 5 perguntas rápidas para ter acesso a uma oferta exclusiva."
            onStart={() => go('areas')}
          />
        );

      case 'areas':
        return (
          <Question
            title="O que mais te incomoda no rosto?"
            hint="Você pode selecionar mais de uma opção."
            disabled={answers.areas.length === 0}
            onNext={() => go('jaFez')}
          >
            <OptionGrid>
              {AREAS_ROSTO.map((o) => (
                <OptionCircle
                  key={o.value}
                  option={o}
                  selected={answers.areas.includes(o.value)}
                  onClick={() => set('areas', toggle(answers.areas, o.value))}
                />
              ))}
            </OptionGrid>
          </Question>
        );

      case 'jaFez':
        return (
          <Question title="Você já fez aplicação de toxina botulínica?" disabled={!answers.jaFez} onNext={() => go('cidade')}>
            <OptionGrid>
              {JA_FEZ.map((o) => (
                <OptionCircle key={o.value} option={o} selected={answers.jaFez === o.value} onClick={() => set('jaFez', o.value)} />
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
          <SemanalQuestion
            title="Você conseguiria vir até a clínica, em Vila Velha?"
            hint="A aplicação é feita na clínica da Praia da Costa."
            value={answers.semanal}
            onChange={(v) => set('semanal', v)}
            onNext={afterSemanal}
          />
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
          <ContactForm
            contact={contact}
            setContact={setContact}
            status={status}
            onSubmit={submit}
            badge="Promoção liberada"
            offer={<RostoOffer />}
            whatsappMessage="Olá! Fiz o quiz do rosto no site e quero saber da promoção deste mês."
          />
        );

      case 'fimQuente':
        return (
          <HotEnding
            icon={<CheckCircle size={34} />}
            firstName={firstName}
            protocolName={ROSTO_PROTOCOL.name}
            eyebrow="Promoção garantida"
            intro={
              <>
                Você pegou o <strong className="font-semibold text-brand-accent">Pague 1, leve 4</strong>. Este é o resultado
                que te espera:
              </>
            }
            highlight={<BeforeAfter />}
            callText={(dentro) =>
              `A ${RECEPTION_NAME}, da nossa recepção, vai te ligar ${
                dentro ? 'nos próximos 15 minutos' : 'no próximo horário comercial (seg. a sex., das 9h às 19h)'
              } para confirmar a sua sessão.`
            }
          />
        );

      case 'fimFora':
        return (
          <Ending icon={<MapPin size={30} />} eyebrow="Obrigada pelo interesse" title="Por enquanto, só em Vila Velha">
            <p className="leading-relaxed text-brand-muted">
              A aplicação é feita presencialmente na nossa clínica. Se um dia ficar mais fácil vir até Vila Velha, vamos
              adorar te receber.
            </p>
          </Ending>
        );
    }
  })();

  return (
    <>
      {import.meta.env.DEV && <DevMenu current={screen} onPick={go} />}
      <QuizShell screen={screen} step={step} labels={STEP_LABELS} onBack={back}>
        {body}
      </QuizShell>
    </>
  );
}

/** `horario` força o aviso da ligação da tela final (o `&dentro` / `&fora` do devStart). */
const DEV_SCREENS: { id: Screen; label: string; horario?: 'dentro' | 'fora' }[] = [
  { id: 'capa', label: 'Capa' },
  { id: 'areas', label: '1 Áreas' },
  { id: 'jaFez', label: '2 Já fez' },
  { id: 'cidade', label: '3 Cidade' },
  { id: 'semanal', label: '3b Semanal' },
  { id: 'inicio', label: '4 Início' },
  { id: 'contato', label: '5 Contato' },
  { id: 'fimQuente', label: 'Fim · no horário', horario: 'dentro' },
  { id: 'fimQuente', label: 'Fim · fora do horário', horario: 'fora' },
  { id: 'fimFora', label: 'Fim · fora da cidade' },
];

/**
 * Só no `npx vite` (localhost): pula para qualquer tela, para revisar sem responder o quiz.
 * No build de produção `import.meta.env.DEV` é falso e o menu não existe.
 */
function DevMenu({ current, onPick }: { current: Screen; onPick: (s: Screen) => void }) {
  const q = new URLSearchParams(window.location.search);
  const horario = q.has('fora') ? 'fora' : q.has('dentro') ? 'dentro' : undefined;
  const pick = (id: Screen, h?: 'dentro' | 'fora') => {
    // A tela final lê o horário da URL (o devStart só olha quando há `tela`): troca os dois
    // antes de abrir. De bônus, recarregar a página volta para a mesma tela.
    const url = new URL(window.location.href);
    url.searchParams.set('tela', id);
    url.searchParams.delete('dentro');
    url.searchParams.delete('fora');
    if (h) url.searchParams.set(h, '');
    window.history.replaceState(null, '', url);
    onPick(id);
  };
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex gap-1 overflow-x-auto bg-slate-900/90 px-2 py-1.5 text-xs text-white backdrop-blur">
      {DEV_SCREENS.map(({ id, label, horario: h }) => {
        const on = id === current && (!h || h === horario);
        return (
          <button
            key={label}
            type="button"
            onClick={() => pick(id, h)}
            className={`shrink-0 rounded-full px-2.5 py-1 ${on ? 'bg-brand-gold text-brand-accent' : 'hover:bg-white/15'}`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}

/** Antes e depois do anúncio, no lugar do cartão "Protocolo indicado" da tela final. */
function BeforeAfter() {
  return (
    <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-3xl bg-brand-accent p-1.5 sm:mb-6">
      {[
        [antesImg, 'Antes'],
        [depoisImg, 'Depois'],
      ].map(([src, label]) => (
        <figure key={label} className="relative overflow-hidden rounded-[1.25rem]">
          <img src={src} alt={`Rosto ${label.toLowerCase()} da aplicação`} className="aspect-square w-full object-cover" />
          <figcaption className="absolute bottom-2 left-2 rounded-full bg-brand-accent/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * A oferta do anúncio de toxina (Pague 1 Leve 4) no lugar do "Falta pouco!" do contato: a
 * pessoa preenche para ter acesso, com 10 minutos no relógio (pedido do Matheus, 27/10).
 */
function RostoOffer() {
  return (
    <div className="mx-auto max-w-xl shrink-0 text-center">
      <OfferCountdown />
      <h2 className="mt-[clamp(0.75rem,2dvh,1.25rem)] font-serif text-[1.6rem] font-bold leading-tight tracking-tight text-brand-accent sm:text-3xl">
        Pague 1, leve 4
      </h2>
      <p className="mt-2 text-sm leading-snug text-brand-muted sm:mt-3 sm:text-base">
        Agende a testa e ganhe entre as sobrancelhas, nariz e ao redor dos olhos.{' '}
        <strong className="font-semibold text-brand-accent">Em até 10x de R$95.</strong>
      </p>
    </div>
  );
}

const OFFER_MS = 10 * 60 * 1000;
const pad = (n: number) => String(n).padStart(2, '0');
/** Quando a pessoa viu a oferta pela primeira vez: voltar e avançar não zera o relógio. */
let offerDeadline: number | null = null;

function OfferCountdown() {
  const [now, setNow] = useState(() => Date.now());
  offerDeadline ??= now + OFFER_MS;
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Chega a 00:00 e para; a oferta continua valendo, o formulário não trava.
  const left = Math.max(0, Math.ceil((offerDeadline - now) / 1000));
  const parts: [number, string][] = [
    [Math.floor(left / 60), 'min'],
    [left % 60, 'seg'],
  ];

  return (
    <div className="flex items-start justify-center gap-4 sm:gap-5" aria-label="Tempo para garantir a promoção">
      {parts.map(([n, label], i) => (
        <div key={label} className="flex items-start gap-4 sm:gap-5">
          {i > 0 && <span className="text-xl font-light leading-none text-slate-300">:</span>}
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold leading-none tabular-nums text-brand-accent sm:text-2xl">{pad(n)}</span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-muted">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
