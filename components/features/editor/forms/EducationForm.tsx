"use client";

import { useAppStore } from "@/store/useAppStore";
import { ResumeItem } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function EducationForm() {
    const { currentResume, updateResumeSection } = useAppStore();

    if (!currentResume) return null;

    const educationSection = currentResume.sections.find(s => s.id === 'education');
    if (!educationSection) return <div>No Education Section Found</div>;

    const items = educationSection.items;

    const handleAddItem = () => {
        const newItem: ResumeItem = {
            id: generateId(),
            title: "",
            subtitle: "",
            date: "",
            location: "",
            content: "",
            visible: true
        };
        updateResumeSection('education', [...items, newItem]);
    };

    const handleUpdateItem = (id: string, field: keyof ResumeItem, value: string) => {
        const newItems = items.map(item => item.id === id ? { ...item, [field]: value } : item);
        updateResumeSection('education', newItems);
    };

    const handleDeleteItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        updateResumeSection('education', newItems);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button size="sm" onClick={handleAddItem} variant="outline" className="h-8 gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Education
                </Button>
            </div>

            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.id} className="relative group p-4 border rounded-lg bg-background hover:border-primary/50 transition-colors space-y-3">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground font-medium">Degree / Major</label>
                                <Input
                                    value={item.title || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                                    placeholder="BS Computer Science"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground font-medium">School / University</label>
                                <Input
                                    value={item.subtitle || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'subtitle', e.target.value)}
                                    placeholder="University of Technology"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground font-medium">Date / Year</label>
                                <Input
                                    value={item.date || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'date', e.target.value)}
                                    placeholder="2019 - 2023"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground font-medium">Location</label>
                                <Input
                                    value={item.location || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'location', e.target.value)}
                                    placeholder="City, State"
                                    className="h-8"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground font-medium">Description (Optional)</label>
                            <Textarea
                                value={item.content}
                                onChange={(e) => handleUpdateItem(item.id, 'content', e.target.value)}
                                className="min-h-[60px] text-sm resize-none"
                                placeholder="Relevant coursework, honors, etc."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
