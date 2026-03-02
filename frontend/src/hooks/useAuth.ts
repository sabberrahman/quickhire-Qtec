import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const authQueryKey = ["auth", "me"] as const;

export const useAuth = () => {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: () => api.getMe(),
  });
};

export const useAuthActions = () => {
  const queryClient = useQueryClient();

  const refreshAuth = async () => {
    await queryClient.invalidateQueries({ queryKey: authQueryKey });
  };

  const login = useMutation({
    mutationFn: api.login,
    onSuccess: refreshAuth,
  });

  const register = useMutation({
    mutationFn: api.register,
    onSuccess: refreshAuth,
  });

  const guestLogin = useMutation({
    mutationFn: () => api.loginGuest(),
    onSuccess: refreshAuth,
  });

  const logout = useMutation({
    mutationFn: () => api.logout(),
    onSuccess: refreshAuth,
  });

  return {
    login,
    register,
    guestLogin,
    logout,
  };
};
