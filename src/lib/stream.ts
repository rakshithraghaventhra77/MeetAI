import { StreamVideoClient } from '@stream-io/video-react-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export function initializeStreamClient(userId: string, userToken: string, userName: string, userImage?: string) {
  return new StreamVideoClient({
    apiKey: apiKey || '',
    user: {
      id: userId,
      name: userName,
      image: userImage,
    },
    token: userToken,
  });
}

export function createStreamCallId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `call-${timestamp}-${random}`;
}
