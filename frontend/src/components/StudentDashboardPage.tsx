import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentLayout from "./ui/StudentLayout";
import StudentDashboard from "./ui/StudentDashboard";
import Profile from "../pages/Profile";
import SettingsPage from "../pages/SettingsPage";
import SearchAndApply from "./SearchAndApply";
import FAQsPage from "./FAQsPage";
import { useScholarshipFavorites } from "@/hooks/useScholarshipFavorites";
import { Bookmark, ExternalLink, Search, Sparkles, Trash2 } from "lucide-react";

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useScholarshipFavorites();
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Saved on this device</p>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">Your favorites</h1>
        </div>
        <p className="text-sm text-muted-foreground">{favorites.length} saved {favorites.length === 1 ? "scholarship" : "scholarships"}</p>
      </div>
      {favorites.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
          <Bookmark className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">No saved scholarships yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Save opportunities from the scholarship list and they will appear here in this browser.</p>
          <button type="button" onClick={() => navigate("?tab=available")} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Search className="h-4 w-4" /> Browse scholarships
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((scholarship) => (
            <article key={scholarship.id} className="flex min-h-52 flex-col rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="rounded-full bg-secondary/25 px-2.5 py-1 text-xs font-semibold text-foreground">{scholarship.type || "Scholarship"}</span>
                <button type="button" onClick={() => toggleFavorite(scholarship)} aria-label={`Remove ${scholarship.title} from favorites`} title="Remove from favorites" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">{scholarship.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{scholarship.description || "No description available."}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">{scholarship.deadline ? `Deadline ${scholarship.deadline}` : "No deadline listed"}</span>
                {scholarship.apply_link && <a href={scholarship.apply_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Apply <ExternalLink className="h-3.5 w-3.5" /></a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

const MatchesPage = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <Sparkles className="mx-auto mb-4 h-8 w-8 text-secondary" />
        <h1 className="text-2xl font-semibold text-foreground">Personalized matching isn’t available yet</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">You can still browse every published scholarship and save the opportunities that interest you. This workspace does not currently calculate eligibility matches.</p>
        <button type="button" onClick={() => navigate("?tab=available")} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Search className="h-4 w-4" /> Browse scholarships
        </button>
      </div>
    </section>
  );
};

const StudentDashboardPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tab = query.get("tab") || "dashboard";

  const renderPage = () => {
    switch (tab) {
      case "available":
        return <StudentDashboard targetTab="available" showSearchInput={false} />;
      case "profile":
        return <Profile />;
      case "search":
        return <SearchAndApply />;
      case "settings":
        return <SettingsPage />;
      case "faqs":
        return <FAQsPage />;
      case "support":
        return <FAQsPage />;
      case "matched":
        return <MatchesPage />;
      case "favorites":
        return <FavoritesPage />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <StudentLayout>
      {renderPage()}
    </StudentLayout>
  );
};

export default StudentDashboardPage;