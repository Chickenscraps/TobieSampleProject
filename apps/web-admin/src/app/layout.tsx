import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <div className="min-h-screen">
          <Sidebar />
          <main className="lg:ml-64 pt-18 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
