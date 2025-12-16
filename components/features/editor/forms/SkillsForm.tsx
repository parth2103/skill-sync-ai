"use client";

import { useAppStore } from "@/store/useAppStore";
import { ResumeItem } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function SkillsForm() {
    const { currentResume, updateResumeSection } = useAppStore();

    if (!currentResume) return null;

    const skillsSection = currentResume.sections.find(s => s.id === 'skills');
    if (!skillsSection) return <div>No Skills Section Found</div>;

    const items = skillsSection.items;

    const handleAddItem = () => {
        const newItem: ResumeItem = {
            id: generateId(),
            content: "New Skill",
            visible: true
        };
        updateResumeSection('skills', [...items, newItem]);
    };

    const handleUpdateItem = (id: string, content: string) => {
        const newItems = items.map(item => item.id === id ? { ...item, content } : item);
        updateResumeSection('skills', newItems);
    };

    const handleDeleteItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        updateResumeSection('skills', newItems);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Add technical and soft skills.</span>
                <Button size="sm" onClick={handleAddItem} variant="outline" className="h-8 gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Skill
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md">
                        <input
                            value={item.content}
                            onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                            className="bg-transparent border-none outline-none w-[100px] text-sm"
                        />
                        <button onClick={() => handleDeleteItem(item.id)} className="text-muted-foreground hover:text-destructive text-xs">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
