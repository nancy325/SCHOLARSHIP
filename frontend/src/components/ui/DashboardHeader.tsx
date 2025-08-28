// src/components/StudentDashboard/DashboardHeader.tsx
import { Bell, Search, Plus, Calendar } from "lucide-react";

const DashboardHeader = () => {
    return (
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              N
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back, Nancy! 👋</h2>
              <p className="text-gray-600 mt-1">
                Ready to discover new scholarship opportunities? Let's find the perfect match for you.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Next deadline: STEM Excellence Scholarship</span>
            </div>
            <div className="text-sm text-blue-600 font-medium">3 days left</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DashboardHeader;
  