import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function importBusinessGrowthPackages() {
  console.log('--- Starting Business Growth Packages Import ---');

  // 1. Ensure the parent Service "Business Growth Packages" exists
  const serviceSlug = 'business-growth-packages';
  const serviceName = 'Business Growth Packages';

  let service = await prisma.service.findUnique({
    where: { slug: serviceSlug },
  });

  if (!service) {
    service = await prisma.service.create({
      data: {
        slug: serviceSlug,
        name: serviceName,
        tagline: 'Website + Client Management + Reels + Social Media',
        shortDesc: 'Complete turnkey growth engine for existing businesses: custom conversion website, dedicated client CRM, high-retention Reels, and full-service social management.',
        fullDesc: 'A consolidated, end-to-end digital infrastructure designed to build authority, capture inquiries, manage sales pipelines, and scale client acquisition with predictable monthly velocity.',
        bestFor: 'Established businesses looking for consolidated, high-ROI digital dominance without managing multiple disjointed agencies.',
        iconName: 'sparkles',
        startingPrice: '$990 / mo',
        status: 'PUBLISHED',
        displayOrder: 0,
        whatIsIncluded: JSON.stringify([
          'Turnkey Conversion Website (Brand-aligned & Mobile Optimized)',
          'High-Performance Free Domain & Cloud Hosting',
          'Integrated Client Management & Follow-up Pipeline',
          'Monthly Cinematic Reels Video Production (Up to 30s each)',
          'End-to-End Social Media Management & Scheduled Distribution',
          'Dedicated Analytics, Pixel Telemetry & Performance Reviews'
        ]),
        benefits: JSON.stringify([
          'Consolidated stack: No disjointed freelancers or multiple retainers',
          'Clear sales pipeline: Never lose an incoming lead or follow-up again',
          'Organic social dominance with high-retention short-form video',
          '100% Unrestricted IP Handover & full CMS admin control'
        ])
      }
    });
    console.log(`[Import] Created parent Service: ${service.name} (${service.id})`);
  } else {
    console.log(`[Import] Found existing parent Service: ${service.name} (${service.id})`);
  }

  // 2. Hide old 6 services so they do not show up on public site, but preserve records
  const oldSlugs = [
    'branding-design',
    'website-design',
    'video-editing',
    'ai-ugc-video-editing',
    'digital-marketing',
    'google-ads'
  ];

  await prisma.service.updateMany({
    where: { slug: { in: oldSlugs } },
    data: { status: 'HIDDEN' }
  });
  console.log('[Import] Set legacy 6 services to HIDDEN.');

  // 3. Define the 3 Spreadsheet Packages with full fidelity deliverables
  const growthPackages = [
    {
      name: 'Business Boost',
      bestFor: 'Existing businesses wanting a reliable conversion web presence, basic lead tracking, and active social media presence.',
      price: '$990 / mo',
      currency: 'USD',
      billingType: 'MONTHLY',
      timeline: '2-3 Weeks Setup + Monthly Retainer',
      isPopular: false,
      badge: 'Starter Growth',
      guaranteeText: 'Free Domain & Hosting Setup Included',
      ctaText: 'Get Started with Business Boost',
      displayOrder: 1,
      status: 'PUBLISHED',
      deliverables: [
        'Website & Design: Up to 5 pages with brand-aligned layout',
        'Domain & Hosting: Free setup & hosting',
        'Content Management: Fixed content setup (managed updates)',
        'Client Directory: Client name, phone, email & company with search & notes',
        'Lead Tracking: New & Contacted lead pipeline stages',
        'Team Access: Administrator access for full oversight',
        'CRM Reporting: Basic client & inquiry summary totals',
        'Reels Video: 4 high-retention Reels monthly (up to 30 sec each)',
        'Social Platforms: 1 managed platform with 8 posts monthly',
        'Story Designs: 4 branded stories per month',
        'Strategy & Reporting: Monthly performance report & analytics overview',
        'Website Inclusions: Responsive layout, WhatsApp integration, technical SEO & Meta Pixel'
      ]
    },
    {
      name: 'Growth Plus',
      bestFor: 'Growing businesses requiring CMS editing flexibility, client assignment, dynamic blog publishing, and multi-channel social management.',
      price: '$1,990 / mo',
      currency: 'USD',
      billingType: 'MONTHLY',
      timeline: '3-4 Weeks Setup + Monthly Retainer',
      isPopular: true,
      badge: 'Most Popular',
      guaranteeText: 'Free Domain & Hosting Setup Included',
      ctaText: 'Get Started with Growth Plus',
      displayOrder: 2,
      status: 'PUBLISHED',
      deliverables: [
        'Website & Design: Up to 10 pages with custom sections & tailored layout',
        'Domain & Hosting: Free setup & hosting',
        'Content Management: Admin access to add / edit designated content & products',
        'Blog & Landing Pages: Dynamic blog engine + 1 dedicated conversion landing page',
        'Client Management: Client & Follow-up Manager with status pipeline (New, Contacted, Interested, Confirmed, Lost)',
        'Follow-up Reminders: Automated schedule alerts for pending leads',
        'Team Access & History: Admin & team client assignment with communication log & history',
        'CRM Export: CSV export for lead data and follow-up analytics',
        'Reels Video: 8 high-retention Reels monthly (up to 30 sec each)',
        'Social Platforms: 2 managed platforms with 12 posts monthly (including 2 carousels)',
        'Story Designs: 8 branded stories per month',
        'Community Management: Once daily comment & inbox replies on business days',
        'Strategy & Review: Detailed monthly growth report + 1 strategic alignment meeting'
      ]
    },
    {
      name: 'Scale Pro',
      bestFor: 'High-velocity brands requiring advanced UI animations, comprehensive sales pipeline, invoicing, multi-channel social & daily engagement.',
      price: '$2,990 / mo',
      currency: 'USD',
      billingType: 'MONTHLY',
      timeline: '4 Weeks Setup + Monthly Retainer',
      isPopular: false,
      badge: 'Enterprise Velocity',
      guaranteeText: 'Free Domain & Hosting Setup Included',
      ctaText: 'Get Started with Scale Pro',
      displayOrder: 3,
      status: 'PUBLISHED',
      deliverables: [
        'Website & Design: Up to 15 pages with bespoke UI design & micro-animations',
        'Domain & Hosting: Free setup & premium cloud hosting',
        'Catalog Management: Full product/content CMS with categories, search & multi-tier filters',
        'Blog & Funnels: Categorized blog with search + 3 targeted conversion landing pages',
        'Sales & Client Manager: Custom sales stages, deal values & follow-up reminders',
        'Invoicing & Financials: Payment tracking records & branded PDF invoice generation',
        'Multi-Tier Team Access: Admin, Manager & Team permissions with client work history',
        'Advanced Reporting: Sales, payment & team performance analytics + CSV data exports',
        'Reels Video: 12 high-retention Reels monthly (up to 30 sec each)',
        'Social Platforms: 3 managed platforms with 16 posts monthly (including 4 carousels)',
        'Story Designs: 12 branded stories per month',
        'Community Management: Twice daily comment & inbox replies on business days',
        'Strategy & Review: Comprehensive monthly report, roadmap & 2 executive strategy meetings'
      ]
    }
  ];

  // 4. Upsert each package idempotently
  for (const pkg of growthPackages) {
    const existing = await prisma.servicePackage.findFirst({
      where: {
        serviceId: service.id,
        name: pkg.name
      }
    });

    if (existing) {
      console.log(`[Import] Package "${pkg.name}" already exists (${existing.id}). Skipping to preserve any admin modifications.`);
    } else {
      const created = await prisma.servicePackage.create({
        data: {
          serviceId: service.id,
          name: pkg.name,
          bestFor: pkg.bestFor,
          price: pkg.price,
          currency: pkg.currency,
          billingType: pkg.billingType,
          timeline: pkg.timeline,
          isPopular: pkg.isPopular,
          badge: pkg.badge,
          guaranteeText: pkg.guaranteeText,
          ctaText: pkg.ctaText,
          ctaLink: '#contact',
          displayOrder: pkg.displayOrder,
          status: pkg.status,
          deliverables: JSON.stringify(pkg.deliverables)
        }
      });
      console.log(`[Import] Created package "${created.name}" (${created.id}) with price ${created.price}`);
    }
  }

  console.log('--- Business Growth Packages Import Completed Successfully ---');
}

if (process.argv[1]?.endsWith('import-growth-packages.mjs')) {
  importBusinessGrowthPackages()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Import Error]:', err);
      process.exit(1);
    });
}
