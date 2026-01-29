
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Inicio', id: 'top' },
    { name: 'Servicios', id: 'services' },
    { name: 'Proyectos', id: 'projects' },
    { name: 'Reseñas', id: 'reviews' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || location.pathname === '/admin' ? 'py-3 md:py-4 glass shadow-xl' : 'py-6 md:py-8 bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <button onClick={() => scrollToSection('top')} className="flex items-center gap-2 md:gap-3 focus:outline-none group">
          <div className="bg-[#fbbf24] p-1.5 md:p-2 rounded-xl shadow-lg shadow-amber-500/20 group-hover:rotate-12 transition-transform">
            <Icons.Hammer />
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter text-white">
            M.y.L <span className="font-medium opacity-60">Construcción</span>
          </span>
        </button>

        <div className="flex items-center gap-3 md:gap-8">
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-[#fbbf24] transition-all focus:outline-none"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <Link
            to="/admin"
            className="px-6 py-3 rounded-2xl bg-[#fbbf24] text-black text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 hover:bg-white"
          >
            {location.pathname === '/admin' ? 'Dashboard' : 'Panel Admin'}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
