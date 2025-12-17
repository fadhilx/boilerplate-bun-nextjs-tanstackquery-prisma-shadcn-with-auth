"use client";

import { logoutAction } from "./actions";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/queries/user";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const queryClient = useQueryClient();

  async function handleLogout() {
    await logoutAction();
    // Clear user cache on logout
    queryClient.removeQueries({ queryKey: userKeys.current() });
  }

  return (
    <form action={handleLogout}>
      <Button type="submit" variant="outline">
        Logout
      </Button>
    </form>
  );
}

