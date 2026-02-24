/**
 * BrandLogo — Single source of truth for ReadSpace branding.
 *
 * Props:
 *   size     {'sm'|'md'|'lg'}   – scales the icon + text  (default 'md')
 *   variant  {'auto'|'sidebar'} – 'sidebar' forces white-on-dark palette
 *   className {string}          – extra class on root element
 *
 * Usage:
 *   <BrandLogo />                  → auto-theme, medium
 *   <BrandLogo size="lg" />        → auth card hero
 *   <BrandLogo variant="sidebar"/> → always-dark admin sidebar
 */
import './BrandLogo.css';

const SIZES = {
  sm: { icon: 18, font: '0.92rem', gap: '0.4rem' },
  md: { icon: 24, font: '1.1rem',  gap: '0.5rem' },
  lg: { icon: 36, font: '1.5rem',  gap: '0.65rem' },
};

/* Open-book mark — stroke-only, matches Lucide strokeWidth=1.75 aesthetic */
function BookMark({ size, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Spine */}
      <line x1="12" y1="3" x2="12" y2="21" />
      {/* Left page arc */}
      <path d="M12 3C10 3 5 4 4 7v11c1-3 6-4 8-4" />
      {/* Right page arc */}
      <path d="M12 3c2 0 7 1 8 4v11c-1-3-6-4-8-4" />
    </svg>
  );
}

export default function BrandLogo({ size = 'md', variant = 'auto', className = '' }) {
  const s = SIZES[size] ?? SIZES.md;
  const isSidebar = variant === 'sidebar';

  return (
    <div
      className={[
        'brand-logo',
        `brand-logo--${size}`,
        isSidebar && 'brand-logo--sidebar',
        className,
      ].filter(Boolean).join(' ')}
      style={{ gap: s.gap }}
      aria-label="ReadSpace"
    >
      <BookMark
        size={s.icon}
        color={isSidebar ? '#93c5fd' : 'var(--color-primary)'}
      />
      <span className="brand-logo__wordmark" style={{ fontSize: s.font }}>
        Read<strong>Space</strong>
      </span>
    </div>
  );
}
