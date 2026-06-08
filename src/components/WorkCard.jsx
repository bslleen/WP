import { useState } from 'react'

/* ── Atmospheric SVG placeholders — exact copy from Home.jsx ─────────────── */

const S = 'rgba(201,168,76,0.3)'

function AtmosphericSVG({ category }) {
  const cat = (category || '').toLowerCase()

  if (cat.includes('novel')) {
    // Stacked book spines + faint quill diagonal + amber top glow
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 165" preserveAspectRatio="xMidYMid slice">
        {/* Amber top glow */}
        <ellipse cx="100" cy="0" rx="80" ry="40" fill="rgba(201,168,76,0.06)" />
        {/* Stacked book rectangles */}
        {[0,1,2,3,4].map(i => (
          <rect key={i}
            x={44 + i * 2} y={62 - i * 14}
            width={112 - i * 4} height={10}
            fill="none" stroke={S} strokeWidth="0.6"
            strokeOpacity={1 - i * 0.15}
          />
        ))}
        {/* Vertical spine lines on books */}
        {[58, 80, 102, 124, 142].map((x, i) => (
          <line key={i} x1={x} y1={62 - i * 14} x2={x} y2={72 - i * 14}
            stroke={S} strokeWidth="0.4" />
        ))}
        {/* Diagonal quill line */}
        <line x1="148" y1="18" x2="88" y2="118"
          stroke={S} strokeWidth="0.5" strokeDasharray="3 5" />
        {/* Quill tip */}
        <path d="M148 18 L144 26 L152 24 Z" fill="none" stroke={S} strokeWidth="0.4" />
      </svg>
    )
  }

  if (cat.includes('poetry')) {
    // Horizontal lines at varying opacities + dark curved horizon silhouette
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 165" preserveAspectRatio="xMidYMid slice">
        {/* Horizontal text lines */}
        {[28, 42, 56, 68, 80, 92, 104, 116].map((y, i) => (
          <line key={i}
            x1={i % 2 === 0 ? 20 : 32} y1={y}
            x2={i % 3 === 0 ? 155 : 170} y2={y}
            stroke={S} strokeWidth="0.5"
            strokeOpacity={0.4 + (i % 3) * 0.2}
          />
        ))}
        {/* Curved horizon silhouette */}
        <path
          d="M0 128 Q30 108 60 118 Q90 128 120 110 Q150 92 180 106 Q192 112 200 108 L200 165 L0 165 Z"
          fill="rgba(10,7,3,0.5)" stroke={S} strokeWidth="0.5"
        />
      </svg>
    )
  }

  // Short story — scattered dots map + compass outline
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 165" preserveAspectRatio="xMidYMid slice">
      {/* Map dots + dashed connectors */}
      {[[34,44],[72,32],[118,52],[148,38],[88,86],[52,108],[130,98]].map(([x,y], i, arr) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.5" fill="none" stroke={S} strokeWidth="0.5" />
          {i < arr.length - 1 && (
            <line x1={x} y1={y} x2={arr[i+1][0]} y2={arr[i+1][1]}
              stroke={S} strokeWidth="0.35" strokeDasharray="4 4" />
          )}
        </g>
      ))}
      {/* Compass circle */}
      <circle cx="100" cy="82" r="26" fill="none" stroke={S} strokeWidth="0.5" />
      <circle cx="100" cy="82" r="22" fill="none" stroke={S} strokeWidth="0.25" />
      {/* Cardinal marks */}
      <line x1="100" y1="58" x2="100" y2="64" stroke={S} strokeWidth="0.6" />
      <line x1="100" y1="100" x2="100" y2="106" stroke={S} strokeWidth="0.6" />
      <line x1="76" y1="82" x2="82" y2="82" stroke={S} strokeWidth="0.6" />
      <line x1="118" y1="82" x2="124" y2="82" stroke={S} strokeWidth="0.6" />
      {/* Compass needle */}
      <line x1="100" y1="68" x2="100" y2="82" stroke={S} strokeWidth="0.8" />
      <line x1="100" y1="82" x2="106" y2="94" stroke={S} strokeWidth="0.4" />
    </svg>
  )
}

/* ── Stone wall texture — exact copy from Home.jsx ───────────────────────── */
/* Uses a distinct pattern id to avoid SVG conflicts during page transitions  */

