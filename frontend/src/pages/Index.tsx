import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CompanyLogos from "@/components/CompanyLogos";
import CategorySection from "@/components/CategorySection";
import CTABanner from "@/components/CTABanner";
import FeaturedJobs from "@/components/FeaturedJobs";
import LatestJobs from "@/components/LatestJobs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CompanyLogos />
        <CategorySection />
        <CTABanner />
        <FeaturedJobs />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
