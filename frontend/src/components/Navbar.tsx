import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, Settings, X, Menu, ChevronDown, Server } from "lucide-react";
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
  { name: "Live Rooms", path: "/live-rooms" },
  { name: "AI Tools", path: "/ai-tools" },
  { name: "Sync", path: "/sync" },
  { name: "Clubs", path: "/clubs" },
  { name: "Achievements", path: "/achievements" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const isHomePage = location.pathname === "/";
  const isLightNav = false; // Always use dark premium navbar on all pages

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setNavVisible(y > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setEventsDropdownOpen(false);
  }, [location.pathname]);

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
  const showNav = isHomePage ? (navVisible || mobileOpen) : true;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        showNav
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none",
        isLightNav
          ? cn(
              scrolled
                ? "bg-[#f6f5fa]/97 backdrop-blur-xl shadow-[0_1px_0_0_rgba(99,111,164,0.08),0_8px_24px_-8px_rgba(99,111,164,0.12)]"
                : "bg-[#f6f5fa]/88 backdrop-blur-lg",
              "border-b border-[#dddbe8]"
            )
          : cn(
              scrolled
                ? "bg-[#09090b]/95 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.03),0_20px_40px_-15px_rgba(0,0,0,0.4)]"
                : "bg-[#09090b]/85 backdrop-blur-xl",
              "border-b border-[#ffffff08]"
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
              <div className={cn("w-full h-full rounded-[10px] overflow-hidden", isLightNav ? "bg-[#f6f5fa]" : "bg-[#09090b]")}>
                <img
                  src="/Risee.png"
                  alt="Haappy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className={cn(
              "text-[19px] font-bold tracking-[-0.03em] bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent",
              isLightNav ? "text-[#2d3354]" : ""
            )}>
              Haappy
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
                    isLightNav
                      ? isActive
                        ? "text-[#636FA4]"
                        : "text-[#636FA4]/60 hover:text-[#636FA4]"
                      : isActive
                        ? "text-white"
                        : "text-[#a1a1aa] hover:text-white"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className={cn(
                      "absolute inset-0 rounded-lg",
                      isLightNav ? "bg-[#edeaf5]" : "bg-white/[0.06]"
                    )} />
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
                  isLightNav
                    ? (location.pathname === "/events" || eventsDropdown.some(item => location.pathname === item.path))
                      ? "text-[#636FA4] bg-[#edeaf5]"
                      : "text-[#636FA4]/60 hover:text-[#636FA4]"
                    : (location.pathname === "/events" || eventsDropdown.some(item => location.pathname === item.path))
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
                "absolute top-full mt-2 right-0 w-48 py-1.5 rounded-xl transition-all duration-200 origin-top-right",
                isLightNav
                  ? "bg-[#f6f5fa] border border-[#dddbe8] shadow-[0_8px_30px_-8px_rgba(99,111,164,0.18)]"
                  : "bg-[#18181b] border border-[#ffffff08] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_-8px_rgba(0,0,0,0.6)]",
                eventsDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}>
                <Link
                  to="/events"
                  onClick={() => setEventsDropdownOpen(false)}
                  className={cn(
                    "block px-3.5 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors",
                    isLightNav
                      ? location.pathname === "/events"
                        ? "text-[#636FA4] bg-[#edeaf5]"
                        : "text-[#636FA4]/70 hover:text-[#636FA4] hover:bg-[#edeaf5]/60"
                      : location.pathname === "/events"
                        ? "text-white bg-white/[0.05]"
                        : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  All Events
                </Link>
                <div className={cn("mx-3 my-1 h-px", isLightNav ? "bg-[#dddbe8]" : "bg-[#ffffff08]")} />
                {eventsDropdown.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setEventsDropdownOpen(false)}
                    className={cn(
                      "block px-3.5 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors",
                      isLightNav
                        ? location.pathname === item.path
                          ? "text-[#636FA4] bg-[#edeaf5]"
                          : "text-[#636FA4]/70 hover:text-[#636FA4] hover:bg-[#edeaf5]/60"
                        : location.pathname === item.path
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
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full transition-colors duration-200",
                    isLightNav
                      ? "bg-[#edeaf5]/70 border border-[#dddbe8] hover:border-[#c8c4d8] hover:bg-[#edeaf5]"
                      : "bg-[#ffffff06] border border-[#ffffff08] hover:border-[#ffffff12] hover:bg-white/[0.04]"
                  )}
                  title="View profile"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-[12px] font-semibold text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className={cn(
                    "text-[13px] font-medium tracking-[-0.01em]",
                    isLightNav ? "text-[#3d4568]" : "text-[#e4e4e7]"
                  )}>
                    {user.name}
                  </span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-500/30 text-red-500 hover:bg-red-500/5 hover:border-red-500/50 transition-all"
                    title="Admin Control Center"
                  >
                    <Server className="w-3.5 h-3.5 animate-pulse" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isLightNav
                      ? location.pathname === "/profile"
                        ? "bg-[#edeaf5] text-[#636FA4]"
                        : "text-[#636FA4]/50 hover:text-[#636FA4] hover:bg-[#edeaf5]/60"
                      : location.pathname === "/profile"
                        ? "bg-white/[0.08] text-white"
                        : "text-[#71717a] hover:text-[#a1a1aa] hover:bg-white/[0.04]"
                  )}
                  title="Profile"
                >
                  <UserCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </Link>
                <Link
                  to="/settings"
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isLightNav
                      ? location.pathname === "/settings"
                        ? "bg-[#edeaf5] text-[#636FA4]"
                        : "text-[#636FA4]/50 hover:text-[#636FA4] hover:bg-[#edeaf5]/60"
                      : location.pathname === "/settings"
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
                className={cn(
                  "px-5 py-2 rounded-full text-[13px] font-semibold tracking-[-0.01em] transition-all duration-200",
                  isLightNav
                    ? "bg-gradient-to-r from-[#636FA4] to-[#7a85b0] text-white hover:opacity-90 shadow-md shadow-[#636FA4]/20"
                    : "bg-white text-[#09090b] hover:bg-[#f4f4f5] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.1)]"
                )}
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className={cn(
              "lg:hidden p-2 -mr-2 rounded-lg transition-all duration-200",
              isLightNav
                ? "text-[#636FA4]/70 hover:text-[#636FA4] hover:bg-[#edeaf5]/60"
                : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.05]"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
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
        <div className={cn(
          "px-4 pb-6 pt-2 border-t",
          isLightNav ? "border-[#dddbe8]" : "border-[#ffffff06]"
        )}>
          <div className="space-y-0.5">
            {primaryNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={cn(
                  "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                  isLightNav
                    ? location.pathname === item.path
                      ? "text-[#636FA4] bg-[#edeaf5]"
                      : "text-[#636FA4]/70 hover:text-[#636FA4]"
                    : location.pathname === item.path
                      ? "text-white bg-white/[0.06]"
                      : "text-[#a1a1aa] hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={cn("mt-4 pt-4 border-t", isLightNav ? "border-[#dddbe8]" : "border-[#ffffff06]")}>
            <p className={cn(
              "px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]",
              isLightNav ? "text-[#636FA4]/50" : "text-[#52525b]"
            )}>
              Events
            </p>
            <Link
              to="/events"
              onClick={closeMobile}
              className={cn(
                "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                isLightNav
                  ? location.pathname === "/events"
                    ? "text-[#636FA4] bg-[#edeaf5]"
                    : "text-[#636FA4]/70 hover:text-[#636FA4]"
                  : location.pathname === "/events"
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
                  isLightNav
                    ? location.pathname === item.path
                      ? "text-[#636FA4] bg-[#edeaf5]"
                      : "text-[#636FA4]/70 hover:text-[#636FA4]"
                    : location.pathname === item.path
                      ? "text-white bg-white/[0.06]"
                      : "text-[#a1a1aa] hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={cn("mt-4 pt-4 border-t", isLightNav ? "border-[#dddbe8]" : "border-[#ffffff06]")}>
            <p className={cn(
              "px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]",
              isLightNav ? "text-[#636FA4]/50" : "text-[#52525b]"
            )}>
              Account
            </p>
            <Link
              to="/profile"
              onClick={closeMobile}
              className={cn(
                "block px-3.5 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-colors",
                isLightNav
                  ? location.pathname === "/profile"
                    ? "text-[#636FA4] bg-[#edeaf5]"
                    : "text-[#636FA4]/70 hover:text-[#636FA4]"
                  : location.pathname === "/profile"
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
                isLightNav
                  ? location.pathname === "/settings"
                    ? "text-[#636FA4] bg-[#edeaf5]"
                    : "text-[#636FA4]/70 hover:text-[#636FA4]"
                  : location.pathname === "/settings"
                    ? "text-white bg-white/[0.06]"
                    : "text-[#a1a1aa] hover:text-white"
              )}
            >
              Settings
            </Link>
          </div>

          <div className={cn("mt-6 pt-4 border-t", isLightNav ? "border-[#dddbe8]" : "border-[#ffffff06]")}>
            {isLoggedIn && user ? (
              <div className="flex flex-col gap-3 px-3.5 py-3">
                <div className="flex items-center justify-between gap-3 w-full">
                  <Link to="/profile" onClick={closeMobile} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-[14px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] flex-shrink-0">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-[14px] font-semibold tracking-[-0.01em] truncate text-left",
                        isLightNav ? "text-[#2d3354]" : "text-white"
                      )}>{user.name}</p>
                      <p className={cn(
                        "text-[12px] truncate text-left",
                        isLightNav ? "text-[#636FA4]/60" : "text-[#71717a]"
                      )}>{user.email}</p>
                    </div>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMobile}
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold border border-red-500/30 text-red-500 hover:bg-red-500/5 transition-all shrink-0"
                    >
                      Admin
                    </Link>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 mt-2 rounded-xl text-center text-xs font-semibold border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMobile}
                className={cn(
                  "block w-full py-3 rounded-full text-center text-[14px] font-semibold tracking-[-0.01em] transition-colors",
                  isLightNav
                    ? "bg-gradient-to-r from-[#636FA4] to-[#7a85b0] text-white hover:opacity-90"
                    : "bg-white text-[#09090b] hover:bg-[#f4f4f5]"
                )}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
