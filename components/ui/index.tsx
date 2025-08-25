export { Button } from "@/components/ui/button";
export function GlassCard({ className = "", ...p }: any) {
    return <div className={ `glass p-6 md:p-8 rounded-2xl ${className}` } {...p } />;
}