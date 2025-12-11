import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Maximize2 } from "lucide-react";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoId: string;
  platform: string;
  originalUrl: string;
}

const VideoPlayer = ({ isOpen, onClose, videoTitle, videoId, platform, originalUrl }: VideoPlayerProps) => {
  // Get embed URL based on platform
  const getEmbedUrl = () => {
    if (platform === "YouTube") {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
    } else if (platform === "NPTEL") {
      // NPTEL SWAYAM - just use the original URL (it's already the preview page)
      return originalUrl;
    }
    return "";
  };

  const embedUrl = getEmbedUrl();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1200px] max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-primary" />
              {videoTitle}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(originalUrl, '_blank')}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Open on {platform}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
          {platform === "YouTube" && embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={videoTitle}
              style={{ border: 'none' }}
            />
          ) : platform === "NPTEL" ? (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-blue-900 to-purple-900">
              <div className="text-center p-8">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-2xl font-bold mb-2">NPTEL SWAYAM Course</h3>
                  <p className="text-blue-200 mb-4">Official Government Platform</p>
                </div>
                <p className="mb-6 text-gray-300">
                  NPTEL courses are best experienced on their official platform.<br/>
                  Click below to access the full course content.
                </p>
                <Button
                  onClick={() => window.open(originalUrl, '_blank')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-6 text-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open NPTEL Course
                </Button>
                <p className="mt-4 text-xs text-gray-400">
                  Free access • IIT Quality • Certificate Available
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <p className="mb-4">Video cannot be embedded</p>
                <Button
                  onClick={() => window.open(originalUrl, '_blank')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on {platform}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {platform}
              </span>
              <span className="text-sm text-muted-foreground">
                ✅ Legally embedded - All content belongs to original creators
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
