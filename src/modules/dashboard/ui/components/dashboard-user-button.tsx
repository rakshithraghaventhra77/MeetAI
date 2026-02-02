"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { GenerateAvatar } from "@/components/generate-avatar";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardUserButton() {
  const { isPending, data } = authClient.useSession();
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
        onError: (error) => console.error("Logout failed:", error),
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  const userDisplay = (
    <>
      {data.user.image ? (
        <Avatar className="size-9">
          <AvatarImage src={data.user.image} alt={data.user.name} />
        </Avatar>
      ) : (
        <GenerateAvatar seed={data.user.name} variant="initials" className="size-9" />
      )}
      <div className="flex-1 text-left overflow-hidden">
        <p className="text-sm truncate">{data.user.name}</p>
        <p className="text-xs text-muted-foreground truncate">{data.user.email}</p>
      </div>
      <ChevronDownIcon className="size-4" />
    </>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="flex items-center gap-2 p-3 rounded-lg border w-full hover:bg-accent">
          {userDisplay}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 p-3 rounded-lg border w-full hover:bg-accent">
        {userDisplay}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
