/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Anchor, Settings, Send, Image as ImageIcon, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getChatResponse } from "./services/geminiService";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "¡Hola! Soy tu guía de la costa cántabra. 🌊🐚\n\n¿Qué vamos a descubrir hoy sobre las dunas, los faros o los seres que viven en el mar?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model" as "user" | "model",
        parts: [{ text: msg.text }]
      }));

      const response = await getChatResponse(userMessage, history);
      
      if (response) {
        setMessages((prev) => [...prev, { role: "bot", text: response }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "¡Vaya! ⚓ Parece que ha habido una tormenta en mis circuitos. ¿Podemos intentarlo de nuevo?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="app-root" className="flex flex-col h-screen overflow-hidden bg-[#f0fdfa] font-sans">
      {/* Header: Maritime Identity */}
      <header className="header-vibrant">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#fde047] rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
             <Anchor className="w-8 h-8 text-[#075985]" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight leading-none uppercase">Guía de la Costa</h1>
            <span className="text-[#7dd3fc] text-xs font-bold uppercase tracking-widest">Explorador del Cantábrico • Nivel 4</span>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden md:flex bg-[#0c4a6e] px-4 py-2 rounded-xl items-center gap-3 border border-[#38bdf8]/30">
            <div className="w-3 h-3 bg-[#4ade80] rounded-full shadow-[0_0_8px_#4ade80]"></div>
            <span className="text-white text-sm font-semibold whitespace-nowrap">Cabo Mayor • Online</span>
          </div>
          <button className="btn-vibrant">
            MENÚ
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden p-4 md:p-6 gap-6">
        {/* Left Column: Navigation/Inventory - Hidden on mobile for focus */}
        <aside className="hidden lg:flex w-64 flex-col gap-4">
          <div className="card-notebook flex-1">
            <h3 className="text-[#075985] text-xs font-black uppercase mb-4 tracking-wider">Tu Cuaderno</h3>
            <nav className="space-y-2">
              <div className="bg-[#ccfbf1] p-3 rounded-2xl flex items-center gap-3 border-2 border-teal-200">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">🌊</div>
                <span className="text-teal-900 font-bold text-sm">Mareas</span>
              </div>
              <div className="bg-white p-3 rounded-2xl flex items-center gap-3 border-2 border-gray-50 hover:border-teal-100 cursor-pointer transition-all">
                <div className="w-8 h-8 bg-[#fde047] rounded-lg flex items-center justify-center text-white font-bold">🐚</div>
                <span className="text-gray-600 font-bold text-sm">Conchas</span>
              </div>
              <div className="bg-white p-3 rounded-2xl flex items-center gap-3 border-2 border-gray-50 hover:border-teal-100 cursor-pointer transition-all">
                <div className="w-8 h-8 bg-[#fb923c] rounded-lg flex items-center justify-center text-white font-bold">⚓</div>
                <span className="text-gray-600 font-bold text-sm">Barcos</span>
              </div>
            </nav>
          </div>
          <div className="bg-[#075985] rounded-3xl p-5 text-white shadow-lg border-b-4 border-[#0c4a6e]">
            <p className="text-xs font-bold opacity-70 uppercase mb-2">Dato del día</p>
            <p className="text-sm italic font-medium leading-relaxed">"Las dunas de Liencres son las más importantes del norte de España."</p>
          </div>
        </aside>

        {/* Middle Column: Chat Experience */}
        <main className="flex-1 flex flex-col bg-white rounded-[32px] md:rounded-[40px] shadow-xl border-4 md:border-8 border-teal-50 overflow-hidden relative">
          <div 
            ref={scrollRef}
            id="chat-container" 
            className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto scroll-smooth pb-10"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="hidden sm:flex w-12 h-12 bg-teal-100 rounded-full flex-shrink-0 items-center justify-center border-2 border-teal-300">
                      <span className="text-2xl">🤖</span>
                    </div>
                  )}
                  
                  <div 
                    className={`mensaje ${msg.role === 'user' ? 'mensaje-user' : 'mensaje-bot'}`}
                    id={`msg-${index}`}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="hidden sm:flex w-12 h-12 bg-[#fbbf24] rounded-full flex-shrink-0 items-center justify-center border-2 border-[#b45309]">
                      <span className="text-2xl">🧒</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
                id="typing-indicator"
              >
                <div className="hidden sm:flex w-12 h-12 bg-teal-100 rounded-full flex-shrink-0 items-center justify-center border-2 border-teal-300">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="mensaje mensaje-bot flex items-center space-x-2 py-4 px-6">
                  <span className="text-sm text-teal-600 font-bold italic">Pensando...</span>
                  <div className="typing-dots flex space-x-1">
                    <span className="h-1.5 w-1.5 bg-teal-400 rounded-full"></span>
                    <span className="h-1.5 w-1.5 bg-teal-400 rounded-full"></span>
                    <span className="h-1.5 w-1.5 bg-teal-400 rounded-full"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Bar */}
          <div className="h-24 px-4 md:px-8 border-t border-gray-100 flex items-center gap-4 bg-gray-50/50 backdrop-blur-sm shrink-0">
            <div className="flex-1 relative flex items-center">
              <input 
                type="text" 
                id="user-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta aquí..." 
                className="w-full h-14 bg-white border-2 border-teal-100 rounded-2xl px-6 font-bold text-[#075985] placeholder:text-teal-200 focus:outline-none focus:border-teal-400 shadow-inner transition-all"
                disabled={isTyping}
              />
              <button 
                id="send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all transform active:scale-90
                  ${!input.trim() || isTyping 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#075985] hover:scale-105'}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <button className="hidden sm:flex w-14 h-14 bg-teal-50 rounded-2xl items-center justify-center border-2 border-teal-100 hover:bg-teal-100 text-teal-600 transition-colors">
              <ImageIcon className="w-7 h-7" />
            </button>
          </div>
        </main>

        {/* Right Column: Progress - Hidden on small screens */}
        <aside className="hidden xl:flex w-72 flex-col gap-6">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-teal-100">
            <div className="w-full h-40 bg-[#bae6fd] rounded-2xl border-4 border-white shadow-inner relative overflow-hidden">
              <div className="absolute top-5 left-5 w-16 h-16 bg-[#075985] rounded-full blur-2xl opacity-20"></div>
              <div className="absolute bottom-0 w-full h-1/2 bg-teal-400 opacity-20 skew-y-6 transform translate-y-4"></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <Search className="w-10 h-10 text-[#0369a1] mb-2" />
                <span className="text-[10px] font-black text-[#075985] uppercase tracking-wider">Mapa del Sardinero</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-end px-1">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Destino</p>
                <p className="text-sm font-black text-[#075985]">Palacio de la Magdalena</p>
              </div>
              <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-1 rounded-lg">1.5 km</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-[#075985] text-xs font-black uppercase mb-4 tracking-tighter">Insignias</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100" title="Nadador"><span className="text-2xl">🏊</span></div>
                <div className="aspect-square bg-yellow-50 rounded-xl flex items-center justify-center border border-yellow-100" title="Faro"><span className="text-xl">🔦</span></div>
                <div className="aspect-square bg-green-50 rounded-xl flex items-center justify-center border border-green-100" title="Ecologista"><span className="text-xl">🌿</span></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Progreso Nivel 4</p>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)]"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


