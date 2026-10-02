import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import VerifyButton from './VerifyButton'

export default async function DashboardPage(props: { searchParams: Promise<{ orgId?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: memberships } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) {
    redirect('/onboarding')
  }

  let orgId = searchParams.orgId
  if (!orgId || !memberships.find(m => m.organization_id === orgId)) {
    orgId = memberships[0].organization_id
    redirect(`/dashboard?orgId=${orgId}`)
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', orgId)

  const { data: entitlement } = await supabase
    .from('entitlements')
    .select('*')
    .eq('organization_id', orgId)
    .single()

  const createProject = async (formData: FormData) => {
    'use server'
    const name = formData.get('name') as string
    const url = formData.get('url') as string
    const supabase = await createClient()

    await supabase.from('projects').insert({
      organization_id: orgId,
      name,
      url,
    })

    redirect('/dashboard')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Plan: {entitlement?.status || 'Trial'}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-bold mb-4">Add Project</h2>
        <form action={createProject} className="flex gap-4">
          <input name="name" type="text" placeholder="Project Name" required className="border p-2 rounded flex-1" />
          <input name="url" type="url" placeholder="https://example.com" required className="border p-2 rounded flex-1" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Your Projects</h2>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded shadow border">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{p.url}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <span className={`px-2 py-1 rounded ${p.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.status === 'unverified' && (
                    <VerifyButton projectId={p.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects yet. Add one above.</p>
        )}
      </div>
    </div>
  )
}
