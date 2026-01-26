import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "./dashboard/layout";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session){
    redirect("/auth/sign-in"); 
  }
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard</p>
      </div>
    </DashboardLayout>
  );
};
export default Page;