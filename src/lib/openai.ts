import OpenAI from 'openai';

// Initialize OpenAI client for server-side use
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a meeting summary from transcript using GPT-4
 * Called after meeting ends via Inngest job
 */
export async function generateMeetingSummary(transcript: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional meeting summarizer. Create a clear, concise summary organized by topic with timestamps. 
          Focus on: decisions made, action items, key discussion points, and outcomes.`,
        },
        {
          role: 'user',
          content: `Please summarize this meeting transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || 'Unable to generate summary';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate meeting summary');
  }
}

/**
 * Generate OpenAI Realtime API token for real-time voice interaction
 * Token has 1-hour expiration
 */
export async function generateRealtimeToken(): Promise<string> {
  try {
    const response = await openai.beta.realtime.sessions.create({
      model: 'gpt-4o-realtime-preview-2024-12-17',
      modalities: ['text', 'audio'],
      instructions: `You are a helpful AI meeting participant. 
      - Listen actively to the user
      - Ask clarifying questions when needed
      - Provide thoughtful, concise responses
      - Take notes mentally of important points
      - Be professional and supportive`,
    });

    return response.client_secret.value;
  } catch (error) {
    console.error('Error generating realtime token:', error);
    throw new Error('Failed to generate OpenAI realtime token');
  }
}

/**
 * Answer questions about a specific meeting using RAG (Retrieval-Augmented Generation)
 * Used in post-meeting chat interface
 */
export async function answerMeetingQuestion(
  question: string,
  transcript: string,
  summary: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant answering questions about a specific meeting. 
          Use the provided transcript and summary to answer accurately.
          If the information isn't in the provided context, say so clearly.`,
        },
        {
          role: 'user',
          content: `Meeting Summary:\n${summary}\n\nFull Transcript:\n${transcript}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || 'Unable to answer question';
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error('Failed to answer meeting question');
  }
}

/**
 * Extract action items from transcript
 * Used to highlight tasks for follow-up
 */
export async function extractActionItems(transcript: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an action item extraction specialist. 
          Extract all action items, tasks, and decisions from the meeting transcript.
          Return as a JSON array of strings.
          Example: ["John to prepare report by Friday", "Team to review proposal"]`,
        },
        {
          role: 'user',
          content: `Extract action items from this transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content || '[]';
    try {
      return JSON.parse(content);
    } catch {
      return [content];
    }
  } catch (error) {
    console.error('Error extracting action items:', error);
    return [];
  }
}

/**
 * Create a custom system prompt for AI agent based on instructions
 */
export function createAgentSystemPrompt(agentName: string, instructions: string): string {
  return `You are ${agentName}, an AI meeting participant.

Your role and behavior:
${instructions}

Guidelines:
- Be respectful and professional
- Ask clarifying questions when needed
- Provide concise, actionable responses
- Stay focused on the meeting topics
- Acknowledge others' points before responding
- Help move the meeting forward productively`;
}
