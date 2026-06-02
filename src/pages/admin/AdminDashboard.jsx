import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorks, getAllJournalEntries } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const STATUS_COLORS = {
  published: '#c9a84c',
  'in progress': '#8a6d2f',
  archived: '#4a3520',
}

function StatCard({ label, value, note }) {
  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid rgba(138,109,47,0.2)',
      background: 'rgba(26,18,9,0.5)',
    }}>
      <p style={{
        color: '#4a3520',
        fontSize: '0.58rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontFamily: "'Playfair Display', serif",
        marginBottom: '0.4rem',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        color: '#c9a84c',
        fontSize: '2.4rem',
        fontStyle: 'italic',
        lineHeight: 1,
      }}>
        {value}
      </p>
      {note && (
        <p style={{ color: '#3d2b14', fontSize: '0.62rem', marginTop: '0.3rem' }}>{note}</p>
      )}
    </div>
  )
}

function RecentRow({ title, sub, statusLabel, statusColor, editTo }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      border: '1px solid rgba(138,109,47,0.15)',
      background: 'rgba(13,10,5,0.4)',
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          color: '#d4c49a',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title}
        </p>
        <p style={{ color: '#4a3520', fontSize: '0.62rem', marginTop: '2px' }}>{sub}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginLeft: '1rem' }}>
        <span style={{
          fontSize: '0.58rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: statusColor,
          border: `1px solid ${statusColor}44`,
          padding: '2px 8px',
          whiteSpace: 'nowrap',
        }}>
          {statusLabel}
        </span>
        <Link to={editTo} style={{ color: '#6b5a3e', fontSize: '0.62rem', textDecoration: 'none', letterSpacing: '0.1em' }}>
          Edit
        </Link>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [works, setWorks] = useState([])
  const [journal, setJournal] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getWorks(), getAllJournalEntries()])
      .then(([w, j]) => { setWorks(w || []); setJournal(j || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const publishedWorks = works.filter(w => w.status === 'published').length
  const draftWorks = works.filter(w => w.status !== 'published').length
  const publishedJournal = journal.filter(j => j.published).length

  return (
    <div className="">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#4a3520', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          ✦ &nbsp; Overview &nbsp; ✦
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: '#f0e6c8',
          fontSize: '2.2rem',
          fontStyle: 'italic',
        }}>
          The Ledger
        </h1>
      </div>

      <OrnateDivider className="mb-8" />

      {loading ? (
        <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>
          Consulting the archives…
        </p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}>
            <StatCard label="Total Works" value={works.length} />
            <StatCard label="Published" value={publishedWorks} note="visible to readers" />
            <StatCard label="In Draft" value={draftWorks} note="works in progress" />
            <StatCard label="Journal" value={publishedJournal} note={`of ${journal.length} entries`} />
          </div>

          {/* Recent works */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: '1.1rem', fontStyle: 'italic' }}>
                Recent Works
              </h2>
              <Link to="/admin/works" style={{ color: '#6b5a3e', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
                All works →
              </Link>
            </div>
            {works.length === 0 ? (
              <p style={{ color: '#3d2b14', fontStyle: 'italic', fontSize: '0.9rem' }}>The shelves are empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {works.slice(0, 5).map(w => (
                  <RecentRow
                    key={w.id}
                    title={w.title}
                    sub={[w.category, w.year].filter(Boolean).join(' · ')}
                    statusLabel={w.status}
                    statusColor={STATUS_COLORS[w.status] || '#6b5a3e'}
                    editTo={`/admin/works/${w.id}/edit`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent journal */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: '1.1rem', fontStyle: 'italic' }}>
                Recent Journal
              </h2>
              <Link to="/admin/journal" style={{ color: '#6b5a3e', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
                All entries →
              </Link>
            </div>
            {journal.length === 0 ? (
              <p style={{ color: '#3d2b14', fontStyle: 'italic', fontSize: '0.9rem' }}>The chronicle is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {journal.slice(0, 5).map(e => (
                  <RecentRow
                    key={e.id}
                    title={e.title}
                    sub={[e.category, e.read_time].filter(Boolean).join(' · ')}
                    statusLabel={e.published ? 'Published' : 'Draft'}
                    statusColor={e.published ? '#c9a84c' : '#6b5a3e'}
                    editTo={`/admin/journal/${e.id}/edit`}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
