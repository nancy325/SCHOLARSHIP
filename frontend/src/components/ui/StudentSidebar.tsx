// src/components/ui/StudentSidebar.tsx
import React from "react";
import {
  X,
  LayoutDashboard,
  Search,
  Wand2,
  Star,
  LifeBuoy,
  Filter,
  BookText,
} from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

type StudentSidebarProps = {
  sidebarOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onNavClick: (key: string) => void;
  navItems?: NavItem[];
};

const defaultNavItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: "available", label: "Available Scholarships", icon: <BookText className="w-5 h-5" /> },
  { key: "matched", label: "Matched Scholarships", icon: <Wand2 className="w-5 h-5" /> },
  { key: "favorites", label: "Favorite Scholarships", icon: <Star className="w-5 h-5" /> },
  { key: "search", label: "Search ", icon: <Search className="w-5 h-5" /> },
  { key: "support", label: "Support", icon: <LifeBuoy className="w-5 h-5" /> },
];

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  sidebarOpen,
  onClose,
  currentTab,
  onNavClick,
  navItems = defaultNavItems,
}) => {
  return (
    <>
      {/* Responsive Sidebar */}
      <aside
        id="student-sidebar"
        className={`fixed lg:static top-16 lg:top-auto left-0 bottom-0 lg:bottom-auto z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="text-lg font-bold text-gray-800">Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              aria-label="Close sidebar"
              aria-controls="student-sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavClick(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTab === item.key
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 ScholarSnap
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
          aria-label="Sidebar backdrop"
        />
      )}
    </>
  );
};

export default StudentSidebar;

