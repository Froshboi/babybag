import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BabyBags – Learn Trading, Earn Real Rewards',
  description: 'Gamified trading education with real payouts.',
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