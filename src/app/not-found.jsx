import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-mint-dark mb-4">404</h1>
      <h2 className="text-2xl font-bold text-navy mb-2">Page not found</h2>
      <p className="text-navy/60 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-primary">
        Go back home
      </Link>
    </div>
  );
}