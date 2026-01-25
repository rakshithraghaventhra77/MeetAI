"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

interface DashboardCommandsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DashboardCommands = ({ open, setOpen }: DashboardCommandsProps) => {
  const router = useRouter();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting or agent" />
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
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
