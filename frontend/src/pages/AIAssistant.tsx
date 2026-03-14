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

  // Send message to Gemini API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: inputMessage
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => setInputMessage("What courses do you recommend for beginners?")}
                      >
                        📚 Course recommendations
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => setInputMessage("How can I improve my coding skills?")}
                      >
                        💻 Coding tips
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => setInputMessage("What are the latest tech trends?")}
                      >
                        🚀 Tech trends
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => setInputMessage("Help me prepare for interviews")}
                      >
                        🎯 Interview prep
                      </Button>
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
