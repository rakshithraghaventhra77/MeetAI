import { Dispatch, SetStateAction } from "react";
import {
  CommandInput,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardCommand({ open, setOpen }: DashboardCommandProps) {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search meetings or agents..." />
      <CommandList />
    </CommandResponsiveDialog>
  );
}
