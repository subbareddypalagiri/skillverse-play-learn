import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MessageCircle, Share2, Play } from "lucide-react";

export default function PremiumHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black pt-20 pb-20">
      <style>{`
        /* ULTRA-PREMIUM CINEMATIC BACKGROUND */
        .hero-bg {
          background: linear-gradient(180deg, #0a0a1f 0%, #0f0f2e 50%, #1a0a2e 100%);
          position: relative;
          overflow: hidden;
        }

        /* Noise/grain overlay for realism */
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise' /%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23000' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.5;
          z-index: 2;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* ANIMATED AURORA GRADIENTS - Slow floating motion */
        .aurora-layer-1 {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: 
            radial-gradient(ellipse 900px 700px at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 40%),
            radial-gradient(ellipse 1000px 600px at 80% 70%, rgba(59, 130, 246, 0.25) 0%, transparent 45%);
          filter: blur(120px);
          animation: auroraFloat1 20s ease-in-out infinite;
          opacity: 0.8;
        }

        .aurora-layer-2 {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: 
            radial-gradient(ellipse 800px 800px at 70% 20%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 700px 900px at 30% 80%, rgba(34, 211, 238, 0.2) 0%, transparent 48%);
          filter: blur(130px);
          animation: auroraFloat2 25s ease-in-out infinite;
          opacity: 0.7;
        }

        .aurora-layer-3 {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: 
            radial-gradient(ellipse 1100px 600px at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 55%),
            radial-gradient(ellipse 600px 1000px at 15% 50%, rgba(8, 145, 178, 0.15) 0%, transparent 50%);
          filter: blur(140px);
          animation: auroraFloat3 30s ease-in-out infinite;
          opacity: 0.6;
        }

        @keyframes auroraFloat1 {
          0%, 100% {
            background-position: 0% 0%;
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -40px);
          }
        }

        @keyframes auroraFloat2 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-40px, 30px);
          }
        }

        @keyframes auroraFloat3 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
        }

        /* Premium smooth easing curve */
        @keyframes smoothPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.02);
          }
        }

        @keyframes smoothFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes softGlow {
          0%, 100% {
            box-shadow: 
              0 0 60px rgba(139, 92, 246, 0.25),
              0 0 100px rgba(34, 211, 238, 0.15),
              inset 0 0 40px rgba(139, 92, 246, 0.05);
          }
          50% {
            box-shadow: 
              0 0 90px rgba(139, 92, 246, 0.35),
              0 0 140px rgba(34, 211, 238, 0.25),
              inset 0 0 60px rgba(139, 92, 246, 0.1);
          }
        }

        @keyframes cardFloatPremium {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        /* Particle effect - ultra subtle */
        .particle {
          position: absolute;
          pointer-events: none;
        }

        .particle-small {
          width: 2px;
          height: 2px;
          background: rgba(139, 92, 246, 0.4);
          border-radius: 50%;
          opacity: 0.15;
          box-shadow: 0 0 6px rgba(139, 92, 246, 0.2);
        }

        .particle-medium {
          width: 4px;
          height: 4px;
          background: rgba(34, 211, 238, 0.3);
          border-radius: 50%;
          opacity: 0.1;
          box-shadow: 0 0 8px rgba(34, 211, 238, 0.15);
        }

        .particle-large {
          width: 5px;
          height: 5px;
          background: rgba(236, 72, 153, 0.25);
          border-radius: 50%;
          opacity: 0.08;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.12);
        }

        /* Soft neon glow - NOT harsh */
        .premium-neon-border {
          border: 1.5px solid;
          border-image: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(34, 211, 238, 0.3)) 1;
          box-shadow: 
            0 0 40px rgba(139, 92, 246, 0.15),
            0 0 80px rgba(34, 211, 238, 0.1),
            inset 0 0 30px rgba(139, 92, 246, 0.03);
        }

        /* Glassmorphism - premium quality */
        .glass-card-premium {
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 
            0 8px 32px rgba(139, 92, 246, 0.08),
            inset 0 0 20px rgba(139, 92, 246, 0.02);
        }

        /* Gradient buttons - soft premium */
        .btn-gradient-premium {
          background: linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%);
          box-shadow: 
            0 0 40px rgba(139, 92, 246, 0.25),
            0 0 80px rgba(34, 211, 238, 0.15);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-gradient-premium:hover {
          box-shadow: 
            0 0 60px rgba(139, 92, 246, 0.4),
            0 0 120px rgba(34, 211, 238, 0.25);
          transform: translateY(-3px);
        }

        .btn-gradient-secondary-premium {
          border: 1.5px solid;
          border-image: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(34, 211, 238, 0.3)) 1;
          background: rgba(139, 92, 246, 0.05);
          color: #cbd5ff;
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-gradient-secondary-premium:hover {
          box-shadow: 0 0 50px rgba(139, 92, 246, 0.25);
          background: rgba(139, 92, 246, 0.1);
          transform: translateY(-3px);
        }

        /* Gradient text */
        .gradient-text-premium {
          background: linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
        }

        /* Soft reel glow */
        .reel-glow-premium {
          position: absolute;
          width: 130%;
          height: 130%;
          left: -15%;
          top: -15%;
          z-index: 0;
          background: 
            radial-gradient(ellipse 600px 600px at 50% 50%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
            radial-gradient(ellipse 500px 700px at 45% 55%, rgba(34, 211, 238, 0.08) 0%, transparent 45%);
          filter: blur(100px);
          pointer-events: none;
          animation: smoothPulse 5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }

        /* Smooth text animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-premium {
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background layers */}
      <div className="hero-bg absolute inset-0 -z-20" />
      <div className="aurora-layer-1 absolute inset-0 -z-20" />
      <div className="aurora-layer-2 absolute inset-0 -z-20" />
      <div className="aurora-layer-3 absolute inset-0 -z-20" />

      {/* Ultra-subtle starfield particles */}
      {[...Array(30)].map((_, i) => {
        const particleType = i % 3 === 0 ? "particle-small" : i % 3 === 1 ? "particle-medium" : "particle-large";
        return (
          <div
            key={i}
            className={`particle ${particleType}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        );
      })}

      {/* Main container */}
      <div className="container mx-auto relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-200px)]">
          {/* Left Section - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-premium w-fit fade-in-premium delay-100">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-300 font-medium">Join 10K+ Learners</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight fade-in-premium delay-200">
                Rise like a
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight gradient-text-premium fade-in-premium delay-300">
                Star
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-cyan-100/70 max-w-lg leading-relaxed fade-in-premium delay-300">
              Experience premium learning with cinematic storytelling, expert guidance, and a community designed for your success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 fade-in-premium delay-400">
              <Link to="/login">
                <Button
                  size="lg"
                  className="btn-gradient-premium text-white border-0 px-8 py-6 text-base font-semibold rounded-xl group"
                >
                  Start Journey
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/vibe">
                <Button
                  size="lg"
                  className="btn-gradient-secondary-premium px-8 py-6 text-base font-semibold rounded-xl"
                >
                  Explore Vibe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-8 fade-in-premium delay-500">
              <div className="flex items-center gap-2 text-sm text-cyan-200/80">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                Expert Instruction
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-200/80">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                Live Projects
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-200/80">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                Career Support
              </div>
            </div>
          </div>

          {/* Right Section - Reel Mockup */}
          <div className="relative hidden lg:flex justify-center items-center h-full">
            {/* Ultra-soft premium glow background */}
            <div className="reel-glow-premium" />
            
            {/* Layered soft lighting */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/15 via-pink-500/10 to-cyan-500/15 rounded-3xl filter blur-3xl -z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/12 via-purple-500/8 to-cyan-600/12 rounded-3xl filter blur-2xl -z-10" />

            {/* Phone/Reel container - premium soft glow */}
            <div className="relative w-64 h-[500px] smoothPulse" style={{animation: 'smoothPulse 5s cubic-bezier(0.22, 1, 0.36, 1) infinite'}}>
              {/* Outer soft glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/15 rounded-3xl filter blur-3xl -z-10" />

              {/* Phone frame - soft premium neon */}
              <div className="relative w-full h-full premium-neon-border rounded-3xl overflow-hidden">
                {/* Screen content */}
                <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black relative">
                  {/* Video placeholder */}
                  <div className="w-full h-full relative group cursor-pointer overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 group-hover:scale-110 transition-transform duration-500 cubic-bezier(0.22, 1, 0.36, 1)">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg" style={{animation: 'softGlow 5s cubic-bezier(0.22, 1, 0.36, 1) infinite'}}>
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>

                    {/* Video background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-cyan-900/40" />
                  </div>

                  {/* Bottom engagement bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors group">
                          <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-xs">234</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors group">
                          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-xs">45</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors group">
                          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-xs">12</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notch simulator */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30" />
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute top-12 -left-20" style={{animation: 'cardFloatPremium 5s cubic-bezier(0.22, 1, 0.36, 1) infinite'}}>
              <div className="glass-card-premium p-4 rounded-xl w-48 group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                    10K
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Active Learners</p>
                    <p className="text-xs text-cyan-300">Growing daily</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-20" style={{animation: 'cardFloatPremium 5s cubic-bezier(0.22, 1, 0.36, 1) infinite', animationDelay: '1s'}}>
              <div className="glass-card-premium p-4 rounded-xl w-48 group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                    500+
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Expert Courses</p>
                    <p className="text-xs text-cyan-300">Industry-curated</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 -left-16" style={{animation: 'cardFloatPremium 5s cubic-bezier(0.22, 1, 0.36, 1) infinite', animationDelay: '2s'}}>
              <div className="glass-card-premium p-4 rounded-xl w-48 group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    95%
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Success Rate</p>
                    <p className="text-xs text-cyan-300">Proven results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
