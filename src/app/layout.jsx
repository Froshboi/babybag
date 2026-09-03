import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BabyBags | Learn trading, one tiny step at a time',
  description: 'Beginner-friendly trading lessons, paper trading practice, and rewards without the hype.',
  metadataBase: new URL('https://babybags.vercel.app'),
  openGraph: { title: 'BabyBags | Learn trading, one tiny step at a time', description: 'Learn, practise, and build better trading habits.', url: 'https://babybags.vercel.app', siteName: 'BabyBags', images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'BabyBags trading education' }], type: 'website' },
  twitter: { card: 'summary_large_image', title: 'BabyBags | Learn trading, one tiny step at a time', description: 'Learn, practise, and build better trading habits.', images: ['/og-image.svg'] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-cream min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 container mx-auto px-0 max-w-none">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}