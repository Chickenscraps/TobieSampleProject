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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-gray-50 text-brand-dark">
        <div className="min-h-screen">
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </div>
      </body>
    </html>
  );
}
