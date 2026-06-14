import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Video, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchMyReels } from '@/lib/reelsApi';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');

const resolveMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
};

const ProfileReelsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile-reels'],
    queryFn: fetchMyReels
  });

  return (
    <Card className="p-6 border border-border/60 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">My Reels</h2>
          <p className="text-sm text-muted-foreground mt-1">All reels uploaded from your account appear here automatically.</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link to="/vibe">
            <Plus className="w-4 h-4" />
            Upload New Reel
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-10 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium">No reels uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first learning reel to start building your audience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.slice(0, 9).map((reel) => (
            <Card key={reel._id} className="overflow-hidden border-border/60">
              <video src={resolveMediaUrl(reel.videoUrl)} className="w-full h-48 object-cover" controls playsInline />
              <div className="p-3 space-y-2">
                <p className="font-medium line-clamp-1">{reel.title}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {reel.category ? <Badge variant="secondary">{reel.category}</Badge> : null}
                  <Badge variant="outline">{reel.duration}s</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>❤️ {reel.stats.likes}</span>
                  <span>💬 {reel.stats.comments}</span>
                  <span>👀 {reel.stats.views}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProfileReelsSection;
