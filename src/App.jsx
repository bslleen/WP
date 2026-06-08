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
import AmbientAudio from './components/AmbientAudio'

import Home from './pages/Home'
import Works from './pages/Works'
import WorkDetail from './pages/WorkDetail'
import ChapterReader from './pages/ChapterReader'

import About from './pages/About'
import Journal from './pages/Journal'
import Secret from './pages/Secret'

import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminWorks from './pages/admin/AdminWorks'
import WorkForm from './pages/admin/WorkForm'
import AdminWorkDashboard from './pages/admin/AdminWorkDashboard'
import ChapterEditor from './pages/admin/ChapterEditor'
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
  const isChapterReader = /^\/works\/[^/]+\/chapter\/[^/]+/.test(location.pathname)

  const {
    showPasswordModal,
    setShowPasswordModal,
    isAuthenticated,
    loading,
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
            <Route path="/admin/works/:workId" element={
              <AdminRequireAuth>
                <PageTransition>
                  <AdminLayout><AdminWorkDashboard /></AdminLayout>
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
            <Route path="/admin/works/:workId/chapters/new" element={
              <AdminRequireAuth>
                <ChapterEditor />
              </AdminRequireAuth>
            } />
            <Route path="/admin/works/:workId/chapters/:chapterId" element={
              <AdminRequireAuth>
                <ChapterEditor />
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
      {!isChapterReader && <Navigation onCandleClick={triggerCandle} />}

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
            <Route path="/works/:workId" element={
              <PageTransition><WorkDetail /></PageTransition>
            } />
            <Route path="/works/:workId/chapter/:chapterId" element={
              <ChapterReader />
            } />
<Route path="/about" element={
              <PageTransition><About /></PageTransition>
            } />
            <Route path="/journal" element={
              <PageTransition><Journal /></PageTransition>
            } />
            <Route path="/secret" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <PageTransition><Secret onLogout={logout} /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <PageTransition><NotFound /></PageTransition>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {!isChapterReader && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DustMotes />
      <AmbientAudio />
      <AppInner />
    </BrowserRouter>
  )
}
