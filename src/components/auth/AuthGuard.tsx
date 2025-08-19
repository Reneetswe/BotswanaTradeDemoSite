import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    // Default fallback - redirect to login
    window.location.href = "/auth/login";
    return null;
  }

  return <>{children}</>;
} 