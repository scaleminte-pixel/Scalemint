import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import AboutSection from '@/components/AboutSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import ProcessSection from '@/components/ProcessSection';
import PricingSection from '@/components/PricingSection';
import FaqAccordion from '@/components/FaqAccordion';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import TestimonialsSection from '@/components/TestimonialsSection';
import ClientsMarquee from '@/components/ClientsMarquee';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function HomePage() {
  // Fetch dynamic CMS data directly from Database
  const [settings, sections, services, faqs, clientBrands, testimonials] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.pageSection.findMany({
      where: { page: 'home', isPublished: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: {
        coverMedia: true,
        packages: {
          where: { status: 'PUBLISHED' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    }),
    prisma.faq.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.clientBrand.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: { logoMedia: true },
    }),
    prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: { photoMedia: true },
    }),
  ]);

  // Map sections by key
  const secMap: Record<string, any> = {};
  for (const s of sections) {
    secMap[s.sectionKey] = {
      ...s,
      metadata: s.metadata ? JSON.parse(s.metadata) : null,
    };
  }

  // Parse services arrays
  const parsedServices = services.map((s) => ({
    ...s,
    whatIsIncluded: s.whatIsIncluded ? JSON.parse(s.whatIsIncluded) : [],
    benefits: s.benefits ? JSON.parse(s.benefits) : [],
  }));

  const heroSection = secMap['hero'];
  const whySection = secMap['why_choose_us'];
  const processSection = secMap['process'];
  const finalCta = secMap['final_cta'];

  return (
    <div className="min-h-screen flex flex-col bg-agency-dark">
      {/* Header with Services Dropdown, About Us, Pricing, Contact, Book a Meeting */}
      <Header
        siteName={settings?.siteName || 'Scalemint'}
        tagline={settings?.tagline || '360° Creative & Digital Growth Partner'}
        whatsappNumber={settings?.whatsappNumber}
      />

      <main className="flex-grow">
        {/* 1. Hero Section with 3D Visual */}
        <HeroSection
          title={heroSection?.title}
          subtitle={heroSection?.subtitle}
          ctaText={heroSection?.ctaText}
          ctaLink={heroSection?.ctaLink}
          ctaSecondaryText={heroSection?.ctaSecondaryText}
          ctaSecondaryLink={heroSection?.ctaSecondaryLink}
          metadata={heroSection?.metadata}
        />

        {/* 2. 360 Infinite Continuous Client Brand Marquee */}
        <ClientsMarquee clients={clientBrands} />

        {/* 4. The 6 Core Services With Rich Visual Mockups */}
        <ServicesGrid services={parsedServices} />

        {/* 5. About Us Executive Section */}
        <AboutSection />

        {/* 6. Why Choose Us */}
        <WhyChooseUs
          title={whySection?.title}
          subtitle={whySection?.subtitle}
          features={whySection?.metadata?.features}
        />

        {/* 7. Battle-Tested 5-Step Process */}
        <ProcessSection
          title={processSection?.title}
          subtitle={processSection?.subtitle}
          steps={processSection?.metadata?.steps}
        />

        {/* 8. Client Testimonials & Social Proof (Dynamic 3-Card Carousel) */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 9. Transparent Pricing Packages */}
        <PricingSection services={parsedServices} />

        {/* 8. FAQs */}
        <FaqAccordion faqs={faqs} />

        {/* 9. Direct Conversion & Lead Generation Section */}
        <ContactCTA
          title={finalCta?.title}
          subtitle={finalCta?.subtitle}
        />
      </main>

      {/* Footer */}
      <Footer
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        contactEmail={settings?.contactEmail}
        contactPhone={settings?.contactPhone}
        whatsappNumber={settings?.whatsappNumber}
        address={settings?.address}
        footerText={settings?.footerText}
      />
    </div>
  );
}
