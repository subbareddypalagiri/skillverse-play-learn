import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadReelVideo, createPost } from "@/lib/feedApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, X, Play } from "lucide-react";

interface ReelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReelUploadModal = ({ isOpen, onClose }: ReelUploadModalProps) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (videoFile: File) => {
      return uploadReelVideo(videoFile, setUploadProgress);
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: {
      mediaUrl: string;
      caption: string;
    }) => {
      return createPost({
        caption: data.caption,
        mediaType: "video",
        mediaUrls: [{ url: data.mediaUrl }],
        category: "general",
        tags: ["reel"]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/posts/feed"] });
      handleClose();
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        alert("Please select a video file");
        return;
      }

      if (selectedFile.size > 100 * 1024 * 1024) {
        alert("File size must be less than 100MB");
        return;
      }

      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setCaption("");
    setPreviewUrl("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const uploadResult = await uploadMutation.mutateAsync(file);
      await createPostMutation.mutateAsync({
        mediaUrl: uploadResult.mediaUrl,
        caption
      });
    } catch (error) {
      alert("Failed to upload reel. Please try again.");
      console.error(error);
    }
  };

  const isUploading = uploadMutation.isPending || createPostMutation.isPending;
  const canUpload = file && !isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create Reel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-400 transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">MP4, WebM or OGG (Max 100MB)</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video">
                <video
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  controls
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
              </div>

              <div className="text-sm text-slate-400">
                <p className="font-medium">{file.name}</p>
                <p className="text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Uploading</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all duration-300"
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
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={isUploading}
                className="w-full text-sm text-slate-400 hover:text-slate-300 disabled:opacity-50"
              >
                Change video
              </button>
            </div>
          )}

          {file && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Caption (Optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption to your reel..."
                maxLength={2200}
                disabled={isUploading}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 disabled:opacity-50 resize-none"
                rows={3}
              />
              <p className="text-xs text-slate-500 mt-1">
                {caption.length}/2200
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!canUpload}
              className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Reel"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
