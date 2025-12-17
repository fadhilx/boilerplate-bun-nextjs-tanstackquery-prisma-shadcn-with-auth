import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <ModeToggle />
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Welcome, {user.name || user.email}!
          </h1>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-muted-foreground">
                <strong>Role:</strong> {user.role === "ADMIN" ? "Administrator" : "User"}
              </p>
            </div>
            {user.role === "ADMIN" && (
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link href="/dashboard/users">Manage Users</Link>
                </Button>
              </div>
            )}
            <div className="mt-6">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
