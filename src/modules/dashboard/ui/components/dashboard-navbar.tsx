"use client";

import { useState } from "react";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommands } from "./dashboard-commands";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <DashboardCommands open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button className="outline" size="icon" variant="outline" onClick={toggleSidebar}>
          {(state === "collapsed" || isMobile) 
            ? <PanelLeftIcon /> 
            : <PanelLeftCloseIcon />
          }
        </Button>
        <Button 
          className="h-9 w-[240px] justify-start font-mono text-muted-foreground hover:text-muted-foreground"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen(true)}
        >
          <SearchIcon />
          Search
        </Button>
      </nav>
    </>
  );
};