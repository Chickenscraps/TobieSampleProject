import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { QuickLinksGrid } from '@/components/QuickLinksGrid';
import { FAQAccordion } from '@/components/FAQAccordion';
import { UnderstandingBenefits } from '@/components/UnderstandingBenefits';
import { BenefitsOverview } from '@/components/BenefitsOverview';
import { FullGuideDownload } from '@/components/FullGuideDownload';
import { ProviderDirectory } from '@/components/ProviderDirectory';
import { ScrollFadeIn } from '@/components/ScrollFadeIn';

export default function Home() {
  return (
    <>
      <HeroSection />

      <ScrollFadeIn>
        <AboutSection />
      </ScrollFadeIn>

      <ScrollFadeIn>
        <QuickLinksGrid />
      </ScrollFadeIn>

      <ScrollFadeIn>
        <FAQAccordion />
      </ScrollFadeIn>

      <ScrollFadeIn>
        <UnderstandingBenefits />
      </ScrollFadeIn>

      <ScrollFadeIn>
        <BenefitsOverview />
      </ScrollFadeIn>

      <ScrollFadeIn>
        <FullGuideDownload />
      </ScrollFadeIn>

      <ScrollFadeIn>
        <ProviderDirectory />
      </ScrollFadeIn>
    </>
  );
}
