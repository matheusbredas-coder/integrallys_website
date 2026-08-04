import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ChevronRight, ArrowRight, Phone, Layers as LayersIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppFab } from '../components/WhatsAppFab';
import { whatsappLink } from '../lib/constants';
import type { Protocol } from '../data/protocols';

const Breadcrumb = ({ name }: { name: string }) => (
  <nav aria-label="Você está aqui" className="text-xs text-brand-muted flex items-center gap-2 flex-wrap">
    <a href="/" className="hover:text-brand-accent transition-colors">Início</a>
    <ChevronRight size={12} className="opacity-50" />
    <a href="/#protocolos" className="hover:text-brand-accent transition-colors">Protocolos</a>
    <ChevronRight size={12} className="opacity-50" />
    <span className="text-slate-900 font-medium">{name}</span>
  </nav>
);

const Hero = ({ protocol }: { protocol: Protocol }) => (
  <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <Breadcrumb name={protocol.name} />
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-brand-gold" />
            <span className="text-xs font-bold tracking-[0.25em] text-brand-gold uppercase">
              {protocol.eyebrow}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl leading-[1.1] font-bold mb-8 tracking-tight font-serif">
            {protocol.name}
          </h1>
          <p className="text-lg text-brand-muted mb-10 leading-relaxed">{protocol.intro}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={whatsappLink(protocol.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-accent text-white py-4 px-10 rounded-full font-bold text-lg hover:translate-y-[-2px] hover:shadow-xl hover:shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              Agendar Avaliação <ArrowRight size={20} />
            </a>
            <a
              href="/#contact"
              className="border-2 border-slate-200 text-slate-900 py-4 px-10 rounded-full font-bold text-lg hover:bg-white hover:border-white hover:shadow-lg transition-all text-center"
            >
              Falar com a equipe
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative"
        >
          <div className="aspect-[4/5] bg-slate-200 rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
            <img
              src={protocol.image}
              alt={protocol.imageAlt}
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        </motion.div>
      </div>
    </div>
  </section>
);

const ForWhom = ({ items }: { items: string[] }) => (
  <section className="bg-white py-24 px-6">
    <div className="max-w-4xl mx-auto">
      <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
        Indicações
      </span>
      <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-10">
        Para quem é este protocolo
      </h2>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4">
            <CheckCircle className="text-brand-gold shrink-0 mt-0.5" size={20} />
            <span className="text-brand-muted leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const Included = ({ protocol }: { protocol: Protocol }) => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
          O Protocolo
        </span>
        <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-4">
          O que está incluído
        </h2>
        <p className="text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Cada etapa tem uma função específica — e potencializa a seguinte. É essa combinação que
          diferencia um protocolo de procedimentos avulsos.
        </p>
      </div>

      <div className="space-y-6">
        {protocol.procedures.map((procedure, index) => (
          <div
            key={procedure.name}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10 flex flex-col md:flex-row gap-8"
          >
            <div className="shrink-0">
              <span className="font-serif text-4xl text-brand-gold/40 font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif mb-4 tracking-tight">{procedure.name}</h3>
              <p className="text-brand-muted leading-relaxed mb-4">{procedure.what}</p>
              <div className="flex items-start gap-3 border-l-2 border-brand-gold/40 pl-5">
                <p className="text-slate-900 text-sm leading-relaxed font-medium">
                  {procedure.delivers}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Journey = ({ steps }: { steps: Protocol['journey'] }) => (
  <section className="bg-white py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
          Passo a Passo
        </span>
        <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight">Como funciona</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((item, index) => (
          <div key={item.step} className="relative">
            <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center font-serif font-bold mb-6">
              {index + 1}
            </div>
            <h3 className="font-bold text-lg mb-3 font-sans">{item.step}</h3>
            <p className="text-brand-muted text-sm leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Tiers = ({ tiers }: { tiers: NonNullable<Protocol['tiers']> }) => (
  <section className="py-24 px-6">
    <div className="max-w-4xl mx-auto bg-brand-accent rounded-[2.5rem] p-10 md:p-16 text-center">
      <div className="w-14 h-14 rounded-full border border-brand-gold/50 flex items-center justify-center mx-auto mb-8">
        <LayersIcon className="text-brand-gold" size={24} strokeWidth={1.5} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold mb-4 block">
        Intensidade
      </span>
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-tight mb-6">
        {tiers.title}
      </h2>
      <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">{tiers.body}</p>
    </div>
  </section>
);

const ProtocolFaq = ({ faqs }: { faqs: Protocol['faq'] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-serif tracking-tight">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="border-b border-slate-200 pb-4">
              <button
                className="w-full flex justify-between items-center gap-6 py-4 text-left font-bold text-lg hover:text-brand-accent transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                {faq.q}
                <ChevronRight
                  className={`shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-90' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-brand-muted pb-6 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaBand = ({ protocol }: { protocol: Protocol }) => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
        Dê o Primeiro Passo
      </span>
      <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight mb-6 leading-tight">
        Sua avaliação é <span className="italic italic-small font-normal">sem custo</span>
      </h2>
      <p className="text-brand-muted text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
        Converse com nossa equipe para descobrir se o protocolo de {protocol.name} é o caminho
        certo para você — e como ele seria montado no seu caso.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={whatsappLink(protocol.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white py-4 px-10 rounded-full font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Phone size={20} /> Falar no WhatsApp
        </a>
        <a
          href="/#contact"
          className="border-2 border-slate-200 text-slate-900 py-4 px-10 rounded-full font-bold text-lg hover:bg-white hover:border-white hover:shadow-lg transition-all text-center"
        >
          Preencher formulário
        </a>
      </div>
    </div>
  </section>
);

export const ProtocolPage = ({ protocol }: { protocol: Protocol }) => (
  <div className="selection:bg-brand-accent selection:text-white overflow-x-hidden">
    <Navbar />
    <Hero protocol={protocol} />
    <ForWhom items={protocol.forWhom} />
    <Included protocol={protocol} />
    <Journey steps={protocol.journey} />
    {protocol.tiers && <Tiers tiers={protocol.tiers} />}
    <ProtocolFaq faqs={protocol.faq} />
    <CtaBand protocol={protocol} />
    <Footer />
    <WhatsAppFab message={protocol.whatsappMessage} />
  </div>
);
