import { useState } from "react";
import HomePage from "@/components/HomePage";
import AboutUsPage from "@/components/AboutUsPage";
import FAQsPage from "@/components/FAQsPage";
import RegisterInstitutePage from "@/components/RegisterInstitutePage";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <Header
        variant="landing"
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
      />

      {/* Page Content */}
      {renderPage()}

      <Footer />
    </div>
  );
};

export default Index;
