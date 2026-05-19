import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ApplyAlumniExpert = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <Badge variant="secondary">Alumni Expert</Badge>
          <h1 className="text-4xl font-bold">Apply as an Alumni Expert</h1>
          <p className="text-muted-foreground text-lg">
            Support learners with industry insight, interviews, referrals, and practical guidance.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            This route is preserved so the app shell and navigation remain intact after the UI refresh.
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

export default ApplyAlumniExpert;