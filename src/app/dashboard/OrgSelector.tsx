'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition } from 'react'

export default function OrgSelector({ memberships }: { memberships: { organization_id: string; organizations: { name: string } | { name: string }[] | null }[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentOrg = searchParams.get('orgId') || (memberships.length > 0 ? memberships[0].organization_id : '')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = e.target.value
    startTransition(() => {
      router.push(`/dashboard?orgId=${orgId}`)
    })
  }

  return (
    <select
      value={currentOrg}
      onChange={handleChange}
      className="w-full border rounded p-1 mt-1 text-sm"
    >
      {memberships.map((m) => (
        <option key={m.organization_id} value={m.organization_id}>
          {Array.isArray(m.organizations) ? m.organizations[0]?.name : (m.organizations as { name: string })?.name}
        </option>
      ))}
    </select>
  )
}
