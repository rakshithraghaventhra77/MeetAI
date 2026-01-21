import { HomeView } from "@/modules/auth/ui/views/home/ui/home-view"
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session){
    redirect("/auth/sign-in"); 
  }
  return <HomeView/>  
};
export default Page;