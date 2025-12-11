import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trophy, Award, CheckCircle } from "lucide-react";

interface CourseCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  studentName: string;
  completionDate: string;
  courseInstructor: string;
  courseDuration: string;
}

const CourseCertificate = ({
  isOpen,
  onClose,
  courseTitle,
  studentName,
  completionDate,
  courseInstructor,
  courseDuration,
}: CourseCertificateProps) => {
  const handleDownload = () => {
    // In production, this would generate a PDF
    alert("Certificate download feature - Generate PDF implementation needed");
  };

  const handleShare = () => {
    alert("Share certificate to LinkedIn/Social Media - Implementation needed");
  };

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
              <span>SkillVerse - Play & Learn</span>
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

            {/* Completion Badge */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <CheckCircle className="w-6 h-6 text-green-500 fill-green-500" />
              <span className="text-green-600 dark:text-green-400 font-semibold">
                All video lectures completed ✓
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-amber-300 dark:border-amber-700 mt-8 mb-6" />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Certificate ID: {`SKILL-${Date.now().toString(36).toUpperCase()}`}</p>
            <p className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4" />
              Verified by SkillVerse Learning Platform
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
