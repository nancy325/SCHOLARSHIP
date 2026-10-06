import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchAndApply from "@/components/SearchAndApply";

const AllScholarships = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="landing" />
      
      {/* Main Content */}
      <main className="flex-1">
        <section className="border-b border-border bg-card py-12">
          <div className="container mx-auto px-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Scholarship directory</p>
            <h1 className="mb-2 mt-1 text-4xl font-semibold text-foreground">Find your next opportunity</h1>
            <p className="max-w-2xl text-muted-foreground">Search published scholarships, compare eligibility details, and visit the official application link.</p>
          </div>
        </section>

        <section className="py-4">
          <div className="container mx-auto px-4">
            <SearchAndApply />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AllScholarships;
