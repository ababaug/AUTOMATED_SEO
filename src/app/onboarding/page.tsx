import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const createOrg = async (formData: FormData) => {
    'use server'
    const name = formData.get('name') as string
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Call securely definer RPC to handle atomic creation
    const { error: orgError } = await supabase
      .rpc('create_organization', { org_name: name })

    if (orgError) {
      console.error(orgError)
      return redirect('/onboarding?error=Could not create organization')
    }

    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
        <p className="text-gray-600 mb-6">Let&apos;s create your first organization to get started.</p>

        <form action={createOrg} className="flex flex-col gap-4">
          <label htmlFor="name" className="font-semibold text-sm">Organization Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Acme Corp"
            required
            className="border p-2 rounded"
          />
          <button className="bg-blue-600 text-white py-2 rounded mt-4">
            Create Organization
          </button>
        </form>
      </div>
    </div>
  )
}
