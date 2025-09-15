import { useState } from "react";
import { Button } from "@/components/ui/button";
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
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <img src="/favicon.png" alt="Logo" className="w-20 h-20 rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">ScholarSnap</span>
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
                variant="ghost"
                onClick={() => navigate("/contact")}
                className="font-medium"
              >
                Contact
              </Button>
              <Button
                variant={currentPage === "Login" ? "default" : "ghost"}
                onClick={() => navigate("/login")}
                className="font-medium"
              >
                Login
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
