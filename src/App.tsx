import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LicenseProvider, useLicense } from "@/components/license/LicenseProvider";
import { LockedUI } from "@/components/license/LockedUI";
import { ProfileSelector } from "@/components/license/ProfileSelector";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

function AppContent() {
  const { isLicensed, isLoading } = useLicense();
  const [selectedProfile, setSelectedProfile] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Yujiro Mode...</p>
        </div>
      </div>
    );
  }

  if (!isLicensed) {
    return <LockedUI />;
  }

  if (!selectedProfile) {
    return <ProfileSelector onSelectProfile={setSelectedProfile} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LicenseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LicenseProvider>
  </QueryClientProvider>
);

export default App;
