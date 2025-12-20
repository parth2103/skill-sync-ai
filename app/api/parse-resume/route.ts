
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";

// 1. Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 2. Extract Text from PDF
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdf(buffer);
        const text = data.text;

        if (!text || text.length < 50) {
            return NextResponse.json({ error: "Could not extract text from PDF or text is too short" }, { status: 400 });
        }

        // 3. Send to OpenAI for Parsing
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Resume Parser. 
                    Convert the provided resume text into a structured JSON format following the schema below.
                    
                    Return ONLY raw JSON:
                    {
                        "personalInfo": {
                             "fullName": "string",
                             "email": "string",
                             "phone": "string",
                             "linkedin": "string",
                             "location": "string",
                             "jobTitle": "string", 
                             "summary": "string"
                        },
                        "sections": [
                            {
                                "id": "experience",
                                "title": "Work Experience",
                                "type": "experience",
                                "items": [
                                    {
                                        "id": "random-string-id",
                                        "visible": true,
                                        "title": "Job Title",
                                        "subtitle": "Company Name",
                                        "date": "Date Range",
                                        "location": "Location",
                                        "content": "<ul><li>Bullet point 1</li><li>Bullet point 2</li></ul>" 
                                    }
                                ]
                            },
                            {
                                "id": "education",
                                "title": "Education",
                                "type": "education",
                                "items": [
                                    {
                                        "id": "random-string-id",
                                        "visible": true,
                                        "title": "Degree",
                                        "subtitle": "University",
                                        "date": "Year",
                                        "location": "Location",
                                        "content": "Description if any"
                                    }
                                ]
                            },
                             {
                                "id": "projects",
                                "title": "Projects",
                                "type": "projects",
                                "items": [
                                    {
                                        "id": "random-string-id",
                                        "visible": true,
                                        "title": "Project Name",
                                        "subtitle": "Tech Stack / Role",
                                        "date": "Date",
                                        "content": "<ul><li>Description</li></ul>"
                                    }
                                ]
                            },
                            {
                                "id": "skills",
                                "title": "Skills",
                                "type": "skills",
                                "columns": 2,
                                "items": [
                                    {
                                        "id": "random-string-id",
                                        "visible": true,
                                        "title": "Category (e.g. Languages)",
                                        "subtitle": "List of skills (e.g. JS, TS, Python)",
                                        "content": ""
                                    }
                                ]
                            }
                        ]
                    }
                    
                    RULES:
                    - Extract as much detail as possible.
                    - For 'content' fields (experience/projects), try to format bullet points as HTML <ul><li>...</li></ul> if they look like lists in the text.
                    - If a section is missing from the text, return empty array for items.
                    - Normalize dates to be consistent (e.g., "Jan 2020 - Present").
                    `
                },
                {
                    role: "user",
                    content: text.substring(0, 10000) // Cap text length just in case
                }
            ],
            response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json({
            success: true,
            data: parsedData
        });

    } catch (error: any) {
        console.error("Resume parsing error:", error);
        return NextResponse.json({ error: error.message || "Failed to parse resume" }, { status: 500 });
    }
}
