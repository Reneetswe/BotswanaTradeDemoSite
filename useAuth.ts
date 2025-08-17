import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import authService, { User, LoginCredentials, RegisterData } from "@/lib/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const queryClient = useQueryClient();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('bse-user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          localStorage.removeItem('bse-user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Use the auth service for login
      const response = await authService.simulateLogin(credentials);
      
      // Store token if provided
      if (response.token) {
        authService.setToken(response.token);
      }
      
      return response.user;
    },
    onSuccess: (user) => {
      localStorage.setItem('bse-user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      setAuthState(prev => ({
        ...prev,
        error: "Login failed. Please check your credentials.",
        isLoading: false,
      }));
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      // Use the auth service for registration
      const response = await authService.simulateRegister(userData);
      
      // Store token if provided
      if (response.token) {
        authService.setToken(response.token);
      }
      
      return response.user;
    },
    onSuccess: (user) => {
      // Don't auto-login after registration, let user go to login page
      return user;
    },
    onError: (error) => {
      setAuthState(prev => ({
        ...prev,
        error: "Registration failed. Please try again.",
        isLoading: false,
      }));
    },
  });

  const logout = () => {
    // Use the auth service for logout
    authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    queryClient.clear();
  };

  return {
    ...authState,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
