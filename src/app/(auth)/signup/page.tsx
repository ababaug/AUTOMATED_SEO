import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SignupPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams
  const signup = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      redirect(`/signup?error=${error.message}`)
    }

    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <form className="flex flex-col w-full max-w-sm gap-4 border p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {searchParams?.error && (
          <div className="bg-red-100 text-red-800 p-2 rounded text-sm">{searchParams.error}</div>
        )}
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="border p-2 rounded" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required className="border p-2 rounded" />
        <button formAction={signup} className="bg-blue-600 text-white p-2 rounded mt-2">
          Sign Up
        </button>
        <div className="text-center text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Log In</a>
        </div>
      </form>
    </div>
  )
}
