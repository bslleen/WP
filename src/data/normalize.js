// Maps API snake_case work to the shape the UI components expect
const CATEGORY_COVER = {
  novel:          '#1a1004',
  poetry:         '#0d1420',
  'short story':  '#0d1a14',
}

export function normalizeWork(w) {
  return {
    ...w,
    category:    capitalize(w.category),
    status:      capitalizeStatus(w.status),
    accentColor: w.accent_color || '#c9a84c',
    coverColor:  CATEGORY_COVER[w.category] || '#1a1209',
  }
}

export function normalizeJournal(e) {
  return {
    ...e,
    date:     e.created_at ? formatDate(e.created_at) : (e.date || ''),
    readTime: e.read_time || '',
    category: e.category || '',
  }
}

function capitalize(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function capitalizeStatus(s = '') {
  return s.split(' ').map(capitalize).join(' ')
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return '' }
}
