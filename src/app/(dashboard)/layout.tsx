import { LoadingState } from "@/components/loading-state";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import DashboardNavbar from "@/modules/dashboard/ui/components/dashboard-navbar";
import DashboardSidebar from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

async function AuthCheck({ children }: DashboardLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <>{children}</>;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Suspense fallback={<LoadingState title="Loading..." description="Please wait" />}>
        <DashboardSidebar />
        <main className="flex flex-col h-screen w-full bg-muted">
          <DashboardNavbar />
          <Suspense fallback={<LoadingState title="Loading..." description="Please wait" />}>
            <AuthCheck>{children}</AuthCheck>
          </Suspense>
        </main>
      </Suspense>
    </SidebarProvider>
  );
}
