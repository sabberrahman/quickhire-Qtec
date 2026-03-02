import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const authQueryKey = ["auth", "me"] as const;

export const useAuth = () => {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: () => api.getMe(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useAuthActions = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: api.login,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
    },
  });

  const register = useMutation({
    mutationFn: api.register,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
    },
  });

  const guestLogin = useMutation({
    mutationFn: () => api.loginGuest(),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
    },
  });

  const logout = useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, null);
    },
  });

  return {
    login,
    register,
    guestLogin,
    logout,
  };
};
