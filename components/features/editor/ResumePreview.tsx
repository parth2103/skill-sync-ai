"use client";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";

export default function ResumePreview() {
    const resume = useAppStore((state) => state.currentResume);

    if (!resume) return <div>No resume selected</div>;

    const { personalInfo, sections, design } = resume;

    // Design Variables
    const fontFamily = {
        inter: 'font-sans',
        merriweather: 'font-serif',
        roboto: 'font-sans',
        lora: 'font-serif'
    }[design?.font || 'inter'];

    const lineHeight = design?.spacing || 1.15;
    const padding = design?.margins ? `${design.margins}mm` : '20mm';
    const headingColor = design?.accentColor || '#000000';
    const entryLayout = design?.entryLayout || 'right';

    return (
        <div
            className={cn("w-[210mm] min-h-[297mm] bg-white shadow-2xl text-black transform origin-top scale-100 sm:scale-[0.8] md:scale-[0.9] lg:scale-100 transition-transform", fontFamily)}
            style={{ padding, lineHeight }}
        >
            {/* Header */}
            <div className="border-b-2 pb-5 mb-5" style={{ borderColor: headingColor }}>
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2" style={{ color: headingColor }}>{personalInfo.fullName || "Your Name"}</h1>
                <p className="text-lg font-medium text-gray-700 mb-2">{personalInfo.jobTitle}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                    {personalInfo.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="h-3.5 w-3.5" />
                            <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5" />
                            <span>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {sections.map(section => {
                    if (!section.items || section.items.length === 0) return null;

                    return (
                        <div key={section.id}>
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b mb-3 pb-1" style={{ borderColor: headingColor, color: headingColor }}>
                                {section.title}
                            </h2>

                            <div className={cn("space-y-3", section.columns === 2 && "grid grid-cols-2 gap-4 space-y-0")}>
                                {section.items.map(item => (
                                    item.visible && (
                                        <div key={item.id} className="text-sm" style={{ lineHeight }}>
                                            {/* Structured Item Header */}
                                            {(item.title || item.subtitle) && (
                                                <div className="mb-1">
                                                    {/* Logic for different layouts */}
                                                    {entryLayout === 'right' && (
                                                        <div className="flex justify-between items-baseline">
                                                            <div className="font-semibold text-gray-900">
                                                                {section.type === 'education' ? (
                                                                    // Watermark Style for Degree
                                                                    <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">{item.title}</span>
                                                                ) : (
                                                                    <span>{item.title}</span>
                                                                )}
                                                                {item.subtitle && (
                                                                    section.type === 'education' ?
                                                                        <div className="text-gray-900 font-bold text-base mt-0.5">{item.subtitle}</div> :
                                                                        <span className="font-medium text-gray-700 ml-1"> — {item.subtitle}</span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 whitespace-nowrap ml-2 text-right">
                                                                <div className="font-medium">{item.date}</div>
                                                                {item.location && <div>{item.location}</div>}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {entryLayout === 'left' && (
                                                        <div className="flex gap-4">
                                                            <div className="w-[120px] shrink-0 text-xs text-gray-500 text-right pt-0.5">
                                                                <div className="font-medium text-gray-700">{item.date}</div>
                                                                {item.location && <div>{item.location}</div>}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-gray-900">
                                                                    {section.type === 'education' ? (
                                                                        <div className="flex flex-col-reverse">
                                                                            <span className="text-gray-900 font-bold text-base">{item.subtitle}</span>
                                                                            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">{item.title}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <span>{item.title}</span>
                                                                            {item.subtitle && <span className="font-medium text-gray-600 block sm:inline sm:ml-1">{item.subtitle}</span>}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {entryLayout === 'stack' && (
                                                        <div className="mb-1">
                                                            <div className="flex justify-between items-start">
                                                                <div className="font-semibold text-gray-900">
                                                                    {section.type === 'education' ? (
                                                                        <div className="flex flex-col-reverse">
                                                                            <span className="text-gray-900 font-bold text-base">{item.subtitle}</span>
                                                                            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">{item.title}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-base">{item.title}</div>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-500 text-right">
                                                                    <div className="font-medium">{item.date}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center text-sm">
                                                                {section.type !== 'education' && <div className="font-medium text-gray-700">{item.subtitle}</div>}
                                                                <div className="text-xs text-gray-500 italic ml-auto">{item.location}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Content / Description */}
                                            {item.content && (
                                                <div
                                                    className={cn(
                                                        "text-gray-800 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-0.5",
                                                        entryLayout === 'left' && "ml-[136px]"
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                                />
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
