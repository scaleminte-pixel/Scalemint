const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Ensuring all page sections and service configurations exist in database...');

  const sectionsToEnsure = [
    // 1. HOMEPAGE
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

    // 2. ABOUT US PAGE
    {
      page: 'about',
      sectionKey: 'hero',
      title: 'Architects of Distinction for Category-Defining Brands',
      subtitle: 'We bridge the costly disconnect between brand prestige, sub-second code engineering, and precision acquisition. One unified senior squad. Zero bloated overhead.',
      metadata: JSON.stringify({
        badge: 'THE SCALEMINT COLLECTIVE · WHO WE ARE',
        stats: [
          { value: '360°', label: 'Unified Discipline (Brand + Code + Media)', color: 'text-purple-400' },
          { value: '99+', label: 'Google Core Web Vitals Standard', color: 'text-blue-400' },
          { value: '100%', label: 'Direct IP & Source Code Ownership', color: 'text-emerald-400' },
          { value: '6 Wks', label: 'Average End-to-End Sprint Velocity', color: 'text-amber-400' },
        ],
      }),
    },
    {
      page: 'about',
      sectionKey: 'thesis',
      title: 'Why We Built Scalemint: The End of Fragmented Agency Bloat',
      subtitle: 'Most founders face an impossible choice: hire multiple specialized boutique agencies that never talk to each other, or pay exorbitant monthly retainers to legacy agencies where your work is handed off to inexperienced juniors.',
      content: 'The designer creates beautiful vectors that cannot convert. The developer writes code that ignores aesthetics. The media buyer blames the creative for lackluster ROAS. Everyone points fingers; your runway bleeds.\n\nScalemint was engineered as the antidote. We assemble a single, cross-functional squad of senior practitioners under one roof. Your visual identity, Next.js tech architecture, and customer acquisition engine work in synchronized harmony from day one.',
      metadata: JSON.stringify({
        badge: 'OUR FOUNDING THESIS',
        nonNegotiablesTitle: 'Our Studio Non-Negotiables',
        nonNegotiables: [
          {
            title: '100% IP & Source Handover',
            desc: 'You own every master file, Next.js repository, raw 4K footage master, and 3D asset. Zero hostage holding.',
            badge: 'Full Autonomy',
          },
          {
            title: 'Direct Senior Principal Access',
            desc: 'You communicate directly with the lead designers and engineers building your artifacts via private Slack and daily Loom video walk-throughs.',
            badge: 'Top 1% Craft',
          },
          {
            title: 'Zero Corporate Bloat',
            desc: 'No account managers, no layers of bureaucracy, and no endless status calls. Pure sprint execution focused on verified deliverables.',
            badge: 'Zero Bureaucracy',
          },
          {
            title: 'Ironclad Enterprise NDA',
            desc: 'Strict bilateral confidentiality agreements standard for all client engagements, protecting proprietary brand algorithms and market strategies.',
            badge: 'Protected IP',
          },
        ],
      }),
    },
    {
      page: 'about',
      sectionKey: 'process',
      title: 'How We Work: The 5-Stage Delivery Process',
      subtitle: 'Predictable milestones, asynchronous transparency, and disciplined sprint cadences with zero guesswork.',
      metadata: JSON.stringify({
        badge: 'STRUCTURED DELIVERY CADENCE',
        steps: [
          {
            number: '01',
            phase: 'Discovery & Strategic Diagnosis',
            title: 'Commercial Framing & Opportunity Mapping',
            desc: 'We audit your existing digital footprint, customer journey bottlenecks, and competitive blind spots to define measurable commercial goals.',
            artifacts: 'Sprint Architecture Manifesto · KPI Target Sheet · Competitor Gap Audit',
          },
          {
            number: '02',
            phase: 'Architecture & Visual Specs',
            title: 'Design Systems & Technical Foundation',
            desc: 'Before moving a single pixel or line of code, we define design tokens, user flows, copy hooks, and Next.js tech stack specifications.',
            artifacts: 'Figma Token Library · Interactive Wireframes · Tech Architecture Blueprint',
          },
          {
            number: '03',
            phase: 'High-Fidelity Sprint Execution',
            title: 'Rapid Production & Senior Craftsmanship',
            desc: 'Our senior craft specialists build in focused 2-to-4 week sprints with daily Loom video walk-throughs and direct async Slack collaboration.',
            artifacts: 'Production-Ready Vector Assets · Next.js Codebase · 4K Master Video Renders',
          },
          {
            number: '04',
            phase: 'Stress-Testing & Optimization',
            title: 'Performance QA & Security Hardening',
            desc: 'Cross-browser testing, Core Web Vitals optimization, mobile viewport audits, and tracking pixel verifications ensure flawless delivery.',
            artifacts: '95+ Lighthouse Audit · Clean Bug Register · SSL/Domain Configuration',
          },
          {
            number: '05',
            phase: 'Deployment & 100% IP Transfer',
            title: 'Turnkey Launch & Growth Scaling',
            desc: 'We deploy to your production servers, handover 100% full source rights, train your in-house squad, and ignite acquisition funnels.',
            artifacts: 'Full GitHub Repo Transfer · Figma Master Ownership · Post-Launch Monitoring',
          },
        ],
      }),
    },

    // 3. CONTACT US PAGE
    {
      page: 'contact',
      sectionKey: 'hero',
      title: "Let's Build Something Exceptional Together.",
      subtitle: 'Connect directly with our leadership. We review your growth objectives, define your sprint scope, and provide a fixed-price roadmap within 24 hours.',
      metadata: JSON.stringify({
        badge: 'DIRECT SENIOR PARTNER INQUIRY · ZERO RED TAPE',
        guarantees: [
          {
            title: '24-Hour Proposal Commitment',
            desc: 'No endless intake queues. A Senior Principal reviews your roadmap and provides a clear milestone scope within 1 business day.',
            color: 'text-amber-400',
          },
          {
            title: 'Standard Enterprise NDA',
            desc: 'All communications, proprietary codebase specs, and commercial strategies are strictly confidential under mutual NDA.',
            color: 'text-purple-400',
          },
          {
            title: '100% IP & Source Ownership',
            desc: 'You retain complete ownership of all Figma designs, Next.js code, vector assets, and media buy accounts from kickoff.',
            color: 'text-emerald-400',
          },
        ],
      }),
    },
  ];

  // Also seed default comparison matrix for each service slug
  const services = [
    'branding-design',
    'website-design',
    'video-editing',
    'ai-ugc-video-editing',
    'digital-marketing',
    'google-ads',
  ];

  for (const slug of services) {
    sectionsToEnsure.push({
      page: slug,
      sectionKey: 'comparison',
      title: 'Traditional Agencies vs Scalemint',
      subtitle: "See at a single glance why high-velocity founders switch from legacy agencies to Scalemint's agile production model.",
      metadata: JSON.stringify({
        badge: 'The Industry Comparison',
        items: [
          {
            category: 'Delivery Speed',
            traditional: {
              title: '3 to 6 Months Dragged Out',
              description: 'Slow discovery phases, endless committee meetings, and bureaucratic roadmaps.',
            },
            scalemint: {
              title: '7 to 14 Days Ultra-Fast Sprints',
              description: 'Laser-focused production sprints with verified milestones and rapid deployment to live production.',
              highlight: '10x Faster Launch',
            },
          },
          {
            category: 'Talent & Craft',
            traditional: {
              title: 'Junior Intern Delegation',
              description: 'Pitched by agency partners, then quietly handed off to inexperienced junior interns or freelancers.',
            },
            scalemint: {
              title: 'Direct Senior Leads Only',
              description: 'Direct execution by battle-tested top 1% senior designers & full-stack engineers.',
              highlight: 'Top 1% Craft',
            },
          },
          {
            category: 'Communication',
            traditional: {
              title: '5 Layers of Account Managers',
              description: 'Formal corporate emails, ticket queues, and 2-week calendar delays just to ask a quick question.',
            },
            scalemint: {
              title: 'Direct Private Slack & Loom',
              description: 'Dedicated private Slack channel with real-time maker access and daily async video updates.',
              highlight: 'Zero Bureaucracy',
            },
          },
          {
            category: 'IP & Ownership',
            traditional: {
              title: 'Files Locked Behind Retainers',
              description: 'Proprietary design files, raw source code, and assets held hostage behind ongoing monthly fees.',
            },
            scalemint: {
              title: '100% Full Source Rights',
              description: 'Complete source ownership transferred on day one — all Figma files, Git repos, 3D assets & 4K masters.',
              highlight: 'Full Autonomy',
            },
          },
          {
            category: 'Billing & Scope',
            traditional: {
              title: 'Opaque Hourly Billing',
              description: 'Vague hourly estimates with unexpected "out-of-scope" line items and escalating monthly invoices.',
            },
            scalemint: {
              title: 'Fixed, Transparent Sprint Pricing',
              description: '100% predictable sprint pricing with guaranteed deliverables, clear milestones & zero surprises.',
              highlight: 'Predictable ROI',
            },
          },
        ],
      }),
    });

    sectionsToEnsure.push({
      page: slug,
      sectionKey: 'process',
      title: 'Battle-Tested Delivery Cadence',
      subtitle: 'Structured sprints with transparent milestones, direct asynchronous communication, and zero bureaucratic bloat.',
      metadata: JSON.stringify({
        badge: 'Battle-Tested Delivery Cadence',
        steps: [
          {
            step: '01',
            title: 'Discipline Audit & Commercial Framing',
            desc: 'Exhaustive analysis of your existing footprint, competitor vulnerabilities, and high-leverage growth opportunities.',
            deliverable: 'Strategy Architecture Document',
          },
          {
            step: '02',
            title: 'System Architecture & Visual Tokens',
            desc: 'Defining core visual specs, component hierarchies, copy hooks, and production milestones before a single pixel moves.',
            deliverable: 'Interactive Prototype / Style Tiles',
          },
          {
            step: '03',
            title: 'Rapid High-Fidelity Sprints',
            desc: 'Senior craft directors execute dedicated production cycles with daily Loom walk-throughs and private Slack collaboration.',
            deliverable: 'Production Candidates & Polish',
          },
          {
            step: '04',
            title: 'Rigorous QA & Source Handover',
            desc: 'Final stress-testing, cross-platform validation, 100% intellectual property transfer, and post-launch performance calibration.',
            deliverable: 'Complete Master Files & Deployment',
          },
        ],
      }),
    });
  }

  for (const s of sectionsToEnsure) {
    const existing = await prisma.pageSection.findUnique({
      where: {
        page_sectionKey: {
          page: s.page,
          sectionKey: s.sectionKey,
        },
      },
    });

    if (!existing) {
      console.log(`Creating section: [${s.page}] -> ${s.sectionKey}...`);
      await prisma.pageSection.create({ data: s });
    } else if (!existing.metadata && s.metadata) {
      console.log(`Updating missing metadata for [${s.page}] -> ${s.sectionKey}...`);
      await prisma.pageSection.update({
        where: { id: existing.id },
        data: { metadata: s.metadata },
      });
    }
  }

  console.log('--- All Page Sections Successfully Verified & Synced ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
