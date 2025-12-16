"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";

export default function PersonalInfoForm() {
    const { currentResume, updatePersonalInfo } = useAppStore();

    if (!currentResume) return null;
    const { personalInfo } = currentResume;

    const handleChange = (field: keyof typeof personalInfo, value: string) => {
        updatePersonalInfo({ ...personalInfo, [field]: value });
    };

    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        value={personalInfo.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="john@example.com"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+1 555 000 0000"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={personalInfo.location || ''}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="New York, NY"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                    id="linkedin"
                    value={personalInfo.linkedin || ''}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                />
            </div>
        </div>
    );
}
