'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AdminPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard by default
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Admin Dashboard...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  )
}

export default AdminPage
