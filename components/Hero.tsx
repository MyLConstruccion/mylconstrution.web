
import React from 'react';

const Hero: React.FC = () => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative h-[95vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background - Optimizado sin bg-fixed para evitar lag en el scroll */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-[25s] ease-linear hover:scale-110"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')` }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 text-center lg:text-left">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6 animate-fade-in">
            <div className="w-12 h-[1px] bg-[#fbbf24]"></div>
            <span className="text-[#fbbf24] text-[9px] font-black uppercase tracking-[0.8em]">M.y.L ARQUITECTURA & OBRA</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[140px] font-black text-white mb-8 leading-[0.8] font-montserrat tracking-tighter animate-reveal-up">
            EL LUJO DE <br />
            <span className="text-stroke-gold italic font-medium">CONSTRUIR.</span>
          </h1>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10 mt-10 animate-fade-in">
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-xl leading-relaxed text-center lg:text-left">
              Obras de alta ingeniería cordobesa por <span className="text-white font-bold">Damián, Nicolás y Leonardo.</span> Estándar premium en cada detalle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => handleScroll('projects')}
                className="group px-10 py-5 bg-[#fbbf24] text-black font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-white shadow-xl active:scale-95"
              >
                Ver Proyectos
              </button>
              <button 
                onClick={() => handleScroll('services')}
                className="group px-10 py-5 border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-white/10 active:scale-95"
              >
                Servicios
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[1px] h-full bg-white/5 hidden lg:block"></div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 hidden lg:block"></div>
    </section>
  );
};

export default Hero;
