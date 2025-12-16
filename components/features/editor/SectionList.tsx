"use client";

import { useAppStore } from "@/store/useAppStore";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";

// Import Forms
import ExperienceForm from "./forms/ExperienceForm";
import SkillsForm from "./forms/SkillsForm";
import EducationForm from "./forms/EducationForm";
import ProjectsForm from "./forms/ProjectsForm";
import SummaryForm from "./forms/SummaryForm";
import PersonalInfoForm from "./forms/PersonalInfoForm"; // Maybe separate this out?

export default function SectionList() {
    const { currentResume } = useAppStore();

    if (!currentResume) return null;

    return (
        <div className="space-y-4">
            {/* Personal Info is always at top */}
            <div className="p-4 border rounded-lg bg-card mb-6">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Personal Details</h3>
                <PersonalInfoForm />
            </div>

            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Sections</h3>

            <Accordion type="multiple" defaultValue={["experience", "skills"]} className="w-full space-y-2">
                {currentResume.sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id} className="border rounded-lg bg-card px-2">
                        <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                                <span className="font-medium text-base">{section.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-2 pt-0">
                            {section.type === 'experience' && <ExperienceForm />}
                            {section.type === 'skills' && <SkillsForm />}
                            {section.type === 'education' && <EducationForm />}
                            {section.type === 'projects' && <ProjectsForm />}
                            {/* Add other types as needed */}
                            {section.type === 'summary' && <SummaryForm />}
                            {section.type === 'custom' && (
                                <div className="p-4 text-muted-foreground text-sm italic">
                                    Custom section editor coming soon...
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <Button variant="outline" className="w-full border-dashed gap-2 h-12">
                <Plus className="h-4 w-4" /> Add Section
            </Button>
        </div>
    );
}
