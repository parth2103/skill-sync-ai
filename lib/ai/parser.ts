import { JobDescription } from "@/types/resume";

// Mock Data for fallback or testing
const MOCK_JD_ANALYSIS: JobDescription = {
    id: "mock-jd-123",
    rawText: "",
    companyName: "TechCorp Inc.",
    jobTitle: "Senior Frontend Engineer",
    skills: {
        hard: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "GraphQL"],
        soft: ["Communication", "Leadership", "Problem Solving", "Mentoring"],
        tools: ["Git", "Jira", "Figma", "AWS", "CI/CD"]
    },
    responsibilities: [
        "Build performant web applications using Next.js",
        "Collaborate with designers to implement pixel-perfect UIs",
        "Lead code reviews and mentor junior developers",
        "Optimize application performance and accessibility"
    ],
    seniorityLevel: "Senior"
};

/**
 * Parses raw job description text into structured data.
 * In a real implementation, this would call OpenAI/Gemini.
 */
export async function parseJobDescription(text: string): Promise<JobDescription> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For MVP/Demo, return mock data if real API isn't set up yet
    // In the future, we would send 'text' to an LLM here.

    return {
        ...MOCK_JD_ANALYSIS,
        id: Math.random().toString(36).substring(7),
        rawText: text,
    };
}

/**
 * Suggests resume bullets based on a specific skill in the context of a JD.
 */
export async function suggestBullets(skill: string, jdContext: JobDescription): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
        `Implemented ${skill} to improve system efficiency by 20%.`,
        `Led the adoption of ${skill} across the engineering team, reducing technical debt.`,
        `Integrated ${skill} into legacy pipelines to modernize the stack.`
    ];
}
