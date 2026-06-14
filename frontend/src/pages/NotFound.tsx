import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PremiumAmbientBackground from "@/components/PremiumAmbientBackground";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="neat-gradient-layout min-h-screen bg-[#E4E4E4] flex flex-col relative overflow-hidden">
      <NeatGradientBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto animate-reveal-up">
            <div className="relative mb-6">
              <div className="text-[120px] font-extrabold leading-none text-gradient opacity-25" style={{ fontFamily: 'Sora, sans-serif' }}>
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              Page not found
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                <Home className="w-4 h-4" /> Go Home
              </Link>
              <button onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground border border-white/10 hover:text-foreground hover:border-primary/30 hover:bg-white/5 transition-all">
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer neat />
      </div>
    </div>
  );
};

export default NotFound;
