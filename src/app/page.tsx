import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import PortfolioGallery from "@/components/site/PortfolioGallery";
import PartnersMarquee from "@/components/site/PartnersMarquee";
import VisionSection from "@/components/site/VisionSection";
import AboutSection from "@/components/site/AboutSection";
import Footer from "@/components/site/Footer";
import { getPartners, getPortfolioItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [items, partners] = await Promise.all([getPortfolioItems(), getPartners()]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PortfolioGallery items={items} />
        <PartnersMarquee partners={partners} />
        <VisionSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
