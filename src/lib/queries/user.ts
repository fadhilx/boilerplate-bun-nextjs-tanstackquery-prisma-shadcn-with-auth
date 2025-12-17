import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  current: () => [...userKeys.all, "current"] as const,
};

// Fetch current user (for client-side usage)
export async function fetchCurrentUser() {
  const response = await fetch("/api/user/current");
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

// Hook to get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for login mutation
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const formData = new FormData();
      formData.append("email", credentials.email);
      formData.append("password", credentials.password);

      const { loginAction } = await import("@/app/login/actions");
      try {
        const result = await loginAction(formData);
        // If redirect happens, loginAction throws NEXT_REDIRECT
        // which is caught and handled by Next.js
        return result;
      } catch (error: any) {
        // If it's a redirect error, that's success - return success
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
          return { success: true };
        }
        // Otherwise, rethrow the error
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}

// Hook for logout mutation
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { logoutAction } = await import("@/app/actions");
      try {
        await logoutAction();
        // If redirect happens, logoutAction throws NEXT_REDIRECT
        return { success: true };
      } catch (error: any) {
        // If it's a redirect error, that's success
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
          return { success: true };
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.removeQueries({ queryKey: userKeys.current() });
    },
  });
}


