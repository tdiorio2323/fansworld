import { GlassCard } from "../../components/ui";
import React from "react";

export default function DashboardTwoCol({
    title = "Dashboard",
    left,
    right,
}: {
    title?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <section className="py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-white">{title}</h1>
            <div className="grid gap-6 md:grid-cols-12">
                <GlassCard className="md:col-span-8">
                    {left ?? <div className="text-white/80">Main content</div>}
                </GlassCard>
                <div className="md:col-span-4 grid gap-6">
                    <GlassCard>
                        <div className="text-white">{right ?? "Widget A"}</div>
                    </GlassCard>
                    <GlassCard>
                        <div className="text-white">Widget B</div>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
}
