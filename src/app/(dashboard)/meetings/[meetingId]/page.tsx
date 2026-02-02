import { auth } from "@/lib/auth";
import {
  MeetingDetailView,
  MeetingDetailViewError,
  MeetingDetailViewLoading,
} from "@/modules/meetings/ui/views/meeting-detail-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface MeetingIdPageProps {
  params: Promise<{ meetingId: string }>;
}

const MeetingIdPage = async ({ params }: MeetingIdPageProps) => {
  const { meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  return (
    <ErrorBoundary FallbackComponent={MeetingDetailViewError}>
      <Suspense fallback={<MeetingDetailViewLoading />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MeetingDetailView meetingId={meetingId} />
        </HydrationBoundary>
      </Suspense>
    </ErrorBoundary>
  );
};

export default MeetingIdPage;
