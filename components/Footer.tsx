
import React from 'react';
import { CONTACT_INFO, Icons } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#fbbf24] p-1 rounded-lg">
                <Icons.Hammer />
              </div>
              <span className="text-xl font-extrabold tracking-tighter">
                M.y.L <span className="font-normal opacity-70">Construcción</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Expertos en construcción premium en la ciudad de Córdoba y alrededores. Calidad garantizada en cada obra.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-[#fbbf24] hover:text-slate-900 transition-all">FB</a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-[#fbbf24] hover:text-slate-900 transition-all">IG</a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 font-montserrat">Navegación</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Proyectos</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Reseñas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 font-montserrat">Servicios</h4>
            <ul className="space-y-3 text-slate-400">
              <li>Piletas de Hormigón</li>
              <li>Durlock Premium</li>
              <li>Pintura de Obra</li>
              <li>Remodelaciones</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 font-montserrat">Contacto</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-[#fbbf24] mt-1">📍</span>
                {CONTACT_INFO.address}
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#fbbf24] mt-1">📞</span>
                {CONTACT_INFO.whatsapp}
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#fbbf24] mt-1">✉️</span>
                {CONTACT_INFO.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} M.y.L Construcción. Todos los derechos reservados. | Córdoba, Argentina.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
