import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Bell, User, Settings, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiService } from "@/services/api";

type HeaderVariant = "landing" | "admin" | "student";

interface HeaderProps {
  variant: HeaderVariant;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  currentPage?: string; // For landing variant
  showSidebarToggle?: boolean; // For admin variant
  onNavigate?: (page: string) => void; // For landing variant navigation
}

const Header: React.FC<HeaderProps> = ({
  variant,
  sidebarOpen = false,
  onSidebarToggle,
  currentPage,
  showSidebarToggle = true,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Landing Variant
  if (variant === "landing") {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <img src="/favicon.png" alt="Logo" className="w-20 h-20 rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
                ScholarSnap
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant={currentPage === "home" ? "default" : "ghost"}
                onClick={() => onNavigate?.("home")}
                className="font-medium"
              >
                Home
              </Button>
              <Button
                variant={currentPage === "about" ? "default" : "ghost"}
                onClick={() => onNavigate?.("about")}
                className="font-medium"
              >
                About Us
              </Button>
              <Button
                variant={currentPage === "register" ? "default" : "ghost"}
                onClick={() => onNavigate?.("register")}
                className="font-medium"
              >
                Register Institute
              </Button>
              <Button
                variant={currentPage === "faqs" ? "default" : "ghost"}
                onClick={() => onNavigate?.("faqs")}
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
          </div>
        </div>
      </nav>
    );
  }

  // Admin Variant
  if (variant === "admin") {
    return (
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            {showSidebarToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden text-slate-800 hover:bg-slate-100"
                onClick={() => onSidebarToggle?.()}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            )}

            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="ScholarSnap" className="w-10 h-10 rounded-lg shadow-sm" />
              <div className="leading-tight">
                <div className="text-lg font-bold text-[#1E3A8A]">ScholarSnap</div>
                <p className="text-xs text-slate-500">Admin Console</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <form className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-8 w-[260px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-500"
                />
              </div>
            </form>

            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-700 hover:bg-slate-100">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex gap-2 text-slate-900 hover:bg-slate-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 text-slate-900 hover:bg-slate-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="overflow-hidden rounded-full border border-slate-200 bg-white">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/favicon.png" alt="Admin" />
                <AvatarFallback className="bg-slate-100 text-slate-700">AD</AvatarFallback>
              </Avatar>
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                ScholarSnap
              </span>
            </div>
          </div>

          {/* Right: Notifications + User Profile */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile - Round Shape */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                aria-label="User menu"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-white">
                  {userInitial}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-500">Student Account</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("?tab=profile");
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("?tab=settings");
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4 text-indigo-500" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm"
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

