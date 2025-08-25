import React from "react";

// Re-export existing Button for unified imports
export { Button } from "../../src/components/ui/button";

// New glass card component using existing .glass styles
export function GlassCard({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`glass p-6 md:p-8 ${className}`} {...props} />;
}
