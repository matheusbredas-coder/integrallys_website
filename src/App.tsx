import React, { useState, useRef, useEffect } from 'react';
import heroImage from './assets/images/hero.jpg';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  CheckCircle,
  Star,
  Users,
  Award,
  Zap,
  ArrowRight,
} from 'lucide-react';
import doctorTeamImg from './assets/images/equipe-clinica.jpg';
import beforeImg from './assets/images/before_after/before.jpg';
import afterImg from './assets/images/before_after/after.jpg';
import priscilaImg from './assets/images/reviews/priscila-santana.png';
import samyImg from './assets/images/reviews/samy-farias.png';
import vitorImg from './assets/images/reviews/vitor-moreno.png';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFab } from './components/WhatsAppFab';
import { Protocols } from './components/Protocols';
import { protocols } from './data/protocols';
import { GOOGLE_REVIEWS_URL, whatsappLink } from './lib/constants';

// --- TYPES ---
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  /** Optional profile photo. When absent the card falls back to an initial-letter avatar. */
  image?: string;
}

// --- COMPONENTS ---

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateFromClientX(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => updateFromClientX(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateFromClientX(e.touches[0].clientX);
    };
    const stop = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', stop);
    window.addEventListener('touchcancel', stop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stop);
      window.removeEventListener('touchcancel', stop);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`image-slider-container select-none group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After image */}
      <img
        src={afterImg}
        alt="Depois do Botox"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImg}
          alt="Antes do Botox"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>

      <div
        className="image-slider-handle pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      />

      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded pointer-events-none">Antes</div>
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded pointer-events-none">Depois</div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-brand-accent"></div>
            <span className="text-sm font-semibold tracking-widest text-brand-accent uppercase">Referência em Estética</span>
          </div>
          <h1 className="text-5xl md:text-7xl leading-[1.1] font-bold mb-8 italic tracking-tight font-serif italic-small">
            Elimine Suas Rugas, <br />
            <span className="text-brand-gold italic not-italic">Realce</span> Sua Confiança
          </h1>
          <p className="text-lg text-brand-muted mb-10 max-w-lg leading-relaxed">
            Redescubra sua beleza natural com tratamentos personalizados. A Integrallys combina precisão médica com olhar artístico para entregar resultados harmônicos e duradouros.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href={whatsappLink('Olá! Gostaria de agendar uma avaliação na Integrallys.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-accent text-white py-4 px-10 rounded-full font-bold text-lg hover:translate-y-[-2px] hover:shadow-xl hover:shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              Agendar Avaliação <ArrowRight size={20} />
            </a>
            <a
              href="#protocolos"
              className="border-2 border-slate-200 text-slate-900 py-4 px-10 rounded-full font-bold text-lg hover:bg-white hover:border-white hover:shadow-lg transition-all text-center"
            >
              Ver Protocolos
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 border-t border-slate-200 pt-8">
            <div>
               <div className="flex items-center gap-2 text-brand-accent mb-1">
                 <CheckCircle size={18} />
                 <span className="font-bold text-slate-900">Consulta Grátis</span>
               </div>
               <p className="text-xs text-brand-muted">Avaliação inicial sem custo</p>
            </div>
            <div>
               <div className="flex items-center gap-2 text-brand-accent mb-1">
                 <Award size={18} />
                 <span className="font-bold text-slate-900">Profissionais</span>
               </div>
               <p className="text-xs text-brand-muted">Equipe altamente qualificada</p>
            </div>
            <div>
               <div className="flex items-center gap-2 text-brand-accent mb-1">
                 <Zap size={18} />
                 <span className="font-bold text-slate-900">Resultados</span>
               </div>
               <p className="text-xs text-brand-muted">Efeito natural e imediato</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-[4/5] bg-slate-200 rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
             <img
               src={heroImage}
               alt="Tratamento de estética facial na Integrallys Estética Avançada, Vila Velha - ES"
               className="w-full h-full object-cover"
               fetchPriority="high"
             />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          
          <div className="absolute right-4 bottom-28 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-slate-100">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                  <Users className="text-brand-accent" size={20} />
                </div>
                <div className="leading-tight">
                  <span className="block text-xs font-bold font-serif">+2.000 Atendidos</span>
                  <span className="block text-[10px] text-brand-muted">em 5 anos de clínica</span>
                </div>
             </div>
             <div className="flex gap-1 text-yellow-400">
               {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
             </div>
             <span className="block mt-1 text-[10px] font-semibold text-brand-muted">5,0 no Google</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ValueProps = () => {
  const props = [
    {
      icon: <Users className="text-brand-accent" />,
      title: "Atendimento Humanizado",
      desc: "Cada rosto é único. Por isso, ouvimos seus desejos para criar um plano que respeite sua anatomia e seus objetivos."
    },
    {
      icon: <Award className="text-brand-accent" />,
      title: "Tecnologia de Ponta",
      desc: "Utilizamos os melhores produtos do mercado mundial, garantindo segurança total e resultados de alta performance."
    },
    {
      icon: <CheckCircle className="text-brand-accent" />,
      title: "Ambiente Premium",
      desc: "Nossa clínica foi projetada para oferecer conforto e sofisticação desde o momento em que você atravessa a porta."
    }
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        {props.map((p, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-beige rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              {p.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 italic italic-small tracking-tight font-serif">{p.title}</h3>
            <p className="text-brand-muted leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Results = () => {
  return (
    <section id="results" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2 block">Cuidado e Transformação</span>
        <h2 className="text-4xl md:text-5xl font-bold italic italic-small tracking-tight font-serif">Antes & <span className="text-brand-gold italic not-italic">Depois</span></h2>
        <p className="text-brand-muted mt-4 max-w-2xl mx-auto">Visualize os resultados reais que nossos protocolos exclusivos proporcionam aos nossos pacientes.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
           <BeforeAfterSlider />
           <p className="text-xs text-center text-brand-muted mt-4 italic">* Resultados reais obtidos após 15 dias de aplicação de toxina botulínica e bioestimuladores.</p>
        </div>
        
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
             <h4 className="text-2xl font-bold mb-4 font-serif">Protocolo de Rejuvenescimento Facial</h4>
             <p className="text-brand-muted mb-6">
               O resultado acima vem da combinação planejada de toxina botulínica e bioestimulador de colágeno. Cada aplicação é calculada para a sua anatomia, suavizando linhas de expressão sem paralisar o rosto.
             </p>
             <ul className="space-y-4 mb-8">
                {[
                  "Primeiros resultados em poucos dias",
                  "Efeito natural, com a sua expressão preservada",
                  "Mínimo desconforto",
                  "Sem tempo de recuperação"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="text-green-500" size={18} />
                    {item}
                  </li>
                ))}
             </ul>
             <a
               href="/protocolos/rejuvenescimento-facial/"
               className="text-brand-accent font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
             >
               Conhecer o protocolo completo <ArrowRight size={16} />
             </a>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="bg-brand-accent/5 p-6 rounded-2xl border border-brand-accent/10">
                <span className="text-3xl font-bold text-brand-accent font-serif block mb-1">10k+</span>
                <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Aplicações Realizadas</span>
             </div>
             <div className="bg-slate-900 p-6 rounded-2xl">
                <span className="text-3xl font-bold text-white font-serif block mb-1">15% Off</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Na primeira sessão</span>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const DoctorProfile = () => {
  return (
    <section id="about" className="py-24 px-6 bg-white overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto">
         <div className="bg-brand-beige rounded-[3rem] p-8 md:p-20 grid md:grid-cols-2 gap-16 items-center border border-slate-100">
            <div className="relative">
               <div className="aspect-[4/5] bg-slate-300 rounded-3xl overflow-hidden shadow-2xl relative z-10 border-[10px] border-white">
                 <img 
                   src={doctorTeamImg} 
                   alt="Equipe de especialistas da Integrallys Estética Avançada"
                   className="w-full h-full object-cover"
                   loading="lazy"
                   referrerPolicy="no-referrer"
                 />
               </div>
               <div className="absolute -top-10 -right-10 bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-lg transform rotate-12 z-20 hidden md:flex border border-slate-100">
                  <div className="text-center">
                    <span className="block text-2xl font-bold font-serif">5+</span>
                    <span className="text-[8px] uppercase font-bold text-brand-muted">Anos Exp.</span>
                  </div>
               </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2 block">Nossa Expertise</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif tracking-tight">Equipe Especializada</h2>
              <p className="text-brand-muted text-lg mb-8 leading-relaxed italic italic-small font-serif">
                "Na Integrallys, acreditamos que a verdadeira beleza reside na harmonia. Nossa missão é realçar sua melhor versão mantendo a essência do seu olhar."
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md shrink-0">
                    <Award className="text-brand-accent" size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">Certificados Internacionais</h5>
                    <p className="text-sm text-brand-muted">Especialistas formados nos maiores centros globais de estética e rejuvenescimento facial.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md shrink-0">
                    <Users className="text-brand-accent" size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">Atendimento Personalizado</h5>
                    <p className="text-sm text-brand-muted">Protocolos desenhados individualmente para as necessidades de cada tipo de pele e anatomia.</p>
                  </div>
                </div>
              </div>
              <a
                href="#contact"
                className="inline-block mt-10 bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-brand-accent transition-all"
              >
                Conheça Nossa Clínica
              </a>
            </div>
         </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    // Avaliações reais publicadas no Google Business Profile. Texto transcrito
    // literalmente — não editar o conteúdo das citações.
    {
      id: 1,
      name: "Priscila Santana",
      role: "Avaliação no Google",
      content: "Minha experiência com a Integrallys foi maravilhosa. Um atendimento de qualidade, profissional excepcional. Meus resultados foram incríveis.",
      rating: 5,
      image: priscilaImg
    },
    {
      id: 2,
      name: "Samy Farias",
      role: "Avaliação no Google",
      content: "Ótimo atendimento, resultados impecáveis dos procedimentos, espaço lindo e confortável. Com certeza voltarei. 🤩",
      rating: 5,
      image: samyImg
    },
    {
      id: 3,
      name: "Vitor Moreno",
      role: "Avaliação no Google",
      content: "Clinica maravilhosa. Todos os procedimentos que faco o resultado sao maravilhosos. Alem de qualidade e preço",
      rating: 5,
      image: vitorImg
    }
  ];

  return (
    <section className="py-24 px-6 bg-brand-accent relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 block">Depoimentos</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-serif italic italic-small tracking-tight">O Que Dizem <span className="italic not-italic opacity-50">Nossos Pacientes</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {testimonials.map((t) => (
             <div key={t.id} className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20 text-white flex flex-col">
                <div className="flex gap-1 text-yellow-400 mb-6">
                   {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg italic leading-relaxed mb-8 font-serif opacity-90 grow">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-white/30 bg-white/15 flex items-center justify-center">
                    {t.image ? (
                      <img src={t.image} alt={`Foto de ${t.name}`} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="font-serif text-xl font-bold text-white/90">{t.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold">{t.name}</h5>
                    <span className="text-xs text-white/60 uppercase tracking-widest">{t.role}</span>
                  </div>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
           <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 flex gap-12 text-white font-serif italic text-lg whitespace-nowrap">
             <div>+2.000 <span className="text-sm not-italic opacity-60">Pacientes</span></div>
             <div className="border-l border-white/20 pl-12">5,0/5 <span className="text-sm not-italic opacity-60 text-nowrap">Avaliações no Google</span></div>
           </div>
           <a
             href={GOOGLE_REVIEWS_URL}
             target="_blank"
             rel="noopener noreferrer"
             className="text-white/70 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2"
           >
             Ver todas as avaliações no Google <ArrowRight size={14} />
           </a>
        </div>
      </div>
    </section>
  );
};

const Faq = () => {
  const faqs = [
    { q: "O procedimento de botox dói?", a: "A aplicação é feita com agulhas extremamente finas e utilizamos anestésico tópico, tornando o desconforto mínimo e totalmente suportável." },
    { q: "Quanto tempo dura o efeito da harmonização?", a: "Geralmente entre 12 a 18 meses, dependendo do metabolismo individual e do produto utilizado." },
    { q: "Posso voltar a trabalhar no mesmo dia?", a: "Sim! A maioria de nossos procedimentos permite o retorno imediato às atividades sociais, com apenas algumas recomendações básicas." },
    { q: "Como agendo minha primeira avaliação?", a: "Você pode agendar pelo botão de WhatsApp em nosso site ou preenchendo o formulário abaixo." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-serif italic tracking-tight">Perguntas Frequentes</h2>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-slate-200 pb-4">
            <button 
              className="w-full flex justify-between items-center py-4 text-left font-bold text-lg hover:text-brand-accent transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {f.q}
              <ChevronRight className={`transition-transform duration-300 ${openIndex === i ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-brand-muted pb-6 leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactForm = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-white overflow-hidden relative scroll-mt-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div>
           <span className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2 block">Dê o Primeiro Passo</span>
           <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif italic italic-small tracking-tight leading-tight">Agende sua <br /> <span className="text-brand-accent italic not-italic">Sessão</span> de Avaliação</h2>
           <p className="text-brand-muted text-lg mb-12 leading-relaxed">
             Preencha o formulário e nossa equipe entrará em contato em até 24 horas para encontrar o melhor horário para você.
           </p>

           <div className="space-y-8">
              <div className="flex items-start gap-6">
                 <div className="w-14 h-14 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-accent shadow-sm border border-slate-100 shrink-0">
                    <MapPin size={24} />
                 </div>
                 <div>
                    <h5 className="font-bold text-lg mb-1">Localização</h5>
                    <p className="text-brand-muted text-sm leading-relaxed">Rua Professor Telmo de Souza Torres, 255 sala 206 <br /> Vila Velha, ES - Brasil</p>
                 </div>
              </div>
              <div className="flex items-start gap-6">
                 <div className="w-14 h-14 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-accent shadow-sm border border-slate-100 shrink-0">
                    <Phone size={24} />
                 </div>
                 <div>
                    <h5 className="font-bold text-lg mb-1">Telefone / WhatsApp</h5>
                    <p className="text-brand-muted text-sm">(27) 99968-7380</p>
                 </div>
              </div>
              <div className="flex items-start gap-6">
                 <div className="w-14 h-14 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-accent shadow-sm border border-slate-100 shrink-0">
                    <Mail size={24} />
                 </div>
                 <div>
                    <h5 className="font-bold text-lg mb-1">E-mail</h5>
                    <p className="text-brand-muted text-sm">contato@integrallys.com.br</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-brand-beige p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative z-10">
           <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nome Completo</label>
                    <input type="text" placeholder="Seu nome" className="w-full bg-white border border-slate-200 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-sans" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">WhatsApp</label>
                    <input type="tel" placeholder="(27) 00000-0000" className="w-full bg-white border border-slate-200 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-sans" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Protocolo de Interesse</label>
                 <select className="w-full bg-white border border-slate-200 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-sans appearance-none cursor-pointer">
                    <option>Selecione uma opção</option>
                    {protocols.map((protocol) => (
                      <option key={protocol.slug}>{protocol.name}</option>
                    ))}
                    <option>Outros</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Mensagem (Opcional)</label>
                 <textarea rows={4} placeholder="Diga-nos como podemos te ajudar..." className="w-full bg-white border border-slate-200 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-sans resize-none"></textarea>
              </div>
              <button className="w-full bg-brand-accent text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 hover:shadow-xl hover:shadow-slate-200 transition-all">
                Enviar Mensagem
              </button>
           </form>
        </div>
      </div>
    </section>
  );
};
// --- MAIN WRAPPER ---

export default function IntegrallysSite() {
  return (
    <div className="selection:bg-brand-accent selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <ValueProps />
      <Results />
      <Protocols />
      <DoctorProfile />
      <Testimonials />
      <Faq />
      <ContactForm />
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
