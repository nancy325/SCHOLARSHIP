// src/components/ui/QuickActions.tsx
import { Calendar, FileText, Bookmark, TrendingUp, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";

const QuickActions = () => {
  const recentActivity = [
    { action: "Applied to STEM Excellence Scholarship", time: "2 hours ago", status: "pending" },
    { action: "Profile updated", time: "1 day ago", status: "completed" },
    { action: "New scholarship match found", time: "2 days ago", status: "new" },
    { action: "Application deadline reminder", time: "3 days ago", status: "reminder" }
  ];

  const upcomingDeadlines = [
    { scholarship: "STEM Excellence Scholarship", deadline: "June 30, 2024", daysLeft: 3 },
    { scholarship: "Women in Tech Grant", deadline: "July 15, 2024", daysLeft: 18 },
    { scholarship: "Community Service Award", deadline: "August 1, 2024", daysLeft: 35 }
  ];

  const quickLinks = [
    { title: "Complete Profile", icon: <FileText className="w-4 h-4" />, progress: 85 },
    { title: "Upload Documents", icon: <FileText className="w-4 h-4" />, progress: 60 },
    { title: "Find Scholarships", icon: <Bookmark className="w-4 h-4" />, progress: 100 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-orange-500" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "new": return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "reminder": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {quickLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {link.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{link.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                    style={{ width: `${link.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{link.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-500" />
          Upcoming Deadlines
        </h3>
        <div className="space-y-3">
          {upcomingDeadlines.map((deadline, index) => (
            <div key={index} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">{deadline.scholarship}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  deadline.daysLeft <= 7 ? 'bg-red-100 text-red-600' : 
                  deadline.daysLeft <= 14 ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {deadline.daysLeft} days
                </span>
              </div>
              <div className="text-xs text-gray-500">{deadline.deadline}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="mt-0.5">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2">
          View All Activity <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Tips & Resources */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-3">💡 Pro Tip</h3>
        <p className="text-sm text-blue-100 mb-4">
          Complete your profile to 100% to unlock personalized scholarship recommendations and increase your match score.
        </p>
        <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          Complete Profile
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
