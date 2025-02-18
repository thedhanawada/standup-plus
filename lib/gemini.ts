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

interface SummaryOptions {
  style: "concise" | "detailed" | "casual" | "formal"
  includeMetrics: boolean
  focusAreas: ("accomplishments" | "blockers" | "next-steps")[]
}

export async function generateStandupSummary(
  entries: StandupEntry[], 
  options: SummaryOptions
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  // Format the entries into a clear prompt
  const entriesText = entries
    .map(entry => `Entry ${format(parseISO(entry.date), 'h:mm a')}:
Text: ${entry.text}
Tags: ${entry.tags?.join(', ') || 'none'}
Projects: ${entry.projects?.join(', ') || 'none'}
`)
    .join('\n\n');

  // Generate style instruction
  const styleGuide = {
    concise: "Keep it brief and to the point",
    detailed: "Provide comprehensive details and context",
    casual: "Use a conversational, friendly tone",
    formal: "Maintain a professional, business-like tone"
  }[options.style]

  // Generate metrics instruction
  const metricsInstruction = options.includeMetrics
    ? "Include relevant metrics such as number of tasks completed, projects touched, etc."
    : "Skip numerical metrics"

  // Generate focus areas
  const focusAreasText = options.focusAreas
    .map(area => {
      switch(area) {
        case "accomplishments": return "Key accomplishments and completed tasks"
        case "blockers": return "Challenges and blockers"
        case "next-steps": return "Next steps and upcoming work"
      }
    })
    .join("\n- ")

  const prompt = `Please create a standup presentation summary from these updates:

${entriesText}

Style Instructions:
- ${styleGuide}
- ${metricsInstruction}

Focus on these areas:
- ${focusAreasText}

Format the response as a presentation script that's easy to read and present.`;

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