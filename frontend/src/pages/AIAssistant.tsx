import { useState, useEffect, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  Loader2, 
  Settings, 
  Sparkles, 
  User,
  Edit2,
  Check,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState("Risee AI Assistant");
  const [tempBotName, setTempBotName] = useState(botName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Load bot name from localStorage
  useEffect(() => {
    const savedBotName = localStorage.getItem('botName');
    if (savedBotName) {
      setBotName(savedBotName);
      setTempBotName(savedBotName);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getEducationalFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("quantum")) {
      return "⚛️ **Quantum Computing Overview**:\n\n1. **Qubits vs Bits**: Unlike classical bits (0 or 1), qubits leverage quantum superposition to exist in states α|0⟩ + β|1⟩ simultaneously, offering exponential parallel state representation.\n2. **Entanglement**: Two or more particles remain intrinsically linked so measuring one immediately reveals information about the other, even across vast distances.\n3. **Key Algorithms**: Shor's algorithm (exponential factoring) and Grover's algorithm (quadratic search speedup).\n4. **Recommended on SkillVerse**: Check out our *Quantum Computing & Qiskit Masterclass* under Learning Paths!";
    }
    if (q.includes("mern") || q.includes("web") || q.includes("roadmap") || q.includes("full stack") || q.includes("frontend")) {
      return "🚀 **30-Day Full-Stack Web Development Roadmap**:\n\n• **Days 1-7 (Modern Frontend)**: React 18, TypeScript, TailwindCSS & component architecture.\n• **Days 8-15 (State & APIs)**: TanStack React Query, Context API, REST APIs & custom hooks.\n• **Days 16-22 (Backend Architecture)**: Node.js, Express.js, JWT authentication, & middleware.\n• **Days 23-28 (Database & Deployment)**: MongoDB Atlas / PostgreSQL, Docker basics, and deployment to Vercel/Render.\n• **Days 29-30 (Polish & Portfolio)**: Add live WebSocket features, responsive design & README docs!";
    }
    if (q.includes("interview") || q.includes("faang") || q.includes("dsa") || q.includes("coding")) {
      return "🎯 **Interview Preparation Strategy**:\n\n1. **Core DSA Patterns**: Two Pointers, Sliding Window, Fast & Slow Pointers, BFS/DFS, Top K Elements (Heaps), and Dynamic Programming.\n2. **System Design Essentials**: Rate Limiting, Caching (Redis), Load Balancing, Database Sharding, and Event-Driven Architecture (Kafka/RabbitMQ).\n3. **Behavioral STAR Technique**: Situation, Task, Action, Result for leadership and problem-solving questions.\n4. Explore our *Competitive Programming & FAANG Coding Interviews* resources in the Courses tab!";
    }
    if (q.includes("resume") || q.includes("career") || q.includes("ats")) {
      return "💼 **ATS-Proof Tech Resume Checklist**:\n\n1. **Quantified Impact**: Use Google's formula: *Accomplished [X], measured by [Y], by doing [Z]* (e.g. 'Reduced API latency by 45% by implementing Redis caching').\n2. **Keyword Optimization**: Include targeted keywords from the job description (e.g. React, TypeScript, Node.js, AWS, Docker).\n3. **Single-column Layout**: Avoid multi-column tables, complex icons, or graphics that break ATS parsers.\n4. Check the **Career Hub** tab on SkillVerse for live internship and job openings!";
    }
    return `Hello! I'm ${botName}. I'm here to help you accelerate your technical learning, master full-stack development, prepare for competitive exams (GATE, GRE), and explore quantum tech. How can I assist your learning journey today?`;
  };

  // Send message to Gemini API with fallback
  const sendMessage = async (overridePrompt?: string) => {
    const textToSend = (typeof overridePrompt === 'string' ? overridePrompt : inputMessage).trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

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
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
              })
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
          }
          const errorData = await response.json().catch(() => ({}));
          // If rate limited (429), model not found (404) or bad request (400), try next model
          if (response.status === 429 || response.status === 404 || response.status === 400) {
            lastError = (errorData as any)?.error?.message || `Status ${response.status}`;
            continue;
          }
          throw new Error(`API Error: ${response.status} - ${(errorData as any)?.error?.message || 'Unknown error'}`);
        } catch (err: any) {
          lastError = err.message;
          continue;
        }
      }
      throw new Error(`All models unavailable. Last error: ${lastError}`);
    };

    try {
      const aiResponse = await callWithFallback(textToSend);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.warn('Gemini API fallback engaged:', error);
      const fallbackResponse = getEducationalFallback(textToSend);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Save bot name
  const saveBotName = () => {
    if (tempBotName.trim()) {
      setBotName(tempBotName.trim());
      localStorage.setItem('botName', tempBotName.trim());
      setIsEditingName(false);
    }
  };

  // Cancel name edit
  const cancelNameEdit = () => {
    setTempBotName(botName);
    setIsEditingName(false);
  };

  return (
    <PageLayout>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{botName}</h1>
                  <p className="text-muted-foreground">Powered by Google Gemini AI</p>
                </div>
              </div>
              
              {/* Settings Dialog */}
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chatbot Settings</DialogTitle>
                    <DialogDescription>
                      Customize your AI assistant
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Bot Name
                      </label>
                      {isEditingName ? (
                        <div className="flex gap-2">
                          <Input
                            value={tempBotName}
                            onChange={(e) => setTempBotName(e.target.value)}
                            placeholder="Enter bot name"
                            className="flex-1"
                          />
                          <Button size="sm" onClick={saveBotName}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelNameEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{botName}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setIsEditingName(true)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>API Status:</strong> Connected to Google Gemini
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Chat Container */}
          <Card className="flex-1 flex flex-col shadow-elevated overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Welcome to {botName}!</h3>
                    <p className="text-muted-foreground mb-6">
                      I'm here to help you with your questions. Ask me anything about learning, 
                      courses, career advice, or general knowledge!
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full max-w-lg mx-auto">
                      <button 
                        onClick={() => sendMessage("Explain Quantum Superposition & Qubits in simple terms")}
                        className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/90 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">⚛️</span>
                          <span className="text-xs font-semibold text-white group-hover:text-violet-400 transition-colors">Quantum Superposition</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">Understand qubits, quantum states, and computing principles.</p>
                      </button>

                      <button 
                        onClick={() => sendMessage("Design a 30-day Full-Stack MERN study roadmap")}
                        className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/90 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">🚀</span>
                          <span className="text-xs font-semibold text-white group-hover:text-violet-400 transition-colors">30-Day MERN Roadmap</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">Step-by-step master plan for React, Node, Express & MongoDB.</p>
                      </button>

                      <button 
                        onClick={() => sendMessage("Top System Design & DSA interview questions for FAANG")}
                        className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/90 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">🎯</span>
                          <span className="text-xs font-semibold text-white group-hover:text-violet-400 transition-colors">Interview Preparation</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">Key DSA patterns and scalable system design architectures.</p>
                      </button>

                      <button 
                        onClick={() => sendMessage("How do I optimize my tech resume to pass ATS scanners?")}
                        className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/90 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">💼</span>
                          <span className="text-xs font-semibold text-white group-hover:text-violet-400 transition-colors">ATS Resume Advice</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">Tips to format and quantify impact for top engineering recruiters.</p>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-muted/30">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send • Shift + Enter for new line
              </p>
            </div>
          </Card>
    </PageLayout>
  );
};

export default AIAssistant;
