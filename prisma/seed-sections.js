const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking existing page sections...');
  const existing = await prisma.pageSection.findMany({
    where: { page: 'home' }
  });
  console.log('Existing sectionKeys:', existing.map(e => e.sectionKey));

  const sectionsToEnsure = [
    {
      page: 'home',
      sectionKey: 'hero',
      title: 'The 360 Creative and Growth Engine',
      subtitle: 'We unite strategic branding, web design, video editing, AI UGC, digital marketing, and Google Ads under one high-velocity squad.',
      ctaText: 'Start Your Project',
      ctaLink: '#contact',
      ctaSecondaryText: 'Explore Core Services',
      ctaSecondaryLink: '#services',
      metadata: JSON.stringify({
        badge: 'Accepting Select Q2/Q3 Growth Partners',
        livePill: 'Select Q2/Q3 Production Slots Active · Direct Senior Squad Access',
        trustBadges: [
          '100% Source Code & IP Ownership',
          'Sprint Delivery Timelines',
          'Strict Non-Disclosure Guarantee',
        ],
        orbitLabels: ['Branding', 'Web Dev', 'Video', 'Google Ads'],
        bentoCards: [
          {
            badge: 'Senior Production',
            title: 'Zero Jr. Dev / Designer Handoffs',
            subtitle: 'Direct execution by senior creatives with 7+ years craft experience.',
            metric: 'Top 1%',
          },
          {
            badge: 'Guaranteed Velocity',
            title: 'Rapid Sprint Deployments',
            subtitle: 'Continuous momentum with structured weekly milestone handoffs.',
            metric: '< 14 Days',
          },
          {
            badge: 'Global Infrastructure',
            title: 'Sub-Second Code & Edge Hosting',
            subtitle: 'Next.js 15, Vercel Edge caching, and enterprise CDN networks.',
            metric: '99.9%+',
          },
        ],
      }),
    },
    {
      page: 'home',
      sectionKey: 'services_intro',
      title: 'Six Specialized Pillars. One Unified Squad.',
      subtitle: 'Everything category leaders need to launch, scale, and capture dominant market share.',
      metadata: JSON.stringify({
        badge: 'Comprehensive 360° Disciplines',
      }),
    },
    {
      page: 'home',
      sectionKey: 'about',
      title: 'Engineered for Radical Growth. Built Without Agency Bloat.',
      subtitle: 'We eliminate the friction between creative vision and revenue-generating execution.',
      content: 'Traditional agencies bill by the hour, assign junior staff to your brand, and operate with fragmented communication. Scalemint was engineered as the antidote.\n\nWe unite elite design, high-performance web engineering, cinematic video production, and high-ROI acquisition into one unified growth engine. Every client works directly with dedicated senior practitioners focused obsessively on your commercial success.',
      metadata: JSON.stringify({
        badge: 'Who We Are & Why We Exist',
        checklist: [
          'Direct senior practitioner access — zero account managers',
          'Complete IP & source code ownership transferred at launch',
          'Production sprints delivered 3x faster than legacy agencies',
          'Integrated full-funnel strategy: Brand + Web + Media + Ads',
        ],
        metricsTitle: 'Our Operating Standards',
        metrics: [
          { value: '360°', label: 'Full-Funnel Growth Coverage' },
          { value: '95%+', label: 'Client Retention Rate' },
          { value: '100%', label: 'IP & Asset Ownership' },
          { value: '24h', label: 'Average Slack Response Time' },
        ],
        ndaText: 'Strict Non-Disclosure Guarantee: All client assets, roadmaps, and data protected under enterprise-grade bilateral confidentiality agreements.',
      }),
    },
    {
      page: 'home',
      sectionKey: 'why_choose_us',
      title: 'Why Forward-Thinking Brands Partner With Scalemint',
      subtitle: 'We bridge the costly disconnect between brand prestige, sub-second code engineering, and precision acquisition.',
      metadata: JSON.stringify({
        badge: 'Competitive Advantage',
        items: [
          {
            title: 'Speed Without Compromise',
            desc: 'Production sprints completed in days, not quarters. Rapid market validation backed by pristine craft.',
          },
          {
            title: 'Unified 360° Squad',
            desc: 'No more coordinating 5 different niche agencies. Brand, web, video, and paid media move in lockstep.',
          },
          {
            title: 'Obsession With ROI',
            desc: 'Every design decision and line of code is measured against commercial conversions and customer LTV.',
          },
          {
            title: 'Transparent Pricing & IP',
            desc: 'Fixed-scope pricing packages, zero hidden retainer fees, and 100% intellectual property ownership.',
          },
        ],
      }),
    },
    {
      page: 'home',
      sectionKey: 'process',
      title: 'Predictable Excellence, Delivered in 5 Sprints',
      subtitle: 'A disciplined, milestone-driven workflow ensuring complete transparency, rapid delivery, and measurable impact.',
      metadata: JSON.stringify({
        badge: 'Our 5-Step Methodology',
        steps: [
          {
            num: '01',
            title: 'Discovery & Strategic Alignment',
            desc: 'We dissect your brand positioning, audience psychology, unit economics, and competitive moat to build an airtight execution roadmap.',
            timeline: 'Sprint Week 1',
          },
          {
            num: '02',
            title: 'Concept & Brand Architecture',
            desc: 'Visual identity exploration, UI/UX wireframing, messaging framework, and art direction calibrated to project category authority.',
            timeline: 'Sprint Week 2',
          },
          {
            num: '03',
            title: 'High-Velocity Production',
            desc: 'Sub-second web engineering, cinematic video editing, AI UGC creative synthesis, and multi-channel campaign asset production.',
            timeline: 'Sprint Weeks 3-4',
          },
          {
            num: '04',
            title: 'Rigorous QA & Market Launch',
            desc: 'Cross-browser testing, Core Web Vitals optimization, analytics pixel verification, and seamless zero-downtime production deployment.',
            timeline: 'Sprint Week 5',
          },
          {
            num: '05',
            title: 'Scale & Conversion Optimization',
            desc: 'Continuous performance monitoring, creative iteration, A/B landing page testing, and targeted Google Ads scale.',
            timeline: 'Ongoing Growth',
          },
        ],
      }),
    },
    {
      page: 'home',
      sectionKey: 'final_cta',
      title: 'Ready to Accelerate Your Brand?',
      subtitle: 'Book a strategic consultation to discover how our 360° growth engine can transform your digital footprint.',
      ctaText: 'Schedule Consultation',
      ctaLink: '#contact',
      ctaSecondaryText: 'Explore Pricing Packages',
      ctaSecondaryLink: '/pricing',
    },
  ];

  for (const s of sectionsToEnsure) {
    const found = existing.find(e => e.sectionKey === s.sectionKey);
    if (!found) {
      console.log(`Creating section: ${s.sectionKey}...`);
      await prisma.pageSection.create({ data: s });
    } else {
      console.log(`Updating section: ${s.sectionKey}...`);
      await prisma.pageSection.update({
        where: { id: found.id },
        data: {
          title: found.title || s.title,
          subtitle: found.subtitle || s.subtitle,
          content: found.content || s.content,
          ctaText: found.ctaText || s.ctaText,
          ctaLink: found.ctaLink || s.ctaLink,
          ctaSecondaryText: found.ctaSecondaryText || s.ctaSecondaryText,
          ctaSecondaryLink: found.ctaSecondaryLink || s.ctaSecondaryLink,
          metadata: s.metadata,
        },
      });
    }
  }

  console.log('Homepage sections successfully seeded and verified!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
