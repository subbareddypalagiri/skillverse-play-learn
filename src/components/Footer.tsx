import { Link } from "react-router-dom";
import { Mail, Twitter, Github, Instagram } from "lucide-react";

const Footer = () => {
  const productLinks = [
    { label: "Courses", to: "/courses" },
    { label: "Events", to: "/events" },
    { label: "Career Hub", to: "/career" },
    { label: "Hobbies", to: "/hobbies" },
  ];

  const companyLinks = [
    { label: "About", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Contact", to: "/" },
    { label: "Careers", to: "/" },
  ];

  const supportLinks = [
    { label: "Help Center", to: "/" },
    { label: "Status", to: "/" },
    { label: "Terms", to: "/" },
    { label: "Privacy", to: "/" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/Risee.jpeg" 
                  alt="Raise Logo" 
                  className="w-full h-full object-cover animate-shine"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">Raise</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Learn, grow, and have fun with a community that lifts you up.
            </p>

            <div className="flex items-center gap-3 mt-4 text-muted-foreground">
              <a href="#" aria-label="Twitter" className="hover:text-foreground">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-foreground">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-foreground">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-foreground">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-foreground">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Stay in the loop</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get product updates and learning tips in your inbox.
            </p>
            <form className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 rounded-lg border border-border px-3 py-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@raise.com"
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Raise. All rights reserved.
          </p>
          <p>
            Built with ❤️ for learners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


