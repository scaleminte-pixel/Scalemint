import type { Metadata } from 'next';
import './globals.css';
import prisma from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });

    return {
      title: settings?.defaultSeoTitle || 'Scalemint — 360° Creative & Performance Agency',
      description:
        settings?.defaultSeoDesc ||
        'Scale your brand with strategic branding, websites, video editing, AI UGC, and Google Ads.',
      icons: {
        icon: settings?.faviconUrl || '/favicon.ico',
        shortcut: settings?.faviconUrl || '/favicon.ico',
        apple: settings?.faviconUrl || '/favicon.ico',
      },
      openGraph: {
        title: settings?.defaultSeoTitle || 'Scalemint — 360° Creative & Performance Agency',
        description:
          settings?.defaultSeoDesc ||
          'Scale your brand with strategic branding, websites, video editing, AI UGC, and Google Ads.',
        siteName: settings?.siteName || 'Scalemint',
        type: 'website',
      },
    };
  } catch (err) {
    console.error('[RootLayout generateMetadata Error]:', err);
    return {
      title: 'Scalemint — 360° Creative & Performance Agency',
      description:
        'Scale your brand with strategic branding, websites, video editing, AI UGC, and Google Ads.',
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
      },
    };
  }
}

import CustomCursor from '@/components/CustomCursor';
import ScrollToTop from '@/components/ScrollToTop';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });
  } catch (err) {
    console.error('[RootLayout Fetch Error]:', err);
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href={settings?.faviconUrl || '/favicon.ico'} sizes="any" />
        <link rel="apple-touch-icon" href={settings?.faviconUrl || '/favicon.ico'} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {settings?.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
        {settings?.metaPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${settings.metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body className="bg-agency-dark text-gray-100 min-h-screen antialiased selection:bg-purple-600 selection:text-white">
        <CustomCursor />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
