import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ApplyAlumni = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <Badge variant="secondary">Alumni Network</Badge>
          <h1 className="text-4xl font-bold">Apply as an Alumni</h1>
          <p className="text-muted-foreground text-lg">
            Join the alumni network to stay connected, contribute, and mentor students when needed.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            The route is kept live so existing navigation and protected routing continue to work.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ApplyAlumni;