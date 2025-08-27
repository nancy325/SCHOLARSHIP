// src/components/StudentDashboard/StudentDashboard.tsx
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import FeaturedScholarships from "./FeaturedScholarships";
import QuickActions from "./QuickActions";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <DashboardStats />
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeaturedScholarships />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
