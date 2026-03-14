import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, BookOpen, Calendar, Briefcase, Award, User, Waves, Zap, Settings, UserCircle, LogOut, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Vibe", path: "/vibe", icon: Zap },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Career", path: "/career", icon: Briefcase },
  { name: "Sync", path: "/sync", icon: Waves },
  { name: "Achievements", path: "/achievements", icon: Award },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobile}>
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/Risee.png" 
                alt="Risee Logo" 
                className="w-full h-full object-cover animate-shine"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Risee
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-card"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name === "Settings" || item.name === "Profile" ? (
                    <span className="sr-only">{item.name}</span>
                  ) : (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop User Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300"
              >
                <UserCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-card"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile Auth Section */}
            <div className="pt-3 mt-3 border-t border-border">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
