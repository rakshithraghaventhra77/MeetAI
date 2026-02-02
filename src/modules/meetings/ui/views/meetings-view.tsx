"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const MeetingsView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-gray-500">No meetings found. Create your first meeting!</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.items.map((meeting) => (
        <Card
          key={meeting.id}
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/meetings/${meeting.id}`)}
        >
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{meeting.name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{meeting.status}</span>
              </p>
              {meeting.startedAt && (
                <p>
                  <span className="font-medium">Started:</span>{" "}
                  {format(new Date(meeting.startedAt), "MMM d, yyyy h:mm a")}
                </p>
              )}
              {meeting.endedAt && (
                <p>
                  <span className="font-medium">Ended:</span>{" "}
                  {format(new Date(meeting.endedAt), "MMM d, yyyy h:mm a")}
                </p>
              )}
              <p>
                <span className="font-medium">Created:</span>{" "}
                {format(new Date(meeting.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState title="Loading Meetings" description="This may take a few seconds" />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error loading meetings"
      description="Something went wrong while loading the meetings"
    />
  );
};
