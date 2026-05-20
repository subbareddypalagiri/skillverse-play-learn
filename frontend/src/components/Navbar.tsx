import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, BookOpen, Calendar, Briefcase, Award, User, Waves, Zap, Settings, UserCircle, LogOut, X, Menu, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Vibe", path: "/vibe", icon: Zap },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Career", path: "/career", icon: Briefcase },
];

const moreNavigation = [
  { name: "Sync", path: "/sync", icon: Waves },
  { name: "Achievements", path: "/achievements", icon: Award },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreDropdown(false);
      }
    };
    if (moreDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [moreDropdown]);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/85 backdrop-blur-2xl border-b border-border/60 shadow-[0_1px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      )}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-4 h-[64px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/40 transition-all duration-300 shadow-lg">
                <img src="/Risee.png" alt="Risee" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
              <span className="text-lg font-bold text-gradient hidden sm:block" style={{fontFamily:'Sora,sans-serif'}}>
                Risee
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.4)]" />
                    )}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-xl bg-white/0 hover:bg-white/5 transition-colors duration-200" />
                    )}
                    <Icon className={cn("w-3.5 h-3.5 relative z-10 transition-transform duration-300", !isActive && "group-hover:scale-110")} />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setMoreDropdown(!moreDropdown)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group",
                    moreNavigation.some(item => location.pathname === item.path)
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {moreNavigation.some(item => location.pathname === item.path) && (
                    <span className="absolute inset-0 rounded-xl bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.4)]" />
                  )}
                  {!moreNavigation.some(item => location.pathname === item.path) && (
                    <span className="absolute inset-0 rounded-xl bg-white/0 hover:bg-white/5 transition-colors duration-200" />
                  )}
                  <MoreHorizontal className={cn("w-3.5 h-3.5 relative z-10 transition-transform duration-300", !moreNavigation.some(item => location.pathname === item.path) && "group-hover:scale-110")} />
                  <span className="relative z-10">More</span>
                </button>

                {/* Dropdown Menu */}
                {moreDropdown && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-background/95 backdrop-blur-2xl border border-border/60 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {moreNavigation.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreDropdown(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary/20 text-primary border-l-2 border-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 group">
                    <div className="relative w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-foreground/80 hidden lg:block max-w-[100px] truncate">{user.name}</span>
                  </Link>
                  <Link to="/settings"
                    className={cn("p-2 rounded-xl transition-all duration-200",
                      location.pathname === '/settings' ? "bg-primary/20 text-primary" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    )}>
                    <Settings className="w-4 h-4" />
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden xl:block">Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200">
                    Sign in
                  </Link>
                  <Link to="/signup"
                    className="relative px-4 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
                    <span className="relative z-10 flex items-center gap-1">
                      Get Started
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden ml-auto p-2.5 rounded-xl hover:bg-white/5 text-foreground transition-all duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-5 h-5">
                <span className={cn("absolute inset-0 transition-all duration-300", mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90")}>
                  <X className="w-5 h-5" />
                </span>
                <span className={cn("absolute inset-0 transition-all duration-300", mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0")}>
                  <Menu className="w-5 h-5" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-40 md:hidden transition-all duration-500",
        mobileOpen ? "pointer-events-auto" : "pointer-events-none"
      )}>
        {/* Backdrop */}
        <div
          className={cn("absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-[280px] bg-background/95 backdrop-blur-2xl border-l border-border/60 shadow-2xl transition-transform duration-500",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-between p-5 border-b border-border/40">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
                <img src="/Risee.png" alt="Risee" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-gradient" style={{fontFamily:'Sora,sans-serif'}}>Risee</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-1">
            {navigation.map((item, i) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />}
                </Link>
              );
            })}

            {/* Mobile More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdown(!moreDropdown)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  moreNavigation.some(item => location.pathname === item.path)
                    ? "bg-primary/20 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
                More
                {moreDropdown && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary rotate-90" />}
              </button>

              {/* Mobile More Dropdown Menu */}
              {moreDropdown && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-primary/40 pl-2">
                  {moreNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          setMoreDropdown(false);
                          setMobileOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary/20 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40">
            {isLoggedIn && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-white/5 transition-all duration-200">
                  <UserCircle className="w-4 h-4" />
                  My Profile
                </Link>
                <Link to="/settings" onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-white/5 transition-all duration-200">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
