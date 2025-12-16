import { NextResponse } from 'next/server';
import { openai } from '@/lib/ai/openai';

// Force dynamic to prevent caching of API responses
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Invalid input. Job description text is required.' },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing API Key' },
                { status: 500 }
            );
        }

        // Logging for debugging
        console.log('--- OUTGOING JD TO OPENAI (first 100 chars) ---');
        console.log(text.substring(0, 100) + '...');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // optimized for speed and cost
            messages: [
                {
                    role: 'system',
                    content: `
You are an ATS-style parser. Extract structured info from a job description.

Return ONLY JSON:

{
  "jobTitle": "string",
  "companyName": "string | null",
  "skills": {
    "hard": ["string"],   // languages, frameworks, libraries
    "soft": ["string"],   // communication, leadership, etc.
    "tools": ["string"]   // devops tools, platforms, IDEs
  },
  "keyKeywords": ["string"] // up to ~20 important technical terms
}

Rules:
- Normalize tech names (React.js -> React, Amazon Web Services -> AWS).
- "hard" and "tools" focus on concrete tech stack.
- "keyKeywords" = top technical concepts, methods, and stack items.
- Exclude generic adjectives/verbs (e.g., "scalable", "collaborate").
                    `.trim()
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1, // low for deterministic extraction
            max_tokens: 300
        });

        const content = completion.choices[0].message.content;

        console.log('--- INCOMING RESPONSE FROM OPENAI ---');
        console.log(content);

        if (!content) {
            throw new Error('Empty response from OpenAI');
        }

        const analysis = JSON.parse(content);

        // Add ID for frontend tracking
        analysis.id = Math.random().toString(36).substring(7);
        analysis.rawText = text;

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Error analyzing JD:', error);
        return NextResponse.json(
            { error: 'Failed to analyze job description' },
            { status: 500 }
        );
    }
}
