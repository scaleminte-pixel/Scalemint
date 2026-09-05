const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial expanded CMS records (Legal, Calculator, Videos, Dynamic Blocks)...');

  // 1. Seed Legal Pages
  const legalPages = [
    {
      slug: 'terms',
      title: 'Terms and Conditions — Scalemint Studio',
      summary: 'Master Services Agreement, Intellectual Property handover terms, revision standards, and commercial engagement guidelines.',
      sections: JSON.stringify([
        {
          id: 'engagement-scope',
          title: '1. Engagement Scope & Sprint Methodology',
          content: 'Scalemint operates as a high-velocity 360° creative and digital growth studio delivering fixed-scope sprints across Branding, Website Design, Video Editing, AI UGC, Meta Advertising, and Google Ads. Every engagement is bound by a structured Statement of Work (SOW) or turnkey sprint package defining deliverables, milestones, and turnaround commitments. Work begins immediately following sprint onboarding and deposit clearance.',
        },
        {
          id: 'ip-rights',
          title: '2. 100% Intellectual Property & Asset Handover',
          content: 'Upon final milestone settlement, 100% unrestricted intellectual property (IP), commercial usage rights, and editable vector master files (Figma tokens, SVG vector marks, Adobe project files, 4K video exports, and full Next.js source code) are transferred irrevocably to the client. Scalemint retains zero proprietary licensing claims over custom client assets.',
        },
        {
          id: 'client-collaboration',
          title: '3. Client Obligations & Material Handover',
          content: 'To ensure rapid sprint delivery, the client agrees to provide necessary access credentials and designate an authorized point of contact. Timely feedback turnaround ensures sprint velocity remains uninterrupted.',
        },
        {
          id: 'revisions-acceptance',
          title: '4. Revision Rounds & Deliverable Acceptance',
          content: 'Every sprint includes structured revision rounds defined in the service tier. Revisions submitted via timestamped comments are executed with 24 to 48-hour turnaround. If no revision requests are logged within 7 business days, deliverables are deemed accepted.',
        },
        {
          id: 'confidentiality-nda',
          title: '5. Confidentiality & Non-Disclosure (NDA)',
          content: 'Scalemint treats all proprietary client data, pre-release software, unreleased pitch decks, sales figures, and technical roadmaps with enterprise-grade confidentiality under mutual NDA standards.',
        },
        {
          id: 'service-guarantees',
          title: '6. Quality Standards & Code Performance',
          content: 'All web applications are engineered on Next.js 14, TypeScript, and modern edge infrastructure, aiming for 95+ Google Core Web Vitals scores and sub-second load times.',
        },
      ]),
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy — Scalemint Studio',
      summary: 'Data protection standards, analytics telemetry, customer privacy rights, and GDPR/CCPA compliance manifesto.',
      sections: JSON.stringify([
        {
          id: 'data-collection',
          title: '1. Information We Collect',
          content: 'We collect information you provide directly to us through discovery inquiry forms, strategy booking schedules, and project communication channels. This includes your name, business email, WhatsApp/phone number, company name, project goals, and estimated budget.',
        },
        {
          id: 'data-usage',
          title: '2. How We Use Your Data',
          content: 'We strictly use collected information to respond to discovery inquiries, deliver creative and engineering sprint milestones, send proposal documentation, and maintain transparent project collaboration.',
        },
        {
          id: 'data-protection',
          title: '3. Enterprise Security & Encryption',
          content: 'We employ modern cryptographic protocols (TLS/HTTPS 1.3), restricted JWT session tokens, and encrypted database connections to safeguard client data against unauthorized access or breaches.',
        },
        {
          id: 'cookie-tracking',
          title: '4. Analytics & Tracking Pixels',
          content: 'We use anonymized Google Analytics (GA4) and Meta Pixel telemetry strictly to measure aggregate traffic performance and optimize page load speeds.',
        },
        {
          id: 'third-party-disclosure',
          title: '5. Zero Third-Party Data Reselling',
          content: 'Scalemint will never sell, rent, or lease client contact information or strategic data to third-party data brokers or marketing lists.',
        },
      ]),
    },
    {
      slug: 'payment-policy',
      title: 'Payment & Milestone Policy — Scalemint Studio',
      summary: 'Turnkey fixed sprint deposits, currency settlements, milestone releases, and invoice terms.',
      sections: JSON.stringify([
        {
          id: 'payment-structure',
          title: '1. Milestone Deposit Structure',
          content: 'All fixed-scope sprints require a standard 50% initial commitment deposit to reserve dedicated senior principal talent and lock in production timelines. The remaining 50% milestone balance is settled upon project completion and final IP handover.',
        },
        {
          id: 'currency-invoicing',
          title: '2. Currency & Payment Methods',
          content: 'All quotes are calculated in USD ($). We accept automated international wire transfers (ACH / SWIFT), Stripe secure card processing, and enterprise invoicing.',
        },
        {
          id: 'refund-policy',
          title: '3. Satisfaction Guarantee & Sprint Pause',
          content: 'If you are unsatisfied with the initial discovery concepts or design direction during Phase 1, you may pause the sprint without incurring further milestone obligations.',
        },
      ]),
    },
  ];

  for (const page of legalPages) {
    await prisma.legalPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        summary: page.summary,
        sections: page.sections,
      },
      create: {
        slug: page.slug,
        title: page.title,
        summary: page.summary,
        sections: page.sections,
        status: 'PUBLISHED',
      },
    });
  }
  console.log('✔ Legal pages seeded.');

  // 2. Seed Calculator Config
  const tierPresets = [
    {
      id: 'essential',
      name: 'Sprint Essential',
      badge: 'Fast Turnaround',
      basePrice: 1490,
      deliveryDays: '5-7 Days',
      features: [
        'Core Production Deliverables',
        'Direct Senior Designer/Engineer',
        '2 Iteration & Review Cycles',
        'Full Source Files & Commercial License',
      ],
    },
    {
      id: 'growth',
      name: 'Growth Flagship',
      badge: 'Most Popular',
      basePrice: 2990,
      deliveryDays: '10-14 Days',
      features: [
        'Complete End-to-End System Architecture',
        'Dedicated Senior Production Director',
        'Interactive Prototype & Component Library',
        'Unlimited Iterations within Sprint Period',
        'Direct Slack Channel Communication',
        'Priority Production Queue Allocation',
      ],
    },
    {
      id: 'scale',
      name: 'Enterprise Scale',
      badge: 'Max Velocity',
      basePrice: 4890,
      deliveryDays: '14-21 Days',
      features: [
        'Full Multi-Discipline Ecosystem Deployment',
        'Co-Founders & Principal Lead Direct Oversight',
        'Multi-Platform Adaptations & Responsive Variants',
        'Advanced Analytics & Telemetry Tracking Integration',
        '30-Day Post-Launch SLA & Optimization Support',
      ],
    },
  ];

  const addOnOptions = [
    {
      id: 'expedited',
      name: '48h Rapid Velocity Fast-Track',
      price: 650,
      desc: 'Jump the queue with dedicated around-the-clock priority sprint cycles.',
    },
    {
      id: 'source-handover',
      name: 'Full Token Library & Git System',
      price: 400,
      desc: 'Automated Figma tokens to CSS/JSON variables and production Git branch.',
    },
    {
      id: 'retainer-warroom',
      name: '30-Day Post-Launch War Room Support',
      price: 850,
      desc: 'Continuous real-time conversion monitoring, A/B testing, and hotfixes.',
    },
  ];

  await prisma.calculatorConfig.upsert({
    where: { id: 'global_calculator' },
    update: {
      basePrice: 1490,
      tierPresets: JSON.stringify(tierPresets),
      addOnOptions: JSON.stringify(addOnOptions),
      minPrice: 490,
      maxPrice: 25000,
    },
    create: {
      id: 'global_calculator',
      basePrice: 1490,
      currency: 'USD',
      tierPresets: JSON.stringify(tierPresets),
      addOnOptions: JSON.stringify(addOnOptions),
      minPrice: 490,
      maxPrice: 25000,
      ctaText: 'Lock In Scope & Book Strategy Call',
      ctaLink: '#contact',
      isVisible: true,
    },
  });
  console.log('✔ Calculator config seeded.');

  // 3. Seed YouTube Videos (Showcases)
  const sampleVideos = [
    {
      title: 'ZenFlow AI — High-Converting Product Anthem Film',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      description: 'Cinematic 4K brand launch video with custom sound design and 3D kinetic typography.',
      category: 'cinema',
      isFeatured: true,
      displayOrder: 1,
      status: 'PUBLISHED',
    },
    {
      title: 'Apex Ventures — Dealflow Acquisition Commercial',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      youtubeId: 'ScMzIvxBSi4',
      description: 'Documentary style founder story crafted for venture capital fundraising.',
      category: 'showcase',
      isFeatured: false,
      displayOrder: 2,
      status: 'PUBLISHED',
    },
    {
      title: 'Pulse Commerce — 9:16 Viral TikTok & Reels Hook',
      youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      youtubeId: 'kJQP7kiw5Fk',
      description: 'Fast-paced UGC style vertical video with 82% 3-second hook retention rate.',
      category: 'ugc',
      isFeatured: true,
      displayOrder: 3,
      status: 'PUBLISHED',
    },
  ];

  for (const v of sampleVideos) {
    const existing = await prisma.youTubeVideo.findFirst({ where: { youtubeId: v.youtubeId } });
    if (!existing) {
      await prisma.youTubeVideo.create({ data: v });
    }
  }
  console.log('✔ YouTube videos seeded.');

  // 4. Seed Dynamic Blocks
  const sampleBlocks = [
    {
      slug: 'sprint-manifesto-block',
      title: 'The Scalemint 5-Step Sprint Architecture',
      subtitle: 'How we build and launch category-defining brands in 2 to 4 weeks.',
      bodyText: 'We bridge the costly gap between prestige brand design, sub-second code engineering, and high-velocity media acquisition.',
      category: 'feature',
      ctaText: 'Explore Sprint Models',
      ctaLink: '#pricing',
      displayOrder: 1,
      status: 'PUBLISHED',
      contentSections: JSON.stringify([
        {
          type: 'text',
          content: 'Traditional agencies bill large monthly retainers while juniors do the work. We assemble a single cross-functional team of senior craft specialists.',
        },
        {
          type: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
          caption: 'Visual token architecture and Next.js 14 design system blueprint.',
          altText: 'Sprint Architecture Blueprint',
        },
        {
          type: 'text',
          content: 'Every sprint produces production-ready vector assets, 100% full Next.js source code, and multi-channel ad funnels ready to scale.',
        },
      ]),
    },
  ];

  for (const b of sampleBlocks) {
    const existing = await prisma.dynamicBlock.findUnique({ where: { slug: b.slug } });
    if (!existing) {
      await prisma.dynamicBlock.create({ data: b });
    }
  }
  console.log('✔ Dynamic blocks seeded.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
