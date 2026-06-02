export function OrnateDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center my-8 ${className}`}>
      <svg viewBox="0 0 520 30" className="w-full max-w-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8a6d2f" stopOpacity="0" />
            <stop offset="100%" stopColor="#8a6d2f" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="lineRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8a6d2f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8a6d2f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fading lines */}
        <line x1="0"   y1="15" x2="195" y2="15" stroke="url(#lineLeft)"  strokeWidth="0.6" />
        <line x1="325" y1="15" x2="520" y2="15" stroke="url(#lineRight)" strokeWidth="0.6" />
        {/* Outer diamonds */}
        <path d="M200 15 L207 8 L214 15 L207 22 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.6" />
        <path d="M306 15 L313 8 L320 15 L313 22 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.6" />
        {/* Inner diamonds flanking center */}
        <circle cx="222" cy="15" r="2.5" fill="none" stroke="#c9a84c" strokeWidth="0.7" opacity="0.7" />
        <circle cx="298" cy="15" r="2.5" fill="none" stroke="#c9a84c" strokeWidth="0.7" opacity="0.7" />
        <path d="M230 15 L238 7 L246 15 L238 23 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.8" />
        <path d="M274 15 L282 7 L290 15 L282 23 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.8" />
        {/* Center — filled diamond */}
        <path d="M252 15 L260 6 L268 15 L260 24 Z" fill="#c9a84c" fillOpacity="0.18" stroke="#c9a84c" strokeWidth="0.9" />
        <circle cx="260" cy="15" r="2" fill="#c9a84c" />
      </svg>
    </div>
  )
}

export function OrnateFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ border: '1px solid rgba(201,168,76,0.35)', boxShadow: '0 0 12px rgba(201,168,76,0.07), inset 0 0 20px rgba(0,0,0,0.4)' }}>
      {/* Corner ornaments — w-10 h-10 */}
      <svg className="absolute top-0 left-0 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 L2 2 L20 2" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="2" cy="2" r="2" fill="#c9a84c" />
        <path d="M2 20 Q2 10 10 10 Q18 10 18 2" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
        {/* Mid-edge diamond — left side */}
        <path d="M2 22 L5 25 L2 28 L-1 25 Z" fill="#c9a84c" fillOpacity="0.5" />
      </svg>
      <svg className="absolute top-0 right-0 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M38 20 L38 2 L20 2" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="38" cy="2" r="2" fill="#c9a84c" />
        <path d="M38 20 Q38 10 30 10 Q22 10 22 2" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
        {/* Mid-edge diamond — top edge */}
        <path d="M20 2 L23 5 L20 8 L17 5 Z" fill="#c9a84c" fillOpacity="0.5" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 L2 38 L20 38" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="2" cy="38" r="2" fill="#c9a84c" />
        <path d="M2 20 Q2 30 10 30 Q18 30 18 38" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
        {/* Mid-edge diamond — bottom edge */}
        <path d="M20 38 L23 35 L20 32 L17 35 Z" fill="#c9a84c" fillOpacity="0.5" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M38 20 L38 38 L20 38" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="38" cy="38" r="2" fill="#c9a84c" />
        <path d="M38 20 Q38 30 30 30 Q22 30 22 38" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
        {/* Mid-edge diamond — right side */}
        <path d="M38 20 L41 23 L38 26 L35 23 Z" fill="#c9a84c" fillOpacity="0.5" />
      </svg>
      <div className="m-1">{children}</div>
    </div>
  )
}

export function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: '#8a6d2f' }}>
        ✦ &nbsp; {subtitle} &nbsp; ✦
      </p>
      <h2 className="text-4xl md:text-5xl italic" style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}>
        {children}
      </h2>
      <OrnateDivider className="mt-4" />
    </div>
  )
}

export function BookIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 28 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="4" height="28" rx="1" fill="#8a6d2f" opacity="0.9" />
      <rect x="5" y="2" width="20" height="28" rx="1.5" fill="#2a1f0e" stroke="#8a6d2f" strokeWidth="0.8" />
      <rect x="6" y="3" width="18" height="26" rx="1" fill="#1a1209" opacity="0.4" />
      <line x1="10" y1="11" x2="21" y2="11" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
      <line x1="10" y1="14" x2="21" y2="14" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />
      <circle cx="15.5" cy="20" r="3" fill="none" stroke="#c9a84c" strokeWidth="0.6" opacity="0.5" />
      <circle cx="15.5" cy="20" r="1" fill="#c9a84c" opacity="0.3" />
      <rect x="23" y="3" width="1.5" height="26" rx="0.5" fill="#f0e6c8" opacity="0.15" />
    </svg>
  )
}

export function CandleIcon({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`relative cursor-pointer group ${className}`}
      title=""
      aria-label="Candle"
      style={{ background: 'none', border: 'none' }}
    >
      <svg viewBox="0 0 24 48" className="w-5 h-10" fill="none">
        <g className="candle-flame" style={{ transformOrigin: '12px 12px' }}>
          <ellipse cx="12" cy="7" rx="3.5" ry="5" fill="#f59e0b" opacity="0.9" />
          <ellipse cx="12" cy="8" rx="2" ry="3" fill="#fde68a" opacity="0.7" />
        </g>
        <line x1="12" y1="12" x2="12" y2="16" stroke="#1a1209" strokeWidth="0.8" />
        <rect x="8" y="16" width="8" height="26" rx="1" fill="#f0e6c8" opacity="0.9" />
        <rect x="8" y="16" width="2" height="26" rx="0" fill="#d4c49a" opacity="0.4" />
        <path d="M8 22 Q6 24 7 28 L8 28 Z" fill="#f0e6c8" opacity="0.6" />
        <rect x="6" y="42" width="12" height="4" rx="1" fill="#8a6d2f" opacity="0.8" />
      </svg>
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />
    </button>
  )
}
