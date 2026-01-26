import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardProvider } from "./context";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <DashboardSidebar/>
        <main className="flex flex-col h-screen w-full bg-muted">
          <DashboardNavbar />
          {children}
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
};

export default Layout;
