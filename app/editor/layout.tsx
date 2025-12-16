export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Header could go here */}
            <div className="flex flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
