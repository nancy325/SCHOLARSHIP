import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboardPage from "./components/StudentDashboardPage";
import AdminDashboard from "./components/AdminDashboard";
import ContactUsPage from "./components/ContactUsPage";
import AllScholarships from "./components/AllScholarships";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/" element={<Index />} />
                <Route index element={<Index />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/all-scholarships" element={<AllScholarships />} />
                <Route path="/student-dashboard" element={<StudentDashboardPage />} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
