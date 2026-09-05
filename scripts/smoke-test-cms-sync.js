const http = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

async function runSmokeTest() {
  console.log('====================================================');
  console.log('🔥 STARTING SHADOW & SMOKE TEST: CMS <-> FRONTEND SYNC');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. Admin Authentication
  console.log('👉 [TEST 1] Admin Authentication');
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

  const setCookie = loginRes.headers['set-cookie'];
  if (!setCookie || !setCookie[0]) {
    console.error('❌ Failed to login admin');
    process.exit(1);
  }
  const adminCookie = setCookie[0].split(';')[0];
  console.log('✅ Admin login successful. Cookie established.\n');
  passed++;

  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: adminCookie,
  };

  // 2. Inspect Live Database for Branding Portfolio Items
  console.log('👉 [TEST 2] Checking Portfolio Projects in DB');
  const brandingProjects = await prisma.portfolioProject.findMany({
    where: { category: { slug: 'branding' } },
    include: { category: true, coverMedia: true },
    orderBy: { displayOrder: 'asc' },
  });

  console.log(`Found ${brandingProjects.length} branding projects in DB:`);
  brandingProjects.forEach((p, idx) => {
    console.log(`   #${idx + 1}: "${p.title}" | Client: "${p.clientName}" | Cover URL: ${p.coverMedia?.publicUrl || 'No media'}`);
  });

  if (brandingProjects.length === 0) {
    console.error('❌ No branding projects found in DB');
    failed++;
  } else {
    console.log('✅ DB contains active branding projects.\n');
    passed++;
  }

  // 3. Check /portfolio Frontend HTML for existing branding projects & images
  console.log('👉 [TEST 3] Fetching Live Frontend /portfolio HTML');
  const initialPortfolioRes = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/portfolio',
    method: 'GET',
  });

  console.log(`Response Status: ${initialPortfolioRes.statusCode}`);
  if (initialPortfolioRes.statusCode !== 200) {
    console.error('❌ /portfolio did not return 200');
    failed++;
  } else {
    // Check if branding titles appear in HTML
    let foundTitles = 0;
    for (const p of brandingProjects) {
      if (initialPortfolioRes.body.includes(p.title)) {
        foundTitles++;
      }
    }
    console.log(`Found ${foundTitles}/${brandingProjects.length} branding project titles rendered in /portfolio HTML.`);
    if (foundTitles > 0) {
      console.log('✅ Live CMS Portfolio data is successfully rendered on /portfolio frontend.\n');
      passed++;
    } else {
      console.error('❌ Portfolio titles not found in rendered HTML.');
      failed++;
    }
  }

  // 4. Test Live Image Mutation & Propagation (The Exact User Issue!)
  console.log('👉 [TEST 4] Mutating Portfolio Cover Image in Backend and Testing Instant Reflection in Frontend');
  const targetProject = brandingProjects[0];
  const originalCoverMediaId = targetProject.coverMediaId;

  // Create or retrieve a distinct test MediaAsset
  const testImageUrl = `/uploads/smoke-test-${Date.now()}.png`;
  const testMedia = await prisma.mediaAsset.create({
    data: {
      filename: 'smoke-test.png',
      originalFilename: 'smoke-test.png',
      mimeType: 'image/png',
      fileSize: 12345,
      storagePath: '/uploads/smoke-test.png',
      publicUrl: testImageUrl,
      category: 'portfolio',
    },
  });

  console.log(`Created test MediaAsset with publicUrl: ${testImageUrl} (ID: ${testMedia.id})`);

  // Update Portfolio Project via Admin API
  const updateRes = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/portfolio/${targetProject.id}`,
      method: 'PUT',
      headers: authHeaders,
    },
    JSON.stringify({
      coverMediaId: testMedia.id,
      title: `${targetProject.title} [SMOKE_SYNC_VERIFIED]`,
    })
  );

  console.log(`Admin API Update Status: ${updateRes.statusCode}`);
  const updateBody = JSON.parse(updateRes.body);
  if (!updateBody.success) {
    console.error('❌ Failed to update project via Admin API:', updateRes.body);
    failed++;
  } else {
    console.log('✅ Project updated via Admin API.');

    // Fetch /portfolio HTML immediately
    const recheckRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/portfolio',
      method: 'GET',
    });

    const hasNewImage = recheckRes.body.includes(testImageUrl);
    const hasNewTitle = recheckRes.body.includes('[SMOKE_SYNC_VERIFIED]');

    console.log(`Verification in /portfolio HTML:`);
    console.log(`   - New Cover Image URL (${testImageUrl}) present: ${hasNewImage ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   - New Title Tag present: ${hasNewTitle ? 'YES ✅' : 'NO ❌'}`);

    if (hasNewImage && hasNewTitle) {
      console.log('🎉 SUCCESS: Backend image and title change INSTANTLY reflected on frontend without caching bugs!\n');
      passed++;
    } else {
      console.error('❌ FAIL: Backend image was NOT found in the frontend HTML.');
      failed++;
    }

    // Restore original project data
    await httpRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/api/admin/portfolio/${targetProject.id}`,
        method: 'PUT',
        headers: authHeaders,
      },
      JSON.stringify({
        coverMediaId: originalCoverMediaId,
        title: targetProject.title,
      })
    );
    await prisma.mediaAsset.delete({ where: { id: testMedia.id } }).catch(() => {});
    console.log('Restored original project state.');
  }

  // 5. Test Client Brand Marquee Sync
  console.log('\n👉 [TEST 5] Testing Client Brand Marquee Sync on Homepage (/)');
  const testClientName = `TestBrand_${Date.now()}`;
  const clientCreateRes = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/clients',
      method: 'POST',
      headers: authHeaders,
    },
    JSON.stringify({
      name: testClientName,
      status: 'PUBLISHED',
      displayOrder: 1,
    })
  );
  const clientData = JSON.parse(clientCreateRes.body);
  if (clientData.success && clientData.data?.id) {
    console.log(`Created test client: "${testClientName}" (ID: ${clientData.data.id})`);

    // Fetch homepage /
    const homeRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
    });

    const hasClientName = homeRes.body.includes(testClientName);
    console.log(`Verification in / HTML: Client Brand present: ${hasClientName ? 'YES ✅' : 'NO ❌'}`);

    if (hasClientName) {
      console.log('✅ Client Brand immediately rendered in homepage marquee.\n');
      passed++;
    } else {
      console.error('❌ Client brand not rendered on homepage.');
      failed++;
    }

    // Cleanup client
    await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/clients?id=${clientData.data.id}`,
      method: 'DELETE',
      headers: authHeaders,
    });
  } else {
    console.error('❌ Failed to create test client');
    failed++;
  }

  // 6. Test Site Settings Logo Sync
  console.log('👉 [TEST 6] Testing Site Settings Logo Sync in Header & Footer');
  const testLogoUrl = `/uploads/smoke-logo-${Date.now()}.svg`;
  const currentSettings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });

  const settingsRes = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/settings',
      method: 'PUT',
      headers: authHeaders,
    },
    JSON.stringify({
      siteName: currentSettings?.siteName || 'Scalemint',
      logoUrl: testLogoUrl,
    })
  );

  const settingsData = JSON.parse(settingsRes.body);
  if (settingsData.success) {
    const homeRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
    });

    const hasLogoInHtml = homeRes.body.includes(testLogoUrl);
    console.log(`Verification in / HTML: New Logo URL (${testLogoUrl}) present: ${hasLogoInHtml ? 'YES ✅' : 'NO ❌'}`);

    if (hasLogoInHtml) {
      console.log('✅ Site Logo instantly rendered in Header/Footer across frontend.\n');
      passed++;
    } else {
      console.error('❌ Site Logo not rendered in HTML.');
      failed++;
    }

    // Restore settings
    await httpRequest(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/settings',
        method: 'PUT',
        headers: authHeaders,
      },
      JSON.stringify({
        siteName: currentSettings?.siteName,
        logoUrl: currentSettings?.logoUrl || null,
      })
    );
    console.log('Restored original site settings.');
  } else {
    console.error('❌ Failed to update site settings');
    failed++;
  }

  console.log('\n====================================================');
  console.log(`🏁 SMOKE TEST COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runSmokeTest().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});
