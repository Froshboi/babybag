'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const links = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/curriculum', label: 'Curriculum' },
        { href: '/simulate', label: 'Simulate' },
        { href: '/wallet', label: 'Wallet' },
      ]
    : [];

  return (
    <nav className="bg-cream sticky top-0 z-50 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex justify-between items-center min-h-20 py-4 gap-4">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-navy shrink-0">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gold text-2xl">🐣</span>
          <span>babybags</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6 text-right">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'hidden sm:block text-sm font-semibold transition-colors hover:text-mint-dark',
                pathname === link.href
                  ? 'text-mint-dark border-b-2 border-mint-dark pb-1'
                  : 'text-navy/70'
              )}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={signOut}
              className="text-sm text-red-500 hover:text-red-700 font-semibold"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth/signup" className="btn-primary text-sm py-3 px-5">
              Create account <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};