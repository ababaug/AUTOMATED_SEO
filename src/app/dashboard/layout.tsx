import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OrgSelector from './OrgSelector'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id, organizations(name)')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) {
    return redirect('/onboarding')
  }

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r flex flex-col p-4">
        <h2 className="font-bold text-xl mb-6">Synmatics</h2>
        <div className="mb-4">
          <label className="text-xs text-gray-500 uppercase">Organization</label>
          <OrgSelector memberships={memberships} />
        </div>
        <div className="mt-auto">
          <form action={signOut}>
            <button className="text-sm text-gray-600 hover:text-black">Sign Out</button>
          </form>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  )
}
