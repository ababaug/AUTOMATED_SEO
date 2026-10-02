'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VerifyButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const verify = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/verify-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(`Verification failed: ${data.error}`)
      }
    } catch (err: unknown) {
      alert(`Error verifying project: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={verify}
      disabled={loading}
      className="bg-blue-600 text-white text-xs px-2 py-1 rounded disabled:opacity-50"
    >
      {loading ? 'Verifying...' : 'Verify Ownership'}
    </button>
  )
}
