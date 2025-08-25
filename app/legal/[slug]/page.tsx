import MarketingPage from "../../_templates/MarketingPage";
export default function Page({ params }: { params: { slug: string } }) {
    return <MarketingPage title={`Page: ${params.slug}`} subtitle="Dynamic content based on slug" />;
}
