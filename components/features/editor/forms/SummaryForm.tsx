"use client";

import { useAppStore } from "@/store/useAppStore";
import { ResumeItem } from "@/types/resume";
import { Textarea } from "@/components/ui/textarea";

export default function SummaryForm() {
    const { currentResume, updateResumeSection } = useAppStore();

    if (!currentResume) return null;

    const summarySection = currentResume.sections.find(s => s.id === 'summary');
    if (!summarySection) return <div>No Summary Section Found</div>;

    const items = summarySection.items || [];
    // Ensure there is at least one item
    const summaryItem = items[0] || {
        id: 'summary-item',
        visible: true,
        content: ''
    };

    const handleUpdate = (value: string) => {
        const newItem: ResumeItem = { ...summaryItem, content: value };
        updateResumeSection('summary', [newItem]);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Professional Profile</label>
                <Textarea
                    value={summaryItem.content}
                    onChange={(e) => handleUpdate(e.target.value)}
                    className="min-h-[150px] text-sm resize-none"
                    placeholder="Briefly describe your professional background and key achievements..."
                />
            </div>
            <p className="text-[10px] text-muted-foreground">
                This section usually appears at the top of your resume. Keep it concise (2-4 sentences).
            </p>
        </div>
    );
}
