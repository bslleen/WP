/**
 * API client for the Go backend.
 *
 * Set VITE_API_URL in your .env file to point at the backend:
 *   VITE_API_URL=http://localhost:8080
 *
 * When VITE_API_URL is not set the helpers fall back to the local
 * mock data in src/data/content.js — so the app runs without a server.
 */

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : null

// ─── Auth token ──────────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('api_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(method, path, body) {
  if (!BASE) throw new Error('No API URL configured')
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Login with owner password. Stores JWT in localStorage.
 * @param {string} password
 */
export async function login(password) {
  const data = await request('POST', '/auth/login', { password })
  localStorage.setItem('api_token', data.token)
  return data
}

export function apiLogout() {
  localStorage.removeItem('api_token')
}

// ─── Works ────────────────────────────────────────────────────────────────────

/** Fetch all published works, optionally filtered by category */
export async function getWorks({ category, status } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (status)   params.set('status', status)
  return request('GET', `/works?${params}`)
}

export async function getWork(id) {
  return request('GET', `/works/${id}`)
}

/**
 * Create a work (protected)
 * @param {{ title, description, excerpt, category, year, pages, status, cover_image, accent_color }} body
 */
export async function createWork(body) {
  return request('POST', '/works', body)
}

export async function updateWork(id, body) {
  return request('PUT', `/works/${id}`, body)
}

export async function deleteWork(id) {
  return request('DELETE', `/works/${id}`)
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export async function getJournalEntries() {
  return request('GET', '/journal')
}

export async function getJournalEntry(id) {
  return request('GET', `/journal/${id}`)
}

export async function createJournalEntry(body) {
  return request('POST', '/journal', body)
}

export async function updateJournalEntry(id, body) {
  return request('PUT', `/journal/${id}`, body)
}

export async function deleteJournalEntry(id) {
  return request('DELETE', `/journal/${id}`)
}

// ─── Image upload ─────────────────────────────────────────────────────────────

/**
 * Upload an image file to Cloudinary via the backend proxy
 * @param {File} file
 * @returns {{ url: string, public_id: string }}
 */
export async function uploadImage(file) {
  if (!BASE) throw new Error('No API URL configured')
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

// ─── Admin-only endpoints ─────────────────────────────────────────────────────

/** Returns ALL journal entries regardless of published status (protected) */
export async function getAllJournalEntries() {
  return request('GET', '/admin/journal')
}

/**
 * Change the owner password (protected)
 * @param {string} newPassword
 */
export async function changePassword(newPassword) {
  return request('PUT', '/auth/password', { new_password: newPassword })
}

// ─── About ────────────────────────────────────────────────────────────────────

export async function fetchAbout() {
  if (!BASE) return null
  return request('GET', '/about')
}

export async function updateAbout(body) {
  return request('PUT', '/admin/about', body)
}

// ─── Convenience: use mock data when no API is configured ────────────────────

import { works as mockWorks, journalEntries as mockJournal } from './content'

/**
 * Returns works from the API if configured, otherwise from mock data.
 * This lets the frontend run standalone without any backend.
 */
export async function fetchWorks(filters = {}) {
  if (!BASE) {
    let data = [...mockWorks]
    if (filters.category) data = data.filter(w => w.category.toLowerCase() === filters.category)
    if (filters.status)   data = data.filter(w => w.status.toLowerCase() === filters.status)
    return data
  }
  return getWorks(filters)
}

export async function fetchJournal() {
  if (!BASE) return [...mockJournal]
  return getJournalEntries()
}
