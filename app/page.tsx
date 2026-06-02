import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import MenuSection from "@/components/sections/MenuSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BlogSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <MenuSection />
      <StatsSection />
      <TestimonialsSection />
      <BlogSection />
      <NewsletterSection />
    </>
  );
}
