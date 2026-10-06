// src/components/ui/StudentDashboard.tsx
import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { 
  Calendar,
  Building2,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Filter,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useScholarshipFavorites } from "@/hooks/useScholarshipFavorites";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [totalItems, setTotalItems] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const { favorites, isFavorite, toggleFavorite } = useScholarshipFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from query params
  const query = new URLSearchParams(location.search);
  const currentTab = query.get("tab") || "dashboard";
  const shouldRender = currentTab === targetTab;

  // Fetch scholarships from API
  useEffect(() => {
    let isMounted = true;
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        setError(null);
        setError(null);
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
            setTotalItems(data.total || data.data.length);
          } else if (Array.isArray(data)) {
            setScholarships(data);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(data.length);
          } else {
            setScholarships([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(0);
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
  }, [currentPage, searchQuery, selectedType, currentTab, retryCount, targetTab]);


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
      government: { label: "Government", className: "bg-emerald-50 text-emerald-800" },
      private: { label: "Private", className: "bg-amber-50 text-amber-900" },
      university: { label: "University", className: "bg-sky-50 text-sky-800" },
      institute: { label: "Institute", className: "bg-rose-50 text-rose-800" },
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
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-4 font-medium text-primary hover:underline"
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
                    <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
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

                <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(scholarship.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(scholarship)}
                      aria-label={isFavorite(scholarship.id) ? "Remove from favorites" : "Add to favorites"}
                      title={isFavorite(scholarship.id) ? "Remove from favorites" : "Add to favorites"}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Star className={`h-4 w-4 ${isFavorite(scholarship.id) ? "fill-current" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedScholarship(scholarship)}
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Details <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  {scholarship.apply_link ? (
                    <a
                      href={scholarship.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline font-medium text-sm"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No application link</span>
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Student workspace</p>
        <h1 className="mb-2 mt-1 text-3xl font-semibold text-foreground">
          {targetTab === "dashboard" ? "Your scholarship dashboard" : "Available scholarships"}
        </h1>
        <p className="text-muted-foreground">
          {targetTab === "dashboard" ? "A clear view of current opportunities and your saved list." : "Search published opportunities and save the ones you want to revisit."}
        </p>
      </div>

      {targetTab === "dashboard" && (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Published scholarships</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{loading ? "—" : totalItems.toLocaleString()}</p>
            </div>
            <button type="button" onClick={() => navigate("?tab=favorites")} className="rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <p className="text-sm text-muted-foreground">Saved in this browser</p>
              <p className="mt-2 flex items-center justify-between text-3xl font-semibold text-foreground">{favorites.length}<ArrowUpRight className="h-5 w-5 text-primary" /></p>
            </button>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Application links on this page</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{scholarships.filter((item) => item.apply_link).length}</p>
            </div>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => navigate("?tab=profile")} className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted">Complete your profile</button>
            <button type="button" onClick={() => navigate("?tab=faqs")} className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted">Scholarship FAQs</button>
          </div>
        </>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          {showSearchInput && (
            <div className="flex-1 space-y-2">
              <label htmlFor="student-scholarship-search" className="text-sm font-medium text-foreground">Search scholarships</label>
              <input
                id="student-scholarship-search"
                type="text"
                aria-label="Search scholarships"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}
          <label className="space-y-2 text-sm font-medium text-foreground">
            <span className="flex items-center gap-2"><Filter className="h-4 w-4" /> Provider type</span>
            <select
              value={selectedType}
              onChange={(event) => {
                setSelectedType(event.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Scholarships Grid */}
      {renderScholarships()}
      <Dialog open={Boolean(selectedScholarship)} onOpenChange={(open) => !open && setSelectedScholarship(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {selectedScholarship && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedScholarship.title}</DialogTitle>
                <DialogDescription>{selectedScholarship.type} scholarship</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm text-foreground">
                <p className="whitespace-pre-wrap text-muted-foreground">{selectedScholarship.description || "No description is available yet."}</p>
                {selectedScholarship.eligibility && <p><span className="font-semibold">Eligibility: </span>{selectedScholarship.eligibility}</p>}
                {selectedScholarship.deadline && <p className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Deadline: {selectedScholarship.deadline}</p>}
                {selectedScholarship.apply_link && <a href={selectedScholarship.apply_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">Visit application <ExternalLink className="h-4 w-4" /></a>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
