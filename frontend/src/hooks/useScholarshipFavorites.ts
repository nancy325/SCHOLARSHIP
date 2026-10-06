import { useEffect, useState } from "react";

const STORAGE_KEY = "scholarsnap:favorite-scholarships";
const CHANGE_EVENT = "scholarsnap:favorites-changed";

export type FavoriteScholarship = {
  id: number;
  title: string;
  description?: string | null;
  type?: string;
  deadline?: string | null;
  eligibility?: string | null;
  apply_link?: string | null;
  university?: { id: number; name: string } | null;
  institute?: { id: number; name: string } | null;
  created_at?: string;
};

const readFavorites = (): FavoriteScholarship[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const favorites: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(favorites)
      ? favorites.filter((item): item is FavoriteScholarship => typeof item?.id === "number" && typeof item?.title === "string")
      : [];
  } catch {
    return [];
  }
};

export const useScholarshipFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteScholarship[]>(readFavorites);

  useEffect(() => {
    const syncFavorites = () => setFavorites(readFavorites());
    window.addEventListener("storage", syncFavorites);
    window.addEventListener(CHANGE_EVENT, syncFavorites);
    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener(CHANGE_EVENT, syncFavorites);
    };
  }, []);

  const toggleFavorite = (scholarship: FavoriteScholarship) => {
    const existing = readFavorites();
    const isSaved = existing.some((item) => item.id === scholarship.id);
    const updated = isSaved
      ? existing.filter((item) => item.id !== scholarship.id)
      : [...existing, scholarship];

    setFavorites(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // The current session still reflects the user's change if storage is unavailable.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return !isSaved;
  };

  const isFavorite = (id: number) => favorites.some((item) => item.id === id);

  return { favorites, isFavorite, toggleFavorite };
};
