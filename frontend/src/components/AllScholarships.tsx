import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchAndApply from "@/components/SearchAndApply";

const AllScholarships = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="landing" />
      
      {/* Main Content */}
      <main className="flex-1">
        <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">All Scholarships</h1>
            <p className="text-gray-600">Explore and apply for thousands of scholarship opportunities</p>
          </div>
        </section>

        <section className="py-8">
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
