import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: '¡Hola! Soy el asistente técnico de M.y.L Construcción. ¿En qué proyecto te podemos ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const reply = await getGeminiResponse(currentInput);
      const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: reply };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = { id: 'err', role: 'model', text: 'Tuvimos un error técnico al conectar con la IA. Podés contactarnos directamente por WhatsApp: +54 9 3543 31-5046.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[104px] right-6 z-50 font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-500 hover:bg-amber-600 text-black p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center border-2 border-black/20"
      >
        {isOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="hidden md:inline font-bold text-[10px] uppercase tracking-tighter">Consultar IA</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[85vw] md:w-96 bg-[#0a0a0a] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[500px] animate-reveal-up">
          <div className="bg-amber-500 p-5 text-black">
            <p className="font-black text-sm uppercase tracking-tight leading-none">M.y.L Construcción</p>
            <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">Soporte IA Córdoba</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050505] custom-scrollbar">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-amber-500 text-black font-semibold rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] text-amber-500 font-bold animate-pulse uppercase tracking-widest pl-2">Analizando proyecto...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex gap-2">
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Preguntá sobre tu obra..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-amber-500 text-black p-3 rounded-xl hover:bg-amber-400 transition-colors">
              <span className="text-xl font-bold">➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;