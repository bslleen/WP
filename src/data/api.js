import { db, storage, auth } from '../firebase'
import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
} from 'firebase/auth'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb)

export const getCurrentUser = () => auth.currentUser

export async function changePassword(newPassword) {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated.')
  return updatePassword(user, newPassword)
}

// ─── Works — public reads (published only) ────────────────────────────────────

export async function fetchWorks(category = null) {
  let q = query(collection(db, 'works'), where('status', '==', 'published'))
  if (category) {
    q = query(collection(db, 'works'), where('status', '==', 'published'), where('category', '==', category))
  }
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
}

// ─── Works — admin reads (all) ────────────────────────────────────────────────

export async function fetchAllWorks() {
  const snap = await getDocs(
    query(collection(db, 'works'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function fetchWork(id) {
  const snap = await getDoc(doc(db, 'works', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createWork(data) {
  return addDoc(collection(db, 'works'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateWork(id, data) {
  return updateDoc(doc(db, 'works', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteWork(id) {
  return deleteDoc(doc(db, 'works', id))
}

// ─── Journal — public reads (published only) ──────────────────────────────────

export async function fetchJournal() {
  const snap = await getDocs(
    query(collection(db, 'journal'), where('published', '==', true))
  )
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
}

// ─── Journal — admin reads (all) ──────────────────────────────────────────────

export async function fetchAllJournal() {
  const snap = await getDocs(
    query(collection(db, 'journal'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function fetchJournalEntry(id) {
  const snap = await getDoc(doc(db, 'journal', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createJournalEntry(data) {
  return addDoc(collection(db, 'journal'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateJournalEntry(id, data) {
  return updateDoc(doc(db, 'journal', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteJournalEntry(id) {
  return deleteDoc(doc(db, 'journal', id))
}

// ─── Profile — single doc ─────────────────────────────────────────────────────

export async function fetchProfile() {
  const snap = await getDoc(doc(db, 'config', 'profile'))
  return snap.exists() ? snap.data() : null
}

export async function updateProfile(data) {
  return setDoc(doc(db, 'config', 'profile'), data, { merge: true })
}

// alias for About page
export const fetchAbout = fetchProfile
export const updateAbout = updateProfile

// ─── Private journal — owner only ─────────────────────────────────────────────

export async function fetchPrivateEntries() {
  const snap = await getDocs(
    query(collection(db, 'private'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createPrivateEntry(data) {
  return addDoc(collection(db, 'private'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updatePrivateEntry(id, data) {
  return updateDoc(doc(db, 'private', id), data)
}

export async function deletePrivateEntry(id) {
  return deleteDoc(doc(db, 'private', id))
}

// ─── Letters to the future — owner only ──────────────────────────────────────

export async function fetchLetters() {
  const snap = await getDocs(
    query(collection(db, 'letters'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createLetter(data) {
  return addDoc(collection(db, 'letters'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function deleteLetter(id) {
  return deleteDoc(doc(db, 'letters', id))
}

// ─── Image upload ─────────────────────────────────────────────────────────────

export async function uploadImage(file, path = 'covers') {
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
