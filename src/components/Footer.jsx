import { Link } from 'react-router-dom'
import { OrnateDivider } from './OrnateElements'

export default function Footer() {
  return (
    <footer
      className="py-16 px-4 md:px-6"
      style={{
        background: '#0a0806',
        borderTop: '1px solid rgba(138, 109, 47, 0.15)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <OrnateDivider />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-8 mb-10 text-center sm:text-left">
          <div>
            <p
              className="text-xl italic mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
            >
              E. Ashworth
            </p>
            <p className="text-sm" style={{ color: '#4a3520' }}>
              Author & Poet<br />
              Est. MMXXIV
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#8a6d2f' }}>
              Navigation
            </p>
            <div className="space-y-2">
              {[['/', 'Home'], ['/works', 'Works'], ['/about', 'About'], ['/journal', 'Journal']].map(([to, label]) => (
                <div key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-300 hover:text-gold"
                    style={{ color: '#4a3520' }}
                  >
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#8a6d2f' }}>
              Correspondence
            </p>
            <a
              href="mailto:eleanor@ashworthwrites.com"
              className="text-sm transition-colors duration-300 hover:text-gold"
              style={{ color: '#4a3520', display: 'block', marginBottom: '8px' }}
            >
              eleanor@ashworthwrites.com
            </a>
            <p className="text-xs" style={{ color: '#3d2b14' }}>
              For inquiries, speaking,<br />
              and correspondence
            </p>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center"
          style={{ borderTop: '1px solid rgba(138,109,47,0.1)' }}
        >
          <p className="text-xs tracking-widest" style={{ color: '#2a1f0e' }}>
            © {new Date().getFullYear()} Eleanor Ashworth. All rights reserved.
          </p>
          <p
            className="text-xs italic"
            style={{ color: '#2a1f0e', fontFamily: "'IM Fell English', serif" }}
          >
            "Write well, write honestly, write always."
          </p>
        </div>

      </div>
    </footer>
  )
}
