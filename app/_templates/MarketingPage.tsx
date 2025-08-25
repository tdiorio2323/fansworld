import { Button, GlassCard } from "../../components/ui";
import Link from "next/link";

export default function MarketingPage({
    title = "Headline",
    subtitle = "Subcopy that explains the value.",
    cta = { href: "/auth/register", label: "Get started" },
}: {
    title?: string;
    subtitle?: string;
    cta?: { href: string; label: string };
}) {
    return (
        <section className="py-16 md:py-24">
            <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl md:text-5xl font-semibold">{title}</h1>
                <p className="text-white/80 text-lg">{subtitle}</p>
                <Link href={cta.href} className="inline-block">
                    <Button>{cta.label}</Button>
                </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map(i => (
                    <GlassCard key={i}>
                        <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
                        <p className="text-white/80">Short value statement.</p>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
