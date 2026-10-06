// src/components/ui/StudentSidebar.tsx
import React from "react";
import {
  X,
  LayoutDashboard,
  Search,
  Wand2,
  Star,
  LifeBuoy,
  BookText,
  Settings,
  CircleHelp,
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
  { key: "search", label: "Search", icon: <Search className="w-5 h-5" /> },
  { key: "faqs", label: "FAQs", icon: <CircleHelp className="w-5 h-5" /> },
  { key: "support", label: "Support", icon: <LifeBuoy className="w-5 h-5" /> },
  { key: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
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
        className={`fixed lg:static top-16 lg:top-auto left-0 bottom-0 lg:bottom-auto z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-hidden={!sidebarOpen && window.innerWidth < 1024}
      >
          <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-screen">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-sidebar-border p-4 lg:hidden">
            <span className="text-lg font-semibold text-sidebar-foreground">Menu</span>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent"
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
                type="button"
                onClick={() => onNavClick(item.key)}
                aria-current={currentTab === item.key ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
                  currentTab === item.key
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} ScholarSnap
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-label="Sidebar backdrop"
        />
      )}
    </>
  );
};

export default StudentSidebar;

