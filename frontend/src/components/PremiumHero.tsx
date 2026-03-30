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
        /* MULTI-LAYERED AURORA/GALAXY BACKGROUND */
        .hero-bg {
          background: 
            /* Base deep space gradient */
            linear-gradient(135deg, #0a0a1f 0%, #1a0f3c 35%, #0f2a5a 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            /* Primary purple glow - top right */
            radial-gradient(ellipse 600px 600px at 70% 20%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
            /* Secondary blue glow - bottom left */
            radial-gradient(ellipse 700px 700px at 15% 85%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            /* Cyan accent - right side */
            radial-gradient(ellipse 500px 500px at 85% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
            /* Pink/magenta glow - center */
            radial-gradient(ellipse 550px 550px at 50% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 60%);
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
        }

        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            /* Deep purple core - top center */
            radial-gradient(ellipse 400px 400px at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            /* Blue-cyan blend - bottom right */
            radial-gradient(ellipse 550px 550px at 90% 90%, rgba(8, 145, 178, 0.12) 0%, transparent 50%);
          filter: blur(120px);
          pointer-events: none;
          z-index: 1;
        }

        /* Animated glow spots */
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes auroraShift {
          0% {
            filter: blur(100px);
            opacity: 0.4;
          }
          50% {
            filter: blur(110px);
            opacity: 0.5;
          }
          100% {
            filter: blur(100px);
            opacity: 0.4;
          }
        }

        @keyframes particleTwinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes particleDrift {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(20px) translateY(-10px);
          }
          50% {
            transform: translateX(-10px) translateY(20px);
          }
          75% {
            transform: translateX(15px) translateY(-15px);
          }
        }

        @keyframes reelGlowPulse {
          0%, 100% {
            opacity: 0.6;
            filter: blur(80px);
          }
          50% {
            opacity: 0.8;
            filter: blur(90px);
          }
        }

        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes reelPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes glowBreathe {
          0%, 100% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 80px rgba(139, 92, 246, 0.6), inset 0 0 40px rgba(139, 92, 246, 0.2);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(34, 211, 238, 0.3);
          }
          50% {
            text-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(34, 211, 238, 0.5);
          }
        }

        .glow-pulse {
          animation: glowPulse 4s ease-in-out infinite;
        }

        .float-up {
          animation: floatUp 6s ease-in-out infinite;
        }

        .reel-pulse {
          animation: reelPulse 3s ease-in-out infinite;
        }

        .card-float {
          animation: cardFloat 5s ease-in-out infinite;
        }

        .glow-breathe {
          animation: glowBreathe 4s ease-in-out infinite;
        }

        .text-glow {
          animation: textGlow 3s ease-in-out infinite;
        }

        /* Gradient text for "Star" */
        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
        }

        /* Neon glow border */
        .neon-border {
          border: 2px solid;
          border-image: linear-gradient(135deg, #8b5cf6, #22d3ee) 1;
          box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.4),
            inset 0 0 20px rgba(139, 92, 246, 0.1),
            0 0 40px rgba(34, 211, 238, 0.2);
        }

        /* Glassmorphic card */
        .glass-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.3);
          box-shadow: 
            0 8px 32px rgba(139, 92, 246, 0.1),
            inset 0 0 20px rgba(139, 92, 246, 0.05);
        }

        /* Gradient buttons */
        .btn-gradient {
          background: linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%);
          box-shadow: 
            0 0 30px rgba(139, 92, 246, 0.4),
            0 0 60px rgba(34, 211, 238, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-gradient:hover {
          box-shadow: 
            0 0 50px rgba(139, 92, 246, 0.6),
            0 0 100px rgba(34, 211, 238, 0.4);
          transform: scale(1.05) translateY(-2px);
        }

        .btn-gradient-secondary {
          border: 2px solid;
          border-image: linear-gradient(135deg, #8b5cf6, #22d3ee) 1;
          background: transparent;
          color: #cbd5ff;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
          transition: all 0.3s ease;
        }

        .btn-gradient-secondary:hover {
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
          background: rgba(139, 92, 246, 0.1);
        }

        /* Particle effect */
        .particle {
          position: absolute;
          pointer-events: none;
        }

        .particle-small {
          width: 2px;
          height: 2px;
          background: rgba(139, 92, 246, 0.5);
          border-radius: 50%;
          opacity: 0.25;
          box-shadow: 0 0 4px rgba(139, 92, 246, 0.3);
        }

        .particle-medium {
          width: 4px;
          height: 4px;
          background: rgba(34, 211, 238, 0.4);
          border-radius: 50%;
          opacity: 0.2;
          box-shadow: 0 0 6px rgba(34, 211, 238, 0.25);
        }

        .particle-large {
          width: 6px;
          height: 6px;
          background: rgba(236, 72, 153, 0.3);
          border-radius: 50%;
          opacity: 0.15;
          box-shadow: 0 0 8px rgba(236, 72, 153, 0.2);
        }

        /* Strong glow behind reel container */
        .reel-glow-bg {
          position: absolute;
          width: 120%;
          height: 120%;
          left: -10%;
          top: -10%;
          z-index: 0;
          background: 
            radial-gradient(ellipse 500px 500px at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 400px 400px at 40% 60%, rgba(34, 211, 238, 0.1) 0%, transparent 50%);
          filter: blur(80px);
          pointer-events: none;
          animation: reelGlowPulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background gradient with depth */}
      <div className="hero-bg absolute inset-0 -z-20" />

      {/* Animated glow spots */}
      <div className="absolute top-20 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl glow-pulse -z-10" />
      <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full filter blur-3xl glow-pulse -z-10" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-20 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl glow-pulse -z-10" style={{ animationDelay: "2s" }} />

      {/* Particle effects - enhanced aurora/galaxy feel */}
      {[...Array(40)].map((_, i) => {
        const particleType = i % 3 === 0 ? "particle-small" : i % 3 === 1 ? "particle-medium" : "particle-large";
        return (
          <div
            key={i}
            className={`particle ${particleType}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatUp ${6 + Math.random() * 6}s ease-in-out infinite, particleTwinkle ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s, ${Math.random() * 3}s`,
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card w-fit">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-300 font-medium">Join 10K+ Learners</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Rise like a
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-glow gradient-text">
                Star
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-cyan-100/70 max-w-lg leading-relaxed">
              Experience premium learning with cinematic storytelling, expert guidance, and a community designed for your success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link to="/login">
                <Button
                  size="lg"
                  className="btn-gradient text-white border-0 px-8 py-6 text-base font-semibold rounded-xl group"
                >
                  Start Journey
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/vibe">
                <Button
                  size="lg"
                  className="btn-gradient-secondary px-8 py-6 text-base font-semibold rounded-xl"
                >
                  Explore Vibe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-8">
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
            {/* Strong aurora glow background behind reel */}
            <div className="reel-glow-bg" />
            
            {/* Enhanced glow background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/25 via-pink-500/15 to-cyan-500/25 rounded-3xl filter blur-3xl -z-10 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-500/10 to-cyan-600/20 rounded-3xl filter blur-2xl -z-10" />

            {/* Phone/Reel container */}
            <div className="relative w-64 h-[500px] reel-pulse">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-500/20 rounded-3xl filter blur-2xl -z-10" />

              {/* Phone frame */}
              <div className="relative w-full h-full neon-border rounded-3xl overflow-hidden">
                {/* Screen content */}
                <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black relative">
                  {/* Video placeholder */}
                  <div className="w-full h-full relative group cursor-pointer overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg glow-breathe">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>

                    {/* Video background with pattern */}
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
            <div className="absolute top-12 -left-20 card-float" style={{ animationDelay: "0s" }}>
              <div className="glass-card p-4 rounded-xl w-48 group hover:glow-breathe transition-all">
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

            <div className="absolute top-1/2 -right-20 card-float" style={{ animationDelay: "1s" }}>
              <div className="glass-card p-4 rounded-xl w-48 group hover:glow-breathe transition-all">
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

            <div className="absolute bottom-20 -left-16 card-float" style={{ animationDelay: "2s" }}>
              <div className="glass-card p-4 rounded-xl w-48 group hover:glow-breathe transition-all">
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
