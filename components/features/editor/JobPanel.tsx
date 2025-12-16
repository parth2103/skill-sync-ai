"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { calculateMatch, MatchResult } from "@/lib/matcher";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobPanel() {
    const { currentResume } = useAppStore();
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState<MatchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMatch = async () => {
        if (!jobDescription || jobDescription.length < 50) {
            setError("Please enter a valid job description (at least 50 chars).");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Call Full AI Match endpoint
            const response = await fetch('/api/match-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resume: currentResume,
                    jobDescription: jobDescription
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to analyze match');
            }

            const matchResult = await response.json();

            // Map API result to UI state
            // Note: The API returns matchedSkills/missingSkills directly now
            // We adapt it to our MatchResult interface
            setResult({
                score: matchResult.score,
                matchedKeywords: matchResult.matchedSkills,
                missingKeywords: matchResult.missingSkills,
                allKeywords: [...matchResult.matchedSkills, ...matchResult.missingSkills],
                feedback: matchResult.feedback // New field
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong. Please check your API key.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="rounded-xl border-border/50 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b shrink-0 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">AI Matcher</CardTitle>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs font-normal bg-purple-100 text-purple-700 border-purple-200">
                        <Sparkles className="h-3 w-3 mr-1" /> GPT-4o
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
                <div className="space-y-2 shrink-0">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Job Description</label>
                        {jobDescription && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => { setJobDescription(""); setResult(null); setError(null); }}
                            >
                                <RotateCcw className="h-3 w-3 mr-1" /> Clear
                            </Button>
                        )}
                    </div>
                    <Textarea
                        placeholder="Paste the job description here..."
                        className="min-h-[150px] text-xs resize-none"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />

                    <Button
                        onClick={handleMatch}
                        disabled={isLoading || !jobDescription}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md relative overflow-hidden"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-xs"></span>
                                <span className="animate-pulse">Analyzing Resume vs JD...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Check Full Match
                            </div>
                        )}
                    </Button>
                    {error && <p className="text-xs text-destructive text-center mt-2">{error}</p>}
                </div>

                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                        {/* Score Display */}
                        <div className="text-center space-y-2 p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle
                                        className="text-muted/20"
                                        strokeWidth="8"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="48"
                                        cy="48"
                                    />
                                    <circle
                                        className={cn(
                                            "transition-all duration-1000 ease-out",
                                            result.score >= 80 ? "text-green-500" :
                                                result.score >= 50 ? "text-yellow-500" : "text-red-500"
                                        )}
                                        strokeWidth="8"
                                        strokeDasharray={251.2}
                                        strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="48"
                                        cy="48"
                                    />
                                </svg>
                                <span className="absolute text-2xl font-bold">{result.score}%</span>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">AI Match Score</p>

                            {/* AI Feedback - Displayed if present */}
                            {(result as any).feedback && (
                                <div className="mt-4 text-xs text-muted-foreground italic border-t pt-2 max-w-xs mx-auto">
                                    "{(result as any).feedback}"
                                </div>
                            )}
                        </div>

                        {/* Missing Skills */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <h4 className="font-semibold text-sm">Missing Skills</h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {result.missingKeywords.length > 0 ? (
                                    result.missingKeywords.slice(0, 15).map(keyword => (
                                        <Badge key={keyword} variant="outline" className="text-xs bg-destructive/5 hover:bg-destructive/10 border-destructive/20 text-destructive font-normal">
                                            {keyword}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground italic">None! Great job coverage.</span>
                                )}
                            </div>
                        </div>

                        {/* Matched Skills */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <h4 className="font-semibold text-sm">Matched Skills</h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {result.matchedKeywords.length > 0 ? (
                                    result.matchedKeywords.slice(0, 10).map(keyword => (
                                        <Badge key={keyword} variant="outline" className="text-xs bg-green-500/5 hover:bg-green-500/10 border-green-500/20 text-green-700 font-normal">
                                            {keyword}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground italic">No specific skills matched yet.</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
