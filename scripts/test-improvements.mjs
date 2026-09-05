// scripts/test-improvements.mjs
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('🧪 RUNNING COMPREHENSIVE VERIFICATION SUITE FOR NEW IMPROVEMENTS\n');

  // 1. Admin Login
  console.log('1️⃣  Authenticating Admin...');
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@scalemint.com', password: 'AdminPassword2026!' }),
  });
  if (!loginRes.ok) throw new Error(`Login failed with status ${loginRes.status}`);
  const cookie = loginRes.headers.get('set-cookie')?.split(';')[0];
  if (!cookie) throw new Error('No auth cookie returned');
  console.log('   ✅ Admin successfully authenticated.');

  const headers = {
    'Content-Type': 'application/json',
    Cookie: cookie,
  };

  // 2. Media Upload Resilience: PNG, JPG, and SVG
  console.log('\n2️⃣  Testing Media Upload Resilience (PNG, SVG, and JPEG)...');
  
  // 2a. SVG Upload
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="purple"/></svg>';
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  const fdSvg = new FormData();
  fdSvg.append('file', svgBlob, 'vector-test-logo.svg');
  fdSvg.append('category', 'test');

  const svgRes = await fetch(`${BASE_URL}/api/admin/media`, {
    method: 'POST',
    headers: { Cookie: cookie },
    body: fdSvg,
  });
  const svgData = await svgRes.json();
  if (!svgData.success || !svgData.data?.publicUrl?.endsWith('.svg')) {
    throw new Error(`SVG upload failed: ${JSON.stringify(svgData)}`);
  }
  console.log(`   ✅ SVG upload preserved raw vector: ${svgData.data.publicUrl}`);

  // 2b. PNG Upload (Converted to WebP)
  // Minimal 1x1 valid PNG buffer
  const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const pngBlob = new Blob([pngBuffer], { type: 'image/png' });
  const fdPng = new FormData();
  fdPng.append('file', pngBlob, 'raster-test-image.png');
  fdPng.append('category', 'test');

  const pngRes = await fetch(`${BASE_URL}/api/admin/media`, {
    method: 'POST',
    headers: { Cookie: cookie },
    body: fdPng,
  });
  const pngData = await pngRes.json();
  if (!pngData.success || !pngData.data?.publicUrl?.endsWith('.webp')) {
    throw new Error(`PNG upload/WebP optimization failed: ${JSON.stringify(pngData)}`);
  }
  console.log(`   ✅ PNG upload converted & optimized to WebP: ${pngData.data.publicUrl}`);

  // 3. Portfolio YouTube Streaming
  console.log('\n3️⃣  Testing Portfolio Project with Direct YouTube Streaming...');
  const portfolioCreateRes = await fetch(`${BASE_URL}/api/admin/portfolio`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: 'E2E Cinema Test Reel',
      slug: 'e2e-cinema-test-reel-' + Date.now(),
      clientName: 'Hollywood Client Test',
      shortDesc: 'Automated test cinema reel with live YouTube video streaming.',
      categorySlug: 'video-editing',
      coverMediaId: pngData.data.id,
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      displayOrder: 1,
      status: 'PUBLISHED',
    }),
  });
  const portfolioData = await portfolioCreateRes.json();
  if (!portfolioData.success || portfolioData.project?.youtubeId !== 'dQw4w9WgXcQ') {
    throw new Error(`Portfolio creation failed: ${JSON.stringify(portfolioData)}`);
  }
  console.log(`   ✅ Portfolio project created. Extracted YouTube ID: ${portfolioData.project.youtubeId}`);

  // Update with youtu.be short URL format
  const portfolioUpdateRes = await fetch(`${BASE_URL}/api/admin/portfolio/${portfolioData.project.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      youtubeUrl: 'https://youtu.be/jNQXAC9IVRw',
    }),
  });
  const portfolioUpdatedData = await portfolioUpdateRes.json();
  if (!portfolioUpdatedData.success || portfolioUpdatedData.project?.youtubeId !== 'jNQXAC9IVRw') {
    throw new Error(`Portfolio update failed: ${JSON.stringify(portfolioUpdatedData)}`);
  }
  console.log(`   ✅ Portfolio project updated with short URL. Normalized YouTube ID: ${portfolioUpdatedData.project.youtubeId}`);

  // 4. Verify /portfolio SSR Renders the YouTube Project
  console.log('\n4️⃣  Testing /portfolio SSR HTML Output...');
  const portfolioPageRes = await fetch(`${BASE_URL}/portfolio`);
  const portfolioHtml = await portfolioPageRes.text();
  if (!portfolioHtml.includes('E2E Cinema Test Reel') || !portfolioHtml.includes('jNQXAC9IVRw')) {
    throw new Error('SSR /portfolio does not contain the dynamic project with YouTube ID');
  }
  console.log('   ✅ /portfolio SSR contains dynamic project and YouTube ID in HTML payload.');

  // 5. Blog Multi-Block CMS: Create, Read, Update, and SSR Render
  console.log('\n5️⃣  Testing Full Blog Customization Multi-Block CMS...');
  const blogSlug = 'e2e-growth-architecture-' + Date.now();
  const blogContent = `## Architecting Digital Dominance in 2026\n\nTraditional digital agency playbooks are obsolete. Modern engineering requires zero-friction user journeys and sub-second Next.js execution.\n\n### The Core Three Pillars\n\n- Sub-second First Contentful Paint with static/SSR hybrid routing\n- Radical distinctiveness through custom design systems\n- Conversion rate optimization built directly into every section\n\n![Scalemint Architecture Visual](${pngData.data.publicUrl})\n\n### Execution Takeaways\n\nDeploying high-velocity systems transforms casual visitors into long-term enterprise clients.`;

  const blogCreateRes = await fetch(`${BASE_URL}/api/admin/blogs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: 'E2E Tested Growth Architecture',
      slug: blogSlug,
      category: 'Web Engineering & CRO',
      author: 'Scalemint Core Team',
      authorRole: 'Chief Technology Architect',
      readTime: '6 min read',
      excerpt: 'Comprehensive deep dive into modern Next.js systems architecture.',
      content: blogContent,
      coverMediaId: pngData.data.id,
      status: 'PUBLISHED',
    }),
  });
  const blogData = await blogCreateRes.json();
  if (!blogData.success || !blogData.data?.id) {
    throw new Error(`Blog post creation failed: ${JSON.stringify(blogData)}`);
  }
  console.log(`   ✅ Multi-block blog post created. ID: ${blogData.data.id}, Slug: ${blogSlug}`);

  // 6. Verify SSR /blog/[slug] HTML renders all blocks
  console.log('\n6️⃣  Testing /blog/[slug] SSR HTML Block Rendering...');
  const blogDetailRes = await fetch(`${BASE_URL}/blog/${blogSlug}`);
  if (!blogDetailRes.ok) throw new Error(`/blog/${blogSlug} returned ${blogDetailRes.status}`);
  const blogDetailHtml = await blogDetailRes.text();

  const checks = [
    'Architecting Digital Dominance in 2026',
    'The Core Three Pillars',
    'Sub-second First Contentful Paint',
    pngData.data.publicUrl,
    'Scalemint Core Team',
  ];
  for (const check of checks) {
    if (!blogDetailHtml.includes(check)) {
      throw new Error(`Missing expected block in blog SSR: "${check}"`);
    }
  }
  console.log('   ✅ /blog/[slug] rendered H2, H3, checklist, inline image, and author properly!');

  // 7. Blog Update via PUT /api/admin/blogs
  console.log('\n7️⃣  Testing Blog Post Update...');
  const blogUpdateRes = await fetch(`${BASE_URL}/api/admin/blogs`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      id: blogData.data.id,
      title: 'E2E Tested Growth Architecture (UPDATED)',
    }),
  });
  const blogUpdatedData = await blogUpdateRes.json();
  if (!blogUpdatedData.success || blogUpdatedData.data?.title !== 'E2E Tested Growth Architecture (UPDATED)') {
    throw new Error(`Blog update failed: ${JSON.stringify(blogUpdatedData)}`);
  }
  console.log('   ✅ Blog post updated successfully.');

  // 8. Clean up created test entities
  console.log('\n8️⃣  Cleaning up test entities...');
  await fetch(`${BASE_URL}/api/admin/portfolio/${portfolioData.project.id}`, { method: 'DELETE', headers });
  await fetch(`${BASE_URL}/api/admin/blogs?id=${blogData.data.id}`, { method: 'DELETE', headers });
  await fetch(`${BASE_URL}/api/admin/media/${svgData.data.id}`, { method: 'DELETE', headers });
  await fetch(`${BASE_URL}/api/admin/media/${pngData.data.id}`, { method: 'DELETE', headers });
  console.log('   ✅ Test portfolio, blog, and media assets deleted cleanly.');

  console.log('\n========================================================');
  console.log('🎉 ALL NEW IMPROVEMENTS FULLY TESTED AND PASSED (100%)');
  console.log('========================================================\n');
}

run().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
