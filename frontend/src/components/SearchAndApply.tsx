import React, { useState, useEffect } from "react";
import {
  Building2,
  GraduationCap,
  Calendar,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { apiService } from "@/services/api";
import { useLocation } from "react-router-dom";

// Scholarship type for type safety
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

// Tab&Button options based on image
const tabOptions = [
  { value: "categories", label: "Categories" },
  { value: "state", label: "State" },
  { value: "class", label: "Current Class" },
  { value: "type", label: "Type" },
  { value: "international", label: "International" },
  { value: "government", label: "Government" },
];

const categoryFilters = [
  { value: "girls", label: "Girls" },
  { value: "scstobc", label: "SC/ST/OBC" },
  { value: "minority", label: "Minority" },
  { value: "disabled", label: "Physically Disabled" },
];

const quickFilters = [
  { value: "", label: "All Scholarships" },
  { value: "live", label: "Live Application Form" },
 ];

// Utility badge for type (unchanged)
const getTypeBadge = (type: string) => {
  const badges: Record<string, { label: string; className: string }> = {
    government: {
      label: "Government",
      className: "bg-blue-100 text-blue-700",
    },
    private: {
      label: "Private",
      className: "bg-purple-100 text-purple-700",
    },
    university: {
      label: "University",
      className: "bg-green-100 text-green-700",
    },
    institute: {
      label: "Institute",
      className: "bg-orange-100 text-orange-700",
    },
  };
  const badge =
    badges[type] || { label: type, className: "bg-gray-100 text-gray-700" };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}
    >
      {badge.label}
    </span>
  );
};

// Deadline utility (unchanged)
const getDaysLeft = (deadline: string | null | undefined): string => {
  if (!deadline) return "No deadline";
  const now = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "Deadline passed";
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day left";
  return `${diff} days left`;
};

const SearchAndApply = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [quickFilter, setQuickFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  // API fetch scholarships
  useEffect(() => {
    let isMounted = true;
    const fetchScholarships = async () => {
      setLoading(true);
      setError(null);
      const params: any = {
        page: currentPage,
        per_page: 12,
      };
      if (searchQuery) params.search = searchQuery;
      if (selectedType) params.type = selectedType;
      if (selectedCategory) params.category = selectedCategory;
      if (quickFilter) params.quick = quickFilter;
      try {
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
        } else if (isMounted) {
          setScholarships([]);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || "Failed to load scholarships.");
          setScholarships([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchScholarships();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [
    currentPage,
    searchQuery,
    selectedType,
    selectedCategory,
    quickFilter,
  ]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset page for new search
  };

  // Scholarships list (unchanged except margin moved lower)
  const renderScholarships = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
            >
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-8">
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

    if (!scholarships.length) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center mt-8">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Scholarships Found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
                      <span className="truncate">
                        {scholarship.university.name}
                      </span>
                    </div>
                  )}
                  {scholarship.institute && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="truncate">
                        {scholarship.institute.name}
                      </span>
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

  // Tab content (demo version for the shown mockup -- only using category tab for now)
  const renderTabContent = () => {
    switch (selectedTab) {
      case "categories":
        return (
          <div className="flex flex-wrap gap-3 mt-3">
            {categoryFilters.map((cat) => (
              <button
                key={cat.value}
                className={`px-5 py-2 rounded-lg border text-base font-medium min-w-[160px] transition ${
                  selectedCategory === cat.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
                onClick={() => {
                  setSelectedCategory(cat.value === selectedCategory ? null : cat.value);
                  setCurrentPage(1);
                }}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>
        );
      case "type":
      case "government":
      case "international":
        // Future: Implement further filter tab UIs as needed
        return (
          <div className="text-gray-500 mt-4 px-2 py-2">
            (Filter coming soon)
          </div>
        );
      default:
        return null;
    }
  };

  // Main Render
  return (
    <div className="max-w-4xl mx-auto px-3 py-10">
      {/* Section: Title */}
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Search and Filter
        </h2>
      </div>
      {/* Section: Search + Quick Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <form onSubmit={onSearchSubmit}>
          <input
            type="text"
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search Scholarships of any State/Gender/Class"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </form>
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-1">
          {quickFilters.map((btn) => (
            <button
              key={btn.value}
              className={`px-4 py-1.5 rounded border text-sm font-medium ${
                quickFilter === btn.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => {
                setQuickFilter(btn.value);
                setCurrentPage(1);
              }}
              type="button"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      {/* Section: Informational (optional, mimic visual) */}
      <div className="text-gray-700 text-sm mb-2 font-medium">
        Select the scholarship according to your need and preference
      </div>
      {/* Tabs for filtering */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tabOptions.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded border text-sm font-semibold ${
              selectedTab === tab.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-blue-50"
            }`}
            type="button"
            onClick={() => {
              setSelectedTab(tab.value);
              setSelectedCategory(null);
              setCurrentPage(1);
              // For demo, only switch to type tab will set type
              if (tab.value === "type" || tab.value === "government" || tab.value === "international") {
                setSelectedType(tab.value === "type" ? "" : tab.value);
              } else {
                setSelectedType("");
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Subfilters / content under tab */}
      {renderTabContent()}
      {/* Scholarships cards */}
      {renderScholarships()}
    </div>
  );
};

export default SearchAndApply;