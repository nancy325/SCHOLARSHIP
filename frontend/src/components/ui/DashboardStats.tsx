// src/components/StudentDashboard/DashboardStats.tsx
import { TrendingUp, Target, Clock, Award } from "lucide-react";

type Props = {
  loading?: boolean;
  data?: {
    total_visible_scholarships: number;
    deadlines_this_week: number;
  } | null;
};

const DashboardStats = ({ loading, data }: Props) => {
  const items = [
    { 
      label: "Total Scholarships", 
      value: data?.total_visible_scholarships ?? (loading ? '—' : 0), 
      note: "Available scholarships",
      icon: <Award className="w-5 h-5" />,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    { 
      label: "Deadlines", 
      value: data?.deadlines_this_week ?? (loading ? '—' : 0), 
      note: "This week",
      icon: <Clock className="w-5 h-5" />,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((stat, index) => (
        <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-sm p-6 border border-white/50 hover:shadow-md transition-all duration-300 group`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} text-white shadow-sm`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-300">
              {stat.value}
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
          <div className="text-xs text-gray-500">{stat.note}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
