"use client";

import { useState } from "react";
import SectionList from "@/components/features/editor/SectionList";
import DesignPanel from "@/components/features/editor/DesignPanel";
import ResumePreview from "@/components/features/editor/ResumePreview";
import JobPanel from "@/components/features/editor/JobPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

export default function EditorPage() {
    const currentResume = useAppStore((state) => state.currentResume);
    const [activeTab, setActiveTab] = useState<'content' | 'design' | 'match'>('content');

    if (!currentResume) {
        return <div className="p-10 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 border-b flex items-center px-4 justify-between bg-background shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-semibold text-sm sm:text-base truncate max-w-[200px]">{currentResume.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Download PDF</Button>
                    <Button size="sm">Save</Button>
                </div>
            </header>

            {/* content */}
            <div className="flex-1 flex overflow-hidden bg-muted/20">
                {/* Left Sidebar: Content & Design */}
                <div className="w-[800px] border-r bg-background flex flex-col z-10 shadow-sm shrink-0">
                    <div className="flex items-center border-b">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 rounded-none py-6 border-b-2 hover:bg-muted/50 ${activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            Content
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('design')}
                            className={`flex-1 rounded-none py-6 border-b-2 hover:bg-muted/50 ${activeTab === 'design' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            Design
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('match')}
                            className={`flex-1 rounded-none py-6 border-b-2 hover:bg-muted/50 ${activeTab === 'match' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            Match
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
                        <div className="p-4 pb-20 h-full">
                            {activeTab === 'content' && <SectionList />}

                            {activeTab === 'design' && (
                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-1">Design Settings</h3>
                                        <p className="text-xs text-muted-foreground">Customize the look and feel of your resume.</p>
                                    </div>
                                    <DesignPanel />
                                </div>
                            )}

                            {activeTab === 'match' && <JobPanel />}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Area: Preview */}
                <div className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto bg-muted/20">
                    <div className="flex justify-center min-h-full pb-20 w-full">
                        <div className="scale-[0.8] origin-top">
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
