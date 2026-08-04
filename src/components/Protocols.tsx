import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { protocols, type Protocol } from '../data/protocols';

const ProtocolCard = ({ protocol }: { protocol: Protocol }) => (
  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="bg-brand-accent rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 flex flex-col"
  >
    {/* Topo: foto à direita, copy à esquerda sobre um gradiente que garante contraste */}
    <div className="relative min-h-[19rem] sm:min-h-[21rem]">
      <img
        src={protocol.image}
        alt={protocol.imageAlt}
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="lazy"
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${protocol.cardGradient}`} />
      <div className="relative h-full flex flex-col justify-center p-8 sm:p-10 max-w-[80%] sm:max-w-[62%]">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold mb-3">
          {protocol.eyebrow}
        </span>
        <h3 className="font-serif text-white text-3xl sm:text-4xl leading-[1.15] mb-5">
          {protocol.name}
        </h3>
        <div className="h-px w-12 bg-brand-gold/70 mb-5" />
        <p className="text-white/80 text-sm leading-relaxed">{protocol.tagline}</p>
      </div>
    </div>

    {/* Pilares 2×2 */}
    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8 px-8 sm:px-10 py-10 border-t border-white/10 grow">
      {protocol.pillars.map((pillar) => {
        const Icon = pillar.icon;
        return (
          <div key={pillar.title} className="flex gap-4">
            <div className="w-12 h-12 shrink-0 rounded-full border border-brand-gold/50 flex items-center justify-center">
              <Icon className="text-brand-gold" size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-white text-[15px] leading-snug mb-1.5">
                {pillar.title}
              </h4>
              <p className="text-white/60 text-[13px] leading-relaxed">{pillar.desc}</p>
            </div>
          </div>
        );
      })}
    </div>

    <a
      href={`/protocolos/${protocol.slug}/`}
      className="group/cta bg-brand-gold text-brand-accent mx-8 sm:mx-10 mb-10 py-5 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:brightness-105 transition-all"
      aria-label={`Saiba mais sobre o protocolo ${protocol.name}`}
    >
      Saiba Mais
      <ArrowRight size={20} className="transition-transform group-hover/cta:translate-x-1" />
    </a>
  </motion.div>
);

export const Protocols = () => (
  // scroll-mt compensa a navbar fixa quando se chega aqui pelo link "Protocolos".
  <section id="protocolos" className="bg-brand-beige py-24 px-6 scroll-mt-24">
    <div className="max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
          Nossos Protocolos
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-serif mb-5 text-balance">
          Dois protocolos.{' '}
          <span className="italic italic-small font-normal">Resultados reais.</span>
        </h2>
        <p className="text-brand-muted text-lg leading-relaxed max-w-xl">
          Abordagens integradas e personalizadas para realçar sua beleza e transformar sua saúde
          com segurança e excelência.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {protocols.map((protocol) => (
          <ProtocolCard key={protocol.slug} protocol={protocol} />
        ))}
      </div>
    </div>
  </section>
);
