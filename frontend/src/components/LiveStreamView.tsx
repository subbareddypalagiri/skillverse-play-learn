import React, { useEffect, useState, useRef } from 'react';
import PageLayout from '@/components/PageLayout';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Radio, Users, Send, Heart, Flame, ShieldAlert, BadgeCheck, MessageSquare, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  timestamp: Date;
  isAdminOrHost?: boolean;
}

const LiveStreamView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [activeViewers, setActiveViewers] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Hardcoded comments to spawn randomly for "live simulation"
  const simulatedComments = [
    "Wow, this explanation is so clear!",
    "Can we use this pipeline in GitLab CI too?",
    "Which Kubernetes cluster provider are you using here?",
    "Nice tip about the Docker layer caching!",
    "Ah now I understand why my builds were taking so long",
    "Should we write custom dockerfiles or use buildpacks?",
    "Awesome content!",
    "Is there any lab we can practice this on?",
    "Amazing stream host! 🔥",
    "Can you explain the useMemo problem again?",
    "Does this work on mobile React Native too?"
  ];

  const simulatedNames = [
    "Abhinav K", "Subba Reddy", "Jane Doe", "Rohan P", "Kiran Shah", "Pranav", "Nikhil G", "Aishwarya", "Vikram"
  ];

  // Fetch session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/live/rooms/${id}`);
        if (res.data?.data?.room) {
          setSession(res.data.data.room);
          setActiveViewers(res.data.data.room.viewerCount || 42);
        }
      } catch (err) {
        console.error('Error fetching room details:', err);
        toast({
          title: "Error Loading Stream",
          description: "This live session may have ended or does not exist.",
          variant: "destructive"
        });
        navigate('/live-rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video auto-play blocked: ", e));
    }
  }, [session]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate active stream chatting & viewer changes
  useEffect(() => {
    if (loading || !session) return;

    // Set initial welcome message
    setMessages([
      {
        id: 'system-1',
        sender: 'System Admin',
        text: 'Welcome to the Live stream! Keep the discussion focused on the current topic. Happy learning!',
        timestamp: new Date(),
        isAdminOrHost: true
      }
    ]);

    // Spawn comments periodically
    const commentInterval = setInterval(() => {
      const randomName = simulatedNames[Math.floor(Math.random() * simulatedNames.length)];
      const randomText = simulatedComments[Math.floor(Math.random() * simulatedComments.length)];
      
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: randomName,
          text: randomText,
          timestamp: new Date()
        }
      ]);
    }, 4500);

    // Bounce viewer count slightly
    const viewerInterval = setInterval(() => {
      setActiveViewers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 8000);

    return () => {
      clearInterval(commentInterval);
      clearInterval(viewerInterval);
    };
  }, [loading, session]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: user?.name || 'Student',
        text: newMsg.trim(),
        timestamp: new Date(),
        isAdminOrHost: user?.role === 'admin' || user?.role === 'instructor' || user?.canHostLive
      }
    ]);

    setNewMsg('');
  };

  const sendHeartReaction = () => {
    toast({
      title: "Reaction Sent",
      description: "You sent a ❤️ to the host!"
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500 border-opacity-50" />
          <p className="mt-4 text-xs text-muted-foreground">Connecting to streaming endpoint...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout noPadding fullWidth>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background">
        
        {/* Main Stream Area */}
        <div className="flex-1 relative flex flex-col justify-between bg-black">
          
          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/5 pointer-events-auto">
              <Button onClick={() => navigate('/live-rooms')} variant="ghost" size="icon" className="w-7 h-7 text-white hover:bg-white/10 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-500 text-white flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE
                </span>
                <span className="text-[10px] font-medium text-white/90 flex items-center gap-1">
                  <Users className="w-3 h-3 text-white/70" />
                  {activeViewers} watching
                </span>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-semibold text-white uppercase tracking-wider">{session?.category}</span>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            <video
              ref={videoRef}
              src={session?.streamUrl}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Title bar */}
          <div className="bg-black/80 backdrop-blur-md p-4 border-t border-white/5 relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center font-bold text-white text-sm">
                {session?.hostId?.avatar ? (
                  <img src={session.hostId.avatar} alt={session.hostId.name} className="w-full h-full object-cover" />
                ) : (
                  session?.hostId?.name.charAt(0)
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {session?.title}
                  <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />
                </h2>
                <p className="text-[10px] text-white/70">{session?.hostId?.name} • Host</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={sendHeartReaction} variant="ghost" size="icon" className="w-9 h-9 text-red-500 hover:bg-white/5 rounded-xl">
                <Heart className="w-5 h-5 fill-red-500" />
              </Button>
              <Button onClick={sendHeartReaction} variant="ghost" size="icon" className="w-9 h-9 text-amber-500 hover:bg-white/5 rounded-xl">
                <Flame className="w-5 h-5 fill-amber-500" />
              </Button>
            </div>
          </div>

        </div>

        {/* Live Chat Panel */}
        <div className="w-full lg:w-96 flex flex-col justify-between border-l border-border bg-card">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Live Feed</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-medium">
              Connected
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh] lg:max-h-none">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2.5">
                <div className="w-6.5 h-6.5 rounded-full bg-muted overflow-hidden flex items-center justify-center font-bold text-[10px] text-muted-foreground flex-shrink-0">
                  {msg.avatar ? (
                    <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
                  ) : (
                    msg.sender.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-bold text-foreground flex items-center gap-1">
                      {msg.sender}
                      {msg.isAdminOrHost && (
                        <span className="text-[8px] px-1 py-0.2 bg-primary/10 border border-primary/25 text-primary rounded-md font-semibold">
                          Host
                        </span>
                      )}
                    </span>
                    <span className="text-[8px] text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/90 mt-0.5 leading-relaxed bg-muted/20 p-2 rounded-xl rounded-tl-none inline-block">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-muted/10 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Send message to stream..."
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              className="rounded-xl flex-1 text-xs"
            />
            <Button type="submit" size="icon" className="rounded-xl flex-shrink-0 bg-primary shadow-sm">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

      </div>
    </PageLayout>
  );
};

export default LiveStreamView;
