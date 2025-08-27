import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentDashboard from "./ui/StudentDashboard";
import { User, LayoutDashboard, Search, Settings, Bell, LogOut } from "lucide-react";
import Profile from "./ui/Profile";
import SettingsPage from "./ui/SettingsPage";
import SearchAndApply from "./ui/SearchAndApply";

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Enhanced Dashboard Navigation */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 border-b border-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-lg">SB</span>
                  </div>
                  <span className="text-xl font-bold text-white">Scholar Booster</span>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      tab === item.key
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
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
            <div className="flex items-center space-x-4">
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">N</span>
              </div>
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    tab === item.key
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => handleNav(item.key)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Render selected subpage */}
      {renderPage()}
    </div>
  );
};

export default StudentDashboardPage;