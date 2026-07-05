import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadReelVideo, createPost } from "@/lib/feedApi";
import { uploadReel, getCloudinarySignature, uploadReelDirect } from "@/lib/reelsApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Play, Sparkles, Video, Link as LinkIcon, CloudUpload } from "lucide-react";

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
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
  const [videoLink, setVideoLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("general");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDirectUploading, setIsDirectUploading] = useState(false);
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
    setVideoLink("");
    setCaption("");
    setCategory("general");
    setPreviewUrl("");
    setUploadProgress(0);
    setDuration(0);
    setIsDirectUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const formatVideoUrl = (url: string) => {
    let cleaned = url.trim();
    if (!cleaned) return "";
    // Google Drive share link -> direct streamable video link
    if (cleaned.includes("drive.google.com/file/d/")) {
      const match = cleaned.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    // Dropbox share link -> raw streamable link
    if (cleaned.includes("dropbox.com/") && cleaned.includes("dl=0")) {
      return cleaned.replace("dl=0", "raw=1");
    }
    return cleaned;
  };

  const handleUpload = async () => {
    if (uploadMode === 'link') {
      const formattedUrl = formatVideoUrl(videoLink);
      if (!formattedUrl) return;
      try {
        setIsDirectUploading(true);
        const createdReel = await uploadReelDirect({
          videoUrl: formattedUrl,
          title: caption.slice(0, 80) || "My Reel",
          caption,
          category,
          tags: "reel,vibe",
          duration: 60,
          videoSize: 0
        });

        await createPost({
          caption: caption || "New Reel",
          mediaType: "video",
          mediaUrls: [{ url: formattedUrl }],
          category: (category || "general") as any,
          tags: ["reel"],
        });

        setIsDirectUploading(false);
        queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
        queryClient.invalidateQueries({ queryKey: ["/posts/feed"] });
        queryClient.invalidateQueries({ queryKey: ["my-reels"] });
        queryClient.invalidateQueries({ queryKey: ["reels-feed"] });
        handleClose();
      } catch (err: any) {
        setIsDirectUploading(false);
        alert(err.message || "Failed to publish reel from link.");
      }
      return;
    }

    if (!file) return;
    try {
      setIsDirectUploading(true);
      setUploadProgress(15);
      const sigData = await getCloudinarySignature().catch((err: any) => {
        console.error("Signature fetch failed:", err);
        return null;
      });
      let finalVideoUrl = "";
      let finalDuration = duration || 30;

      if (sigData && sigData.success && sigData.cloudName && sigData.apiKey && sigData.signature) {
        setUploadProgress(30);
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("api_key", sigData.apiKey);
        cloudinaryFormData.append("timestamp", String(sigData.timestamp));
        cloudinaryFormData.append("signature", sigData.signature);
        cloudinaryFormData.append("folder", sigData.folder || "skillverse/reels");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`, {
          method: "POST",
          body: cloudinaryFormData,
        });
        const cData = await res.json();
        if (res.ok && cData.secure_url) {
          finalVideoUrl = cData.secure_url;
          finalDuration = Math.round(cData.duration || duration || 30);
        } else {
          throw new Error("CLOUDINARY_ERROR: " + (cData.error?.message || "Cloud storage rejected the file"));
        }
      } else if (file.size > 4 * 1024 * 1024) {
        throw new Error("CLOUDINARY_ERROR: Cloudinary credentials in Vercel are missing or invalid! Since your file is over 4MB, please use the 'Paste Video Link' tab!");
      }

      if (finalVideoUrl) {
        setUploadProgress(90);
        const createdReel = await uploadReelDirect({
          videoUrl: finalVideoUrl,
          title: caption.slice(0, 80) || "My Reel",
          caption,
          category,
          tags: "reel,vibe",
          duration: finalDuration,
          videoSize: file.size
        });

        await createPost({
          caption: caption || "New Reel",
          mediaType: "video",
          mediaUrls: [{ url: finalVideoUrl }],
          category: (category || "general") as any,
          tags: ["reel"],
        });

        setUploadProgress(100);
        setIsDirectUploading(false);
        queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
        queryClient.invalidateQueries({ queryKey: ["/posts/feed"] });
        queryClient.invalidateQueries({ queryKey: ["my-reels"] });
        queryClient.invalidateQueries({ queryKey: ["reels-feed"] });
        handleClose();
      } else {
        setIsDirectUploading(false);
        await publishMutation.mutateAsync({
          caption,
          videoFile: file,
          postCategory: category,
        });
      }
    } catch (error: any) {
      setIsDirectUploading(false);
      const errMsg = error?.message || "Failed to upload reel.";
      if (errMsg.includes("CLOUDINARY_ERROR") || errMsg.includes("Cloudinary") || errMsg.includes("cloud_name")) {
        alert("⚠️ Cloudinary Configuration Alert:\n" + errMsg.replace("CLOUDINARY_ERROR: ", "") + "\n\n💡 Don't worry! Auto-switching you to the 'Paste Video Link' tab where you can publish instantly with 0 size limits!");
        setUploadMode('link');
      } else {
        alert(errMsg + "\n\n💡 Tip: If file upload fails on Vercel, switch to the 'Paste Video Link' tab!");
      }
      console.error(error);
    }
  };

  const isUploading = publishMutation.isPending || isDirectUploading;
  const canUpload = (uploadMode === 'file' ? file : videoLink.trim()) && !isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg bg-[#0a0a14] border border-white/10 text-white p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-600/10 pointer-events-none" />
          <div className="relative p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-white flex items-center gap-2 text-xl">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Video className="w-4 h-4 text-black" />
                </div>
                Create Your Reel
              </DialogTitle>
              <p className="text-sm text-white/50 mt-1">Share your story with the Vibe community</p>
            </DialogHeader>

            {/* Upload Mode Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl mb-4 border border-white/10">
              <button
                onClick={() => setUploadMode('file')}
                disabled={isUploading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                  uploadMode === 'file'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <CloudUpload className="w-3.5 h-3.5" />
                Upload Video File
              </button>
              <button
                onClick={() => setUploadMode('link')}
                disabled={isUploading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                  uploadMode === 'link'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Paste Video Link
              </button>
            </div>

            <div className="space-y-4">
              {uploadMode === 'file' ? (
                !file ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group border-2 border-dashed border-white/15 rounded-2xl p-8 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-white/70 font-medium">Drop your video here</p>
                    <p className="text-xs text-white/40 mt-1">MP4, WebM or OGG · Direct Cloud Upload Supported</p>
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
                          <span>Uploading directly to Cloud...</span>
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
                )
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-white/60 mb-1 uppercase tracking-wider">
                    Direct Video URL / Link (0 Risk / No Size Limit!)
                  </label>
                  <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://... (Google Drive link, Dropbox link, Cloudinary, or MP4)"
                    disabled={isUploading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 disabled:opacity-50 text-sm"
                  />
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      ⚡ 100% Risk-Free Instant Publish!
                    </p>
                    <p className="text-white/70 leading-relaxed">
                      You can paste any <strong>Google Drive share link</strong> or <strong>Dropbox link</strong>! We automatically convert it into a high-speed HD video stream with zero size limits!
                    </p>
                  </div>
                </div>
              )}

              {(file || uploadMode === 'link') && (
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
