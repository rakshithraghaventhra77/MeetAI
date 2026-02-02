"use client";

import { authClient } from "@/lib/auth-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { VideoRoom } from "@/modules/meetings/ui/components/video-room";
import { redirect } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";

interface VideoRoomPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function VideoRoomPage({ params }: VideoRoomPageProps) {
  return (
    <Suspense fallback={<VideoRoomLoading />}>
      <VideoRoomContent params={params} />
    </Suspense>
  );
}

function VideoRoomLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <Card className="p-8">
        <p className="text-lg font-semibold">Initializing video room...</p>
      </Card>
    </div>
  );
}

function VideoRoomContent({ params }: { params: Promise<{ meetingId: string }> }) {
  const { data: session } = authClient.useSession();
  const trpc = useTRPC();
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get params
  useEffect(() => {
    params.then((p) => setMeetingId(p.meetingId));
  }, [params]);

  // Get meeting data
  const { data: meeting } = useSuspenseQuery(
    meetingId ? trpc.meetings.getOne.queryOptions({ id: meetingId }) : { queryKey: ["disabled"], queryFn: () => null }
  );

  // Generate token
  useEffect(() => {
    if (!session?.user || !meetingId) return;

    const generateToken = async () => {
      try {
        const response = await fetch(`/api/video/token?callId=${meetingId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to generate token");
        }

        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        console.error("Token generation failed:", err);
        setError(err instanceof Error ? err.message : "Failed to generate token");
      } finally {
        setLoading(false);
      }
    };

    generateToken();
  }, [session?.user, meetingId]);

  if (!session) {
    redirect("/sign-in");
  }

  if (!meeting || !meetingId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 bg-red-50">
          <p className="text-red-800">Meeting not found</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Card className="p-8">
          <p className="text-lg font-semibold">Loading video room...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 bg-red-50">
          <p className="text-red-800">Error: {error}</p>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8">
          <p className="text-lg font-semibold">Preparing video room...</p>
        </Card>
      </div>
    );
  }

  return (
    <VideoRoom
      meetingId={meetingId}
      meetingName={meeting.name}
      callId={meetingId}
      token={token}
      userId={session.user.id}
      userName={session.user.name || "User"}
    />
  );
}
