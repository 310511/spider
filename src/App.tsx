import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { MarketplaceDashboard } from "@/components/marketplace/MarketplaceDashboard";
import { SupplierDashboard } from "@/components/marketplace/SupplierDashboard";
import SupplierDashboardPage from "@/components/supplier/SupplierDashboard";
import { InfiniteMemoryProvider } from "@/contexts/InfiniteMemoryContext";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { InfiniteMemoryDashboard } from "@/components/infinite-memory/InfiniteMemoryDashboard";
import { InfiniteMemoryDemo } from "@/components/infinite-memory/InfiniteMemoryDemo";
import { MLPredictionsDashboard } from "@/components/ml-predictions/MLPredictionsDashboard";
import { MedicineRecommendationDashboard } from "@/components/medicine-recommendation/MedicineRecommendationDashboard";
import InventoryDashboard from "@/components/inventory/InventoryDashboard";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/marketplace" element={<MarketplaceDashboard />} />
      <Route path="/supplier" element={<SupplierDashboard />} />
      <Route path="/infinite-memory" element={<InfiniteMemoryDashboard />} />
      <Route path="/infinite-memory-demo" element={<InfiniteMemoryDemo />} />
      <Route path="/ml-predictions" element={<MLPredictionsDashboard />} />
      <Route path="/medicine-recommendation" element={<MedicineRecommendationDashboard />} />
      <Route path="/inventory" element={<InventoryDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/supplier-dashboard" element={<SupplierDashboardPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BlockchainProvider>
      <InventoryProvider>
        <NotificationProvider>
          <InfiniteMemoryProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </InfiniteMemoryProvider>
        </NotificationProvider>
      </InventoryProvider>
    </BlockchainProvider>
  </QueryClientProvider>
);

export default App;
