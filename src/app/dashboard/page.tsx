import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Redirect to users page as default dashboard page
  redirect("/dashboard/users");
}

