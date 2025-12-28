import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Send, 
  Loader2, 
  Settings, 
  Sparkles, 
  User,
  Edit2,
  Check,
  X,
  MessageCircle,
  Minimize2,
  Paperclip,
  File,
  Image as ImageIcon,
  Sun,
  Moon
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

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState("Risee AI Assistant");
  const [tempBotName, setTempBotName] = useState(botName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Load bot name, theme, and messages from localStorage
  useEffect(() => {
    const savedBotName = localStorage.getItem('botName');
    if (savedBotName) {
      setBotName(savedBotName);
      setTempBotName(savedBotName);
    }

    const savedTheme = localStorage.getItem('chatbotTheme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update unread count
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Reset unread count when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Send message to Gemini API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Rate limiting: wait at least 2 seconds between requests for better variety
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < 2000) {
      const waitTime = 2000 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setLoading(true);
    setLastRequestTime(Date.now());

    try {
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured. Please add your key to the .env file as VITE_OPENAI_API_KEY.');
      }

      const systemPrompt =
        "You are Risee AI Assistant, a helpful learning companion. Be specific and avoid repeating the same answer. If the user asks the same question again, respond with a different explanation, new examples, or a new angle.";

      const recent = [...messages, userMessage].slice(-10);

      const chatMessages = [
        { role: "system" as const, content: systemPrompt },
        ...recent.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: chatMessages,
            temperature: 0.9,
            max_tokens: 1024,
            top_p: 0.95,
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);

        if (response.status === 401 || response.status === 403) {
          throw new Error('OpenAI API key invalid or unauthorized. Check your key and project settings.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded by OpenAI. Please wait a moment before trying again.');
        } else {
          throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      console.log('OpenAI API Response:', data);

      const aiResponse =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to connect to AI. Please check your internet connection and try again.'}`,
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

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    setSettingsOpen(false);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('chatbotTheme', newTheme);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground shadow-elevated hover:opacity-90 relative"
            size="icon"
          >
            <MessageCircle className="w-7 h-7" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]">
          <Card className={`h-full flex flex-col shadow-2xl ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white'}`}>
            {/* Header */}
            <div className="bg-gradient-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">{botName}</h3>
                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Settings Dialog */}
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                      <Settings className="w-4 h-4" />
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
                      {/* Theme Toggle */}
                      <div>
                        <label className="text-sm font-semibold mb-2 block">
                          Appearance
                        </label>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            {theme === 'light' ? (
                              <Sun className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <Moon className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="font-medium">
                              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={toggleTheme}
                            className="gap-2"
                          >
                            {theme === 'light' ? (
                              <>
                                <Moon className="w-4 h-4" />
                                Dark
                              </>
                            ) : (
                              <>
                                <Sun className="w-4 h-4" />
                                Light
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

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

                      <div className="pt-4 border-t space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={clearChat}
                        >
                          Clear Chat History
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Powered by Google Gemini AI
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-muted/30'}`}>
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-xs">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Hi! I'm {botName}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask me anything about courses, learning, or career advice!
                    </p>
                    <div className="space-y-2 text-xs">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => setInputMessage("What courses do you recommend?")}
                      >
                        📚 Recommend courses
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => setInputMessage("Help me with interview prep")}
                      >
                        🎯 Interview tips
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-primary text-primary-foreground'
                            : theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-background border'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className={`rounded-2xl px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-background border'}`}>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className={`border-t p-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-background'}`}>
              {/* Selected File Display */}
              {selectedFile && (
                <div className={`mb-2 flex items-center gap-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-muted'}`}>
                  <File className="w-4 h-4 text-primary" />
                  <span className="text-xs flex-1 truncate">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={removeFile}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              <div className="flex gap-2">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                
                {/* File Upload Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={loading}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                  size="icon"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
