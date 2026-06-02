export function OrnateDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center my-8 ${className}`}>
      <svg viewBox="0 0 400 30" className="w-full max-w-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="15" x2="155" y2="15" stroke="#8a6d2f" strokeWidth="0.5" />
        <path d="M160 15 L167 8 L174 15 L167 22 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="185" cy="15" r="3" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <path d="M192 15 L200 7 L208 15 L200 23 Z" fill="#c9a84c" fillOpacity="0.15" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="200" cy="15" r="2" fill="#c9a84c" />
        <path d="M192 15 L200 7 L208 15 L200 23 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="215" cy="15" r="3" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <path d="M226 15 L233 8 L240 15 L233 22 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <line x1="245" y1="15" x2="400" y2="15" stroke="#8a6d2f" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

export function OrnateFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ border: '1px solid #8a6d2f' }}>
      {/* Corner ornaments */}
      <svg className="absolute top-0 left-0 w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M2 16 L2 2 L16 2" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="2" cy="2" r="2" fill="#c9a84c" />
        <path d="M2 16 Q2 8 8 8 Q14 8 14 2" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
      </svg>
      <svg className="absolute top-0 right-0 w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M30 16 L30 2 L16 2" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="30" cy="2" r="2" fill="#c9a84c" />
        <path d="M30 16 Q30 8 24 8 Q18 8 18 2" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M2 16 L2 30 L16 30" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="2" cy="30" r="2" fill="#c9a84c" />
        <path d="M2 16 Q2 24 8 24 Q14 24 14 30" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M30 16 L30 30 L16 30" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="30" cy="30" r="2" fill="#c9a84c" />
        <path d="M30 16 Q30 24 24 24 Q18 24 18 30" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
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
      {/* Spine */}
      <rect x="2" y="2" width="4" height="28" rx="1" fill="#8a6d2f" opacity="0.9" />
      {/* Cover */}
      <rect x="5" y="2" width="20" height="28" rx="1.5" fill="#2a1f0e" stroke="#8a6d2f" strokeWidth="0.8" />
      {/* Inner pages edge */}
      <rect x="6" y="3" width="18" height="26" rx="1" fill="#1a1209" opacity="0.4" />
      {/* Title line */}
      <line x1="10" y1="11" x2="21" y2="11" stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
      <line x1="10" y1="14" x2="21" y2="14" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />
      {/* Ornament */}
      <circle cx="15.5" cy="20" r="3" fill="none" stroke="#c9a84c" strokeWidth="0.6" opacity="0.5" />
      <circle cx="15.5" cy="20" r="1" fill="#c9a84c" opacity="0.3" />
      {/* Pages shimmer */}
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
        {/* Flame */}
        <ellipse cx="12" cy="7" rx="3.5" ry="5" fill="#f59e0b" opacity="0.9"
          className="group-hover:opacity-100 transition-opacity" />
        <ellipse cx="12" cy="8" rx="2" ry="3" fill="#fde68a" opacity="0.7" />
        {/* Wick */}
        <line x1="12" y1="12" x2="12" y2="16" stroke="#1a1209" strokeWidth="0.8" />
        {/* Candle body */}
        <rect x="8" y="16" width="8" height="26" rx="1" fill="#f0e6c8" opacity="0.9" />
        <rect x="8" y="16" width="2" height="26" rx="0" fill="#d4c49a" opacity="0.4" />
        {/* Wax drip */}
        <path d="M8 22 Q6 24 7 28 L8 28 Z" fill="#f0e6c8" opacity="0.6" />
        {/* Base */}
        <rect x="6" y="42" width="12" height="4" rx="1" fill="#8a6d2f" opacity="0.8" />
      </svg>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />
    </button>
  )
}
