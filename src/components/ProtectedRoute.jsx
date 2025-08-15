import React from 'react'
import { useApp } from '../store/app.jsx'
import HiddenSection from './ui/HiddenSection'

export default function ProtectedRoute({ children, sectionName, settingKey }) {
  const { data } = useApp()
  const isVisible = data?.settings?.visibility?.[settingKey] !== false

  if (!isVisible) {
    return <HiddenSection sectionName={sectionName} />
  }

  return children
}
