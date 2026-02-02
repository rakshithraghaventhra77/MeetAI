"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mic, MicOff, Video, VideoOff } from "lucide-react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

interface VideoRoomProps {
  meetingId: string;
  meetingName: string;
  callId: string;
  token: string;
  userId: string;
  userName: string;
}

export function VideoRoom({
  meetingId,
  meetingName,
  callId,
  token,
  userId,
  userName,
}: VideoRoomProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize client and call
  useEffect(() => {
    const initializeClientAndCall = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        if (!apiKey) {
          throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not configured");
        }

        const videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: userName },
          token,
        });

        // Get or create the call
        const callInstance = videoClient.call("default", callId);
        
        setClient(videoClient);
        setCall(callInstance);
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize Stream client:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize");
        setLoading(false);
      }
    };

    initializeClientAndCall();
  }, [userId, userName, token, callId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Card className="p-8">
          <p className="text-lg font-semibold">Initializing video room...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Card className="p-8 bg-red-50 border-red-200">
          <p className="text-lg font-semibold text-red-800">Error: {error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Card className="p-8">
          <p className="text-lg font-semibold">Loading Stream client...</p>
        </Card>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <VideoRoomContent 
          meetingName={meetingName} 
          meetingId={meetingId} 
          callId={callId}
          call={call}
        />
      </StreamTheme>
    </StreamVideo>
  );
}

function VideoRoomContent({
  meetingName,
  meetingId,
  callId,
  call,
}: {
  meetingName: string;
  meetingId: string;
  callId: string;
  call: any;
}) {
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(true);
  const [joinedCall, setJoinedCall] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Join the call when component mounts and call is available
  useEffect(() => {
    const joinTheCall = async () => {
      if (!call) {
        console.warn("Call object not available yet");
        return;
      }

      try {
        console.log("Stream user:", call.state?.createdBy);
        console.log("Stream token exists:", !!call.state?.createdAt);
        console.log("Call ID:", call.id);
        console.log("Call state:", call.state);

        console.log("Attempting to join call:", callId);
        await call.join({ create: true });
        console.log("Successfully joined call");
        setJoinedCall(true);
        setJoinError(null);
      } catch (error) {
        console.error("Error joining call:", error);
        setJoinError(error instanceof Error ? error.message : "Failed to join call");
      }
    };

    // Only join if we have a call object
    if (call) {
      // Small delay to ensure call object is properly initialized
      const timer = setTimeout(joinTheCall, 500);
      return () => clearTimeout(timer);
    }
  }, [call, callId]);

  const toggleMicrophone = () => {
    setMicrophone((prev) => !prev);
  };

  const toggleCamera = () => {
    setCamera((prev) => !prev);
  };

  const endCall = async () => {
    try {
      const response = await fetch(`/api/trpc/meetings.end?batch=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 0: { id: meetingId } }),
      });

      if (response.ok) {
        window.location.href = "/meetings";
      }
    } catch (err) {
      console.error("Failed to end call:", err);
    }
  };

  if (joinError) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-white text-xl font-semibold">{meetingName}</h1>
            <span className="text-red-500 text-sm font-medium">● LIVE</span>
          </div>
          <div className="text-gray-400 text-sm">Meeting Active</div>
        </div>

        {/* Video Area */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <Card className="p-8 bg-red-50 border-red-200">
            <p className="text-lg font-semibold text-red-800">
              Error: {joinError}
            </p>
            <Button
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 border-t border-gray-700 px-6 py-4 flex items-center justify-center gap-4">
          <Button
            onClick={toggleMicrophone}
            variant={microphone ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            title={microphone ? "Mute" : "Unmute"}
          >
            {microphone ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>

          <Button
            onClick={toggleCamera}
            variant={camera ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            title={camera ? "Stop camera" : "Start camera"}
          >
            {camera ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>

          <div className="w-px h-8 bg-gray-700" />

          <Button
            onClick={endCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            title="End call"
          >
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-white text-xl font-semibold">{meetingName}</h1>
          <span className="text-red-500 text-sm font-medium">● LIVE</span>
        </div>
        <div className="text-gray-400 text-sm">Meeting Active</div>
      </div>

      {/* Video Area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        {!joinedCall ? (
          <div className="text-center text-gray-400">
            <div className="w-32 h-32 rounded-full bg-gray-800 mx-auto mb-6 flex items-center justify-center border-2 border-gray-700">
              <Video className="w-16 h-16 text-gray-600" />
            </div>
            <p className="text-xl font-semibold mb-2">Ready to connect</p>
            <p className="text-sm">Waiting for video stream...</p>
            <p className="text-xs mt-4 text-gray-600">Meeting: {meetingName}</p>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p className="text-xl font-semibold mb-2">Connected</p>
            <p className="text-sm">Video stream active</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-700 px-6 py-4 flex items-center justify-center gap-4">
        <Button
          onClick={toggleMicrophone}
          variant={microphone ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          title={microphone ? "Mute" : "Unmute"}
        >
          {microphone ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </Button>

        <Button
          onClick={toggleCamera}
          variant={camera ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          title={camera ? "Stop camera" : "Start camera"}
        >
          {camera ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </Button>

        <div className="w-px h-8 bg-gray-700" />

        <Button
          onClick={endCall}
          variant="destructive"
          size="lg"
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          title="End call"
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
        </Button>
      </div>
    </div>
  );
}
