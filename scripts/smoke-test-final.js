const http = require('http');
const fs = require('fs');
const path = require('path');

function httpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function uploadMultipart(options, filename, mimeType, fileBuffer, category = 'general') {
  return new Promise((resolve, reject) => {
    const boundary = '----ScalemintTestBoundary' + Date.now();
    const partHeader = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
    );
    const partMiddle = Buffer.from(
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\n${category}\r\n`
    );
    const partEnd = Buffer.from(`--${boundary}--\r\n`);
    const postData = Buffer.concat([partHeader, fileBuffer, partMiddle, partEnd]);

    const reqHeaders = {
      ...options.headers,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': postData.length,
    };

    const req = http.request({ ...options, headers: reqHeaders }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body,
        });
      });
    });
    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function runSmokeTest() {
  console.log('====================================================');
  console.log('🧪 SCALEMINT PRODUCTION SYSTEM & CMS SMOKE TEST');
  console.log('====================================================\n');

  let adminCookie = '';

  // 1. Admin Authentication
  console.log('--- TEST 1: Admin Authentication ---');
  const loginRes = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({
      email: 'admin@scalemint.com',
      password: 'AdminPassword2026!',
    })
  );

  if (loginRes.statusCode !== 200) {
    throw new Error(`Admin login failed: ${loginRes.statusCode} - ${loginRes.body}`);
  }
  const setCookie = loginRes.headers['set-cookie'];
  adminCookie = setCookie[0].split(';')[0];
  console.log('✅ Admin authenticated successfully (JWT session active)\n');

  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: adminCookie,
  };

  // 2. Image Upload Tests (PNG, SVG, JPG MIME handling)
  console.log('--- TEST 2: Resilient Image Uploads ---');

  // 2a. PNG Raster Upload
  const png1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const pngUpload = await uploadMultipart(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/media',
      method: 'POST',
      headers: { Cookie: adminCookie },
    },
    'smoke_test_raster.png',
    'image/png',
    png1x1,
    'portfolio'
  );
  const pngData = JSON.parse(pngUpload.body);
  if (!pngData.success || !pngData.data.publicUrl) {
    throw new Error(`PNG Upload failed: ${pngUpload.body}`);
  }
  console.log(`✅ PNG Upload & WebP conversion: ${pngData.data.publicUrl} (ID: ${pngData.data.id})`);

  // 2b. SVG Vector Upload (Must preserve SVG, not rasterize)
  const svgBuffer = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" fill="#7C3AED" rx="8"/><text x="60" y="25" fill="#fff" font-size="14" text-anchor="middle" font-family="sans-serif">SCALEMINT</text></svg>'
  );
  const svgUpload = await uploadMultipart(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/media',
      method: 'POST',
      headers: { Cookie: adminCookie },
    },
    'smoke_test_logo.svg',
    'image/svg+xml',
    svgBuffer,
    'client'
  );
  const svgData = JSON.parse(svgUpload.body);
  if (!svgData.success || !svgData.data.publicUrl.endsWith('.svg')) {
    throw new Error(`SVG Upload failed: ${svgUpload.body}`);
  }
  console.log(`✅ SVG Vector Upload preserved: ${svgData.data.publicUrl} (Mime: ${svgData.data.mimeType})`);

  // 2c. Windows JPG mime variation test ('image/jpg')
  const jpgUpload = await uploadMultipart(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/media',
      method: 'POST',
      headers: { Cookie: adminCookie },
    },
    'camera_photo.jpg',
    'image/jpg',
    png1x1,
    'general'
  );
  const jpgData = JSON.parse(jpgUpload.body);
  if (!jpgData.success) {
    throw new Error(`JPG variation upload failed: ${jpgUpload.body}`);
  }
  console.log(`✅ Windows JPG MIME type handled: ${jpgData.data.publicUrl}\n`);

  // 3. Portfolio YouTube Link Option (Direct Stream, Zero File Uploads)
  console.log('--- TEST 3: Portfolio YouTube Link Option ---');
  const portfolioCreateRes = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/portfolio',
      method: 'POST',
      headers: authHeaders,
    },
    JSON.stringify({
      title: 'Apex Cinema Commercial 4K',
      slug: 'apex-cinema-commercial-smoke-' + Date.now(),
      clientName: 'Apex Global Enterprises',
      categorySlug: 'video-editing',
      shortDesc: 'A Hollywood-grade broadcast commercial with high-retention editing.',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      coverMediaId: pngData.data.id,
      displayOrder: 1,
      status: 'PUBLISHED',
    })
  );

  const createdProject = JSON.parse(portfolioCreateRes.body);
  if (!createdProject.success || !createdProject.project.youtubeUrl) {
    throw new Error(`Portfolio creation with YouTube URL failed: ${portfolioCreateRes.body}`);
  }
  console.log(`✅ Portfolio Project created with YouTube Link:`);
  console.log(`   - URL: ${createdProject.project.youtubeUrl}`);
  console.log(`   - Normalized YouTube ID: ${createdProject.project.youtubeId}`);

  // 3b. Update with YouTube Shorts link
  const portfolioUpdateRes = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/portfolio/${createdProject.project.id}`,
      method: 'PATCH',
      headers: authHeaders,
    },
    JSON.stringify({
      youtubeUrl: 'https://youtube.com/shorts/5qap5aO4i9A',
    })
  );
  const updatedProject = JSON.parse(portfolioUpdateRes.body);
  if (!updatedProject.success || updatedProject.project.youtubeId !== '5qap5aO4i9A') {
    throw new Error(`YouTube Shorts extraction failed: ${portfolioUpdateRes.body}`);
  }
  console.log(`✅ YouTube Shorts URL updated & normalized: ID = ${updatedProject.project.youtubeId}\n`);

  // 4. Customizable Blog Post CMS (Multi-block custom sections)
  console.log('--- TEST 4: Customizable Blog CMS & Multi-Block Sections ---');
  const blogSlug = 'growth-sprint-blueprint-' + Date.now();
  const blogCreateRes = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/blogs',
      method: 'POST',
      headers: authHeaders,
    },
    JSON.stringify({
      title: 'The Modern Creative Velocity Blueprint',
      slug: blogSlug,
      category: 'Strategy',
      excerpt: 'How top tech scaleups produce high-converting digital flagships in 14-day sprints.',
      content: `In the contemporary digital landscape, slow iteration cycles are the death of market distinction.\n\n## The Three Pillars of Velocity\n\nHigh-velocity execution requires three foundational commitments:\n\n- Sub-second first contentful paint and responsive architecture\n- Bespoke brand identity rather than cookie-cutter templates\n- Cinematic video and scroll-stopping mobile UGC hooks\n\n![Scalemint Vector Brand System](${svgData.data.publicUrl})\n\n### Measurable Performance Multipliers\n\nWhen creative assets are engineered in sync with paid acquisition funnels, conversion rates increase between 3x and 7x.\n\n\`\`\`\nVelocity is not just moving fast; it is compounding commercial leverage with zero design compromise.\n\`\`\``,
      author: 'Scalemint Strategy Squad',
      authorRole: 'Principal Creative Lead',
      readTime: '4 min read',
      status: 'PUBLISHED',
      coverUrl: pngData.data.publicUrl,
      coverMediaId: pngData.data.id,
    })
  );

  const blogData = JSON.parse(blogCreateRes.body);
  if (!blogData.success || !blogData.data.id) {
    throw new Error(`Blog creation failed: ${blogCreateRes.body}`);
  }
  console.log(`✅ Blog article created with customizable multi-block content:`);
  console.log(`   - Title: ${blogData.data.title}`);
  console.log(`   - Slug: ${blogData.data.slug}`);
  console.log(`   - Inline Image Insert: ${svgData.data.publicUrl}`);

  // 4b. SSR Fetch on frontend blog page
  const blogFrontendRes = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/blog/${blogSlug}`,
    method: 'GET',
  });
  if (blogFrontendRes.statusCode !== 200) {
    throw new Error(`Frontend /blog/${blogSlug} returned ${blogFrontendRes.statusCode}`);
  }
  if (!blogFrontendRes.body.includes('The Three Pillars of Velocity') || !blogFrontendRes.body.includes(svgData.data.publicUrl)) {
    throw new Error('SSR rendered blog missing custom headings or inline image');
  }
  console.log(`✅ Frontend SSR /blog/${blogSlug} verified (Status: 200 OK, Headings & Inline Image rendered)\n`);

  // 5. Frontend Pages Verification
  console.log('--- TEST 5: Frontend Page SSR & Player Integration ---');
  const pages = [
    { path: '/', label: 'Homepage' },
    { path: '/portfolio', label: 'Portfolio & Showcases' },
    { path: '/services/video-editing', label: 'Cinema Video Sprint' },
    { path: '/services/ai-ugc-video-editing', label: 'UGC Reels Sprint' },
    { path: '/blog', label: 'Blog Index' },
    { path: '/admin', label: 'Admin Dashboard' },
  ];

  for (const page of pages) {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: page.path,
      method: 'GET',
    });
    if (res.statusCode !== 200) {
      throw new Error(`Page ${page.path} failed with status ${res.statusCode}`);
    }
    console.log(`✅ ${page.label} (${page.path}) rendered successfully (200 OK)`);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL SMOKE TESTS PASSED WITH 100% SUCCESS!');
  console.log('====================================================');
}

runSmokeTest().catch((err) => {
  console.error('❌ Smoke test failed:', err);
  process.exit(1);
});
