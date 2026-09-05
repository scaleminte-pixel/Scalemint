const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Safe & Idempotent Database Initialization ---');

  // 1. Check & Seed Admin User safely
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const email = process.env.ADMIN_DEFAULT_EMAIL || 'admin@scalemint.com';
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPassword2026!';
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.admin.create({
      data: {
        email,
        passwordHash,
        name: 'Agency Principal',
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`[Seed] Created initial super admin: ${email}`);
  } else {
    console.log('[Seed] Admin already exists. Skipping admin creation.');
  }

  // 2. Check & Seed Global Site Settings
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  if (!settings) {
    await prisma.siteSettings.create({
      data: {
        id: 'global',
        siteName: 'Scalemint',
        tagline: '360° Creative & Digital Growth Engine',
        contactEmail: 'growth@scalemint.com',
        contactPhone: '+1 (415) 890-3412',
        whatsappNumber: '+14158903412',
        address: 'San Francisco, CA & Global Hubs',
        socialLinks: JSON.stringify({
          twitter: 'https://twitter.com/scalemint',
          linkedin: 'https://linkedin.com/company/scalemint',
          instagram: 'https://instagram.com/scalemint',
          youtube: 'https://youtube.com/@scalemint',
        }),
        footerText: '© 2026 Scalemint Studio. Engineered for high-velocity brands and conversion impact.',
        defaultSeoTitle: 'Scalemint — 360° Full-Service Creative & Performance Agency',
        defaultSeoDesc: 'We architect premium branding, high-converting web experiences, viral UGC video, digital marketing, and Google Ads for ambitious brands.',
      },
    });
    console.log('[Seed] Initialized Global Site Settings.');
  }

  // 3. Check & Seed The 6 Core Services
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    const coreServices = [
      {
        slug: 'branding-design',
        name: 'Branding Design',
        tagline: 'Distinctive visual identity that commands premium market authority.',
        shortDesc: 'Strategic brand identity, design systems, visual guidelines, typography, and iconography tailored for high-growth modern businesses.',
        fullDesc: 'Your brand is the silent ambassador of your pricing power and customer trust. We build cohesive, memorable identities that differentiate you instantly in saturated markets.',
        iconName: 'palette',
        whatIsIncluded: JSON.stringify([
          'Brand Strategy & Market Positioning',
          'Primary & Secondary Logo Suite',
          'Typography Hierarchy & Color Systems',
          'Brand Book & Usage Guidelines',
          'Social Media & Digital Collateral Kits',
          'Vector Asset Delivery (SVG, AI, PDF, PNG)',
        ]),
        bestFor: 'Startups launching new products, or established companies undergoing premium rebrands.',
        benefits: JSON.stringify([
          'Command higher pricing with immediate perceived value',
          'Consistency across every customer touchpoint',
          'Memorable visual recall against competitors',
        ]),
        startingPrice: 'From $1,490',
        displayOrder: 1,
        status: 'PUBLISHED',
        packages: [
          {
            name: 'Essential Identity',
            bestFor: 'Early-stage ventures needing foundational branding',
            price: '$1,490',
            deliverables: JSON.stringify(['Core Logo System', 'Color & Type Tokens', 'Mini Brand Guidelines', 'Favicon & Social Avatars']),
            revisions: '3 Revision Rounds',
            timeline: '7-10 Business Days',
            isPopular: false,
            displayOrder: 1,
          },
          {
            name: 'Full Brand Ecosystem',
            bestFor: 'Growing companies seeking market leadership',
            price: '$2,990',
            deliverables: JSON.stringify(['Full Brand Architecture', 'Comprehensive Brand Guidelines', 'Custom 3D/Vector Iconography', 'Social Kit & Presentation Deck', 'Packaging / Merch Guidelines']),
            revisions: 'Unlimited during design sprint',
            timeline: '2-3 Weeks',
            isPopular: true,
            displayOrder: 2,
          },
        ],
      },
      {
        slug: 'website-design',
        name: 'Website Design',
        tagline: 'High-speed, conversion-engineered digital flagships that convert visitors into revenue.',
        shortDesc: 'Custom UI/UX, responsive modern design, interactive micro-animations, and fast Next.js architectures optimized for conversion rate and SEO.',
        fullDesc: 'We build digital experiences that blend aesthetic excellence with razor-sharp CRO principles. Clean typography, frictionless navigation, lightning-fast loads, and seamless lead capture.',
        iconName: 'layout',
        whatIsIncluded: JSON.stringify([
          'Wireframing & High-Fidelity Figma Prototypes',
          'Custom Responsive Development (Desktop, Tablet, Mobile)',
          'SEO-Optimized Semantic Architecture',
          'CMS Integration for Effortless Content Updates',
          'Analytics, Meta Pixel & UTM Lead Tracking Built-in',
          'Lighthouse 95+ Core Web Vitals Optimization',
        ]),
        bestFor: 'B2B brands, DTC flagships, SaaS products, and service agencies looking for exponential conversions.',
        benefits: JSON.stringify([
          'Sub-second page load times for low bounce rates',
          'Clear user journeys leading directly to booked calls & inquiries',
          'Self-serve CMS without needing ongoing developer fees',
        ]),
        startingPrice: 'From $2,490',
        displayOrder: 2,
        status: 'PUBLISHED',
        packages: [
          {
            name: 'Sprint Landing Page',
            bestFor: 'High-ticket campaign launches & product validation',
            price: '$1,990',
            deliverables: JSON.stringify(['Custom CRO Single-Page Architecture', 'Interactive Sections & Sticky CTA', 'Lead Capture Form with UTM Tracking', 'Speed & Mobile Optimization']),
            revisions: '3 Rounds',
            timeline: '5-7 Days',
            isPopular: false,
            displayOrder: 1,
          },
          {
            name: 'Flagship Website + CMS',
            bestFor: 'Established brands needing a complete digital conversion engine',
            price: '$4,490',
            deliverables: JSON.stringify(['Up to 7 Custom Dynamic Pages', 'Full CMS & Media Library System', 'Interactive Portfolio & Service Hubs', 'Advanced Analytics & Event Tracking', '30-Day Post-Launch Support']),
            revisions: 'Unlimited sprint revisions',
            timeline: '3-4 Weeks',
            isPopular: true,
            displayOrder: 2,
          },
        ],
      },
      {
        slug: 'video-editing',
        name: 'Video Editing',
        tagline: 'Cinematic, retention-focused video post-production for high-impact social and brand campaigns.',
        shortDesc: 'Premium pacing, dynamic motion graphics, sound design, and color grading for YouTube, brand films, podcasts, and commercial reels.',
        fullDesc: 'Video is the highest-leverage medium to build intimacy and credibility. We turn raw footage into gripping narratives that hold audience retention and drive viewers to take action.',
        iconName: 'film',
        whatIsIncluded: JSON.stringify([
          'Multi-cam Editing & Narrative Structuring',
          'Dynamic Kinetic Typography & Captions',
          'Custom Sound Design, Foley & Audio Mastering',
          'Professional Color Grading (Rec.709 / Film Emulation)',
          'B-roll Curation & Motion Graphic Overlays',
          'Export in 4K/UHD and Vertical 9:16 Formats',
        ]),
        bestFor: 'Content creators, founders building personal brands, and companies scaling YouTube or video podcasts.',
        benefits: JSON.stringify([
          'Higher audience watch time and algorithmic reach',
          'Turn raw footage into polished, brand-consistent assets',
          'Predictable turnaround times to maintain publishing cadence',
        ]),
        startingPrice: 'From $790',
        displayOrder: 3,
        status: 'PUBLISHED',
        packages: [
          {
            name: 'Shorts & Reels Sprint',
            bestFor: 'Brands scaling TikTok, IG Reels, and YouTube Shorts',
            price: '$990 / mo',
            deliverables: JSON.stringify(['8 High-Retention Vertical Videos', 'Kinetic Subtitles & Sound FX', 'Hook Testing & Optimization', 'Weekly Delivery']),
            revisions: '2 Rounds per video',
            timeline: 'Weekly Delivery',
            isPopular: true,
            displayOrder: 1,
          },
          {
            name: 'Long-Form & Brand Films',
            bestFor: 'YouTube channels, keynote videos, and product launches',
            price: '$1,890 / mo',
            deliverables: JSON.stringify(['4 Deep-Dive Long-Form Edits (up to 15 mins)', 'Custom Motion Graphics & Intros', 'Thumbnail Design Concept Included', 'Full Audio Mastering']),
            revisions: '2 Rounds per video',
            timeline: 'Bi-weekly Delivery',
            isPopular: false,
            displayOrder: 2,
          },
        ],
      },
      {
        slug: 'ai-ugc-video-editing',
        name: 'AI UGC Video Editing',
        tagline: 'High-converting UGC ads powered by authentic hooks and AI-assisted performance iteration.',
        shortDesc: 'Direct-response UGC videos built for TikTok, Meta Ads, and Reels. Combining authentic creator feel with fast-paced editing and AI-optimized hooks.',
        fullDesc: 'Modern ad platforms demand constant creative iteration. We produce and edit performance-driven UGC ads that blend native organic aesthetics with aggressive direct-response persuasion.',
        iconName: 'sparkles',
        whatIsIncluded: JSON.stringify([
          'Ad Hook Research & Direct Response Scripting',
          'AI-Assisted Voiceover & Creative Variations',
          'Native TikTok/Meta Style Captions & Stickers',
          'B-roll Sourcing, Product Overlay & Split Testing Cuts',
          'Multiple Hook Variations per Ad Concept (3 Hooks + 1 Body)',
          'Aspect Ratio Optimization (9:16, 4:5, 1:1)',
        ]),
        bestFor: 'E-commerce, DTC brands, mobile apps, and digital products spending on Meta & TikTok Ads.',
        benefits: JSON.stringify([
          'Lower CPA and higher ROAS by defeating ad fatigue',
          'Rapid creative testing with multiple hook variations',
          'Native look and feel that doesn’t look like a standard corporate ad',
        ]),
        startingPrice: 'From $890',
        displayOrder: 4,
        status: 'PUBLISHED',
        packages: [
          {
            name: 'Ad Starter Kit',
            bestFor: 'Brands launching their first UGC ad campaigns',
            price: '$890',
            deliverables: JSON.stringify(['4 Custom UGC Video Ads', '3 Hook Variations per Concept (12 total assets)', 'Caption Styling & Voice Tuning', 'Direct-Response CTAs']),
            revisions: '2 Rounds',
            timeline: '5-7 Business Days',
            isPopular: false,
            displayOrder: 1,
          },
          {
            name: 'Scale Velocity Batch',
            bestFor: 'Active media buyers requiring continuous fresh ad creatives',
            price: '$1,790 / mo',
            deliverables: JSON.stringify(['12 High-Converting UGC Ads', '36 Hook Iterations for A/B Testing', 'Dedicated Ad Creative Strategist', 'Bi-weekly Creative Refresh']),
            revisions: 'Unlimited tweak iterations',
            timeline: 'Continuous Bi-weekly',
            isPopular: true,
            displayOrder: 2,
          },
        ],
      },
      {
        slug: 'digital-marketing',
        name: 'Digital Marketing Service',
        tagline: 'Omnichannel growth systems that turn cold attention into loyal, high-LTV customers.',
        shortDesc: 'Full-funnel marketing strategies, email marketing automation, content distribution, and conversion rate optimization tailored to sustainable growth.',
        fullDesc: 'Marketing without strategy is just noise. We build predictable acquisition and retention funnels that connect organic discovery, paid acquisition, and automated lifecycle marketing.',
        iconName: 'trending-up',
        whatIsIncluded: JSON.stringify([
          'Comprehensive Funnel Audit & Competitive Analysis',
          'Email Automation & Lifecycle Flows (Klaviyo / HubSpot)',
          'Landing Page CRO & A/B Testing Roadmap',
          'Content Repurposing & Multi-Platform Distribution',
          'Customer Retention & Referral Mechanics',
          'Monthly Executive Reporting & Strategic Insights',
        ]),
        bestFor: 'Established businesses looking to unlock higher customer lifetime value and consistent inbound demand.',
        benefits: JSON.stringify([
          'Predictable pipeline of qualified leads',
          'Automated nurture funnels that convert while you sleep',
          'Clear attribution and visibility on marketing ROI',
        ]),
        startingPrice: 'From $1,500 / mo',
        displayOrder: 5,
        status: 'PUBLISHED',
        packages: [
          {
            name: 'Retention & Email Accelerator',
            bestFor: 'Brands with existing traffic needing higher retention revenue',
            price: '$1,500 / mo',
            deliverables: JSON.stringify(['Full Welcome, Abandon & Post-Purchase Flows', '8 Campaign Newsletters per Month', 'List Segmentation & Deliverability Audit', 'Monthly Revenue Report']),
            revisions: 'Ongoing collaboration',
            timeline: 'Monthly Retainer',
            isPopular: false,
            displayOrder: 1,
          },
          {
            name: 'Full Growth Engine',
            bestFor: 'Companies seeking end-to-end marketing management',
            price: '$3,200 / mo',
            deliverables: JSON.stringify(['Omnichannel Strategy & Execution', 'CRO Audit & Page Optimization Sprints', 'Lifecycle Marketing & Automation', 'Ad Creative Direction & Copywriting', 'Weekly Growth Syncs']),
            revisions: 'Ongoing dedicated squad',
            timeline: 'Monthly Retainer',
            isPopular: true,
            displayOrder: 2,
          },
        ],
      },
      {
        slug: 'google-ads',
        name: 'Google Ads Service',
        tagline: 'High-intent search, Shopping, and YouTube campaigns that capture buyers at the moment of search.',
        shortDesc: 'Precision PPC management, high-converting ad copy, negative keyword sculpting, and conversion tracking setup that maximizes return on ad spend (ROAS).',
        fullDesc: 'Capture prospective customers at the exact moment they are looking for your solution. We engineer high-intent Google Search, Performance Max, and Remarketing campaigns with strict budget discipline and ruthless ROAS focus.',
        iconName: 'target',
        whatIsIncluded: JSON.stringify([
          'In-Depth Keyword Research & Intent Clustering',
          'Campaign Architecture (Search, PMax, Remarketing)',
          'High-CTR Ad Copywriting & Responsive Ad Assets',
          'Negative Keyword Lists & Wasteful Spend Pruning',
          'Conversion Tracking & Google Tag Manager Setup',
          'Bid Strategy Optimization & Weekly ROAS Reviews',
        ]),
        bestFor: 'Service businesses, B2B companies, and e-commerce stores wanting to capture existing market demand.',
        benefits: JSON.stringify([
          'Direct capture of high-intent, ready-to-buy traffic',
          'Elimination of wasted ad spend through negative keywords',
          'Accurate conversion tracking tied directly to business revenue',
        ]),
        startingPrice: 'From $1,200 / mo',
        displayOrder: 6,
        status: 'PUBLISHED',
        packages: [
          {
            name: 'Search Intent Focus',
            bestFor: 'Service businesses targeting local or niche national buyers',
            price: '$1,200 / mo',
            deliverables: JSON.stringify(['Google Search & Call Ads Management', 'Weekly Negative Keyword Pruning', 'Conversion Tagging Audit', 'Up to $5k Ad Spend Managed']),
            revisions: 'Continuous optimization',
            timeline: 'Monthly Retainer',
            isPopular: false,
            displayOrder: 1,
          },
          {
            name: 'Performance Max & Scale',
            bestFor: 'Scaling businesses spending $5,000+ per month on Google',
            price: '$2,400 / mo',
            deliverables: JSON.stringify(['Full Google Suite (Search, PMax, YouTube, Display)', 'Landing Page Alignment Recommendations', 'Offline Conversion Tracking Integration', 'Dedicated Account Strategist', 'Up to $20k Ad Spend Managed']),
            revisions: 'Continuous daily monitoring',
            timeline: 'Monthly Retainer',
            isPopular: true,
            displayOrder: 2,
          },
        ],
      },
    ];

    for (const s of coreServices) {
      const { packages, ...serviceData } = s;
      const createdService = await prisma.service.create({
        data: serviceData,
      });

      if (packages && packages.length > 0) {
        for (const pkg of packages) {
          await prisma.servicePackage.create({
            data: {
              ...pkg,
              serviceId: createdService.id,
            },
          });
        }
      }
    }
    console.log(`[Seed] Successfully seeded all 6 core services and their packages.`);
  } else {
    console.log('[Seed] Services already exist. Preserving existing CMS records.');
  }

  // 4. Check & Seed Page Sections
  const sectionCount = await prisma.pageSection.count();
  if (sectionCount === 0) {
    const defaultSections = [
      {
        page: 'home',
        sectionKey: 'hero',
        title: 'We Build Brands & Digital Engines That Scale Revenue',
        subtitle: 'Scalemint is your 360° creative and performance partner. We unite strategic branding, conversion-focused web design, viral video editing, AI UGC, digital marketing, and precision Google Ads under one high-velocity squad.',
        ctaText: 'Start Your Project',
        ctaLink: '#contact',
        ctaSecondaryText: 'Explore Core Services',
        ctaSecondaryLink: '#services',
        metadata: JSON.stringify({
          badge: 'Accepting Select Q2/Q3 Growth Partners',
          stats: [
            { label: 'Core Capabilities', value: '360°' },
            { label: 'Focus & Execution', value: '100%' },
            { label: 'Creative Partner', value: '1 Squad' },
          ],
        }),
        displayOrder: 1,
        isPublished: true,
      },
      {
        page: 'home',
        sectionKey: 'why_choose_us',
        title: 'Why Forward-Thinking Brands Partner With Scalemint',
        subtitle: 'No fragmented freelancers. No bloated corporate bureaucracy. Just one agile creative partner obsessed with your brand elevation and measurable ROI.',
        metadata: JSON.stringify({
          features: [
            {
              title: 'One Unified Creative Partner',
              desc: 'Branding, web design, video, and paid acquisition aligned under one strategic vision with zero disconnect.',
            },
            {
              title: 'High-Velocity Sprints',
              desc: 'We move fast with dedicated design sprints, predictable delivery timelines, and transparent Slack communication.',
            },
            {
              title: 'Conversion-First Philosophy',
              desc: 'Aesthetic excellence backed by behavioral psychology, CRO principles, and performance ad testing.',
            },
            {
              title: 'Full Content Ownership',
              desc: 'You retain 100% ownership of your source files, Figma systems, code repositories, and ad creative assets.',
            },
          ],
        }),
        displayOrder: 2,
        isPublished: true,
      },
      {
        page: 'home',
        sectionKey: 'process',
        title: 'A Frictionless, Battle-Tested 5-Step Process',
        subtitle: 'From initial strategy to live deployment and revenue scale, here is how we work together.',
        metadata: JSON.stringify({
          steps: [
            { step: '01', title: 'Discovery & Audit', desc: 'We dissect your market, ideal buyer persona, competitive gaps, and growth bottlenecks.' },
            { step: '02', title: 'Strategic Roadmap', desc: 'We blueprint the exact deliverables, visual style, technical stack, and KPI milestones.' },
            { step: '03', title: 'Sprint Production', desc: 'Our specialized squads execute branding, coding, video cutting, or ad campaign building.' },
            { step: '04', title: 'Review & Refinement', desc: 'Interactive feedback loops to polish every pixel, copy hook, and interaction state.' },
            { step: '05', title: 'Launch & Scale', desc: 'Deployment with verified tracking, QA verification, and post-launch optimization.' },
          ],
        }),
        displayOrder: 3,
        isPublished: true,
      },
      {
        page: 'home',
        sectionKey: 'final_cta',
        title: 'Ready to Scale Your Brand With a Dedicated Creative Partner?',
        subtitle: 'Book a discovery consultation or request a custom proposal today. Let’s build something extraordinary together.',
        ctaText: 'Schedule a Discovery Call',
        ctaLink: '#contact',
        ctaSecondaryText: 'Chat on WhatsApp',
        ctaSecondaryLink: 'https://wa.me/14158903412',
        displayOrder: 4,
        isPublished: true,
      },
    ];

    for (const sec of defaultSections) {
      await prisma.pageSection.create({ data: sec });
    }
    console.log('[Seed] Seeded default homepage sections.');
  } else {
    console.log('[Seed] Page sections already exist. Preserving CMS data.');
  }

  // 5. Check & Seed FAQs
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    const defaultFaqs = [
      {
        question: 'What makes a 360° agency better than hiring separate specialists?',
        answer: 'When you hire separate freelancers for design, video, web, and ads, your brand voice fractures and coordination falls on you. Scalemint provides a single unified squad where your brand identity directly informs your website UX, your video hooks match your ad messaging, and your Google Ads point to conversion-optimized landing pages.',
        category: 'general',
        displayOrder: 1,
      },
      {
        question: 'How fast do projects typically launch?',
        answer: 'Our sprint timelines depend on project scope: Landing pages and branding sprints typically deliver within 7-14 business days. Full custom websites with CMS take 3-4 weeks. Retainers for video editing and Google Ads begin within 5 days of onboarding.',
        category: 'process',
        displayOrder: 2,
      },
      {
        question: 'How does the revision and feedback process work?',
        answer: 'We provide structured review milestones via Figma, Loom, and dedicated staging links. We offer transparent revision rounds (and unlimited sprint adjustments on flagship packages) until you are 100% satisfied.',
        category: 'process',
        displayOrder: 3,
      },
      {
        question: 'Can I start with one service and expand later?',
        answer: 'Absolutely. Many of our clients start with a Branding or Website Design sprint, and subsequently retain us for Video Editing, AI UGC, and Google Ads growth.',
        category: 'services',
        displayOrder: 4,
      },
      {
        question: 'Who owns the intellectual property and assets?',
        answer: 'You do. Upon project completion and final payment, 100% of all intellectual property, source files (Figma, code, raw video, ad accounts) belongs entirely to your company.',
        category: 'pricing',
        displayOrder: 5,
      },
    ];

    for (const f of defaultFaqs) {
      await prisma.faq.create({ data: f });
    }
    console.log('[Seed] Seeded foundational FAQs.');
  } else {
    console.log('[Seed] FAQs already exist. Preserving CMS data.');
  }

  // 6. Check & Seed Portfolio Categories
  const catCount = await prisma.portfolioCategory.count();
  if (catCount === 0) {
    const categories = [
      { name: 'Branding & Identity', slug: 'branding', displayOrder: 1 },
      { name: 'Web Experiences', slug: 'web-design', displayOrder: 2 },
      { name: 'Video & Motion', slug: 'video', displayOrder: 3 },
      { name: 'Performance & Ads', slug: 'ads', displayOrder: 4 },
    ];
    for (const c of categories) {
      await prisma.portfolioCategory.create({ data: c });
    }
    console.log('[Seed] Seeded portfolio categories.');
  }

  console.log('--- Database Initialization Complete (All Data Preserved & Verified) ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
