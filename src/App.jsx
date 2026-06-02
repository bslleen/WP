import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import PasswordModal from './components/PasswordModal'
import ProtectedRoute from './components/ProtectedRoute'
import { useSecretAccess } from './hooks/useSecretAccess'
import AdminRequireAuth from './components/admin/AdminRequireAuth'
import AdminLayout from './components/admin/AdminLayout'

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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppInner() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

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
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRequireAuth>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/works"
            element={
              <AdminRequireAuth>
                <AdminLayout><AdminWorks /></AdminLayout>
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/works/new"
            element={
              <AdminRequireAuth>
                <AdminLayout><WorkForm /></AdminLayout>
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/works/:id/edit"
            element={
              <AdminRequireAuth>
                <AdminLayout><WorkForm /></AdminLayout>
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/journal"
            element={
              <AdminRequireAuth>
                <AdminLayout><AdminJournal /></AdminLayout>
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/journal/new"
            element={
              <AdminRequireAuth>
                <AdminLayout><JournalForm /></AdminLayout>
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/journal/:id/edit"
            element={
              <AdminRequireAuth>
                <AdminLayout><JournalForm /></AdminLayout>
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRequireAuth>
                <AdminLayout><AdminSettings /></AdminLayout>
              </AdminRequireAuth>
            }
          />
        </Routes>
      </>
    )
  }

  // Public site
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navigation onCandleClick={triggerCandle} />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={tryPassword}
      />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/all" element={<WorksAll />} />
          <Route path="/about" element={<About />} />
          <Route path="/journal" element={<Journal />} />
          <Route
            path="/secret"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Secret onLogout={logout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
