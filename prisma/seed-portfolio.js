const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPortfolio() {
  console.log('--- Seeding 6 Distinct Showcase Projects Per Service (36 Total) ---');

  const categories = [
    { name: 'Branding & Visual Identity', slug: 'branding' },
    { name: 'Websites & Digital Flagships', slug: 'websites' },
    { name: 'Cinematic Video Production', slug: 'video-editing' },
    { name: 'AI UGC & Viral Ad Hooks', slug: 'ai-ugc' },
    { name: 'Growth Marketing & Funnels', slug: 'digital-marketing' },
    { name: 'High-Intent Google Ads & PPC', slug: 'google-ads' },
  ];

  for (const cat of categories) {
    await prisma.portfolioCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
  }

  const catMap = {};
  const dbCats = await prisma.portfolioCategory.findMany();
  dbCats.forEach(c => { catMap[c.slug] = c.id; });

  await prisma.portfolioProject.deleteMany();

  const brandingProjects = [
    { slug: 'zenflow-ai-brand', title: 'ZenFlow Systems Architecture', clientName: 'ZenFlow AI', categoryId: catMap['branding'] },
    { slug: 'hyperion-stealth-rebrand', title: 'Hyperion DeepTech Identity', clientName: 'Hyperion Technologies', categoryId: catMap['branding'] },
    { slug: 'lumina-luxury-brand', title: 'Lumina Aesthetic Identity', clientName: 'Lumina Global', categoryId: catMap['branding'] },
    { slug: 'apex-capital-brand', title: 'Apex Global Brand Guidelines', clientName: 'Apex Capital', categoryId: catMap['branding'] },
    { slug: 'novatech-vector-system', title: 'NovaTech Geometric Mark', clientName: 'NovaTech', categoryId: catMap['branding'] },
    { slug: 'vantage-token-system', title: 'Vantage Mobile Brand Tokens', clientName: 'Vantage Group', categoryId: catMap['branding'] },
  ];

  const websiteProjects = [
    { slug: 'apex-ventures-flagship', title: 'Apex Ventures Next.js 14 Flagship', clientName: 'Apex Capital', categoryId: catMap['websites'] },
    { slug: 'pulse-commerce-storefront', title: 'Pulse Headless D2C Storefront', clientName: 'Pulse D2C', categoryId: catMap['websites'] },
    { slug: 'zenflow-saas-platform', title: 'ZenFlow AI Cloud Platform', clientName: 'ZenFlow Inc.', categoryId: catMap['websites'] },
    { slug: 'horizon-cloud-portal', title: 'Horizon Enterprise Web Portal', clientName: 'Horizon Cloud', categoryId: catMap['websites'] },
    { slug: 'elevate-studios-web', title: 'Elevate Studios Creative Hub', clientName: 'Elevate Studios', categoryId: catMap['websites'] },
    { slug: 'cloudscale-enterprise-web', title: 'CloudScale Technical Documentation', clientName: 'CloudScale', categoryId: catMap['websites'] },
  ];

  const videoProjects = [
    { slug: 'lumina-health-film', title: 'Lumina Health 4K Brand Anthem', clientName: 'Lumina Health', categoryId: catMap['video-editing'] },
    { slug: 'elevate-docuseries', title: 'Elevate Behind The Craft Docuseries', clientName: 'Elevate Media', categoryId: catMap['video-editing'] },
    { slug: 'apex-investor-reel', title: 'Apex Ventures Annual Summit Reel', clientName: 'Apex Ventures', categoryId: catMap['video-editing'] },
    { slug: 'zenflow-product-demo', title: 'ZenFlow 3D Product Teaser', clientName: 'ZenFlow AI', categoryId: catMap['video-editing'] },
    { slug: 'hyperion-quantum-cut', title: 'Hyperion Quantum Launch Film', clientName: 'Hyperion DeepTech', categoryId: catMap['video-editing'] },
    { slug: 'novatech-brand-commercial', title: 'NovaTech Broadcast Commercial', clientName: 'NovaTech', categoryId: catMap['video-editing'] },
  ];

  const aiUgcProjects = [
    { slug: 'novatech-viral-hooks', title: 'NovaTech Viral TikTok Hook Sprints', clientName: 'NovaTech Global', categoryId: catMap['ai-ugc'] },
    { slug: 'vantage-app-ugc', title: 'Vantage App Store Creator Ads', clientName: 'Vantage Mobile', categoryId: catMap['ai-ugc'] },
    { slug: 'pulse-d2c-reels', title: 'Pulse eCommerce Dynamic UGC Reels', clientName: 'Pulse Commerce', categoryId: catMap['ai-ugc'] },
    { slug: 'lumina-lifestyle-hooks', title: 'Lumina Wellness Creator Sprints', clientName: 'Lumina Care', categoryId: catMap['ai-ugc'] },
    { slug: 'zenflow-tutorial-ugc', title: 'ZenFlow Interactive TikTok Demos', clientName: 'ZenFlow AI', categoryId: catMap['ai-ugc'] },
    { slug: 'artisan-unboxing-ugc', title: 'Artisan Heritage Unboxing Series', clientName: 'Artisan Co.', categoryId: catMap['ai-ugc'] },
  ];

  const marketingProjects = [
    { slug: 'horizon-omnichannel-growth', title: 'Horizon B2B Enterprise Funnel Engine', clientName: 'Horizon SaaS', categoryId: catMap['digital-marketing'] },
    { slug: 'artisan-retention-lifecycle', title: 'Artisan Omnichannel Retention Matrix', clientName: 'Artisan Brands', categoryId: catMap['digital-marketing'] },
    { slug: 'pulse-d2c-scale-engine', title: 'Pulse High-Velocity Acquisition Funnel', clientName: 'Pulse D2C', categoryId: catMap['digital-marketing'] },
    { slug: 'apex-dealflow-engine', title: 'Apex Founder Deal-Flow Automation', clientName: 'Apex Capital', categoryId: catMap['digital-marketing'] },
    { slug: 'zenflow-demo-funnel', title: 'ZenFlow Self-Serve PLG Funnel', clientName: 'ZenFlow Inc.', categoryId: catMap['digital-marketing'] },
    { slug: 'novatech-capi-attribution', title: 'NovaTech Server-Side Attribution Stack', clientName: 'NovaTech Global', categoryId: catMap['digital-marketing'] },
  ];

  const googleAdsProjects = [
    { slug: 'cloudscale-pmax-defense', title: 'CloudScale PMax & Intent Search Shield', clientName: 'CloudScale Tech', categoryId: catMap['google-ads'] },
    { slug: 'nexus-legal-high-intent', title: 'Nexus Corporate Counsel High-Intent PPC', clientName: 'Nexus Legal', categoryId: catMap['google-ads'] },
    { slug: 'horizon-b2b-search', title: 'Horizon Cloud Commercial Search Capture', clientName: 'Horizon Cloud', categoryId: catMap['google-ads'] },
    { slug: 'pulse-shopping-pmax', title: 'Pulse eCommerce Google Shopping Fleet', clientName: 'Pulse D2C', categoryId: catMap['google-ads'] },
    { slug: 'apex-venture-search', title: 'Apex Global Venture Search Presence', clientName: 'Apex Ventures', categoryId: catMap['google-ads'] },
    { slug: 'zenflow-ai-intent', title: 'ZenFlow AI Exact-Match Search Defense', clientName: 'ZenFlow AI', categoryId: catMap['google-ads'] },
  ];

  const allProjects = [
    ...brandingProjects,
    ...websiteProjects,
    ...videoProjects,
    ...aiUgcProjects,
    ...marketingProjects,
    ...googleAdsProjects,
  ];

  for (let i = 0; i < allProjects.length; i++) {
    const p = allProjects[i];
    await prisma.portfolioProject.create({
      data: {
        slug: p.slug,
        title: p.title,
        clientName: p.clientName,
        shortDesc: `${p.title} engineered by Scalemint for category leadership.`,
        categoryId: p.categoryId,
        displayOrder: i + 1,
        status: 'PUBLISHED',
      },
    });
  }

  console.log(`Successfully seeded ${allProjects.length} portfolio projects across 6 disciplines (6 each)!`);
}

seedPortfolio()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
