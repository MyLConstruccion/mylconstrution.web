
import React, { useState, useEffect } from 'react';
import { getReviews, addReview } from '../services/db';
import { Review } from '../types';
import { Icons } from '../constants';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ author: '', text: '', rating: 5 });
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.text) return;
    
    const result = await addReview(form);
    if (result) {
      await fetchReviews();
      setForm({ author: '', text: '', rating: 5 });
      alert('¡Gracias por tu reseña!');
    } else {
      alert('Hubo un error al enviar tu reseña. Por favor intenta más tarde.');
    }
  };

  return (
    <section id="reviews" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 font-montserrat uppercase tracking-tight">Opiniones de <span className="text-[#fbbf24]">Clientes</span></h2>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
              Nuestra reputación se construye con cada ladrillo y cada piscina terminada con éxito.
            </p>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map(r => (
                  <div key={r.id} className="glass-dark p-6 rounded-3xl border border-white/5 animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg">{r.author}</h4>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Icons.Star key={i} filled={i < r.rating} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 italic">"{r.text}"</p>
                    <p className="text-slate-500 text-[10px] mt-4 uppercase tracking-widest font-bold">{r.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">Aún no hay reseñas. ¡Sé el primero en comentar!</p>
              )}
            </div>
          </div>

          <div className="bg-white text-slate-900 p-10 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-2xl font-black mb-8 font-montserrat uppercase tracking-tighter">Dejanos tu testimonio</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Nombre Completo</label>
                <input 
                  type="text" 
                  value={form.author}
                  onChange={e => setForm({...form, author: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:outline-none focus:border-[#fbbf24] transition-all font-medium"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Tu Comentario</label>
                <textarea 
                  value={form.text}
                  onChange={e => setForm({...form, text: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:outline-none focus:border-[#fbbf24] transition-all h-32 resize-none font-medium"
                  placeholder="¿Cómo fue tu experiencia con nosotros?"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">Calificación</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setForm({...form, rating: num})}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${form.rating >= num ? 'bg-[#fbbf24] scale-110 shadow-lg' : 'bg-slate-100'}`}
                    >
                      <Icons.Star filled={form.rating >= num} />
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-[#fbbf24] hover:text-slate-900 transition-all shadow-xl uppercase tracking-widest text-sm"
              >
                Publicar mi Opinión
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
