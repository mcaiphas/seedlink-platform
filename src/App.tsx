import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";

import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Onboarding from "@/pages/Onboarding";
import DashboardRouter from "@/pages/DashboardRouter";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import FarmerDashboard from "@/pages/dashboards/FarmerDashboard";
import SupplierDashboard from "@/pages/dashboards/SupplierDashboard";
import BuyerDashboard from "@/pages/dashboards/BuyerDashboard";
import TrainerDashboard from "@/pages/dashboards/TrainerDashboard";
import LogisticsDashboard from "@/pages/dashboards/LogisticsDashboard";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public auth routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected onboarding */}
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

            {/* Protected app shell */}
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<DashboardRouter />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="farmer" element={<FarmerDashboard />} />
              <Route path="supplier" element={<SupplierDashboard />} />
              <Route path="buyer" element={<BuyerDashboard />} />
              <Route path="trainer" element={<TrainerDashboard />} />
              <Route path="logistics" element={<LogisticsDashboard />} />
              <Route path="settings" element={<Settings />} />
              {/* Placeholder sub-routes */}
              <Route path="admin/*" element={<AdminDashboard />} />
              <Route path="farmer/*" element={<FarmerDashboard />} />
              <Route path="supplier/*" element={<SupplierDashboard />} />
              <Route path="buyer/*" element={<BuyerDashboard />} />
              <Route path="trainer/*" element={<TrainerDashboard />} />
              <Route path="logistics/*" element={<LogisticsDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
