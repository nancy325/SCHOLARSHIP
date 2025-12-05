import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboardPage from "./components/StudentDashboardPage";
import AdminDashboard from "./components/AdminDashboard";
import ContactUsPage from "./components/ContactUsPage";
import ApiTest from "./components/ApiTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
         
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
