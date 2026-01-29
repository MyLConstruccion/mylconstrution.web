import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import AdminPanel from './components/AdminPanel';
// Se eliminó la importación del Chatbot
import Footer from './components/Footer';
import { CONTACT_INFO, Icons } from './constants';

const LandingPage = () => (
  <div className="animate-fade-in" id="top">
    <Hero />
    <div id="services">
      <Services />
    </div>
    <div id="projects">
      <Gallery />
    </div>
    <div id="reviews">
      <Reviews />
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#f8fafc]">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <Footer />
        
        {/* Botón Flotante de WhatsApp */}
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
          <a 
            href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=Hola! Vengo desde su sitio web y me gustaría solicitar un presupuesto para una obra.`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
            title="Solicitar Presupuesto"
          >
            <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
            <Icons.WhatsApp />
            <span className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl translate-x-4 group-hover:translate-x-0 tracking-widest uppercase">
              Presupuesto Express
            </span>
          </a>
        </div>

        {/* Se eliminó el componente Chatbot de aquí */}
      </div>
    </HashRouter>
  );
};

export default App;