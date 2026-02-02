"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MeetingDetailViewProps {
  meetingId: string;
}

export const MeetingDetailView = ({ meetingId }: MeetingDetailViewProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: meeting } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const startMeeting = useMutation(
    trpc.meetings.start.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: meetingId }));
        toast.success("Meeting started! Joining video room...");
        router.push(`/meetings/${meetingId}/room`);
      },
      onError: (error) => {
        toast.error(`Error starting meeting: ${error.message}`);
      },
    })
  );

  const endMeeting = useMutation(
    trpc.meetings.end.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: meetingId }));
        toast.success("Meeting ended successfully");
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(`Error ending meeting: ${error.message}`);
      },
    })
  );

  const cancelMeeting = useMutation(
    trpc.meetings.cancel.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: meetingId }));
        toast.success("Meeting cancelled successfully");
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(`Error cancelling meeting: ${error.message}`);
      },
    })
  );

  if (!meeting) {
    return (
      <ErrorState
        title="Meeting not found"
        description="The meeting you're looking for doesn't exist"
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{meeting.name}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className={getStatusColor(meeting.status)}>
                {meeting.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-lg font-medium">
                {format(new Date(meeting.createdAt), "MMM d, yyyy h:mm a")}
              </p>
            </div>

            {meeting.startedAt && (
              <div>
                <p className="text-sm text-gray-500">Started</p>
                <p className="text-lg font-medium">
                  {format(new Date(meeting.startedAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}

            {meeting.endedAt && (
              <div>
                <p className="text-sm text-gray-500">Ended</p>
                <p className="text-lg font-medium">
                  {format(new Date(meeting.endedAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-lg font-medium">
                {format(new Date(meeting.updatedAt), "MMM d, yyyy h:mm a")}
              </p>
            </div>
          </div>

          {meeting.transcriptUrl && (
            <div>
              <p className="text-sm text-gray-500">Transcript</p>
              <a
                href={meeting.transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Transcript
              </a>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        {meeting.status === "upcomming" && (
          <>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={() => startMeeting.mutate({ id: meetingId })}
              disabled={startMeeting.isPending}
            >
              {startMeeting.isPending ? "Starting..." : "Start Meeting"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => cancelMeeting.mutate({ id: meetingId })}
              disabled={cancelMeeting.isPending}
            >
              {cancelMeeting.isPending ? "Cancelling..." : "Cancel Meeting"}
            </Button>
          </>
        )}
        {meeting.status === "active" && (
          <>
            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={() => router.push(`/meetings/${meetingId}/room`)}
            >
              Join Video Room
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={() => endMeeting.mutate({ id: meetingId })}
              disabled={endMeeting.isPending}
            >
              {endMeeting.isPending ? "Ending..." : "End Meeting"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export const MeetingDetailViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
};

export const MeetingDetailViewError = () => {
  return (
    <ErrorState
      title="Error loading meeting"
      description="Something went wrong while loading the meeting"
    />
  );
};
