import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'IB Unlocked | Smart Subject Choices',
  description: 'Choose your International Baccalaureate subjects with confidence using data-driven guidance and AI advisor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30 selection:text-primary">
        <Navbar />
        <main className="min-h-[calc(100svh-4rem)]">
          {children}
        </main>
        <footer className="border-t py-12 bg-muted/30">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} IB Unlocked. All rights reserved.</p>
            <p className="mt-2">Empowering IB students to make smarter academic decisions.</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
