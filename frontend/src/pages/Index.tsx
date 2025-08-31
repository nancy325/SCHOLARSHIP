import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HomePage from "@/components/HomePage";
import AboutUsPage from "@/components/AboutUsPage";
import FAQsPage from "@/components/FAQsPage";
import RegisterInstitutePage from "@/components/RegisterInstitutePage";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const navigate = useNavigate();

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutUsPage />;
      case "faqs":
        return <FAQsPage />;
      case "register":
        return <RegisterInstitutePage />;
      case "Login":
        return <Login />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
              <span className="text-xl font-bold text-foreground">ScholarPortal</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant={currentPage === "home" ? "default" : "ghost"}
                onClick={() => setCurrentPage("home")}
                className="font-medium"
              >
                Home
              </Button>
              <Button
                variant={currentPage === "about" ? "default" : "ghost"}
                onClick={() => setCurrentPage("about")}
                className="font-medium"
              >
                About Us
              </Button>
              <Button
                variant={currentPage === "register" ? "default" : "ghost"}
                onClick={() => setCurrentPage("register")}
                className="font-medium"
              >
                Register Institute
              </Button>
              <Button
                variant={currentPage === "faqs" ? "default" : "ghost"}
                onClick={() => setCurrentPage("faqs")}
                className="font-medium"
              >
                FAQs
              </Button>
              <Button
                variant={currentPage === "Login" ? "default" : "ghost"}
                onClick={() => navigate("/login")}
                className="font-medium"
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin-login")}
                className="font-medium"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {renderPage()}
    </div>
  );
};

export default Index;
