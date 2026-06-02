import { useState, useEffect } from 'react'
import { fetchAbout, updateAbout, uploadImage } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const field = (label, value, onChange, opts = {}) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{
      display: 'block', color: '#6b5a3e', fontSize: '0.58rem',
      letterSpacing: '0.3em', textTransform: 'uppercase',
      fontFamily: "'Playfair Display', serif", marginBottom: '0.4rem',
    }}>{label}</label>
    {opts.multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={opts.rows || 5}
        style={inputStyle}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    )}
  </div>
)

const inputStyle = {
  width: '100%',
  background: 'rgba(26,18,9,0.6)',
  border: '1px solid rgba(138,109,47,0.3)',
  color: '#f0e6c8',
  padding: '0.6rem 0.85rem',
  fontSize: '0.9rem',
  fontFamily: "'Crimson Text', serif",
  outline: 'none',
  resize: 'vertical',
}

export default function AdminAbout() {
  const [form, setForm] = useState({
    name: '', tagline: '', email: '', photo_url: '',
    bio: [
      { heading: '', text: '' },
      { heading: '', text: '' },
      { heading: '', text: '' },
      { heading: '', text: '' },
    ],
    stats: [
      { num: '', label: '' },
      { num: '', label: '' },
      { num: '', label: '' },
      { num: '', label: '' },
    ],
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAbout().then(data => {
      if (!data) return
      setForm({
        name:      data.name      || '',
        tagline:   data.tagline   || '',
        email:     data.email     || '',
        photo_url: data.photo_url || '',
        bio: data.bio?.length ? data.bio : form.bio,
        stats: data.stats?.length ? data.stats : form.stats,
      })
    }).catch(() => {})
  }, [])

  const set = key => val => setForm(f => ({ ...f, [key]: val }))

  const setBio = (i, key) => val => setForm(f => {
    const bio = [...f.bio]
    bio[i] = { ...bio[i], [key]: val }
    return { ...f, bio }
  })

  const setStat = (i, key) => val => setForm(f => {
    const stats = [...f.stats]
    stats[i] = { ...stats[i], [key]: val }
    return { ...f, stats }
  })

  const handlePhoto = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadImage(file)
      setForm(f => ({ ...f, photo_url: res.url }))
    } catch {
      alert('Upload failed — check Cloudinary config or paste a URL manually.')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await updateAbout(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#4a3520', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          ✦ &nbsp; Profile &nbsp; ✦
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '2.2rem', fontStyle: 'italic' }}>
          About the Writer
        </h1>
      </div>

      <OrnateDivider className="mb-8" />

      {/* Identity */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={sectionHead}>Identity</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {field('Writer name', form.name, set('name'))}
          {field('Tagline', form.tagline, set('tagline'))}
        </div>
        {field('Contact email', form.email, set('email'))}

        {/* Photo */}
        <label style={{ display: 'block', color: '#6b5a3e', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", marginBottom: '0.4rem' }}>
          Portrait photo
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <input
            type="text"
            value={form.photo_url}
            onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
            placeholder="https://… or upload below"
            style={{ ...inputStyle, flex: 1 }}
          />
          <label style={{
            padding: '0.6rem 1rem', border: '1px solid rgba(138,109,47,0.4)',
            color: '#8a6d2f', fontSize: '0.65rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: "'Playfair Display', serif",
            opacity: uploading ? 0.5 : 1,
          }}>
            {uploading ? 'Uploading…' : 'Upload image'}
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
        {form.photo_url && (
          <img src={form.photo_url} alt="preview" style={{ height: '120px', objectFit: 'cover', border: '1px solid rgba(138,109,47,0.3)', marginBottom: '1rem' }} />
        )}
      </section>

      {/* Stats */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={sectionHead}>Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {form.stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={s.num}
                onChange={e => setStat(i, 'num')(e.target.value)}
                placeholder="6"
                style={{ ...inputStyle, width: '60px', flexShrink: 0, textAlign: 'center' }}
              />
              <input
                type="text"
                value={s.label}
                onChange={e => setStat(i, 'label')(e.target.value)}
                placeholder="Published Works"
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Bio sections */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={sectionHead}>Biography</h2>
        {form.bio.map((b, i) => (
          <div key={i} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < form.bio.length - 1 ? '1px solid rgba(138,109,47,0.1)' : 'none' }}>
            <input
              type="text"
              value={b.heading}
              onChange={e => setBio(i, 'heading')(e.target.value)}
              placeholder={`Section ${i + 1} heading`}
              style={{ ...inputStyle, marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            />
            <textarea
              value={b.text}
              onChange={e => setBio(i, 'text')(e.target.value)}
              rows={4}
              placeholder="Write this section…"
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
        ))}
      </section>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          onClick={save}
          disabled={saving}
          className="btn-gold"
          style={{ opacity: saving ? 0.5 : 1 }}
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        {saved && (
          <span style={{ color: '#c9a84c', fontSize: '0.7rem', letterSpacing: '0.15em', fontFamily: "'IM Fell English', serif", fontStyle: 'italic' }}>
            ✦ Saved
          </span>
        )}
      </div>
    </div>
  )
}

const sectionHead = {
  fontFamily: "'Playfair Display', serif",
  color: '#c9a84c',
  fontSize: '1rem',
  fontStyle: 'italic',
  marginBottom: '1rem',
}
