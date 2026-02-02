import { StreamClient, StreamVideo } from '@stream-io/video-react-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const userId = 'user-123'; // This will come from auth session

// Initialize Stream Video Client (to be used on client side)
export function initializeStreamClient(userId: string, userToken: string) {
  const client = new StreamClient({
    apiKey: apiKey || '',
    user: {
      id: userId,
      name: 'User Name',
      image: 'user-avatar-url',
    },
    token: userToken,
  });

  return client;
}

// This is for server-side token generation
export function generateStreamToken(userId: string): string {
  // This will be called from an API route
  // Returns JWT token for Stream Video
  // Implementation in api/video/token/route.ts
  return '';
}

export function createStreamCallId(): string {
  // Generate unique call ID for each meeting
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `call-${timestamp}-${random}`;
}
