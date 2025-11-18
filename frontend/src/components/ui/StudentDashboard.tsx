// src/components/ui/StudentDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import { apiService } from "@/services/api";
import { 
  Calendar,
  Building2,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import { useLocation } from "react-router-dom";

type Scholarship = {
  id: number;
  title: string;
  description: string;
  type: string;
  deadline?: string | null;
  start_date?: string | null;
  eligibility?: string | null;
  apply_link?: string | null;
  university?: { id: number; name: string } | null;
  institute?: { id: number; name: string } | null;
  created_at: string;
};

type ScholarshipsResponse = {
  data: Scholarship[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type StudentDashboardProps = {
  targetTab?: string;
  showSearchInput?: boolean;
};

const TYPES = [
  { value: "", label: "All Types" },
  { value: "government", label: "Government" },
  { value: "private", label: "Private" },
  { value: "university", label: "University" },
  { value: "institute", label: "Institute" },
];

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  targetTab = "dashboard",
  showSearchInput = true,
}) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Get current tab from query params
  const query = new URLSearchParams(location.search);
  const currentTab = query.get("tab") || "dashboard";
  const shouldRender = currentTab === targetTab;

  // Close filter menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  // Fetch scholarships from API
  useEffect(() => {
    let isMounted = true;
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const params: any = {
          page: currentPage,
          per_page: 12,
        };
        
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        if (selectedType) {
          params.type = selectedType;
        }

        const res = await apiService.getScholarships(params);
        
        if (isMounted && res.success && res.data) {
          const data = res.data as any;
          if (data.data && Array.isArray(data.data)) {
            setScholarships(data.data);
            setCurrentPage(data.current_page || 1);
            setTotalPages(data.last_page || 1);
          } else if (Array.isArray(data)) {
            setScholarships(data);
            setCurrentPage(1);
            setTotalPages(1);
          }
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || 'Failed to load scholarships');
          console.error('Error fetching scholarships:', e);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (currentTab === targetTab) {
      fetchScholarships();
    }

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, selectedType, currentTab, targetTab]);


  const getDaysLeft = (deadline: string | null | undefined): string => {
    if (!deadline) return "No deadline";
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Deadline passed";
    if (diff === 0) return "Today";
    if (diff === 1) return "1 day left";
    return `${diff} days left`;
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      government: { label: "Government", className: "bg-blue-100 text-blue-700" },
      private: { label: "Private", className: "bg-purple-100 text-purple-700" },
      university: { label: "University", className: "bg-green-100 text-green-700" },
      institute: { label: "Institute", className: "bg-orange-100 text-orange-700" },
    };
    const badge = badges[type] || { label: type, className: "bg-gray-100 text-gray-700" };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  // Render scholarships list
  const renderScholarships = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (scholarships.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Scholarships Found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeBadge(scholarship.type)}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {scholarship.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {scholarship.description || "No description available"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {scholarship.university && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{scholarship.university.name}</span>
                    </div>
                  )}
                  {scholarship.institute && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="truncate">{scholarship.institute.name}</span>
                    </div>
                  )}
                  {scholarship.deadline && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <Calendar className="w-4 h-4" />
                      <span>{getDaysLeft(scholarship.deadline)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(scholarship.created_at).toLocaleDateString()}
                  </span>
                  {scholarship.apply_link ? (
                    <a
                      href={scholarship.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  // Only render dashboard content when on dashboard tab
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Scholarships</h1>
        <p className="text-gray-600">Discover and apply for scholarships that match your profile</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 relative">
          {showSearchInput && (
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          {/* Filter menu trigger */}
          <div className="relative flex items-center">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="button"
              aria-haspopup="true"
              aria-expanded={filterOpen}
              aria-controls="filter-menu"
            >
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">
                {TYPES.find((t) => t.value === selectedType)?.label || "All Types"}
              </span>
            </button>
            {/* Filter menu dropdown */}
            {filterOpen && (
              <div
                id="filter-menu"
                ref={filterMenuRef}
                className="absolute right-0 mt-2 z-20 min-w-[180px] rounded-xl bg-white shadow-lg border border-gray-200 p-2"
              >
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === t.value
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedType(t.value);
                      setCurrentPage(1);
                      setFilterOpen(false);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      {renderScholarships()}
    </div>
  );
};

export default StudentDashboard;
