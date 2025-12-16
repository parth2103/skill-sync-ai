"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import SkillsForm from "./forms/SkillsForm";

export default function ResumeForm() {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Editor</h2>
                <p className="text-muted-foreground">Update your resume information below.</p>
            </div>

            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    {/* <TabsTrigger value="education">Education</TabsTrigger> */}
                </TabsList>

                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Contact details and links.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PersonalInfoForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="experience">
                    <Card>
                        <CardHeader>
                            <CardTitle>Work Experience</CardTitle>
                            <CardDescription>Add your relevant job experience.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ExperienceForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills</CardTitle>
                            <CardDescription>List your technical and soft skills.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SkillsForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
