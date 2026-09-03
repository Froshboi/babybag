export function BabyMascot({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-10 w-10', md: 'h-24 w-24', lg: 'h-44 w-44' };
  return (
    <div className={`${sizes[size] || sizes.md} ${className}`} aria-label="Cute BabyBags mascot" role="img">
      <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
        <circle cx="80" cy="84" r="56" fill="#ffd86b" />
        <path d="M35 60c8-29 29-44 45-44 22 0 43 16 47 47-22-13-58-15-92-3Z" fill="#f7bd55" />
        <circle cx="60" cy="78" r="6" fill="#14221d" /><circle cx="100" cy="78" r="6" fill="#14221d" />
        <path d="M70 96c7 7 13 7 20 0" fill="none" stroke="#14221d" strokeLinecap="round" strokeWidth="4" />
        <circle cx="45" cy="92" r="9" fill="#f6a49c" opacity=".7" /><circle cx="115" cy="92" r="9" fill="#f6a49c" opacity=".7" />
        <path d="M42 126c11-20 65-20 76 0 8 14 1 24-10 24H52c-11 0-18-10-10-24Z" fill="#72c6b0" />
        <path d="m29 113-15 12M131 113l15 12" stroke="#f7bd55" strokeLinecap="round" strokeWidth="10" />
      </svg>
    </div>
  );
}
