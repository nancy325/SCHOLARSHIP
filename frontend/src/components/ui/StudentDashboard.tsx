// src/components/StudentDashboard/StudentDashboard.tsx
import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import FeaturedScholarships from "./FeaturedScholarships";
import QuickActions from "./QuickActions";
import { apiService } from "@/services/api";

type StudentDashboardData = {
  stats: {
    total_visible_scholarships: number;
    deadlines_this_week: number;
  };
  next_deadline?: { id: number; title: string; deadline: string } | null;
  upcoming_deadlines: Array<{ id: number; title: string; deadline: string }>;
  recent_scholarships: Array<{ id: number; title: string; type: string; deadline?: string | null }>;
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    recent: Array<{ id: number; scholarship_id: number; status: string; submitted_at?: string | null; created_at: string }>;
  };
};

const StudentDashboard = () => {
  const [data, setData] = React.useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await apiService.getStudentDashboard();
        if (isMounted && res.success && res.data) {
          setData(res.data as StudentDashboardData);
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load dashboard');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <DashboardStats data={data?.stats} loading={loading} />
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeaturedScholarships items={data?.recent_scholarships || []} loading={loading} />
          </div>
          <div className="lg:col-span-1">
            <QuickActions deadlines={data?.upcoming_deadlines || []} recentApplications={data?.applications?.recent || []} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
