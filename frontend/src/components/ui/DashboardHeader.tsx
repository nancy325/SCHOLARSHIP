// src/components/StudentDashboard/DashboardHeader.tsx
import React from "react";
import { Bell, Search, Plus, Calendar } from "lucide-react";
import env from "../../env";
import { apiService } from "@/services/api";

type NextDeadline = {
  id: number;
  title: string;
  deadline: string;
} | null;

const DashboardHeader = () => {
  const features = {
    showAddApplication: env.SHOW_ADD_APPLICATION,
    showSearchButton: env.SHOW_SEARCH_BUTTON,
    showDeadlineBar: env.SHOW_DEADLINE_BAR,
  };

  // State for next deadline
  const [nextDeadline, setNextDeadline] = React.useState<NextDeadline>(null);
  const [loading, setLoading] = React.useState<boolean>(features.showDeadlineBar);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    if (features.showDeadlineBar) {
      (async () => {
        try {
          const res = await apiService.getStudentDashboard();
          if (isMounted && res.success && res.data && res.data.next_deadline) {
            setNextDeadline(res.data.next_deadline);
          }
        } catch (e: any) {
          if (isMounted) setError(e?.message || "Failed to load next deadline");
        } finally {
          if (isMounted) setLoading(false);
        }
      })();
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [features.showDeadlineBar]);

  // Helper to calculate days left
  const getDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Placeholder for user info (replace with real user data if available)
  const userInitial = "N";
  const userName = "Nancy";

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {userInitial}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userName}! 👋</h2>
            <p className="text-gray-600 mt-1">
              Ready to discover new scholarship opportunities? Let's find the perfect match for you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5" />
          </button>
          {features.showSearchButton && (
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
          )}
          {features.showAddApplication && (
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
              <Plus className="w-4 h-4" />
              New Application
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      {features.showDeadlineBar && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {loading
                  ? "Loading next deadline..."
                  : nextDeadline
                  ? `Next deadline: ${nextDeadline.title}`
                  : error
                  ? "Could not load next deadline"
                  : "No upcoming deadlines"}
              </span>
            </div>
            <div className="text-sm text-blue-600 font-medium">
              {loading
                ? ""
                : nextDeadline && nextDeadline.deadline
                ? (() => {
                    const days = getDaysLeft(nextDeadline.deadline);
                    if (days < 0) return "Deadline passed";
                    if (days === 0) return "Today";
                    if (days === 1) return "1 day left";
                    return `${days} days left`;
                  })()
                : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
