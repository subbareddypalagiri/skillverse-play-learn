import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Sparkles } from "lucide-react";

const Vibe = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            Vibe
          </Badge>
          <h1 className="text-2xl font-bold">Vibe Zone</h1>
        </div>

        {/* Coming Soon Card */}
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Video className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold flex items-center gap-2 justify-center">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Coming Soon
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h2>
              <p className="text-muted-foreground max-w-md">
                Short-form learning videos are on the way! Get ready for bite-sized educational content.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Vibe;
