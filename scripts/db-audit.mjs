import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function audit() {
  const [services, blogs, portfolios, settings, calc, testimonials, clients, faqs, legalPages] = await Promise.all([
    db.service.findMany({ include: { packages: true }, orderBy: { displayOrder: 'asc' } }),
    db.blogPost.findMany({ orderBy: [{ displayOrder: 'asc' }, { publishedAt: 'desc' }] }),
    db.portfolioProject.findMany({ orderBy: { displayOrder: 'asc' }, include: { category: true } }),
    db.siteSettings.findUnique({ where: { id: 'global' } }),
    db.calculatorConfig.findUnique({ where: { id: 'global_calculator' } }),
    db.testimonial.findMany({ orderBy: { displayOrder: 'asc' } }),
    db.clientBrand.findMany({ orderBy: { displayOrder: 'asc' } }),
    db.faq.findMany({ orderBy: { displayOrder: 'asc' } }),
    db.legalPage.findMany(),
  ]);

  console.log('\n=== DATABASE STATE AUDIT ===\n');

  console.log(`SERVICES (${services.length}):`);
  services.forEach(s => {
    const pkgs = s.packages || [];
    console.log(`  [${s.status}] "${s.name}" (/${s.slug}) — ${pkgs.length} packages, coverMedia: ${s.coverMediaId ? 'SET' : 'NONE'}`);
  });

  console.log(`\nBLOG POSTS (${blogs.length}):`);
  blogs.forEach(b => {
    console.log(`  [${b.status}] "${b.title}" — category: "${b.category}", cover: ${b.coverMediaId || b.coverUrl ? 'SET' : 'NONE'}`);
  });

  console.log(`\nPORTFOLIO PROJECTS (${portfolios.length}):`);
  portfolios.forEach(p => {
    console.log(`  [${p.status}] "${p.title}" — cat: "${p.category?.name || 'UNCATEGORIZED'}", youtube: ${p.youtubeUrl ? 'YES' : 'NO'}, cover: ${p.coverMediaId ? 'SET' : 'NONE'}`);
  });

  console.log('\nSITE SETTINGS:');
  console.log(`  siteName: "${settings?.siteName}", tagline: "${settings?.tagline}"`);
  console.log(`  logo: ${settings?.logoUrl ? `"${settings.logoUrl.substring(0,50)}"` : 'NOT SET'}`);
  console.log(`  favicon: ${settings?.faviconUrl ? 'SET' : 'NOT SET'}`);
  console.log(`  contact: ${settings?.contactEmail}, phone: ${settings?.contactPhone}`);

  console.log('\nCALCULATOR CONFIG:');
  if (calc) {
    const tiers = calc.tierPresets ? JSON.parse(calc.tierPresets) : [];
    const addons = calc.addOnOptions ? JSON.parse(calc.addOnOptions) : [];
    console.log(`  basePrice: ${calc.basePrice}, currency: ${calc.currency}`);
    console.log(`  tiers: ${tiers.length} | addons: ${addons.length}`);
    if (tiers.length > 0) tiers.forEach(t => console.log(`    tier: "${t.name}" — $${t.basePrice}`));
  } else {
    console.log('  MISSING — No calculator config in DB!');
  }

  console.log(`\nTESTIMONIALS (${testimonials.length}):`);
  testimonials.forEach(t => console.log(`  [${t.status}] "${t.clientName}" — photo: ${t.photoMediaId ? 'SET' : 'NONE'}`));

  console.log(`\nCLIENT BRANDS (${clients.length}):`);
  clients.forEach(c => console.log(`  [${c.status}] "${c.name}" — logo: ${c.logoMediaId ? 'SET' : 'NONE'}`));

  console.log(`\nFAQS (${faqs.length}):`);
  if (faqs.length > 0) console.log('  OK — FAQs present');

  console.log(`\nLEGAL PAGES (${legalPages.length}):`);
  legalPages.forEach(l => console.log(`  [${l.status}] "${l.title}" (/${l.slug})`));

  console.log('\n=== END AUDIT ===\n');
  await db.$disconnect();
}

audit().catch(e => { console.error('AUDIT ERROR:', e.message); process.exit(1); });
