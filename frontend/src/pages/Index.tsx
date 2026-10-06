import { useSearchParams } from "react-router-dom";
import HomePage from "@/components/HomePage";
import AboutUsPage from "@/components/AboutUsPage";
import FAQsPage from "@/components/FAQsPage";
import RegisterInstitutePage from "@/components/RegisterInstitutePage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("view") || "home";
  const setCurrentPage = (page: string) => {
    setSearchParams(page === "home" ? {} : { view: page });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutUsPage />;
      case "faqs":
        return <FAQsPage />;
      case "register":
        return <RegisterInstitutePage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
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
