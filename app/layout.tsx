import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import 'katex/dist/katex.css';
import { Fraunces, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteConfig } from '@/lib/site';
import { StudyTimerProvider, TimerOverlays } from '@/features/study-timer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const socialImage = {
  url: siteConfig.socialImage,
  width: 1200,
  height: 630,
  alt: siteConfig.socialImageAlt,
  type: 'image/png',
};

export const metadata: Metadata = {
  title: {
    default: 'University CS Docs | University of Botswana Study Hub',
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: 'Mooketsi Vincent Magwaza', url: 'https://github.com/MooketsiMagwaza' }],
  creator: 'Mooketsi Vincent Magwaza',
  publisher: siteConfig.name,
  category: 'education',
  keywords: [
    'University of Botswana',
    'computer science notes',
    'data structures',
    'Java programming',
    'functional programming',
    'calculus',
    'study guides',
    'computer science quizzes',
  ],
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  openGraph: {
    title: 'University CS Docs | University of Botswana Study Hub',
    description: siteConfig.description,
    url: '/',
    images: [socialImage],
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'University CS Docs | University of Botswana Study Hub',
    description: siteConfig.description,
    images: [socialImage],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  isAccessibleForFree: true,
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} flex min-h-screen flex-col font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <RootProvider>
          <StudyTimerProvider>
            {children}
            <TimerOverlays />
          </StudyTimerProvider>
        </RootProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
