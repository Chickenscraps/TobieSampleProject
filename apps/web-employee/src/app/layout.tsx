import type { Metadata } from 'next';
import './globals.css';
import { StickyHeader } from '@/components/StickyHeader';
import { EnrollmentBanner } from '@/components/EnrollmentBanner';
import { Footer } from '@/components/Footer';
import { ChatAssistantLauncher } from '@/components/ChatAssistantLauncher';
import { PageAnalyticsTracker } from '@/components/PageAnalyticsTracker';

export const metadata: Metadata = {
  title: '2026 Tobie Benefits Guide',
  description: 'Your comprehensive guide to Tobie employee benefits for the 2026 plan year.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tobie_theme');var d=t==='dark'||(!t||t==='system')&&window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans bg-white dark:bg-slate-900 text-brand-dark dark:text-gray-100 transition-colors duration-200">
        <div className="lg:mr-[400px]">
          <EnrollmentBanner />
          <StickyHeader />
          <main>{children}</main>
          <Footer />
        </div>
        <ChatAssistantLauncher />
        <PageAnalyticsTracker />
      </body>
    </html>
  );
}
