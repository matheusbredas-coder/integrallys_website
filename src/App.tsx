import React, { useState, useRef, useEffect } from 'react';
import heroImage from './assets/images/hero.jpg';
import preenchimentoLabialImg from './assets/images/preenchimento-labial.jpg';
import harmonizacaoFacialImg from './assets/images/harmonizacao-facial.jpeg';
import lipoImg from './assets/images/lipo.jpeg';
import emagrecimentoImg from './assets/images/emagrecimento.webp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Star,
  Users,
  Award,
  Zap,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import doctorTeamImg from './assets/images/equipe-clinica.jpg';
import logoImg from './assets/images/logo.jpg';
import beforeImg from './assets/images/before_after/before.jpg';
import afterImg from './assets/images/before_after/after.jpg';

// --- CONSTANTS ---
const WHATSAPP_URL = 'https://wa.me/5527999687380';

// --- TYPES ---
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

// --- COMPONENTS ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Procedimentos', href: '#services' },
    { name: 'A clínica', href: '#about' },
    { name: 'Resultados', href: '#results' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <img src={logoImg} alt="Integrallys Logo" className="w-12 h-12 object-contain" />
           <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-tight">Integrallys</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Estética Avançada</span>
           </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium hover:text-brand-accent transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-muted">
            <Phone size={16} className="text-brand-accent" />
            <span>(27) 99968-7380</span>
          </div>
          <button className="bg-brand-accent text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-slate-200">
            Agendar Consulta
          </button>
        </div>

        <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t md:hidden flex flex-col p-6 gap-4"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">
                {link.name}
              </a>
            ))}
            <hr />
            <button className="bg-brand-accent text-white w-full py-4 rounded-xl font-semibold">
              Agendar Agora
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

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
            <button className="bg-brand-accent text-white py-4 px-10 rounded-full font-bold text-lg hover:translate-y-[-2px] hover:shadow-xl hover:shadow-slate-200 transition-all flex items-center justify-center gap-2">
              Começar Agora <ArrowRight size={20} />
            </button>
            <button className="border-2 border-slate-200 text-slate-900 py-4 px-10 rounded-full font-bold text-lg hover:bg-white hover:border-white hover:shadow-lg transition-all">
              Agendar Avaliação
            </button>
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
    <section id="results" className="py-24 px-6 max-w-7xl mx-auto">
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
             <h4 className="text-2xl font-bold mb-4 font-serif">Protocolo Revolucionário MaxInject™</h4>
             <p className="text-brand-muted mb-6">
               Nossa técnica exclusiva permite uma aplicação mais precisa com zero desperdício, garantindo que cada gota do produto atue onde é necessário para suavizar linhas de expressão sem paralisar o rosto.
             </p>
             <ul className="space-y-4">
                {[
                  "Resultados em até 48 horas",
                  "Efeito 'Natural Look' garantido",
                  "Mínimo desconforto",
                  "Sem tempo de recuperação"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="text-green-500" size={18} />
                    {item}
                  </li>
                ))}
             </ul>
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

