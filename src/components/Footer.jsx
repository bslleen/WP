import { Link } from 'react-router-dom'
import { OrnateDivider } from './OrnateElements'

export default function Footer() {
  return (
    <footer
      className="py-16 px-4 md:px-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        backgroundImage: 'none',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <OrnateDivider />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-8 mb-10 text-center sm:text-left">
          <div>
            <p
              className="text-xl italic mb-2"
              style={{ fontFamily: "var(--font-heading)", color: 'var(--text-primary)' }}
            >
              E. Ashworth
            </p>
            <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
              Author & Poet<br />
              Est. MMXXIV
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent-dim)' }}>
              Navigation
            </p>
            <div className="space-y-2">
              {[['/', 'Home'], ['/works', 'Works'], ['/about', 'About'], ['/journal', 'Journal']].map(([to, label]) => (
                <div key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-300 hover:text-gold"
                    style={{ color: 'var(--text-faint)' }}
                  >
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent-dim)' }}>
              Correspondence
            </p>
            <a
              href="mailto:eleanor@ashworthwrites.com"
              className="text-sm transition-colors duration-300 hover:text-gold"
              style={{ color: 'var(--text-faint)', display: 'block', marginBottom: '8px' }}
            >
              eleanor@ashworthwrites.com
            </a>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              For inquiries, speaking,<br />
              and correspondence
            </p>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs tracking-widest" style={{ color: 'var(--text-faint)' }}>
            © {new Date().getFullYear()} Eleanor Ashworth. All rights reserved.
          </p>
          <p
            className="text-xs italic"
            style={{ color: 'var(--text-faint)', fontFamily: "var(--font-accent)" }}
          >
            "Write well, write honestly, write always."
          </p>
        </div>

      </div>
    </footer>
  )
}
