import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: () => [...usersKeys.lists(), "all"] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
};

// Fetch all users
export async function fetchUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

// Hook to get all users
export function useUsers() {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: fetchUsers,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook for creating user
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      name?: string;
      role?: "USER" | "ADMIN";
    }) => {
      const { role = "USER", ...rest } = userData;
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to create user" };
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.list() });
    },
  });
}

// Hook for updating user
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      id: number;
      name?: string;
      password?: string;
      role?: "USER" | "ADMIN";
    }) => {
      const { id, ...updateData } = userData;
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to update user" };
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.list() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.id) });
    },
  });
}

// Hook for deleting user
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to delete user" };
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.list() });
    },
  });
}