const Services = () => {
  const services = [
    { 
      name: "Botox & Bioestimuladores", 
      desc: "Suavize rugas e estimule colágeno para uma pele firme.",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600"
    },
    { 
      name: "Preenchimento Labial", 
      desc: "Recupere o volume perdido e harmonize seus traços.",
      image: preenchimentoLabialImg
    },
    {
      name: "Harmonização Facial",
      desc: "Equilíbrio estético planejado sob medida para você.",
      image: harmonizacaoFacialImg
    },
    {
      name: "Ozonioterapia",
      desc: "Tratamento integrativo para regeneração e saúde.",
      image: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Lipo Enzimática",
      desc: "Redução de gordura localizada sem cirurgias.",
      image: lipoImg
    },
    {
      name: "Emagrecimento",
      desc: "Protocolos metabólicos para perda de peso saudável.",
      image: emagrecimentoImg
    },
  ];

  return (
    <section id="services" className="bg-brand-beige py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
             <span className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2 block">Nossos Protocolos</span>
             <h2 className="text-4xl md:text-5xl font-bold italic italic-small tracking-tight font-serif">Especialidades Integrallys</h2>
          </div>
          <button className="text-brand-accent font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Ver Todos os Procedimentos <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {services.map((s, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -10 }}
               className="bg-white rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500"
             >
                <div className="h-64 overflow-hidden relative">
                   <img 
                     src={s.image} 
                     alt={`${s.name} na Integrallys Estética Avançada, Vila Velha - ES`}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     loading="lazy"
                     referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute bottom-6 left-6 text-white font-bold text-xl">{s.name}</div>
                </div>
                <div className="p-8">
                   <p className="text-brand-muted text-sm leading-relaxed mb-6">
                     {s.desc}
                   </p>
                   <button className="text-slate-900 font-bold text-sm flex items-center gap-2 group-hover:text-brand-accent transition-colors">
                     Saiba Mais <ChevronRight size={16} />
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const DoctorProfile = () => {
  return (
    <section id="about" className="py-24 px-6 bg-white overflow-hidden">
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
              <button className="mt-10 bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-brand-accent transition-all">
                Conheça Nossa Clínica
              </button>
            </div>
         </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Mariana Silva",
      role: "Paciente de Botox",
      content: "A Integrallys mudou minha visão sobre estética. O resultado do meu botox ficou tão natural que as pessoas dizem que estou descansada, mas ninguém diz que 'fiz algo'. É exatamente o que eu queria!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=47"
    },
    {
      id: 2,
      name: "Manu P",
      role: "Harmonização Facial",
      content: "Profissionalismo impecável. O planejamento 3D do meu rosto antes do procedimento me deu muita segurança. O resultado final superou todas as minhas expectativas.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 3,
      name: "Jorge D",
      role: "Lipo Enzimática",
      content: "Estive em várias clínicas antes de encontrar a Integrallys. O protocolo de emagrecimento deles é o único que realmente funcionou para mim sem sacrifícios malucos.",
      rating: 5,
      image: "https://i.pravatar.cc/150?u=ana"
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
             <div key={t.id} className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20 text-white">
                <div className="flex gap-1 text-yellow-400 mb-6">
                   {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg italic leading-relaxed mb-8 font-serif opacity-90">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30">
                    <img src={t.image} alt={t.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h5 className="font-bold">{t.name}</h5>
                    <span className="text-xs text-white/60 uppercase tracking-widest">{t.role}</span>
                  </div>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-16 flex justify-center">
           <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 flex gap-12 text-white font-serif italic text-lg whitespace-nowrap">
             <div>+2.000 <span className="text-sm not-italic opacity-60">Pacientes</span></div>
             <div className="border-l border-white/20 pl-12">5,0/5 <span className="text-sm not-italic opacity-60 text-nowrap">Avaliações no Google</span></div>
           </div>
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
    <section id="contact" className="py-24 px-6 bg-white overflow-hidden relative">
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
                 <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Procedimento de Interesse</label>
                 <select className="w-full bg-white border border-slate-200 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-sans appearance-none cursor-pointer">
                    <option>Selecione uma opção</option>
                    <option>Botox / Toxina Botulínica</option>
                    <option>Preenchimento / Harmonização</option>
                    <option>Emagrecimento</option>
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

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/integrallys/', icon: <Instagram size={18} /> },
  { name: 'WhatsApp', href: WHATSAPP_URL, icon: <Phone size={18} /> },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100066375682865', icon: <Facebook size={18} /> },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
            <img src={logoImg} alt="Integrallys Logo" className="w-20 h-20 object-contain mb-4" />
            <h2 className="text-3xl font-bold font-serif italic mb-2 italic-small tracking-tight">Integrallys Estética</h2>
            <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">Beleza, Ciência e Harmonia</p>
        </div>

        <div className="flex gap-10 mb-12">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Integrallys no ${social.name}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-[0.2em]"
            >
               {social.icon}
               {social.name}
            </a>
          ))}
        </div>

        <div className="w-full border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-widest gap-6">
          <div>© {new Date().getFullYear()} Integrallys Estética Avançada. Todos os direitos reservados.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="/privacidade.html" className="hover:text-white transition-colors">Privacidade</a>
          </div>
          <div className="text-nowrap">Desenvolvido com sofisticação</div>
        </div>
      </div>
    </footer>
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
      <Services />
      <DoctorProfile />
      <Testimonials />
      <Faq />
      <ContactForm />
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <a 
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 transition-transform active:scale-95"
      >
        <Phone size={32} />
      </a>
    </div>
  );
}
