import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import LoginPage from "./components/auth/LoginPage";
import PasswordChange from "./components/auth/PasswordChange";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import HomePage from "./components/home/HomePage";
import DataEntryForm from "./components/dataEntry/DataEntryForm";
import DashboardAdmin from "./components/dashboard/DashboardAdmin";
import CalculationPage from "./components/calculator/CalculationPage";
import VisualizationPage from "./components/visualization/VisualizationPage";
import UserRegistration from "./components/admin/UserRegistration";
import UserManagement from "./components/admin/UserManagement";
import DashboardPage from "./components/dashboard/DashboardPage";
import EmissionConfigPage from "./components/admin/EmissionConfigPage";
import UserProfile from "./components/auth/UserProfile";
import AccountSettings from "./components/auth/AccountSettings";

import NotFound from "./pages/NotFound";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import RecommendationsPage from "./components/recommendations/RecommendationsPage";
import ReportPage from "./components/reports/ReportPage";

const queryClient = new QueryClient();

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState, isAdmin } = useAuth();

  if (authState.isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }

  if (!authState.isAuthenticated || !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>

              
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Page de connexion */}
              <Route path="/login" element={<LoginPage />} />

              {/* Pages de gestion de mot de passe */}
              <Route path="/password-change" element={<PasswordChange />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Pages utilisateurs connectés */}
              <Route path="/home" element={
                <AuthenticatedLayout>
                  <HomePage />
                </AuthenticatedLayout>
              } />
              <Route path="/dashboard" element={
                <AuthenticatedLayout>
                  <DashboardPage />
                </AuthenticatedLayout>
              } />
              <Route path="/data-entry" element={
                <AuthenticatedLayout>
                  <DataEntryForm />
                </AuthenticatedLayout>
              } />
              <Route path="/calculation" element={
                <AuthenticatedLayout>
                  <CalculationPage />
                </AuthenticatedLayout>
              } />
              <Route path="/visualization" element={
                <AuthenticatedLayout>
                  <VisualizationPage />
                </AuthenticatedLayout>
              } />
              <Route path="/recommendations" element={
                <AuthenticatedLayout>
                  <RecommendationsPage />
                </AuthenticatedLayout>
              }
              />
              

              {/* Routes Admin */}
              <Route path="/user-management/*" element={
                <AuthenticatedLayout>
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                </AuthenticatedLayout>
              } />
              <Route path="/register-user" element={
                <AuthenticatedLayout>
                  <AdminRoute>
                    <UserRegistration />
                  </AdminRoute>
                </AuthenticatedLayout>
              } />
              <Route path="/emission-config" element={
                <AuthenticatedLayout>
                  <AdminRoute>
                    <EmissionConfigPage />
                  </AdminRoute>
                </AuthenticatedLayout>
              } />
              <Route path="/dashboard-admin" element={
                <AuthenticatedLayout  >
                  <AdminRoute>
                    <DashboardAdmin />
                  </AdminRoute>
                </AuthenticatedLayout>
              }
              />
              <Route 
                path="/profile"
                element={
                  <AuthenticatedLayout>
                    <UserProfile />
                  </AuthenticatedLayout>
                }
              />
              <Route 
                path="/account-settings"
                element={
                  <AuthenticatedLayout>
                    <AccountSettings />
                  </AuthenticatedLayout>
                }
              />
              {/* Page de rapports */}
              <Route
                path="/reports"
                element={
                  <AuthenticatedLayout>
                    <ReportPage />
                  </AuthenticatedLayout>
                }
              />
              
              {/* Page Not Found */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
