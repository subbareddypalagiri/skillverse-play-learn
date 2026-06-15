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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const now = Date.now();
    if (now - lastRequestTime < 1000) await new Promise(r => setTimeout(r, 1000 - (now - lastRequestTime)));

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    const currentInput = inputMessage;
    setInputMessage(""); setLoading(true); setLastRequestTime(Date.now());

    try {
      if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured.');
      const systemPrompt = "You are Risee AI, a helpful learning companion. Be specific, concise, and avoid repeating yourself.";
      const recent = [...messages, userMsg].slice(-10);
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${recent.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nRespond helpfully.` }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 1024 }
          })
        }
      );
      if (!resp.ok) {
        const e = await resp.json();
        if (resp.status === 429) throw new Error('Rate limit exceeded. Please wait 30 seconds and try again.');
        throw new Error(`API Error: ${e.error?.message || resp.status}`);
      }
      const data = await resp.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response generated.";
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: aiText, timestamp: new Date() }]);
    } catch (err: any) {
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: `Error: ${err.message}`, timestamp: new Date() }]);
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
          <div className="relative flex items-center justify-between p-4 border-b border-border/40 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                <Sparkles className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background" />
              </div>
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input value={tempBotName} onChange={e => setTempBotName(e.target.value)}
                      className="text-sm font-semibold text-foreground bg-white/5 border border-border/50 rounded-lg px-2 py-0.5 w-28 outline-none focus:border-primary/50"
                      onKeyDown={e => e.key === 'Enter' && saveBotName()} autoFocus />
                    <button onClick={saveBotName} className="text-emerald-400 hover:text-emerald-300"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setIsEditingName(false)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground" style={{fontFamily:'Sora,sans-serif'}}>{botName}</span>
                    <button onClick={() => setIsEditingName(true)} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                    <Settings className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent style={{ background: 'hsl(230,25%,8%)', border: '1px solid hsl(230,20%,14%)' }} className="rounded-2xl max-w-xs">
                  <DialogHeader>
                    <DialogTitle className="text-foreground" style={{fontFamily:'Sora,sans-serif'}}>Chat Settings</DialogTitle>
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
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.15))' }}>
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1" style={{fontFamily:'Sora,sans-serif'}}>Ask me anything!</p>
                  <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                    I'm your AI learning companion. Ask about courses, career advice, or anything you want to learn.
                  </p>
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
                      : 'text-foreground/90 border border-border/40 rounded-bl-sm'
                  }`}
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }
                      : { background: 'rgba(255,255,255,0.04)' }
                    }>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 px-1">{formatTime(msg.timestamp)}</span>
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
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-border/40 flex items-center gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
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
            <div className="flex items-center gap-2 px-4 py-2 border-t border-border/30 bg-primary/5">
              <File className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground flex-1 truncate">{selectedFile.name}</span>
              <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2 p-3 border-t border-border/40 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <input type="file" ref={fileInputRef} onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" accept="image/*,.pdf,.txt" />
            <button onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
                rows={1}
                className="w-full bg-white/4 border border-border/40 rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none resize-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_2px_rgba(124,58,237,0.12)]"
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
