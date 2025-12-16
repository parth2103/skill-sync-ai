import { Resume } from "@/types/resume";

export interface MatchResult {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    allKeywords: string[];
    feedback?: string;
}

/**
 * Normalizes a keyword for better matching.
 * e.g., "React.js" -> "react", "NodeJS" -> "node js"
 */
function normalize(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates a match score between the resume and a list of AI-extracted keywords.
 */
export function calculateMatch(resume: Resume, jdKeywords: string[]): MatchResult {
    if (!jdKeywords || jdKeywords.length === 0 || !resume) {
        return { score: 0, matchedKeywords: [], missingKeywords: [], allKeywords: [] };
    }

    // 1. Prepare Resume Text (Full Searchable Content)
    const resumeText = [
        resume.personalInfo.fullName,
        resume.personalInfo.jobTitle,
        resume.personalInfo.location,
        resume.personalInfo.summary || "",
        ...resume.sections.flatMap(s => s.items).filter(i => i.visible).map(i =>
            `${i.title} ${i.subtitle} ${i.location} ${i.content.replace(/<[^>]*>/g, ' ')}` // Strip HTML
        )
    ].join(' ').toLowerCase();

    // 2. Find Matches
    const matched: string[] = [];
    const missing: string[] = [];

    // Normalize resume text for searching (remove punctuation)
    const normalizedResumeText = resumeText.replace(/[^a-z0-9\s]/g, '');

    jdKeywords.forEach(keyword => {
        const normalizedKeyword = normalize(keyword);

        // Check if the normalized keyword exists in the normalized resume text
        // This handles "React" matching "Re-act" or "React.js" roughly, 
        // but simple substring search is robust enough for "exact" hits.
        // We use the normalized version for comparison.

        if (normalizedResumeText.includes(normalizedKeyword)) {
            matched.push(keyword);
        } else {
            missing.push(keyword);
        }
    });

    // 3. Calculate Score
    const score = Math.round((matched.length / jdKeywords.length) * 100);

    return {
        score,
        matchedKeywords: matched,
        missingKeywords: missing,
        allKeywords: jdKeywords
    };
}
