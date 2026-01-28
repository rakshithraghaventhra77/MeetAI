"use client";

import { useEffect } from "react";
import {
  CommandResponsiveDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

interface DashboardCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => {
              router.push("/dashboard");
              setOpen(false);
            }}
          >
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/meetings");
              setOpen(false);
            }}
          >
            Meetings
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/agents");
              setOpen(false);
            }}
          >
            Agents
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/upgrade");
              setOpen(false);
            }}
          >
            Upgrade
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/settings");
              setOpen(false);
            }}
          >
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
