"use client";

import { useAppStore } from "@/store/useAppStore";
import { ResumeItem } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SmartBulletTextarea from "@/components/features/editor/SmartBulletTextarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Helper to generate simple ID if uuid not installed, but we should install it or use random
const generateId = () => Math.random().toString(36).substring(2, 9);


export default function ExperienceForm() {
    const { currentResume, updateResumeSection } = useAppStore();

    if (!currentResume) return null;

    const experienceSection = currentResume.sections.find(s => s.id === 'experience');
    if (!experienceSection) return <div>No Experience Section Found</div>;

    const items = experienceSection.items;

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
        updateResumeSection('experience', [...items, newItem]);
    };

    const handleUpdateItem = (id: string, field: keyof ResumeItem, value: string) => {
        const newItems = items.map(item => item.id === id ? { ...item, [field]: value } : item);
        updateResumeSection('experience', newItems);
    };

    const handleDeleteItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        updateResumeSection('experience', newItems);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button size="sm" onClick={handleAddItem} variant="outline" className="h-8 gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Job
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
                                <label className="text-xs text-muted-foreground font-medium">Job Title</label>
                                <Input
                                    value={item.title || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                                    placeholder="Software Engineer"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground font-medium">Company</label>
                                <Input
                                    value={item.subtitle || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'subtitle', e.target.value)}
                                    placeholder="Acme Corp"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground font-medium">Date Range</label>
                                <Input
                                    value={item.date || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'date', e.target.value)}
                                    placeholder="Jan 2020 - Present"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground font-medium">Location</label>
                                <Input
                                    value={item.location || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'location', e.target.value)}
                                    placeholder="New York, NY"
                                    className="h-8"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground font-medium">Description</label>
                            <SmartBulletTextarea
                                value={item.content}
                                onChange={(val) => handleUpdateItem(item.id, 'content', val)}
                                className="min-h-[100px] text-sm resize-none font-normal"
                                placeholder="• Achieved X result..."
                            />
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        No experience added yet.
                    </div>
                )}
            </div>
        </div>
    );
}
