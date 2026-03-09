import type { Metadata } from 'next';
import './globals.css';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

export const metadata: Metadata = {
  title: 'Tobie Benefits Admin Dashboard',
  description: 'HR admin dashboard for reviewing chat transcripts and managing the benefits AI assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tobie_theme');var d=t==='dark'||(!t||t==='system')&&window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans bg-gray-50 dark:bg-slate-900 text-brand-dark dark:text-gray-100 transition-colors duration-200">
        <div className="min-h-screen">
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </div>
      </body>
    </html>
  );
}
