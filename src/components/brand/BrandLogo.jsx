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

/* Minimal open-book mark — clean at 18–36 px */
function BookMark({ size, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Spine */}
      <rect x="13" y="3" width="2" height="22" rx="1" fill={color} opacity="0.35" />
      {/* Left page */}
      <path
        d="M13 5 C10 5 5 6.5 4 9 L4 23 C5 20.5 10 19 13 19 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Right page */}
      <path
        d="M15 5 C18 5 23 6.5 24 9 L24 23 C23 20.5 18 19 15 19 Z"
        fill={color}
        opacity="0.65"
      />
      {/* Top highlight line on left page */}
      <line x1="6.5" y1="11" x2="11.5" y2="10.2" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <line x1="6.5" y1="14" x2="11.5" y2="13.2" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
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
