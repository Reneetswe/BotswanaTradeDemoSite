import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import TradingDashboard from "@/components/trading/TradingDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize user data
  const initializeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/initialize");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stocks"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          // In local development, redirect to landing instead
          window.location.href = "/";
        }, 500);
        return;
      }
      console.error("Error initializing:", error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize trading data",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      initializeMutation.mutate();
    }
  }, [authLoading, isAuthenticated, user]);

  // Redirect to login if not authenticated (only in production)
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !user?.error) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        // In local development, redirect to landing instead
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast, user]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <TradingDashboard />;
}
