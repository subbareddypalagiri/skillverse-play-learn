import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, BookOpen, Calendar, Briefcase, Award, User, Waves, Zap, Settings, UserCircle, LogOut, X, Menu, ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const primaryNavigation = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Vibe", path: "/vibe" },
  { name: "Career", path: "/career" },
  { name: "Dashboard", path: "/dashboard" },
];

const eventsDropdown = [
  { name: "Sync", path: "/sync" },
  { name: "Achievements", path: "/achievements" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [homeNavOpen, setHomeNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setHomeNavOpen(false);
  }, [isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEventsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {isHomePage && (
        <div
          onMouseEnter={() => setHomeNavOpen(true)}
          className="fixed top-0 left-0 right-0 z-[60] h-6"
        />
      )}

      <nav
        onMouseLeave={() => isHomePage && setHomeNavOpen(false)}
        className={cn(
          "left-0 right-0 z-50 transition-all duration-700 ease-expo-out",
          isHomePage
            ? cn(
                "absolute top-5 mx-auto max-w-6xl left-5 right-5 rounded-[20px]",
                "bg-[#09090b]/80 backdrop-blur-2xl",
                "border border-[#ffffff08]",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_50px_-12px_rgba(0,0,0,0.5)]",
                homeNavOpen 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )
            : cn(
                "fixed top-0",
                scrolled 
                  ? "bg-[#09090b]/95 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.03),0_20px_40px_-15px_rgba(0,0,0,0.4)]" 
                  : "bg-[#09090b]/60 backdrop-blur-xl",
                "border-b border-[#ffffff05]"
              )
        )}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group" 
              onClick={closeMobile}
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#09090b]">
                  <img 
                    src="/Risee.png" 
                    alt="Risee" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[19px] font-bold tracking-[-0.03em] text-white">
                Risee
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {primaryNavigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative px-4 py-2 text-[14px] font-medium tracking-[-0.01em] rounded-lg transition-all duration-200",
                      isActive
                        ? "text-white"
                        : "text-[#a1a1aa] hover:text-white"
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-white/[0.06]" />
                    )}
                  </Link>
                );
              })}

              {/* Events Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setEventsDropdownOpen(!eventsDropdownOpen)}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-[14px] font-medium tracking-[-0.01em] rounded-lg transition-all duration-200",
                    (location.pathname === "/events" || eventsDropdown.some(item => location.pathname === item.path))
                      ? "text-white bg-white/[0.06]"
                      : "text-[#a1a1aa] hover:text-white"
                  )}
                >
                  Events
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300",
                    eventsDropdownOpen && "rotate-180"
                  )} />
                </button>

                <div className={cn(
                  "absolute top-full mt-2 right-0 w-48 py-1.5 rounded-xl",
                  "bg-[#18181b] border border-[#ffffff08]",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_-8px_rgba(0,0,0,0.6)]",
                  "transition-all duration-200 origin-top-right",
                  eventsDropdownOpen 
                    ? "opacity-100 scale-100 translate-y-0" 
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}>
                  <Link
                    to="/events"
                    onClick={() => setEventsDropdownOpen(false)}
                    className={cn(
                      "block px-3.5 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors",
                      location.pathname === "/events"
                        ? "text-white bg-white/[0.05]"
                        : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    All Events
                  </Link>
                  <div className="mx-3 my-1 h-px bg-[#ffffff08]" />
                  {eventsDropdown.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setEventsDropdownOpen(false)}
                      className={cn(
                        "block px-3.5 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors",
                        location.pathname === item.path
                          ? "text-white bg-white/[0.05]"
                          : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.03]"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-2">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full bg-[#ffffff06] border border-[#ffffff08] hover:border-[#ffffff12] transition-colors duration-200">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-[12px] font-semibold text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-[13px] font-medium text-[#e4e4e7] tracking-[-0.01em]">
                      {user.name}
                    </span>
                  </div>
                  <Link
                    to="/settings"
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      location.pathname === "/settings"
                        ? "bg-white/[0.08] text-white"
                        : "text-[#71717a] hover:text-[#a1a1aa] hover:bg-white/[0.04]"
                    )}
                  >
                    <Settings className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-[13px] font-semibold tracking-[-0.01em] bg-white text-[#09090b] hover:bg-[#f4f4f5] transition-all duration-200 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.1)]"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile Button */}
            <button
              className="lg:hidden p-2 -mr-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              onClick={() => {
                setHomeNavOpen(true);
                setMobileOpen(!mobileOpen);
              }}
            >
              {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out",
          mobileOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 pb-6 pt-2 border-t border-[#ffffff06]">
            <div className="space-y-0.5">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={cn(
                    "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                    location.pathname === item.path
                      ? "text-white bg-white/[0.06]"
                      : "text-[#a1a1aa] hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#ffffff06]">
              <p className="px-3.5 py-2 text-[11px] font-semibold text-[#52525b] uppercase tracking-[0.08em]">
                Events
              </p>
              <Link
                to="/events"
                onClick={closeMobile}
                className={cn(
                  "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                  location.pathname === "/events"
                    ? "text-white bg-white/[0.06]"
                    : "text-[#a1a1aa] hover:text-white"
                )}
              >
                All Events
              </Link>
              {eventsDropdown.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={cn(
                    "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                    location.pathname === item.path
                      ? "text-white bg-white/[0.06]"
                      : "text-[#a1a1aa] hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#ffffff06]">
              <p className="px-3.5 py-2 text-[11px] font-semibold text-[#52525b] uppercase tracking-[0.08em]">
                Account
              </p>
              <Link
                to="/profile"
                onClick={closeMobile}
                className={cn(
                  "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                  location.pathname === "/profile"
                    ? "text-white bg-white/[0.06]"
                    : "text-[#a1a1aa] hover:text-white"
                )}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={closeMobile}
                className={cn(
                  "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                  location.pathname === "/settings"
                    ? "text-white bg-white/[0.06]"
                    : "text-[#a1a1aa] hover:text-white"
                )}
              >
                Settings
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-[#ffffff06]">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3 px-3.5 py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-[14px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white tracking-[-0.01em]">{user.name}</p>
                    <p className="text-[12px] text-[#71717a]">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block w-full py-3 rounded-full text-center text-[14px] font-semibold tracking-[-0.01em] bg-white text-[#09090b] hover:bg-[#f4f4f5] transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
