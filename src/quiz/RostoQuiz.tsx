import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import heroImg from '../assets/images/hero.jpg';
import { trackEvent } from '../lib/analytics';
import { identifyPixelUser, trackPixel, trackPixelCustom } from '../lib/pixel';
import { leadEventId, markSentFromThisBrowser, sentFromThisBrowser } from '../lib/leadOnce';
import { submitQuizLead } from '../lib/lead';
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
            text="Responda 5 perguntas rápidas e receba a indicação da equipe Integrallys feita para você."
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
            whatsappMessage="Olá! Fiz o quiz do rosto no site e quero saber da promoção deste mês."
          />
        );

      case 'fimQuente':
        return <HotEnding icon={<CheckCircle size={34} />} firstName={firstName} protocolName={ROSTO_PROTOCOL.name} />;

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
    <QuizShell screen={screen} step={step} labels={STEP_LABELS} onBack={back}>
      {body}
    </QuizShell>
  );
}
