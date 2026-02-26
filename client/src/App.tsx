import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import ScrollToTop from "@/components/ScrollToTop";
import { Provider } from "react-redux";
import store from "@/store";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { authActions } from "@/store/slices/authSlice";

import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.hydrateSessionRequest());
  }, [dispatch]);

  return null;
}
const App = () => (
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthInitializer />
      <ScrollToTop />
      <Toaster />
      <Sonner />
      <AppRoutes />
    </TooltipProvider>
  </QueryClientProvider>
  </Provider>
);

export default App;
