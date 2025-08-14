import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function App(){
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Summary />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/wishes" element={<Wishes />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Shell>
      </AppProvider>
    </ErrorBoundary>
  )
}
