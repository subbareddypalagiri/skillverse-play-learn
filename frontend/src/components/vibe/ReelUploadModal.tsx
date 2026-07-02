import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadReelVideo, createPost } from "@/lib/feedApi";
import { uploadReel } from "@/lib/reelsApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Play, Sparkles, Video } from "lucide-react";

interface ReelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'general', label: 'General' },
  { value: 'learning', label: 'Learning' },
  { value: 'project', label: 'Project' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'tip', label: 'Tips & Tricks' },
];

export const ReelUploadModal = ({ isOpen, onClose }: ReelUploadModalProps) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("general");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (videoFile: File) => uploadReelVideo(videoFile, setUploadProgress),
  });

  const publishMutation = useMutation({
    mutationFn: async (data: { caption: string; videoFile: File; postCategory: string }) => {
      const createdReel = await uploadReel({
        video: data.videoFile,
        title: data.caption.slice(0, 80) || "My Reel",
        caption: data.caption,
        category: data.postCategory,
        tags: "reel,vibe",
        duration: duration || 30,
      });

      const videoUrl = createdReel?.videoUrl || "/uploads/reels/default.mp4";

      await createPost({
        caption: data.caption || "New Reel",
        mediaType: "video",
        mediaUrls: [{ url: videoUrl }],
        category: (data.postCategory || "general") as any,
        tags: ["reel"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
      queryClient.invalidateQueries({ queryKey: ["/posts/feed"] });
      queryClient.invalidateQueries({ queryKey: ["my-reels"] });
      queryClient.invalidateQueries({ queryKey: ["reels-feed"] });
      handleClose();
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      alert("Please select a video file");
      return;
    }
    if (selectedFile.size > 200 * 1024 * 1024) {
      alert("File size must be less than 200MB");
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setUploadProgress(0);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setDuration(Math.round(video.duration));
      URL.revokeObjectURL(video.src);
    };
    video.src = url;
  };

  const handleClose = () => {
    setFile(null);
    setCaption("");
    setCategory("general");
    setPreviewUrl("");
    setUploadProgress(0);
    setDuration(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await publishMutation.mutateAsync({
        caption,
        videoFile: file,
        postCategory: category,
      });
    } catch (error) {
      alert("Failed to upload reel. Please check your network or try again.");
      console.error(error);
    }
  };

  const isUploading = publishMutation.isPending;
  const canUpload = file && !isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg bg-[#0a0a14] border border-white/10 text-white p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-600/10 pointer-events-none" />
          <div className="relative p-6">
            <DialogHeader className="mb-5">
              <DialogTitle className="text-white flex items-center gap-2 text-xl">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Video className="w-4 h-4 text-black" />
                </div>
                Create Your Reel
              </DialogTitle>
              <p className="text-sm text-white/50 mt-1">Share your story with the Vibe community</p>
            </DialogHeader>

            <div className="space-y-4">
              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group border-2 border-dashed border-white/15 rounded-2xl p-10 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="text-white/70 font-medium">Drop your video here</p>
                  <p className="text-xs text-white/40 mt-1">MP4, WebM or OGG · Max 100MB</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border border-white/10">
                    <video src={previewUrl} className="w-full h-full object-cover" controls />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur text-xs text-amber-400 flex items-center gap-1">
                      <Play className="w-3 h-3 fill-amber-400" />
                      {duration > 0 ? `${duration}s` : 'Preview'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 truncate max-w-[200px]">{file.name}</span>
                    <span className="text-white/40">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl("");
                      setUploadProgress(0);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    disabled={isUploading}
                    className="text-xs text-white/40 hover:text-white/70 disabled:opacity-50"
                  >
                    Choose different video
                  </button>
                </div>
              )}

              {file && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          disabled={isUploading}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            category === cat.value
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="What's this reel about?"
                      maxLength={2200}
                      disabled={isUploading}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 disabled:opacity-50 resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-white/30 mt-1 text-right">{caption.length}/2200</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 bg-transparent border-white/15 text-white/70 hover:bg-white/5 hover:text-white"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!canUpload}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold hover:from-amber-300 hover:to-orange-400 disabled:opacity-40"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Publish Reel
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
