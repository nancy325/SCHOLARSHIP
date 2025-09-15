import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentDashboard from "./ui/StudentDashboard";
import { User, Search, LayoutDashboard, Settings, Bell, LogOut, ChevronDown } from "lucide-react";
import { apiService } from "@/services/api";
import Profile from "../pages/Profile";
import SettingsPage from "../pages/SettingsPage";
import SearchAndApply from "./SearchAndApply";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { key: "search", label: "Search & Apply", icon: <Search className="w-5 h-5" /> },
  { key: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StudentDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();
  const tab = query.get("tab") || "dashboard";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (key: string) => {
    navigate(`?tab=${key}`);
  };

  const renderPage = () => {
    switch (tab) {
      case "profile":
        return <Profile />;
      case "search":
        return <SearchAndApply />;
      case "settings":
        return <SettingsPage />;
      default:
        return <StudentDashboard />;
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // ignore; still clear client state
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-30 animate-float-slow"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full blur-3xl opacity-40 animate-float-reverse"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 right-1/4 w-12 h-12 border-4 border-blue-200/30 rounded-lg rotate-45"></div>
        <div className="absolute bottom-40 left-10 w-16 h-16 border-4 border-indigo-200/30 rounded-full"></div>
        <div className="absolute top-1/3 right-40 w-10 h-10 border-4 border-cyan-200/30 rotate-12"></div>
      </div>
      
      {/* Enhanced Dashboard Navigation */}
      <nav className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Title - Updated with your logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <img 
                    src="/favicon.png" 
                    alt="ScholarSnap Logo" 
                    className="w-12 h-12 object-contain mr-3" 
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">ScholarSnap</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      tab === item.key
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-600 hover:bg-white hover:shadow-md hover:text-blue-600"
                    }`}
                    onClick={() => handleNav(item.key)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2.5 text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-xl transition-all duration-300 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center space-x-2 bg-white py-1.5 pl-1.5 pr-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md">
                  N
                </div>
                <span className="text-sm font-medium text-gray-700">Nancy</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-sm rounded-xl transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex justify-around bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={`flex flex-col items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    tab === item.key
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => handleNav(item.key)}
                >
                  <span className="mb-1">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Render selected subpage */}
      <div className="relative z-10">
        {renderPage()}
      </div>

      {/* Add custom styles for animations using a style tag without jsx attribute */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(15px) rotate(-5deg); }
          }
          @keyframes float-reverse {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(20px) rotate(5deg); }
          }
          .animate-float {
            animation: float 15s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 20s ease-in-out infinite;
          }
          .animate-float-reverse {
            animation: float-reverse 18s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default StudentDashboardPage;