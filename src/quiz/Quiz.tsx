import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle, Heart, MapPin } from 'lucide-react';
import heroImg from '../assets/images/emagrecimento.webp';
import { trackEvent } from '../lib/analytics';
import { identifyPixelUser, trackPixel, trackPixelCustom } from '../lib/pixel';
import { leadEventId, markSentFromThisBrowser, sentFromThisBrowser } from '../lib/leadOnce';
import { submitQuizLead } from '../lib/lead';
import { CityMap } from './CityMap';
import {
  IN_AREA,
  INCOMODO,
  INICIOS,
  REGIOES,
  VERBAS,
  labelOf,
  protocolOf,
  tierOf,
  firesLead,
  type Answers,
} from './questions';
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

export function Quiz() {
  const [history, setHistory] = useState<Screen[]>(() => {
    const dev = devStart<Screen>();
    return dev ? ['capa', dev.screen] : ['capa'];
  });
  const screen = history[history.length - 1];
  const [answers, setAnswers] = useState<Answers>({ incomodo: [], regioes: [] });
  const [contact, setContact] = useState<Contact>(() => ({ nome: devStart()?.nome ?? '', whatsapp: '', website: '' }));
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

  const { phoneDigits, contactValid } = contactCheck(contact);

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

    trackEvent('generate_lead', { method: 'quiz', qualificacao: tier, protocolo: protocol.slug, repetida: result.duplicate });
    // Um Lead por pessoa: ver leadOnce.ts. A checagem do navegador vem ANTES de marcar.
    const repeat = result.duplicate || sentFromThisBrowser();
    markSentFromThisBrowser();
    if (firesLead(tier)) {
      if (!repeat) {
        identifyPixelUser({
          phone: phoneDigits,
          name: contact.nome,
          city: answers.cidade && IN_AREA.has(answers.cidade) ? cityName(answers.cidade) : undefined,
        });
        trackPixel('Lead', { content_name: protocol.name, content_category: tier }, await leadEventId(phoneDigits));
      }
      go('fimQuente');
    } else {
      if (!repeat) trackPixelCustom('QuizLeadFria');
      go('fimFria');
    }
    setStatus('idle');
  };

  const firstName = contact.nome.trim().split(/\s+/)[0] ?? '';

  const body = (() => {
    switch (screen) {
      case 'capa':
        return (
          <Cover
            image={heroImg}
            title="Descubra o protocolo ideal para o seu corpo"
            text="Responda 6 perguntas rápidas e receba a indicação da equipe Integrallys feita para você."
            onStart={() => go('incomodo')}
          />
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
          <SemanalQuestion
            title="Você conseguiria vir a Vila Velha toda semana?"
            hint="O tratamento é presencial, com sessões semanais na clínica da Praia da Costa."
            value={answers.semanal}
            onChange={(v) => set('semanal', v)}
            onNext={afterSemanal}
          />
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
          <ContactForm
            contact={contact}
            setContact={setContact}
            status={status}
            onSubmit={submit}
            whatsappMessage="Olá! Fiz o quiz de avaliação no site e quero saber da promoção deste mês."
          />
        );

      case 'fimQuente':
        return <HotEnding icon={<CheckCircle size={34} />} firstName={firstName} protocolName={protocolOf(answers).name} />;

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

  return (
    <QuizShell screen={screen} step={step} onBack={back}>
      {body}
    </QuizShell>
  );
}
