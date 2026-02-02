"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function HomeView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !session) {
    return <div className="flex flex-col p-4 gap-y-4"><p>Loading...</p></div>;
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.name}</p>

      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in"); // Redirect to sign-in page after sign out
              },
            },
          })
        }
      >
        Sign Out
      </Button>
    </div>
  );
}
