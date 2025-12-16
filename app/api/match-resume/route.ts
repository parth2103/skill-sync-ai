import { NextResponse } from 'next/server';
import { openai } from '@/lib/ai/openai';
import { Resume } from '@/types/resume';

// Force dynamic to prevent caching of API responses
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { resume, jobDescription } = await request.json();

        if (!resume || !jobDescription) {
            return NextResponse.json(
                { error: 'Missing resume or job description.' },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing API Key' },
                { status: 500 }
            );
        }

        // 1. Prepare compact versions of JD + Resume
        const jdText = prepareJobDescription(jobDescription);
        const resumeText = prepareResumeText(resume);

        // Logging for debugging
        console.log('--- STARTING FULL AI MATCH ---');
        console.log('JD Length (chars):', jdText.length);
        console.log('Resume Text Length (chars):', resumeText.length);

        // 2. Call OpenAI for analysis (shorter prompt, capped output)
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `
You are a technical hiring manager. Compare ONE job description and ONE candidate resume.

Return ONLY valid JSON:

{
  "score": number,           // 0-100 overall match
  "feedback": "string",      // 2-3 sentences, direct & constructive
  "matchedSkills": ["string"],
  "missingSkills": ["string"]
}

Score bands:
90-100: excellent fit
75-89: good fit
50-74: partial fit
0-49: weak fit
                    `.trim()
                },
                {
                    role: 'user',
                    content: `
JD:
${jdText}

RESUME:
${resumeText}
                    `.trim()
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
            max_tokens: 250 // enough for JSON + 2–3 sentences
        });

        const content = completion.choices[0].message.content;

        console.log('--- AI MATCH RESULT ---');
        console.log(content);

        if (!content) {
            throw new Error('Empty response from OpenAI');
        }

        const result = JSON.parse(content);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error matching resume:', error);
        return NextResponse.json(
            { error: 'Failed to perform AI match' },
            { status: 500 }
        );
    }
}

/**
 * Compact the job description a bit:
 * - Normalize whitespace
 * - Optionally cap length to avoid gigantic postings using too many tokens
 */
function prepareJobDescription(jd: string): string {
    const normalized = jd.replace(/\s+/g, ' ').trim();
    // Cap at ~6000 characters to avoid crazy-long JDs burning tokens
    return normalized.slice(0, 6000);
}

/**
 * Convert complex Resume object into a compact string for the AI:
 * - Strip HTML
 * - Limit number of items per section
 * - Cap the length of each block
 */
function prepareResumeText(resume: Resume): string {
    const parts: string[] = [];

    // Personal info (short, no extra fluff)
    if (resume.personalInfo) {
        const name = resume.personalInfo.fullName || '';
        const title = resume.personalInfo.jobTitle || '';
        const summary = (resume.personalInfo.summary || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 400); // cap summary length

        const header = [name, title].filter(Boolean).join(' - ');
        if (header) parts.push(header);
        if (summary) parts.push(`Summary: ${summary}`);
    }

    // Sections: keep only visible items and cap quantity + length
    if (Array.isArray(resume.sections)) {
        resume.sections.forEach(section => {
            if (!section?.items) return;

            const title = section.title || '';
            const lowerTitle = title.toLowerCase();
            const isSkillsSection = lowerTitle.includes('skill');

            // Fewer items: skills can have more, others fewer
            const visibleItems = section.items
                .filter((i: any) => i.visible)
                .slice(0, isSkillsSection ? 10 : 5);

            visibleItems.forEach((item: any) => {
                const cleanContent = (item.content || '')
                    .replace(/<[^>]*>/g, ' ') // strip HTML
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 300); // cap each item

                const headerParts = [
                    item.title || '',
                    item.subtitle || '',
                    item.date || ''
                ]
                    .filter(Boolean)
                    .join(' | ');

                const lineParts: string[] = [];
                if (title) lineParts.push(`${title}:`);
                if (headerParts) lineParts.push(headerParts);
                if (cleanContent) lineParts.push(cleanContent);

                const line = lineParts.join(' - ');
                if (line) parts.push(line);
            });
        });
    }

    return parts.join('\n');
}
