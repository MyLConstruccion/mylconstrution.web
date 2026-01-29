import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getProjects } from '../services/db';
import { Project } from '../types';
import { Icons, CONTACT_INFO } from '../constants';

const Gallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);

  // Referencias para Auto-play y Gestos
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  const nextMedia = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (activeProject?.media) {
      setCurrentMediaIdx((prev) => (prev + 1) % activeProject.media!.length);
    }
  }, [activeProject]);

  const prevMedia = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (activeProject?.media) {
      setCurrentMediaIdx((prev) => (prev - 1 + activeProject.media!.length) % activeProject.media!.length);
    }
  }, [activeProject]);

  // Lógica de Auto-play (5 segundos)
  useEffect(() => {
    if (activeProject && activeProject.media && activeProject.media.length > 1) {
      autoplayRef.current = setInterval(() => {
        nextMedia();
      }, 5000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [activeProject, currentMediaIdx, nextMedia]);

  // Manejo de Gestos (Swipe) para celulares
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextMedia(); // Desliza a la izquierda
    if (distance < -50) prevMedia(); // Desliza a la derecha
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const openLightbox = (p: Project) => {
    setActiveProject(p);
    setCurrentMediaIdx(0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setActiveProject(null);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    document.body.style.overflow = 'auto';
  }, []);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, nextMedia, prevMedia]);

  const categories = ['Todos', 'Piletas', 'Durlock', 'Remodelación', 'Pintura'];
  const filtered = filter === 'Todos' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-[#050505] relative min-h-screen">
      <div className="container mx-auto px-6">
        {/* Encabezado Estilo Minimalista */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div>
            <span className="text-[#fbbf24] font-black uppercase tracking-[0.8em] text-[10px] mb-4 block">Portfolio Seleccionado</span>
            <h2 className="text-5xl md:text-7xl font-black text-white font-montserrat tracking-tighter uppercase leading-[0.85]">
              NUESTRAS <br /><span className="text-stroke-white opacity-20">OBRAS</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === cat ? 'bg-[#fbbf24] text-black shadow-lg shadow-amber-500/20' : 'text-white/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Principal */}
        {loading ? (
          <div className="py-40 flex flex-col items-center gap-6">
            <div className="w-10 h-10 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px]">Sincronizando galería...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div 
                key={p.id} 
                onClick={() => openLightbox(p)}
                className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#111] cursor-pointer border border-white/5 hover:border-[#fbbf24]/40 transition-all duration-500 shadow-2xl"
              >
                <img 
                  src={p.url} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                  alt={p.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                <div className="absolute top-6 left-6">
                  <span className="bg-[#fbbf24] text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{p.category}</span>
                </div>

                <div className="absolute bottom-8 left-8 right-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[#fbbf24] text-[8px] font-black uppercase tracking-[0.3em] mb-1.5">{p.location}</p>
                  <h3 className="text-2xl font-black text-white font-montserrat uppercase tracking-tight leading-none">{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox con Efectos de Alta Calidad */}
      {activeProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-2xl p-4 md:p-10 animate-fade-in" onClick={closeLightbox}>
          
          <button 
            onClick={closeLightbox} 
            className="absolute top-6 right-6 z-[110] bg-white/10 hover:bg-[#fbbf24] text-white hover:text-black w-14 h-14 rounded-full flex items-center justify-center transition-all group shadow-2xl active:scale-90"
          >
            <Icons.X />
          </button>

          <div className="w-full h-full flex flex-col items-center justify-center gap-6" onClick={e => e.stopPropagation()}>
            <div 
              className="relative w-full max-w-6xl aspect-video bg-black/40 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center group/viewer"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {activeProject.media && activeProject.media[currentMediaIdx] ? (
                activeProject.media[currentMediaIdx].type === 'video' ? (
                  <video 
                    key={activeProject.media[currentMediaIdx].url} 
                    src={activeProject.media[currentMediaIdx].url} 
                    className="w-full h-full object-contain" 
                    controls autoPlay muted loop
                  />
                ) : (
                  <img 
                    key={activeProject.media[currentMediaIdx].url}
                    src={activeProject.media[currentMediaIdx].url} 
                    className="w-full h-full object-cover md:object-contain transition-all duration-700 animate-image-entry" 
                    style={{ filter: 'contrast(1.05) brightness(1.05)' }}
                    alt={activeProject.title}
                  />
                )
              ) : (
                <img src={activeProject.url} className="w-full h-full object-contain" alt={activeProject.title} />
              )}

              {/* Controles de Navegación Lateral */}
              {activeProject.media && activeProject.media.length > 1 && (
                <>
                  <button 
                    onClick={prevMedia} 
                    className="absolute left-6 w-14 h-14 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-[#fbbf24] hover:text-black transition-all md:opacity-0 group-viewer/hover:opacity-100 z-[120] border border-white/5 backdrop-blur-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button 
                    onClick={nextMedia} 
                    className="absolute right-6 w-14 h-14 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-[#fbbf24] hover:text-black transition-all md:opacity-0 group-viewer/hover:opacity-100 z-[120] border border-white/5 backdrop-blur-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </>
              )}
            </div>

            {/* Panel de Información y Dots */}
            <div className="text-center max-w-xl w-full">
              <h2 className="text-2xl md:text-4xl font-black text-white font-montserrat uppercase tracking-tight mb-3">{activeProject.title}</h2>
              
              {/* Indicadores de Progreso (Dots) */}
              <div className="flex justify-center gap-2 mb-4">
                {activeProject.media?.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentMediaIdx(idx)}
                    className={`h-1 transition-all duration-500 rounded-full ${idx === currentMediaIdx ? 'w-10 bg-[#fbbf24]' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>

              <p className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.6em] mb-8 opacity-80">
                {activeProject.location} | ITEM {currentMediaIdx + 1} DE {activeProject.media?.length || 1}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
                <a 
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=Hola, me interesa info sobre el proyecto: ${activeProject.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#fbbf24] text-black px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl active:scale-95 text-center"
                >
                  Consultar Presupuesto
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para la animación de entrada suave */}
      <style>{`
        @keyframes imageEntry {
          from { opacity: 0; transform: scale(1.08) translateY(10px); filter: blur(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-image-entry {
          animation: imageEntry 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default Gallery;