import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, BookOpen, Calendar, Briefcase, Palette, Award, User, LogIn, UserPlus, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Career Hub", path: "/career", icon: Briefcase },
  { name: "Sync", path: "/sync", icon: Waves },
  { name: "Achievements", path: "/achievements", icon: Award },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Login", path: "/login", icon: LogIn },
  { name: "Signup", path: "/signup", icon: UserPlus },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/Risee.jpeg" 
                alt="Raise Logo" 
                className="w-full h-full object-cover animate-shine"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Raise
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-card"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name === "Profile" ? (
                    <span className="sr-only">Profile</span>
                  ) : (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-muted">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
