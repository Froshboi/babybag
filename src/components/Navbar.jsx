'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { BabyMascot } from '@/components/BabyMascot';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/curriculum', label: 'Curriculum' },
        { href: '/simulate', label: 'Simulate' },
        { href: '/wallet', label: 'Wallet' },
      ]
    : [];

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-cream/95 backdrop-blur sticky top-0 z-50 border-b border-black/5">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 flex justify-between items-center min-h-16 py-3 gap-3">
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-xl font-extrabold text-navy shrink-0">
          <BabyMascot size="sm" className="shrink-0" />
          <span>babybags</span>
        </Link>

        <div className="hidden md:flex items-center gap-3 sm:gap-6 text-right">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs sm:text-sm font-semibold transition-colors hover:text-mint-dark',
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
              className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-semibold"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth/signup" className="btn-primary text-xs sm:text-sm py-2.5 px-3 sm:px-5">
              Create account <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-black/10 text-navy text-xl shrink-0"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-black/5 bg-cream px-5 py-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  'rounded-xl px-4 py-3 text-sm font-semibold',
                  pathname === link.href ? 'bg-mint/30 text-mint-dark' : 'text-navy/75'
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  closeMenu();
                  signOut();
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500"
              >
                Logout
              </button>
            ) : (
              <Link href="/auth/signup" onClick={closeMenu} className="btn-primary text-sm py-3 px-5">
                Create account <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};