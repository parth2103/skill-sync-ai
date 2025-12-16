"use client";

import { useAppStore } from "@/store/useAppStore";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DesignPanel() {
    const { currentResume, setResume } = useAppStore();

    if (!currentResume) return null;

    // Fallback for legacy resumes that don't have design object
    const design = currentResume.design || {
        font: 'inter',
        accentColor: '#000000',
        spacing: 1.0,
        margins: 20,
        entryLayout: 'right'
    };

    const updateDesign = (field: keyof typeof design, value: string | number) => {
        setResume({
            ...currentResume,
            design: {
                ...design,
                [field]: value
            }
        });
    };

    return (
        <Card className="rounded-xl border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-semibold">Design & Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {/* Font Selection */}
                <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Font</Label>
                    <Select value={design.font} onValueChange={(v) => updateDesign('font', v)}>
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="inter">Inter (Sans)</SelectItem>
                            <SelectItem value="merriweather">Merriweather (Serif)</SelectItem>
                            <SelectItem value="roboto">Roboto (Sans)</SelectItem>
                            <SelectItem value="lora">Lora (Serif)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Accent Color</Label>
                    <div className="flex gap-2 flex-wrap">
                        {['#000000', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'].map((color) => (
                            <button
                                key={color}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${design.accentColor === color ? 'border-primary scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                onClick={() => updateDesign('accentColor', color)}
                            />
                        ))}
                    </div>
                </div>

                {/* Spacing Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Line Spacing</Label>
                        <span className="text-xs text-muted-foreground">{design.spacing}x</span>
                    </div>
                    <Slider
                        defaultValue={[design.spacing]}
                        max={2.0}
                        min={0.8}
                        step={0.1}
                        onValueChange={([val]) => updateDesign('spacing', val)}
                    />
                </div>

                {/* Margins Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Page Margins</Label>
                        <span className="text-xs text-muted-foreground">{design.margins}mm</span>
                    </div>
                    <Slider
                        defaultValue={[design.margins]}
                        max={30}
                        min={10}
                        step={1}
                        onValueChange={([val]) => updateDesign('margins', val)}
                    />
                </div>

                {/* Entry Layout Selection */}
                <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Entry Layout</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => updateDesign('entryLayout', 'right')}
                            className={`p-2 border rounded-md text-xs flex flex-col items-center gap-1 hover:bg-muted ${design.entryLayout === 'right' ? 'border-primary bg-primary/5' : ''}`}
                        >
                            <div className="w-full space-y-1 opacity-50">
                                <div className="h-1 bg-current w-3/4 rounded-full" />
                                <div className="h-1 bg-current w-full rounded-full" />
                            </div>
                            <span className="font-medium">Right</span>
                        </button>
                        <button
                            onClick={() => updateDesign('entryLayout', 'left')}
                            className={`p-2 border rounded-md text-xs flex flex-col items-center gap-1 hover:bg-muted ${design.entryLayout === 'left' ? 'border-primary bg-primary/5' : ''}`}
                        >
                            <div className="w-full space-y-1 opacity-50">
                                <div className="flex justify-between">
                                    <div className="h-1 bg-current w-1/4 rounded-full" />
                                    <div className="h-1 bg-current w-1/2 rounded-full" />
                                </div>
                            </div>
                            <span className="font-medium">Left</span>
                        </button>
                        <button
                            onClick={() => updateDesign('entryLayout', 'stack')}
                            className={`p-2 border rounded-md text-xs flex flex-col items-center gap-1 hover:bg-muted ${design.entryLayout === 'stack' ? 'border-primary bg-primary/5' : ''}`}
                        >
                            <div className="w-full space-y-1 opacity-50">
                                <div className="h-1 bg-current w-1/4 rounded-full" />
                                <div className="h-1 bg-current w-3/4 rounded-full" />
                            </div>
                            <span className="font-medium">Stack</span>
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
