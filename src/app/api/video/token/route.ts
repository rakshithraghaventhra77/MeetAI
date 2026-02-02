import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { sign } from 'jsonwebtoken';

const API_KEY = process.env.STREAM_API_KEY;
const API_SECRET = process.env.STREAM_API_SECRET;

/**
 * Generate Stream Video SDK token for authenticated user
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

    // Get params from URL
    const url = new URL(request.url);
    const callId = url.searchParams.get('callId');
    const userId = session.user.id;

    if (!callId) {
      return Response.json(
        { error: 'callId is required' },
        { status: 400 }
      );
    }

    if (!API_KEY || !API_SECRET) {
      throw new Error('Stream API credentials not configured');
    }

    // Generate JWT token for Stream
    const token = generateStreamToken(userId, callId);

    return Response.json({
      token,
      userId,
      callId,
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    });

  } catch (error) {
    console.error('Token generation error:', error);
    return Response.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}

/**
 * Generate a JWT token for Stream Video SDK
 */
function generateStreamToken(userId: string, callId: string): string {
  const secret = process.env.STREAM_API_SECRET;
  
  if (!secret) {
    throw new Error('STREAM_API_SECRET not configured');
  }

  const payload = {
    user_id: userId,
    call_cids: [`default:${callId}`],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
  };

  return sign(payload, secret, { algorithm: 'HS256' });
}

/**
 * POST endpoint to start recording a call
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
    const { callId } = body;

    if (!callId) {
      return Response.json(
        { error: 'callId is required' },
        { status: 400 }
      );
    }

    // Call Stream API to start recording
    // Implementation depends on Stream's API structure
    // This is a placeholder

    return Response.json({
      success: true,
      message: 'Recording started',
      callId,
    });

  } catch (error) {
    console.error('Recording error:', error);
    return Response.json(
      { error: 'Failed to start recording' },
      { status: 500 }
    );
  }
}
