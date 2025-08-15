import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Shell from './components/Shell'
import ErrorBoundary from './components/ErrorBoundary'
import { AppProvider } from './store/app.jsx'
import Summary from './pages/Summary'
import Goals from './pages/Goals'
import Habits from './pages/Habits'
import Wishes from './pages/Wishes'
import Notes from './pages/Notes'
import Competitions from './pages/Competitions'
import Settings from './pages/Settings'
import ThemeSelection from './pages/ThemeSelection'
import ProtectedRoute from './components/ProtectedRoute'

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  
  return (
    <Routes>
      <Route path="/" element={<Summary />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/wishes" element={<Wishes />} />
      <Route path="/notes" element={
        <ProtectedRoute sectionName="Notes" settingKey="notes">
          <Notes />
        </ProtectedRoute>
      } />
      <Route path="/competitions" element={
        <ProtectedRoute sectionName="Competitions" settingKey="competitions">
          <Competitions />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={<Settings />} />
      <Route path="/themes" element={<ThemeSelection />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App(){
  // Initialize Telegram WebApp on first render
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        console.log('Initializing Telegram WebApp...')
        window.Telegram.WebApp.ready()
        console.log('Telegram WebApp ready called successfully')
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error)
    }
  }, [])

  // Global error handlers for iOS webview
  React.useEffect(() => {
    const handleError = (event) => {
      console.error('Global error caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    }

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', {
        reason: event.reason,
        promise: event.promise
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
  
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </Shell>
      </AppProvider>
    </ErrorBoundary>
  )
}
