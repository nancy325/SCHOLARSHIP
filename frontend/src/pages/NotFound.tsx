import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">ScholarSnap</p>
        <h1 className="mb-3 mt-2 text-5xl font-semibold">404</h1>
        <p className="mb-5 text-lg text-muted-foreground">This page isn’t available.</p>
        <Link to="/" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
