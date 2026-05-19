import { Link } from "react-router-dom";
import { Twitter, Github, Instagram, Mail, ArrowRight, Sparkles } from "lucide-react";

const Footer = () => {
  const productLinks = [
    { label: "Courses", to: "/courses" },
    { label: "Events", to: "/events" },
    { label: "Career Hub", to: "/career" },
    { label: "Achievements", to: "/achievements" },
    { label: "Vibe", to: "/vibe" },
  ];
  const companyLinks = [
    { label: "About", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Contact", to: "/" },
    { label: "Privacy", to: "/" },
  ];
  const socials = [
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Github, href: "#", label: "GitHub" },
    { Icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="relative border-t border-border/40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 container mx-auto px-4 lg:px-6">
        {/* Main footer */}
        <div className="grid gap-10 md:grid-cols-4 py-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10">
                <img src="/Risee.png" alt="Risee" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-gradient" style={{fontFamily:'Sora,sans-serif'}}>Risee</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-[200px]">
              The future of learning. Built for ambitious people who want to grow fast.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl glass border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm" style={{fontFamily:'Sora,sans-serif'}}>Product</h4>
            <ul className="space-y-3">
              {productLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm" style={{fontFamily:'Sora,sans-serif'}}>Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group">
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-sm" style={{fontFamily:'Sora,sans-serif'}}>Stay in the loop</h4>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Weekly learning tips, course drops, and career insights.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 premium-card p-1 pl-3">
                <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <input type="email" placeholder="your@email.com"
                  className="bg-transparent outline-none text-xs flex-1 text-foreground placeholder:text-muted-foreground/50 min-w-0" />
              </div>
              <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2 group"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                <Sparkles className="w-3.5 h-3.5" />
                Subscribe free
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-border/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Risee. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <span>Built with ❤️ for learners</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
