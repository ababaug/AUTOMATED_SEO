import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ResetPasswordPage(props: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const searchParams = await props.searchParams

  const resetPassword = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password/update`,
    })

    if (error) {
      redirect(`/reset-password?error=${error.message}`)
    }

    redirect(`/reset-password?message=Check your email for a password reset link`)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <form className="flex flex-col w-full max-w-sm gap-4 border p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {searchParams?.error && (
          <div className="bg-red-100 text-red-800 p-2 rounded text-sm">{searchParams.error}</div>
        )}
        {searchParams?.message && (
          <div className="bg-green-100 text-green-800 p-2 rounded text-sm">{searchParams.message}</div>
        )}
        <p className="text-sm text-gray-600 mb-4">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <label htmlFor="email" className="font-semibold text-sm">Email</label>
        <input id="email" name="email" type="email" required className="border p-2 rounded" />
        <button formAction={resetPassword} className="bg-blue-600 text-white p-2 rounded mt-2">
          Send Reset Link
        </button>
        <div className="text-center text-sm mt-4">
          Remembered it? <a href="/login" className="text-blue-600">Log In</a>
        </div>
      </form>
    </div>
  )
}
