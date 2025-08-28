// src/components/StudentDashboard/DashboardStats.tsx
import { TrendingUp, Target, Clock, Award } from "lucide-react";

const stats = [
  { 
    label: "Total Scholarships", 
    value: 247, 
    note: "Available scholarships",
    icon: <Award className="w-5 h-5" />,
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100"
  },
  { 
    label: "Eligible For", 
    value: 23, 
    note: "Based on your profile",
    icon: <Target className="w-5 h-5" />,
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100"
  },
  { 
    label: "Applications", 
    value: 8, 
    note: "In progress",
    icon: <TrendingUp className="w-5 h-5" />,
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100"
  },
  { 
    label: "Deadlines", 
    value: 5, 
    note: "This week",
    icon: <Clock className="w-5 h-5" />,
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100"
  }
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
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
