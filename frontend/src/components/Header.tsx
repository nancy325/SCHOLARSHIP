import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, Settings, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from "@/services/api";

type HeaderVariant = "landing" | "admin" | "student";

interface HeaderProps {
  variant: HeaderVariant;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  currentPage?: string; // For landing variant
  showSidebarToggle?: boolean; // For admin variant
  onNavigate?: (page: string) => void; // For landing variant navigation
  adminNavItems?: Array<{ label: string; path: string }>;
}

const Header: React.FC<HeaderProps> = ({
  variant,
  sidebarOpen = false,
  onSidebarToggle,
  currentPage,
  showSidebarToggle = true,
  onNavigate,
  adminNavItems = [],
}) => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminSearchMessage, setAdminSearchMessage] = useState("");
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click (for student variant)
  useEffect(() => {
    if (variant !== "student") return;

    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen, variant]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (variant !== "landing") return;

    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, variant]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleAdminSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = adminSearch.trim().toLowerCase();
    if (!query) return;
    const match = adminNavItems.find((item) => item.label.toLowerCase() === query)
      ?? adminNavItems.find((item) => item.label.toLowerCase().includes(query));
    if (match) {
      navigate(match.path);
      setAdminSearchMessage(`${match.label} opened`);
      setAdminSearch("");
    } else {
      setAdminSearchMessage("No admin section matches that search");
    }
  };

  const handleLandingNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(page === "home" ? "/" : `/?view=${encodeURIComponent(page)}`);
    }
  };

  // Landing Variant
  if (variant === "landing") {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate("home") : navigate("/"))}
              className="flex items-center gap-2 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="ScholarSnap home"
            >
              <img src="/favicon.png" alt="" className="h-12 w-12 rounded-md object-contain" />
              <span className="text-2xl font-semibold text-primary">ScholarSnap</span>
            </button>
            {/* Hamburger for mobile */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="p-2"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={currentPage === "home" ? "default" : "ghost"}
                onClick={() => handleLandingNavigation("home")}
                className="font-medium"
              >
                Home
              </Button>
              <Button
                variant={currentPage === "about" ? "default" : "ghost"}
                onClick={() => handleLandingNavigation("about")}
                className="font-medium"
              >
                About Us
              </Button>
              <Button
                variant={currentPage === "register" ? "default" : "ghost"}
                onClick={() => handleLandingNavigation("register")}
                className="font-medium"
              >
                Register Institute
              </Button>
              <Button
                variant={currentPage === "faqs" ? "default" : "ghost"}
                onClick={() => handleLandingNavigation("faqs")}
                className="font-medium"
              >
                FAQs
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/contact")}
                className="font-medium"
              >
                Contact
              </Button>
              <Button
                variant={currentPage === "Login" ? "default" : "ghost"}
                onClick={() => navigate("/login")}
                className="font-medium"
              >
                Login
              </Button>
            </div>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className="fixed inset-0 z-[99] bg-black/40 flex justify-end md:hidden transition"
              >
                <div className="w-2/3 max-w-xs bg-white h-full shadow-md px-5 py-6 space-y-2 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-2xl text-[#1E3A8A]">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close menu"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  <Button
                    variant={currentPage === "home" ? "default" : "ghost"}
                    onClick={() => {
                      handleLandingNavigation("home");
                      setMobileMenuOpen(false);
                    }}
                    className="font-medium justify-start w-full"
                  >
                    Home
                  </Button>
                  <Button
                    variant={currentPage === "about" ? "default" : "ghost"}
                    onClick={() => {
                      handleLandingNavigation("about");
                      setMobileMenuOpen(false);
                    }}
                    className="font-medium justify-start w-full"
                  >
                    About Us
                  </Button>
                  <Button
                    variant={currentPage === "register" ? "default" : "ghost"}
                    onClick={() => {
                      handleLandingNavigation("register");
                      setMobileMenuOpen(false);
                    }}
                    className="font-medium justify-start w-full"
                  >
                    Register Institute
                  </Button>
                  <Button
                    variant={currentPage === "faqs" ? "default" : "ghost"}
                    onClick={() => {
                      handleLandingNavigation("faqs");
                      setMobileMenuOpen(false);
                    }}
                    className="font-medium justify-start w-full"
                  >
                    FAQs
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/contact");
                      setMobileMenuOpen(false);
                    }}
                    className="font-medium justify-start w-full"
                  >
                    Contact
                  </Button>
                  <Button
                    variant={currentPage === "Login" ? "default" : "ghost"}
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="font-medium justify-start w-full"
                  >
                    Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // Admin Variant
  if (variant === "admin") {
    return (
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 shadow-sm backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            {showSidebarToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-foreground hover:bg-muted md:hidden"
                onClick={() => onSidebarToggle?.()}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            )}

            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="ScholarSnap" className="w-10 h-10 rounded-lg shadow-sm" />
              <div className="leading-tight">
                <div className="text-lg font-semibold text-primary">ScholarSnap</div>
                  <p className="text-xs text-muted-foreground">Admin console</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <form onSubmit={handleAdminSearch} className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  value={adminSearch}
                  onChange={(event) => { setAdminSearch(event.target.value); setAdminSearchMessage(""); }}
                  aria-label="Jump to admin section"
                  placeholder="Jump to section"
                  className="w-[220px] border-input bg-background pl-8 text-foreground placeholder:text-muted-foreground"
                />
                <p role="status" aria-live="polite" className="absolute right-0 top-full mt-1 text-xs text-muted-foreground">{adminSearchMessage}</p>
              </div>
            </form>

            <Button
              variant="ghost"
              size="sm"
              className="hidden gap-2 text-foreground hover:bg-muted md:inline-flex"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-foreground hover:bg-muted md:hidden"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>

          </div>
        </div>
      </header>
    );
  }

  // Student Variant
  let storedUser, userInitial, userName;
  try {
    storedUser = apiService.getStoredUser();
    userInitial = storedUser?.name?.charAt(0).toUpperCase() || "U";
    userName = storedUser?.name || "User";
  } catch (e) {
    userInitial = "U";
    userName = "User";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Hamburger/Sidebar button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSidebarToggle?.();
              }}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Toggle sidebar"
              aria-controls="student-sidebar"
              aria-expanded={sidebarOpen}
              type="button"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <img
                src="/favicon.png"
                alt="ScholarSnap Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-semibold text-primary">
                ScholarSnap
              </span>
            </div>
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center gap-3">
            {/* User Profile - Round Shape */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-full p-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                type="button"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-card">
                  {userInitial}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div role="menu" className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
                  <div className="border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground shadow-sm">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-popover-foreground">{userName}</p>
                        <p className="text-xs text-muted-foreground">Student account</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("?tab=profile");
                      }}
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-muted"
                    >
                      <User className="h-4 w-4 text-primary" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("?tab=settings");
                      }}
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-muted"
                    >
                      <Settings className="h-4 w-4 text-primary" />
                      Settings
                    </button>
                    <div className="my-1 border-t border-border"></div>
                    <button
                      onClick={handleLogout}
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/5"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

