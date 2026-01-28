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

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center space-x-2 group mb-4">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <img src="/Risee.png" alt="Risee" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">Risee</span>
            </Link>
            <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">
              Learn, grow, and achieve your dreams.
            </p>
            <div className="flex items-center gap-2">
              {[Twitter, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Stay Updated</h4>
            <p className="text-xs text-muted-foreground mb-3">Get learning tips in your inbox.</p>
            <div className="flex gap-2">
              <div className="flex items-center flex-1 rounded-lg border border-border px-3 py-2">
                <Mail className="w-3 h-3 text-muted-foreground mr-2" />
                <input type="email" placeholder="Email" className="bg-transparent outline-none text-xs flex-1 w-full" />
              </div>
              <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Risee. All rights reserved.</p>
          <p>Built with ❤️ for learners.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


