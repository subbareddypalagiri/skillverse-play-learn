import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, BookOpen, Calendar, Briefcase, Palette, Award, User, LogIn, UserPlus, Waves, Zap, Moon, Sun, Monitor, ChevronDown, Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

const navigation = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Vibe", path: "/vibe", icon: Zap },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Career Hub", path: "/career", icon: Briefcase },
  { name: "Sync", path: "/sync", icon: Waves },
  { name: "Achievements", path: "/achievements", icon: Award },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Account", path: "/login", icon: UserCircle },
  { name: "Settings", path: "/settings", icon: Settings, iconOnly: true },
];

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme, colorPalette, setColorPalette, availablePalettes } = useTheme();
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/Risee.jpeg" 
                alt="Risee Logo" 
                className="w-full h-full object-cover animate-shine"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Risee
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
                  {item.iconOnly || item.name === "Profile" ? (
                    <span className="sr-only">{item.name}</span>
                  ) : (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Color Picker */}
          <div className="flex items-center space-x-1">
            {/* Small Color Boxes */}
            <div className="hidden md:flex items-center space-x-1 border-r border-border pr-2">
              {availablePalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => setColorPalette(palette)}
                  className={cn(
                    "w-6 h-6 rounded-md transition-all duration-200 hover:scale-110 border-2",
                    colorPalette.name === palette.name
                      ? "border-primary shadow-card"
                      : "border-border hover:border-primary/50"
                  )}
                  title={palette.name}
                  style={{
                    background: `linear-gradient(135deg, rgb(${palette.primary}), rgb(${palette.secondary}))`
                  }}
                />
              ))}
            </div>

            {/* Mobile Color Picker Dropdown */}
            <div className="relative md:hidden">
              <button
                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                className="flex items-center space-x-1 p-2 rounded-lg transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted"
                title="Change color theme"
              >
                <Palette className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>

              {isColorDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-elevated p-2 z-50">
                  <div className="text-sm font-medium text-foreground mb-2">Color Theme</div>
                  <div className="grid grid-cols-3 gap-2">
                    {availablePalettes.map((palette) => (
                      <button
                        key={palette.name}
                        onClick={() => {
                          setColorPalette(palette);
                          setIsColorDropdownOpen(false);
                        }}
                        className={cn(
                          "relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                          colorPalette.name === palette.name
                            ? "border-primary shadow-card"
                            : "border-border hover:border-border/80"
                        )}
                        title={palette.name}
                        style={{
                          background: `linear-gradient(135deg, rgb(${palette.primary}), rgb(${palette.secondary}))`
                        }}
                      >
                        {colorPalette.name === palette.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    {colorPalette.name}
                  </div>
                </div>
              )}
            </div>
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
