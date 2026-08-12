import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEventMessages, sendEventMessage } from '@/lib/eventsApi';
import { cn } from '@/lib/utils';

interface Message {
  _id: string;
  text: string;
  senderId: { _id: string; name: string; avatar?: string; role?: string };
  createdAt: string;
}

interface EventChatProps {
  eventId: string;
  onClose?: () => void;
  isFullScreen?: boolean;
}

export const EventChat: React.FC<EventChatProps> = ({ eventId, onClose, isFullScreen = false }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const data = await fetchEventMessages(eventId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setLoading(false);
    }
  };

  // Smart Polling
  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [eventId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const tempText = inputText;
    setInputText('');

    try {
      const newMsg = await sendEventMessage(eventId, tempText);
      setMessages((prev) => [...prev, newMsg]);
    } catch (error) {
      console.error('Error sending message', error);
      alert('Failed to send message');
      setInputText(tempText); // revert
    }
  };

  const chatBody = (
    <div className="flex flex-col h-full bg-[#09090b] text-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111115] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Live Trip Chat</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        {loading && messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground text-center">No messages yet. Say hi to the trip members! 👋</div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId._id === user?._id;
            const isAmbassador = msg.senderId.role === 'campus_ambassador';
            
            return (
              <div key={msg._id} className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                {!isMe && (
                  <span className={cn("text-[10px] mb-1 px-1 font-semibold", isAmbassador ? "text-emerald-400" : "text-muted-foreground")}>
                    {msg.senderId.name} {isAmbassador && '🛡️'}
                  </span>
                )}
                <div className={cn(
                  "px-3 py-2 rounded-2xl text-sm break-words relative",
                  isMe 
                    ? "bg-violet-600 text-white rounded-tr-sm" 
                    : "bg-[#1f1f23] text-zinc-200 border border-white/5 rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#111115] border-t border-white/10">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message the group..."
            className="flex-1 bg-[#1a1a1e] border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-4 h-4 text-white -ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );

  if (isFullScreen) {
    return chatBody;
  }

  // Floating window style for overlay
  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[500px] z-50 shadow-2xl animate-reveal-up">
      {chatBody}
    </div>
  );
};
