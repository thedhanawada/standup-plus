import { format, parseISO } from "date-fns";
import { StandupEntry } from "@/types";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function generateStandupSummary(entries: StandupEntry[]): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  // Format the entries into a clear prompt
  const entriesText = entries
    .map(entry => `Entry ${format(parseISO(entry.date), 'h:mm a')}:
Text: ${entry.text}
Tags: ${entry.tags?.join(', ') || 'none'}
Projects: ${entry.projects?.join(', ') || 'none'}
`)
    .join('\n\n');

  const prompt = `Please create a concise, well-structured standup presentation from these updates:

${entriesText}

Format the response as a presentation script with:
1. A brief overview
2. Key accomplishments
3. Current focus areas
4. Any blockers or challenges
5. Next steps

Keep it professional but conversational.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating standup summary:', error);
    throw new Error('Failed to generate standup summary');
  }
} 