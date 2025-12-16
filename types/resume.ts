export type ResumeItem = {
    id: string;
    visible: boolean;
    // Structured Data
    title?: string;      // Job Title, Degree, Project Name
    subtitle?: string;   // Company, School, Role
    date?: string;       // "Jan 2020 - Present"
    location?: string;   // "New York, NY"
    content: string;     // Description or HTML content
};

export type ResumeSection = {
    id: string;
    title: string;
    type: 'experience' | 'education' | 'projects' | 'skills' | 'summary' | 'custom';
    items: ResumeItem[];
    columns?: 1 | 2; // For Skills or Custom lists
};

export type PersonalInfo = {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
    location?: string;
    jobTitle?: string; // "Software Engineer"
    summary?: string;  // Short bio or professional summary
    photo?: string;    // URL or Base64 (optional)
};

export type ResumeDesign = {
    font: string;        // "inter", "merriweather", etc.
    accentColor: string; // Hex code
    spacing: number;     // 0.5 to 2.0
    margins: number;     // mm
    entryLayout: 'right' | 'left' | 'stack'; // Alignment of dates/location
};

export type Resume = {
    id: string;
    title: string;
    personalInfo: PersonalInfo;
    sections: ResumeSection[];
    design: ResumeDesign;
    createdAt: number;
    updatedAt: number;
};

export type JobDescription = {
    id: string;
    rawText: string;
    companyName?: string;
    jobTitle?: string;
    skills: {
        hard: string[];
        soft: string[];
        tools: string[];
    };
    responsibilities: string[];
    seniorityLevel?: string;
};

export type MatchScore = {
    overall: number;
    hardSkills: number;
    softSkills: number;
    tools: number;
    missingKeywords: string[];
    matchedKeywords: string[];
};
