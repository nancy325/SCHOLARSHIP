import React from "react";
import { useLocation } from "react-router-dom";
import StudentLayout from "./ui/StudentLayout";
import StudentDashboard from "./ui/StudentDashboard";
import Profile from "../pages/Profile";
import SettingsPage from "../pages/SettingsPage";
import SearchAndApply from "./SearchAndApply";
import FAQsPage from "./FAQsPage";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StudentDashboardPage = () => {
  const location = useLocation();
  const query = useQuery();
  const tab = query.get("tab") || "dashboard";

  const renderPage = () => {
    switch (tab) {
      case "available":
        return <StudentDashboard targetTab="available" showSearchInput={false} />;
      case "profile":
        return <Profile />;
      case "search":
        return <SearchAndApply />;
      case "settings":
        return <SettingsPage />;
      case "faqs":
        return <FAQsPage />;
      default:
       return <StudentDashboard />;
    }
  };

  return (
    <StudentLayout>
      {renderPage()}
    </StudentLayout>
  );
};

export default StudentDashboardPage;