export function StoneWall() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="stonePatternWorks" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="240" y2="0" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="0" y1="120" x2="240" y2="120" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="80" y1="0" x2="80" y2="120" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="200" y1="0" x2="200" y2="120" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="40" y1="120" x2="40" y2="240" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="140" y1="120" x2="140" y2="240" stroke="#1a1209" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stonePatternWorks)" opacity="0.6" />
    </svg>
  )
}

/* ── Ornate frame SVG — exact copy of SideFrameSVG from Home.jsx ─────────── */

function FrameSVG() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 200 280" preserveAspectRatio="none">
      <rect x="0" y="0" width="200" height="280" fill="none" stroke="#8a6d2f" strokeWidth="1.5"/>
      <rect x="6" y="6" width="188" height="268" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
      <rect x="10" y="10" width="180" height="260" fill="none" stroke="#8a6d2f" strokeWidth="0.3"/>
      <circle cx="0" cy="0" r="3" fill="#c9a84c"/>
      <circle cx="200" cy="0" r="3" fill="#c9a84c"/>
      <circle cx="0" cy="280" r="3" fill="#c9a84c"/>
      <circle cx="200" cy="280" r="3" fill="#c9a84c"/>
      <path d="M0 18 L0 0 L18 0" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <path d="M200 18 L200 0 L182 0" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <path d="M0 262 L0 280 L18 280" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <path d="M200 262 L200 280 L182 280" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <circle cx="100" cy="0" r="2" fill="#8a6d2f"/>
      <circle cx="100" cy="280" r="2" fill="#8a6d2f"/>
      <circle cx="0" cy="140" r="2" fill="#8a6d2f"/>
      <circle cx="200" cy="140" r="2" fill="#8a6d2f"/>
    </svg>
  )
}

/* ── WorkCard — shared framed card ──────────────────────────────────────── */

export default function WorkCard({ work }) {
  const [hovered, setHovered] = useState(false)
  const accent = work.accentColor || '#8a6d2f'

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        paddingTop: '28px',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'transform 0.4s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hanging wire */}
      <div style={{
        position: 'absolute', top: '8px', left: '50%',
        transform: 'translateX(-50%)',
        width: '1px', height: '20px',
        background: 'linear-gradient(to bottom, transparent, #8a6d2f)',
      }} />
      <div style={{
        position: 'absolute', top: '6px', left: '50%',
        transform: 'translateX(-50%)',
        width: '6px', height: '6px', borderRadius: '50%',
        border: '1px solid #8a6d2f', background: 'transparent',
      }} />

      {/* Card + frame overlay */}
      <div style={{ position: 'relative', width: '200px' }}>
        <div style={{
          background: '#1a1209',
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 20px 60px rgba(0,0,0,0.95), inset 0 0 30px rgba(0,0,0,0.4)'
            : '0 8px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.4s ease',
        }}>
          {/* Painting area */}
          <div style={{
            height: '150px',
            background: work.cover_image
              ? `url(${work.cover_image}) center/cover`
              : `linear-gradient(135deg, ${work.coverColor || '#2a1f0e'}, #0d0a05)`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, #0d0a05 100%)',
            }} />
            {!work.cover_image && (
              <AtmosphericSVG category={work.category} />
            )}
          </div>

          {/* Gold separator */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
            margin: '0 12px',
          }} />

          {/* Text block */}
          <div style={{ padding: '14px 16px 16px' }}>
            <p style={{
              fontSize: '9px', letterSpacing: '0.35em',
              textTransform: 'uppercase', color: accent, marginBottom: '6px',
            }}>
              {work.category}
            </p>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '16px', fontStyle: 'italic',
              color: '#f0e6c8', marginBottom: '6px', lineHeight: 1.3,
            }}>
              {work.title}
            </h3>
            <p style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: '11px', fontStyle: 'italic',
              color: '#8a6d2f', marginBottom: '10px', lineHeight: 1.5,
            }}>
              "{work.excerpt?.substring(0, 55)}…"
            </p>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              borderTop: '1px solid rgba(138,109,47,0.2)', paddingTop: '8px',
            }}>
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#4a3520', textTransform: 'uppercase' }}>
                {work.year}
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#4a3520', textTransform: 'uppercase' }}>
                {work.status || (work.pages > 0 ? `${work.pages} pp.` : 'In Progress')}
              </span>
            </div>
          </div>
        </div>

        <FrameSVG />
      </div>
    </div>
  )
}
