"use client";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface SmartBulletTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SmartBulletTextarea({ value, onChange, placeholder, className }: SmartBulletTextareaProps) {
    const [textValue, setTextValue] = useState("");
    const isInternalUpdate = useRef(false);

    // Convert HTML to Plain Text for display
    const htmlToText = (html: string) => {
        if (!html) return "";
        let text = html;
        // Replace list items
        text = text.replace(/<ul>/g, '').replace(/<\/ul>/g, '');
        text = text.replace(/<li>/g, '• ').replace(/<\/li>/g, '\n');
        // Replace breaks
        text = text.replace(/<br\s*\/?>/g, '\n');
        // Remove other tags
        text = text.replace(/<[^>]+>/g, '');
        // Decode entities
        text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        return text.trim();
    };

    // Convert Plain Text to HTML for storage
    const textToHtml = (text: string) => {
        if (!text.trim()) return "";

        const lines = text.split('\n');
        let html = "";
        let inList = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            // Check if line starts with a bullet point
            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                if (!inList) {
                    html += "<ul>";
                    inList = true;
                }
                const content = trimmed.substring(1).trim();
                html += `<li>${content}</li>`;
            } else {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                if (trimmed) {
                    html += `${trimmed}<br/>`;
                }
            }
        });

        if (inList) html += "</ul>";
        return html;
    };

    // Sync from parent (only if not editing)
    useEffect(() => {
        if (!isInternalUpdate.current) {
            setTextValue(htmlToText(value));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setTextValue(newVal);
        isInternalUpdate.current = true;

        const newHtml = textToHtml(newVal);
        onChange(newHtml); // Propagate HTML back to parent

        // Reset internal flag after a short delay to allow parent updates to flow back
        // but not overwrite cursor position logic if we were to implement purely controlled.
        // Actually, since we maintain local state `textValue`, we don't need to reset this immediately
        // unless we want to support external updates overwriting user input.
        setTimeout(() => { isInternalUpdate.current = false; }, 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const currentText = textValue;

            // Insert newline and bullet
            const before = currentText.substring(0, start);
            const after = currentText.substring(end);
            const newText = before + "\n• " + after;

            setTextValue(newText);
            isInternalUpdate.current = true;
            onChange(textToHtml(newText));

            // Move cursor
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 3; // \n• + space
            }, 0);
        }
    };

    return (
        <Textarea
            value={textValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
        />
    );
}
