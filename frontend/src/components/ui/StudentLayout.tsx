// src/components/ui/StudentLayout.tsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentHeader from "./StudentHeader";
import StudentSidebar from "./StudentSidebar";

type StudentLayoutProps = {
  children: React.ReactNode;
  navItems?: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
  }>;
};

const StudentLayout: React.FC<StudentLayoutProps> = ({ children, navItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const prevTabRef = useRef<string>("");

  // Get current tab from query params
  const query = new URLSearchParams(location.search);
  const currentTab = query.get("tab") || "dashboard";

  // Close sidebar on route change (mobile only, and only when tab actually changes)
  useEffect(() => {
    // Only close if tab actually changed (not on initial mount)
    if (prevTabRef.current && prevTabRef.current !== currentTab) {
      // Only close on mobile (check window width)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
    prevTabRef.current = currentTab;
  }, [currentTab]);

  const handleNav = (key: string) => {
    setSidebarOpen(false);
    navigate(`?tab=${key}`);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header Component */}
      <StudentHeader 
        sidebarOpen={sidebarOpen} 
        onSidebarToggle={handleSidebarToggle} 
      />

      <div className="flex">
        {/* Sidebar Component */}
        <StudentSidebar
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentTab={currentTab}
          onNavClick={handleNav}
          navItems={navItems}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

