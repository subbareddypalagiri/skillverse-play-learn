import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Radio } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const LiveStreamView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/live/rooms/${id}`);
        if (res.data?.data?.room) {
          setSession(res.data.data.room);
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
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500 border-opacity-50" />
          <p className="mt-4 text-xs text-muted-foreground">Connecting to live classroom...</p>
        </div>
      </PageLayout>
    );
  }

  // Determine if the current logged in user is the host of this specific room
  const isHost = session?.hostId?._id === user?._id;

  return (
    <PageLayout noPadding fullWidth>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black relative">
        
        {/* Top Floating Info Bar */}
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
              <span className="text-[12px] font-semibold text-white">
                {session?.title || "Live Stream Classroom"}
              </span>
            </div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-white uppercase tracking-wider">{session?.category || 'Stream'}</span>
          </div>
        </div>

        {/* Jitsi Meeting Container */}
        <div className="flex-1 w-full h-full pt-16 bg-zinc-950">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={`skillverse-live-class-${id}`}
            configOverwrite={{
              startWithAudioMuted: !isHost,
              startWithVideoMuted: !isHost,
              disableDeepLinking: true,
              prejoinPageEnabled: false,
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              SHOW_CHROME_EXTENSION_BANNER: false
            }}
            userInfo={{
              displayName: user?.name || 'Student'
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
              iframeRef.style.border = 'none';
            }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default LiveStreamView;
