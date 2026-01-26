"use client";

import { useDashboard } from "./context";
import { AgentsView } from "@/modules/agents/ui/views/agents-view";

export default function DashboardPage() {
  const { activeView } = useDashboard();

  return (
    <div className="container mx-auto py-10 w-full">
      {activeView === "overview" && (
        <div>
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
      )}
      
      {activeView === "agents" && (
        <AgentsView />
      )}

      {activeView === "meetings" && (
        <div>
          <h1 className="text-4xl font-bold mb-4">Meetings</h1>
          <p className="text-muted-foreground">Your meetings</p>
        </div>
      )}

      {activeView === "upgrade" && (
        <div>
          <h1 className="text-4xl font-bold mb-4">Upgrade</h1>
          <p className="text-muted-foreground">Upgrade your plan</p>
        </div>
      )}
    </div>
  );
}
