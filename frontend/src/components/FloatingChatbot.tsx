import { useState, useEffect, useRef } from "react";
import { Bot, Send, Loader2, Settings, Sparkles, User, Edit2, Check, X, MessageCircle, Minimize2, Paperclip, File, Image as ImageIcon, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState("Risee AI");
  const [tempBotName, setTempBotName] = useState(botName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    const saved = localStorage.getItem('botName');
    if (saved) { setBotName(saved); setTempBotName(saved); }
    const savedMsgs = localStorage.getItem('chatMessages');
    if (savedMsgs) {
      const parsed = JSON.parse(savedMsgs);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, []);

  useEffect(() => { if (messages.length > 0) localStorage.setItem('chatMessages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (!isOpen && messages.length > 0 && messages[messages.length - 1].role === 'assistant')
      setUnreadCount(p => p + 1);
  }, [messages]);
  useEffect(() => { if (isOpen) setUnreadCount(0); }, [isOpen]);

  const getEducationalFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("quantum")) {
      return "⚛️ **Quantum Computing**: Qubits leverage superposition & entanglement to compute in parallel. Check our *Quantum Tech* courses on SkillVerse!";
    }
    if (q.includes("mern") || q.includes("web") || q.includes("roadmap")) {
      return "🚀 **Web Dev Roadmap**: Master HTML/CSS → JavaScript (ES6+) → React & TypeScript → Node.js & Express → MongoDB/PostgreSQL → Deploy to Vercel/Render.";
    }
    if (q.includes("interview") || q.includes("faang") || q.includes("dsa")) {
      return "🎯 **Interview Tips**: Master Two Pointers, BFS/DFS, Sliding Window & Dynamic Programming. Check our FAANG resources in the Courses tab!";
    }
    if (q.includes("course") || q.includes("haappy")) {
      return "📚 We offer expert-curated courses across Quantum Tech, AI & ML, Full-Stack Development, Cloud Computing, and Competitive Exams (GATE, GRE). Check out the Courses tab!";
    }
    return `Hello! I'm ${botName}. I'm here to help you with course advice, tech roadmaps, coding questions, and interview preparation. Ask me anything!`;
  };

  const sendMessage = async (overridePrompt?: string) => {
    const textToSend = (typeof overridePrompt === 'string' ? overridePrompt : inputMessage).trim();
    if (!textToSend) return;
    const now = Date.now();
    if (now - lastRequestTime < 1000) await new Promise(r => setTimeout(r, 1000 - (now - lastRequestTime)));

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: textToSend, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInputMessage(""); setLoading(true); setLastRequestTime(Date.now());

    // Auto-fallback model chain: tries each model in order if one is busy/unavailable
    const MODELS = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-1.5-flash',
    ];

    const callWithFallback = async (prompt: string): Promise<string> => {
      if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured.');
      let lastError = '';
      for (const model of MODELS) {
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.9, maxOutputTokens: 1024 }
              })
            }
          );
          if (resp.ok) {
            const data = await resp.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';
          }
          const e = await resp.json().catch(() => ({}));
          // If rate limited (429) or model not found (404), try next model
          if (resp.status === 429 || resp.status === 404 || resp.status === 400) {
            lastError = (e as any)?.error?.message || `Status ${resp.status}`;
            continue;
          }
          throw new Error(`API Error: ${(e as any)?.error?.message || resp.status}`);
        } catch (err: any) {
          lastError = err.message;
          continue;
        }
      }
      throw new Error(`All models unavailable. Last error: ${lastError}`);
    };

    try {
      const systemPrompt = "You are Risee AI, a helpful learning companion. Be specific, concise, and avoid repeating yourself.";
      const recent = [...messages, userMsg].slice(-10);
      const prompt = `${systemPrompt}\n\n${recent.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nRespond helpfully.`;
      const aiText = await callWithFallback(prompt);
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: aiText, timestamp: new Date() }]);
    } catch (err: any) {
      console.warn('Floating chatbot fallback engaged:', err);
      const fallbackText = getEducationalFallback(textToSend);
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: fallbackText, timestamp: new Date() }]);
    } finally { setLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const saveBotName = () => { if (tempBotName.trim()) { setBotName(tempBotName.trim()); localStorage.setItem('botName', tempBotName.trim()); setIsEditingName(false); } };
  const clearChat = () => { setMessages([]); localStorage.removeItem('chatMessages'); setSettingsOpen(false); };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* FAB trigger */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-2xl text-white shadow-[0_8px_32px_rgba(124,58,237,0.5)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.7)] transition-all duration-300 hover:scale-105 group"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageCircle className="w-6 h-6 mx-auto" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[580px] rounded-2xl border border-border/60 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col animate-scale-in"
          style={{ background: 'hsl(230,25%,7%)' }}>

          {/* Orb bg */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 60%)', filter: 'blur(50px)' }} />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between p-4 border-b border-zinc-800 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                <Sparkles className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#121216]" />
              </div>
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input value={tempBotName} onChange={e => setTempBotName(e.target.value)}
                      className="text-sm font-semibold text-white bg-white/10 border border-zinc-700 rounded-lg px-2 py-0.5 w-28 outline-none focus:border-primary/50"
                      onKeyDown={e => e.key === 'Enter' && saveBotName()} autoFocus />
                    <button onClick={saveBotName} className="text-emerald-400 hover:text-emerald-300"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setIsEditingName(false)} className="text-zinc-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white" style={{fontFamily:'Sora,sans-serif'}}>{botName}</span>
                    <button onClick={() => setIsEditingName(true)} className="text-zinc-400 hover:text-white transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-zinc-400">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                    <Settings className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent style={{ background: 'hsl(230,25%,8%)', border: '1px solid hsl(230,20%,14%)' }} className="rounded-2xl max-w-xs text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white" style={{fontFamily:'Sora,sans-serif'}}>Chat Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 pt-2">
                    <button onClick={clearChat}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-4 h-4" /> Clear conversation
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
              <button onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2.5 py-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.15))' }}>
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm mb-0.5" style={{fontFamily:'Sora,sans-serif'}}>Ask me anything!</p>
                  <p className="text-[11px] text-zinc-400 max-w-[220px] leading-relaxed mx-auto mb-2">
                    Your AI companion for learning, roadmaps & career tips.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 w-full text-left">
                  {[
                    { text: "What courses are on Haappy?", icon: "📚" },
                    { text: "Explain Quantum Computing simply", icon: "⚛️" },
                    { text: "Full-Stack MERN 30-day roadmap", icon: "🚀" },
                    { text: "DSA interview preparation tips", icon: "🎯" }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(chip.text)}
                      className="px-3 py-2 rounded-xl border border-zinc-800/80 bg-white/[0.03] hover:bg-white/[0.08] hover:border-violet-500/40 text-left transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="text-xs">{chip.icon}</span>
                      <span className="text-xs text-zinc-300 group-hover:text-white transition-colors truncate">{chip.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-sm'
                      : 'text-zinc-100 border border-zinc-700/60 rounded-bl-sm shadow-md'
                  }`}
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }
                      : { background: 'rgba(255,255,255,0.08)' }
                    }>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <span className="text-[10px] text-zinc-400 px-1">{formatTime(msg.timestamp)}</span>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-zinc-700/60 flex items-center gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* File indicator */}
          {selectedFile && (
            <div className="flex items-center gap-2 px-4 py-2 border-t border-zinc-800 bg-primary/10">
              <File className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-zinc-300 flex-1 truncate">{selectedFile.name}</span>
              <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-zinc-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2 p-3 border-t border-zinc-800 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <input type="file" ref={fileInputRef} onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" accept="image/*,.pdf,.txt" />
            <button onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
                rows={1}
                className="w-full bg-white/10 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-400 outline-none resize-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_2px_rgba(124,58,237,0.2)]"
                style={{ maxHeight: '80px', fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
            <button onClick={sendMessage} disabled={loading || !inputMessage.trim()}
              className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 flex-shrink-0 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
