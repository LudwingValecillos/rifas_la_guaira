import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SorteazoProvider } from "./contexts/SorteazoContext";
import Index from "./pages/Index";
import RaffleDetail from "./pages/RaffleDetail";
import PaymentPage from "./pages/PaymentPage";
import Terms from "./pages/Terms";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SorteazoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sorteo/:id" element={<RaffleDetail />} />
            <Route path="/pago/:id" element={<PaymentPage />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SorteazoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
