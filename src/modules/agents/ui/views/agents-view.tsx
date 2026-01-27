"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState, ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useQuery(trpc.agents.getMany.queryOptions());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Agents"
        description="This may take a few seconds"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Agents"
        description="Please try again later"
      />
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agents</h1>
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setIsDialogOpen(true)}>Open responsive dialog</Button>
      </div>
      <ResponsiveDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Responsive test"
        description="Responsive description"
      >
        <Button>Some action</Button>
      </ResponsiveDialog>
      <pre className="bg-muted p-4 rounded-lg">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
