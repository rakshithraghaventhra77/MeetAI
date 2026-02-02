import { auth } from '@/lib/auth';
import { generateRealtimeToken, createAgentSystemPrompt } from '@/lib/openai';
import { headers } from 'next/headers';

/**
 * Generate OpenAI Realtime API token for voice interaction
 * 
 * This endpoint creates a session token that allows the AI agent
 * to participate in the video call with real-time voice
 * 
 * Query params:
 * - agentId: string (the AI agent's ID)
 * - meetingId: string (the meeting ID)
 */
export async function GET(request: Request) {
  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const agentId = url.searchParams.get('agentId');
    const meetingId = url.searchParams.get('meetingId');

    if (!agentId || !meetingId) {
      return Response.json(
        { error: 'agentId and meetingId are required' },
        { status: 400 }
      );
    }

    // TODO: Fetch agent from database to get instructions
    // const agent = await db.query.agents.findOne({ where: { id: agentId } });
    // const systemPrompt = createAgentSystemPrompt(agent.name, agent.instructions);

    // For now, use a generic prompt
    const systemPrompt = createAgentSystemPrompt(
      'AI Meeting Participant',
      'Be helpful, professional, and ask clarifying questions when needed.'
    );

    // Generate OpenAI Realtime token
    const token = await generateRealtimeToken();

    return Response.json({
      token,
      agentId,
      meetingId,
      model: 'gpt-4o-realtime-preview-2024-12-26',
      systemPrompt,
    });

  } catch (error) {
    console.error('OpenAI token generation error:', error);
    return Response.json(
      { error: 'Failed to generate OpenAI token' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to capture meeting data and trigger processing
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { meetingId, transcriptUrl, recordingUrl } = body;

    if (!meetingId) {
      return Response.json(
        { error: 'meetingId is required' },
        { status: 400 }
      );
    }

    // TODO: Update meeting in database with transcript and recording URLs
    // TODO: Trigger Inngest job to process transcript
    // TODO: Generate summary using OpenAI

    return Response.json({
      success: true,
      message: 'Meeting data captured and processing started',
      meetingId,
    });

  } catch (error) {
    console.error('Meeting capture error:', error);
    return Response.json(
      { error: 'Failed to capture meeting data' },
      { status: 500 }
    );
  }
}
