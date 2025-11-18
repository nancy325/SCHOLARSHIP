// src/components/ui/StudentHeader.tsx
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Bell, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

type StudentHeaderProps = {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
};

const StudentHeader: React.FC<StudentHeaderProps> = ({ sidebarOpen, onSidebarToggle }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Get user data from localStorage
  const storedUser = apiService.getStoredUser();
  const userInitial = storedUser?.name?.charAt(0).toUpperCase() || "U";
  const userName = storedUser?.name || "User";

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
                onSidebarToggle();
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

export default StudentHeader;

