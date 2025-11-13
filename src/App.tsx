import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Register from "./pages/register";
import Login from "./pages/login";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ Protected Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Error Page */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
