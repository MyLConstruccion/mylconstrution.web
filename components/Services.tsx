
import React from 'react';

const services = [
  {
    title: 'Piletas de Hormigón',
    desc: 'Espejos de agua de alta ingeniería. Estética minimalista con tecnología de filtrado invisible.',
    icon: '🏊',
    bg: 'bg-blue-50/50'
  },
  {
    title: 'Durlock Maestro',
    desc: 'Construcción en seco con nivel de detalle milimétrico. Cielorrasos con iluminación arquitectónica.',
    icon: '🏗️',
    bg: 'bg-amber-50/50'
  },
  {
    title: 'Pintura & Textura',
    desc: 'Aplicaciones de lujo, microcemento y revestimientos plásticos con acabado Premium.',
    icon: '🎨',
    bg: 'bg-emerald-50/50'
  },
  {
    title: 'Reformas Integrales',
    desc: 'Transformación total de espacios con materiales nobles. Elevamos la plusvalía de tu propiedad.',
    icon: '✨',
    bg: 'bg-purple-50/50'
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 bg-[#f8fafc]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
          <div className="max-w-3xl">
            <p className="text-[#fbbf24] font-black uppercase tracking-[0.6em] text-[10px] mb-4">Nuestra Experticia</p>
            <h2 className="text-5xl md:text-8xl font-black text-slate-950 font-montserrat tracking-tighter uppercase leading-[0.85]">
              SOLUCIONES <br /> <span className="text-[#fbbf24]">DE AUTOR</span>
            </h2>
          </div>
          <p className="text-slate-500 max-w-sm text-xl font-light leading-relaxed border-l-2 border-slate-200 pl-8">
            Diseñamos y ejecutamos proyectos que definen un nuevo estándar en la construcción cordobesa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white p-12 rounded-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700 border border-slate-100 flex flex-col items-center text-center"
            >
              <div className={`w-24 h-24 rounded-[2.5rem] ${s.bg} flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 font-montserrat leading-tight tracking-tight uppercase">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed text-base font-light mb-10">{s.desc}</p>
              
              <div className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24]">Saber Más</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
