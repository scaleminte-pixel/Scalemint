const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedExtra() {
  console.log('--- Seeding Extra Data: Blogs, Client Brands, Testimonials, Service FAQs ---');

  // 1. Seed Blogs
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    const blogs = [
      {
        slug: 'death-of-generic-branding-distinctiveness-2026',
        title: 'The Death of Generic Brand Identities: Why Distinctiveness Wins in 2026',
        excerpt: 'In an AI-saturated market flooded with template designs, distinct visual systems and radical positioning are the only defensible moat for high-velocity brands.',
        category: 'Branding & Positioning',
        author: 'Sakhawat Hossain',
        authorRole: 'Founder & Principal Creative',
        readTime: '6 min read',
        coverUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
        displayOrder: 1,
        status: 'PUBLISHED',
        publishedAt: new Date('2026-03-01'),
        content: `
### Why Most Modern Rebrands Fail

Over 80% of corporate redesigns suffer from what we call the "consensus trap" — smoothing out every distinctive edge until the brand looks identical to every other venture-backed company in their sector.

When your brand looks like everyone else, your customer acquisition cost (CAC) rises exponentially. Buyers cannot recall who you are, what you stand for, or why your product deserves a premium price tag.

\`\`\`
Distinctiveness = Memorability = Higher Pricing Power = Lower Long-Term Blended CAC
\`\`\`

### The 4 Pillars of a Defensible Visual System

1. **Radical Typographic Contrast**: Moving away from bland neo-grotesque sans-serifs into high-personality type pairings that communicate enterprise authority and aesthetic craft.
2. **Dynamic Color Architecture**: Establishing an unmistakable primary signature complemented by rich dark mode palettes and neon luminescence accents.
3. **Motion Identity as a Brand Asset**: Brand marks must move. In digital environments, micro-interactions and transitions are as vital as your logo itself.
4. **Direct-Response Consistency**: Seamless continuity between top-of-funnel ads, landing pages, pitch decks, and internal platforms.

### How Scalemint Approaches Brand Engineering

We don't design logos in a vacuum. Every branding sprint begins with a competitive gap analysis to pinpoint exactly how your competitors look, sound, and convert — ensuring your brand commands the spotlight the second a prospect lands on your touchpoints.
        `.trim(),
      },
      {
        slug: 'nextjs-conversion-engines-architectural-guide',
        title: 'From Static Websites to Conversion Engines: Next.js Architecture for Enterprise ROI',
        excerpt: 'How modern web applications built on Next.js 14, server components, and sub-second load times transform passive visitors into enterprise pipeline.',
        category: 'Web Engineering & CRO',
        author: 'Tech & Architecture Team',
        authorRole: 'Senior Full-Stack Architect',
        readTime: '8 min read',
        coverUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
        displayOrder: 2,
        status: 'PUBLISHED',
        publishedAt: new Date('2026-03-10'),
        content: `
### Speed Is A Direct Conversion Lever

Every 100ms delay in page load time reduces conversion rates by up to 7%. For high-ticket B2B agencies and eCommerce brands spending tens of thousands on paid acquisition, slow websites represent pure revenue leakage.

Traditional CMS builders (WordPress, Webflow) generate bloated DOM trees and heavy script dependencies that destroy Google Core Web Vitals.

### The Scalemint Architectural Standard

- **React Server Components (RSC)**: Zero client-side bundle weight for static content.
- **Edge Dynamic Rendering**: Sub-50ms TTFB across global geographic hubs.
- **Micro-Animations with Framer Motion**: Smooth 60FPS transitions that retain user focus without blocking the main browser thread.
- **Frictionless Lead Funnels**: Native multi-step lead capture integrated directly with CRM webhooks and instant Slack notifications.

When code and design operate in perfect alignment, your website stops being an expense and becomes your most predictable revenue channel.
        `.trim(),
      },
      {
        slug: 'ai-ugc-outperforming-commercials-roas-playbook',
        title: 'Why AI UGC & Short-Form Video Outperform Traditional Commercials by 340%',
        excerpt: 'Consumer psychology has evolved. Polished TV spots get skipped in 1.2 seconds, while high-velocity, authentic creator formats generate record ROAS.',
        category: 'Video & Paid Ads',
        author: 'Creative Strategy Lead',
        authorRole: 'Head of Paid Acquisition',
        readTime: '5 min read',
        coverUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
        displayOrder: 3,
        status: 'PUBLISHED',
        publishedAt: new Date('2026-03-15'),
        content: `
### The 3-Second Hook Rule

Modern buyers consume short-form video in a rapid dopamine scroll. If your video hook fails to deliver an emotional or pattern-interrupting punch within the first 1.8 seconds, you have already wasted your ad spend.

### The High-Velocity AI UGC Workflow

1. **Algorithmic Hook Mining**: Identifying viral narrative hooks across TikTok, Reels, and YouTube Shorts.
2. **Hybrid AI & Real Creator Synthesis**: Leveraging AI-assisted scripts, synthetic voice pacing, and authentic human delivery.
3. **Multi-Variation Creative Testing**: Producing 15+ variations of hooks, body pacing, and CTAs per sprint to isolate top ROAS winners.
4. **Rapid Iteration Cadence**: Doubling down on winning creatives within 48 hours of ad launch.
        `.trim(),
      },
      {
        slug: 'google-ads-2026-pmax-search-intent-mastery',
        title: 'Google Ads in 2026: Navigating Performance Max and Commercial Intent Bidding',
        excerpt: 'How leading performance marketers are structuring Google Ads campaigns to capture high-intent buyers while keeping algorithmic waste to zero.',
        category: 'Performance Marketing',
        author: 'Google Ads Specialist',
        authorRole: 'Senior PPC Strategist',
        readTime: '7 min read',
        coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        displayOrder: 4,
        status: 'PUBLISHED',
        publishedAt: new Date('2026-03-20'),
        content: `
### The Shift from Keyword Match Types to Audience Signals

Google's smart bidding algorithms now evaluate thousands of contextual signals at auction time. Bidding exclusively on exact match keywords is no longer enough to dominate high-value auctions.

To win in 2026, brands need:
- First-party conversion data fed back into Google Ads via offline conversion tracking.
- Tightly segmented Performance Max asset groups tailored to buyer awareness levels.
- High-converting landing pages that mirror the exact search intent of the query.

At Scalemint, our Google Ads squad works hand-in-hand with our web design team so your ads and landing pages form an unbreakable conversion loop.
        `.trim(),
      },
    ];

    for (const b of blogs) {
      await prisma.blogPost.create({ data: b });
    }
    console.log(`[Seed] Seeded ${blogs.length} blog posts.`);
  } else {
    console.log(`[Seed] Blogs already exist (${blogCount}).`);
  }

  // 2. Seed Client Brands / Logos
  const brandCount = await prisma.clientBrand.count();
  if (brandCount === 0) {
    const brands = [
      { name: 'Apex Ventures', websiteUrl: 'https://apexventures.example', displayOrder: 1, status: 'PUBLISHED' },
      { name: 'NovaTech Global', websiteUrl: 'https://novatech.example', displayOrder: 2, status: 'PUBLISHED' },
      { name: 'Lumina Health', websiteUrl: 'https://luminahealth.example', displayOrder: 3, status: 'PUBLISHED' },
      { name: 'Elevate Studios', websiteUrl: 'https://elevatestudios.example', displayOrder: 4, status: 'PUBLISHED' },
      { name: 'Pulse Commerce', websiteUrl: 'https://pulsecommerce.example', displayOrder: 5, status: 'PUBLISHED' },
      { name: 'Hyperion AI', websiteUrl: 'https://hyperion.example', displayOrder: 6, status: 'PUBLISHED' },
      { name: 'Vantage Capital', websiteUrl: 'https://vantagecap.example', displayOrder: 7, status: 'PUBLISHED' },
      { name: 'ZenFlow Systems', websiteUrl: 'https://zenflow.example', displayOrder: 8, status: 'PUBLISHED' },
    ];

    for (const br of brands) {
      await prisma.clientBrand.create({ data: br });
    }
    console.log(`[Seed] Seeded ${brands.length} client brands.`);
  } else {
    console.log(`[Seed] Client brands already exist (${brandCount}).`);
  }

  // 3. Seed Testimonials
  const testCount = await prisma.testimonial.count();
  if (testCount === 0) {
    const testimonials = [
      {
        clientName: 'Jonathan Ellis',
        clientRole: 'CEO & Founder',
        companyName: 'Apex Ventures',
        quote: 'Scalemint completely transformed our digital presence. Their 360° approach meant our branding, website, and ads worked in perfect harmony. Our pipeline value tripled in 90 days.',
        rating: 5,
        displayOrder: 1,
        status: 'PUBLISHED',
      },
      {
        clientName: 'Sarah Chen',
        clientRole: 'CMO',
        companyName: 'NovaTech Solutions',
        quote: 'Working with Scalemint felt like having an elite in-house team. The sprint velocity, design precision, and strategic thinking were unmatched. Our Google Ads ROAS jumped from 2.1x to 7.4x.',
        rating: 5,
        displayOrder: 2,
        status: 'PUBLISHED',
      },
      {
        clientName: 'Marcus Rivera',
        clientRole: 'Head of Growth',
        companyName: 'Lumina Health',
        quote: 'The video content they produced was cinematic quality. Our social engagement increased 5x and the AI UGC ads became our highest-performing creative assets ever.',
        rating: 5,
        displayOrder: 3,
        status: 'PUBLISHED',
      },
      {
        clientName: 'Emily Dawson',
        clientRole: 'Brand Director',
        companyName: 'Elevate Studios',
        quote: 'From brand identity to full website launch, Scalemint delivered everything in under 6 weeks. The craft and attention to detail rival agencies that charge 10x more.',
        rating: 5,
        displayOrder: 4,
        status: 'PUBLISHED',
      },
      {
        clientName: 'David Okoye',
        clientRole: 'Founder & CEO',
        companyName: 'Pulse Commerce',
        quote: 'The commercial impact was immediate. Scalemint built our entire digital ecosystem — branding, high-speed Next.js storefront, and performance funnels. Revenue grew 280% year over year.',
        rating: 5,
        displayOrder: 5,
        status: 'PUBLISHED',
      },
      {
        clientName: 'Elena Rostova',
        clientRole: 'VP of Marketing',
        companyName: 'Hyperion AI',
        quote: 'Scalemint is the only partner we trust with both creative and performance. Zero disconnect, lightning turnaround, and complete IP ownership. Absolutely indispensable.',
        rating: 5,
        displayOrder: 6,
        status: 'PUBLISHED',
      },
    ];

    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t });
    }
    console.log(`[Seed] Seeded ${testimonials.length} testimonials.`);
  } else {
    console.log(`[Seed] Testimonials already exist (${testCount}).`);
  }

  // 4. Seed Service-Specific FAQs
  const faqList = [
    // Branding
    {
      question: 'What assets and deliverables are included in a Scalemint branding sprint?',
      answer: 'You receive complete brand identity guidelines (primary/secondary logos, color architecture, typography pairings, iconography), vector master files (SVG, AI, PDF), social media kit, business collateral, and interactive Figma design system tokens.',
      category: 'branding-design',
      displayOrder: 1,
    },
    {
      question: 'Do we own 100% of the trademark and IP rights?',
      answer: 'Yes, unconditionally. Upon sprint completion and settlement, 100% intellectual property, trademark usage rights, and editable vector master files are transferred entirely to your organization.',
      category: 'branding-design',
      displayOrder: 2,
    },
    {
      question: 'How long does a full brand identity sprint take?',
      answer: 'Standard sprints are delivered in 2 to 4 weeks depending on the tier, featuring structured milestone reviews and direct asynchronous Slack collaboration.',
      category: 'branding-design',
      displayOrder: 3,
    },

    // Website Design
    {
      question: 'What technology stack do you use for website development?',
      answer: 'We build enterprise flagships using Next.js 14, React Server Components, TypeScript, TailwindCSS, and Framer Motion. This guarantees Google Core Web Vitals scores above 95 and sub-second page transitions.',
      category: 'website-design',
      displayOrder: 1,
    },
    {
      question: 'Can our internal team easily update content after launch?',
      answer: 'Absolutely. Every website comes integrated with an intuitive Admin CMS or headless CMS allowing non-technical team members to edit text, publish blogs, update media, and manage leads with zero coding.',
      category: 'website-design',
      displayOrder: 2,
    },
    {
      question: 'Do you handle domain setup, SSL, and Hostinger deployment?',
      answer: 'Yes. We handle end-to-end DevOps — configuring DNS records, automated SSL certificates, environment variables, database backups, and CDN caching on Hostinger or your cloud host of choice.',
      category: 'website-design',
      displayOrder: 3,
    },

    // Video Editing
    {
      question: 'What format of raw footage can we provide for video editing?',
      answer: 'We accept all raw formats including 4K/6K ProRes, RED, Sony S-Log, smartphone footage, screen recordings, and multi-cam audio. We provide a private high-speed cloud upload link.',
      category: 'video-editing',
      displayOrder: 1,
    },
    {
      question: 'What is your revision turnaround time for video drafts?',
      answer: 'First cuts are delivered within 48 to 72 hours. Revisions via Frame.io or timestamped feedback are typically turned around in 24 hours.',
      category: 'video-editing',
      displayOrder: 2,
    },

    // AI UGC
    {
      question: 'How do you create authentic UGC without expensive physical shoots?',
      answer: 'We combine vetted native creator talent with proprietary AI workflows for algorithmic hook mining, viral pacing, voice synthesis, and direct-response text animations.',
      category: 'ai-ugc-video-editing',
      displayOrder: 1,
    },
    {
      question: 'How many creative ad hooks do we test per campaign?',
      answer: 'Every sprint includes 5 to 15 unique hook variations per core offer, allowing you to rapidly test which visual and copy angle achieves the lowest Cost Per Acquisition (CPA).',
      category: 'ai-ugc-video-editing',
      displayOrder: 2,
    },

    // Digital Marketing
    {
      question: 'How do your digital marketing funnels integrate with our existing CRM?',
      answer: 'We connect directly to HubSpot, Klaviyo, ActiveCampaign, Make, or custom webhooks, ensuring all incoming leads are enriched, segmented, and automatically followed up with high-converting email sequences.',
      category: 'digital-marketing',
      displayOrder: 1,
    },
    {
      question: 'Do you focus on top-of-funnel acquisition or retention?',
      answer: 'We execute full-funnel growth — uniting cold acquisition, retargeting sequences, post-purchase retention flows, and automated SMS nurture to maximize Customer Lifetime Value (LTV).',
      category: 'digital-marketing',
      displayOrder: 2,
    },

    // Google Ads
    {
      question: 'How do you prevent ad spend waste in Google Ads?',
      answer: 'We employ rigorous negative keyword sculpturing, target high-intent commercial keywords, segment Performance Max asset groups, and implement server-side conversion tracking to train Google bidding algorithms on qualified revenue, not spam clicks.',
      category: 'google-ads',
      displayOrder: 1,
    },
    {
      question: 'Who owns the Google Ads ad account and conversion data?',
      answer: 'You retain 100% ownership of your Google Ads account, pixel history, conversion tracking, and analytics. We operate as authorized agency managers with zero account lock-in.',
      category: 'google-ads',
      displayOrder: 2,
    },
  ];

  for (const faq of faqList) {
    const existing = await prisma.faq.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.faq.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          displayOrder: faq.displayOrder,
          status: 'PUBLISHED',
        },
      });
    }
  }
  console.log(`[Seed] Checked and seeded service-specific FAQs.`);
  console.log('--- Extra Data Seeding Complete ---');
}

seedExtra()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
