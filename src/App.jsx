import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shell from './components/Shell'
import { AppProvider } from './store/app.jsx'
import Summary from './pages/Summary'
import Goals from './pages/Goals'
import Habits from './pages/Habits'
import Wishes from './pages/Wishes'
import Notes from './pages/Notes'
import Competitions from './pages/Competitions'
import Settings from './pages/Settings'

export default function App(){
  return (<AppProvider>
    <Shell>
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
    </Shell>
  </AppProvider>)
}
