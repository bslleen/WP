import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import PasswordModal from './components/PasswordModal'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import { useSecretAccess } from './hooks/useSecretAccess'
import AdminRequireAuth from './components/admin/AdminRequireAuth'
import AdminLayout from './components/admin/AdminLayout'
import DustMotes from './components/DustMotes'
import AmbientSound from './components/AmbientSound'
import MusicPlayer from './components/MusicPlayer'

import Home from './pages/Home'
import Works from './pages/Works'
import WorksAll from './pages/WorksAll'
import About from './pages/About'
import Journal from './pages/Journal'
import Secret from './pages/Secret'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminWorks from './pages/admin/AdminWorks'
import WorkForm from './pages/admin/WorkForm'
import AdminJournal from './pages/admin/AdminJournal'
import JournalForm from './pages/admin/JournalForm'
import AdminSettings from './pages/admin/AdminSettings'
import AdminAbout from './pages/admin/AdminAbout'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppInner() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const [musicOpen, setMusicOpen] = useState(false)

  const {
    showPasswordModal,
    setShowPasswordModal,
    isAuthenticated,
    tryPassword,
    triggerCandle,
    logout,
  } = useSecretAccess()

  // Admin section: no public nav/footer
  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/admin/login" element={
              <PageTransition><AdminLogin /></PageTransition>
            } />
            <Route path="/admin" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/works" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><AdminWorks /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/works/new" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><WorkForm /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/works/:id/edit" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><WorkForm /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/journal" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><AdminJournal /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/journal/new" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><JournalForm /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/journal/:id/edit" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><JournalForm /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/about" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><AdminAbout /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
            <Route path="/admin/settings" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><AdminSettings /></AdminLayout>
                </PageTransition>
              </AdminRequireAuth>
            } />
          </Routes>
        </AnimatePresence>
      </>
    )
  }

  // Public site
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navigation onCandleClick={triggerCandle} />
      <MusicPlayer open={musicOpen} onToggle={() => setMusicOpen(o => !o)} />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={tryPassword}
      />

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition><Home /></PageTransition>
            } />
            <Route path="/works" element={
              <PageTransition><Works /></PageTransition>
            } />
            <Route path="/works/all" element={
              <PageTransition><WorksAll /></PageTransition>
            } />
            <Route path="/about" element={
              <PageTransition><About /></PageTransition>
            } />
            <Route path="/journal" element={
              <PageTransition><Journal /></PageTransition>
            } />
            <Route path="/secret" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PageTransition><Secret onLogout={logout} /></PageTransition>
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DustMotes />
      <AmbientSound />
      <AppInner />
    </BrowserRouter>
  )
}
