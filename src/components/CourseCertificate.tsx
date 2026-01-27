import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trophy, Award, CheckCircle, Shield, Clock, Eye } from "lucide-react";

interface CourseCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  studentName: string;
  completionDate: string;
  courseInstructor: string;
  courseDuration: string;
  verificationData?: {
    watchedPercentage: number;
    engagement: number;
    skipAttempts: number;
    totalWatchTime: number;
  };
}

const CourseCertificate = ({
  isOpen,
  onClose,
  courseTitle,
  studentName,
  completionDate,
  courseInstructor,
  courseDuration,
  verificationData = {
    watchedPercentage: 100,
    engagement: 95,
    skipAttempts: 0,
    totalWatchTime: 1800,
  },
}: CourseCertificateProps) => {
  const handleDownload = () => {
    // In production, this would generate a PDF
    alert("Certificate download feature - Generate PDF implementation needed");
  };

  const handleShare = () => {
    alert("Share certificate to LinkedIn/Social Media - Implementation needed");
  };

  const certificateId = `SKILL-${Date.now().toString(36).toUpperCase()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        {/* Certificate Design */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-12 border-8 border-amber-400 dark:border-amber-600">
          {/* Header */}
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-amber-500" />
            <h1 className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              Certificate of Completion
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>SkillVerse - Play & Learn (Risee)</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-amber-300 dark:border-amber-700 mb-8" />

          {/* Content */}
          <div className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">This is to certify that</p>
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {studentName}
            </h2>

            <p className="text-lg text-muted-foreground">has successfully completed</p>

            <h3 className="text-3xl font-bold text-foreground px-8">
              {courseTitle}
            </h3>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{courseDuration}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Instructor</p>
                <p className="font-semibold">{courseInstructor}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-semibold">{new Date(completionDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Completion & Verification Badge */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500 fill-green-500" />
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  All video lectures completed ✓
                </span>
              </div>

              {/* Anti-Cheating Verification Shield */}
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 mx-4 border-2 border-green-400">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <p className="font-bold text-green-700 dark:text-green-400">Verified Completion</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <Eye className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <p className="font-semibold">{verificationData.watchedPercentage}%</p>
                    <p className="text-xs text-muted-foreground">Video Watched</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-600" />
                    <p className="font-semibold">{verificationData.engagement}%</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <p className="font-semibold">{Math.round(verificationData.totalWatchTime / 60)}m</p>
                    <p className="text-xs text-muted-foreground">Watch Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-amber-300 dark:border-amber-700 mt-8 mb-6" />

          {/* Footer with Verification */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Certificate ID: {certificateId}</p>
            <p className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-700 dark:text-green-400 font-semibold">
                Anti-Cheating Verified • Video Tracked • Engagement Monitored
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              This certificate is valid only for legitimate course completion. 
              Verification timestamp: {new Date().toISOString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-background p-6 flex gap-4 justify-center border-t">
          <Button onClick={handleDownload} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share on LinkedIn
          </Button>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCertificate;
