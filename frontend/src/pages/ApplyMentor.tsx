import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ApplyMentor = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <Badge variant="secondary">Mentor Program</Badge>
          <h1 className="text-4xl font-bold">Apply as a Mentor</h1>
          <p className="text-muted-foreground text-lg">
            Share your experience, guide learners, and help shape the next generation of builders.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            This page is available in the route structure and can be connected to the backend application flow later.
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

export default ApplyMentor;