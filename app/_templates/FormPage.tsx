import { Button, GlassCard } from "../../components/ui";

export default function FormPage({
    title = "Form title",
    onSubmitHref = "#",
}: {
    title?: string;
    onSubmitHref?: string;
}) {
    return (
        <section className="py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-white">{title}</h1>
            <GlassCard>
                <form className="space-y-5" action={onSubmitHref}>
                    <div>
                        <label className="text-sm text-white/80">Email</label>
                        <input
                            className="mt-1 w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/80">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </GlassCard>
        </section>
    );
}
