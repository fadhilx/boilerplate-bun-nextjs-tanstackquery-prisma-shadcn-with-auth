import UsersDashboard from "./users-dashboard";

export default function DashboardUsersPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage all users in the system
        </p>
      </div>
      <UsersDashboard />
    </>
  );
}

