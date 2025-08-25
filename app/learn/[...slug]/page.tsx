import MarketingPage from "../../_templates/MarketingPage";
export default function Page({ params }: { params: { slug: string[] } }) {
    const path = params.slug.join("/");
    return <MarketingPage title={`${path}`} subtitle="Dynamic catch-all content" />;
}
