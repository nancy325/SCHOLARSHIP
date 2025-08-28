// src/components/StudentDashboard/FeaturedScholarships.tsx
import { Clock, DollarSign, Users, ArrowRight, Star } from "lucide-react";

const scholarships = [
  {
    title: "STEM Excellence Scholarship",
    description: "For outstanding students in science, technology, engineering, and mathematics.",
    deadline: "June 30, 2024",
    amount: "$10,000",
    applicants: 156,
    matchScore: 95,
    category: "STEM",
    status: "featured"
  },
  {
    title: "Women in Tech Grant",
    description: "Supporting women pursuing careers in technology fields.",
    deadline: "July 15, 2024",
    amount: "$8,500",
    applicants: 89,
    matchScore: 88,
    category: "Technology",
    status: "hot"
  },
  {
    title: "Community Service Award",
    description: "For students with exceptional community service records.",
    deadline: "August 1, 2024",
    amount: "$5,000",
    applicants: 234,
    matchScore: 92,
    category: "Community",
    status: "new"
  },
  {
    title: "First Generation Student Fund",
    description: "Supporting first-generation college students in their academic journey.",
    deadline: "July 22, 2024",
    amount: "$12,000",
    applicants: 67,
    matchScore: 96,
    category: "First Gen",
    status: "featured"
  }
];

const getStatusBadge = (status: string) => {
  const badges = {
    featured: { text: "Featured", class: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" },
    hot: { text: "Hot", class: "bg-gradient-to-r from-red-500 to-orange-500 text-white" },
    new: { text: "New", class: "bg-gradient-to-r from-green-500 to-emerald-500 text-white" }
  };
  
  const badge = badges[status as keyof typeof badges];
  return badge ? (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
      {badge.text}
    </span>
  ) : null;
};

const FeaturedScholarships = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">🎓 Featured Scholarships</h3>
          <p className="text-gray-600">
            Handpicked opportunities that match your profile
          </p>
        </div>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {scholarships.map((sch, idx) => (
          <div key={idx} className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(sch.status)}
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {sch.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {sch.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {sch.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Amount</span>
                  </div>
                  <span className="font-semibold text-green-600">{sch.amount}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Applicants</span>
                  </div>
                  <span className="text-gray-700">{sch.applicants}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>Match Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sch.matchScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{sch.matchScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Deadline: {sch.deadline}</span>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedScholarships;
  