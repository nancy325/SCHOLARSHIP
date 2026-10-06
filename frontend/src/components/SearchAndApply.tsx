import React, { useState, useEffect } from "react";
import {
  Building2,
  GraduationCap,
  Calendar,
  ExternalLink,
  ChevronRight,
  Search,
  Star,
} from "lucide-react";
import { apiService } from "@/services/api";
import { useLocation } from "react-router-dom";
import { useScholarshipFavorites } from "@/hooks/useScholarshipFavorites";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const getTypeBadge = (type: string) => {
  const badges: Record<string, { label: string; className: string }> = {
    government: {
      label: "Government",
      className: "bg-emerald-50 text-emerald-800",
    },
    private: {
      label: "Private",
      className: "bg-amber-50 text-amber-900",
    },
    university: {
      label: "University",
      className: "bg-sky-50 text-sky-800",
    },
    institute: {
      label: "Institute",
      className: "bg-rose-50 text-rose-800",
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
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(
    () => new URLSearchParams(location.search).get("search") ?? ""
  );
  const [selectedType, setSelectedType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const { isFavorite, toggleFavorite } = useScholarshipFavorites();

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
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedType) params.type = selectedType;
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
          } else {
            setScholarships([]);
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
  }, [
    currentPage,
    searchQuery,
    selectedType,
    retryCount,
  ]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset page for new search
  };

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
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-4 text-primary hover:underline font-medium"
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
                      className="flex items-center gap-1 text-primary hover:underline font-medium text-sm"
                    >
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                    {scholarship.apply_link && (
                      <a
                        href={scholarship.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline font-medium text-sm"
                      >
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Find your next opportunity</p>
          <h2 className="mt-1 text-3xl font-semibold text-foreground">Scholarship directory</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">Search current listings and narrow results by the scholarship provider.</p>
      </div>
      <div className="mb-6 grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-end">
        <form onSubmit={onSearchSubmit} className="space-y-2">
          <label htmlFor="scholarship-search" className="text-sm font-medium text-foreground">Search scholarships</label>
          <div className="flex gap-2">
          <input
            id="scholarship-search"
            type="text"
            className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search by name or keyword"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
            <button type="submit" aria-label="Search scholarships" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Provider type
          <select
            value={selectedType}
            onChange={(event) => {
              setSelectedType(event.target.value);
              setCurrentPage(1);
            }}
            className="block h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All providers</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="university">University</option>
            <option value="institute">Institute</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setSelectedType("");
            setCurrentPage(1);
          }}
          disabled={!searchQuery && !selectedType}
          className="h-11 rounded-md px-3 text-sm font-medium text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear filters
        </button>
      </div>
      <div className="mb-2 text-sm text-muted-foreground">
        {selectedType ? `Showing ${selectedType} scholarships` : "Browse all available scholarships"}
        {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ""}
      </div>
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
                {selectedScholarship.eligibility && (
                  <div>
                    <h3 className="font-semibold">Eligibility</h3>
                    <p className="mt-1 text-muted-foreground">{selectedScholarship.eligibility}</p>
                  </div>
                )}
                {selectedScholarship.deadline && (
                  <p className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Deadline: {selectedScholarship.deadline}</p>
                )}
                {selectedScholarship.apply_link && (
                  <a href={selectedScholarship.apply_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
                    Visit application <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchAndApply;