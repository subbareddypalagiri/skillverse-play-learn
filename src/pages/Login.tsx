import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="p-8 shadow-card">
            <h1 className="text-3xl font-bold mb-2 text-center">Welcome back</h1>
            <p className="text-muted-foreground text-center mb-8">Sign in to your Raise account</p>

            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@raise.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90" type="submit">
                Sign in
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              Don’t have an account? <Link to="/signup" className="text-primary underline">Create one</Link>
            </p>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;


