'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error: userError } = await supabase.auth.getUser()

      if (userError || !data.user) {
        setIsChecking(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (!profileError && profile?.role === 'admin') {
        router.replace('/admin')
        return
      }

      await supabase.auth.signOut()
      setIsChecking(false)
    }

    void checkSession()
  }, [router, supabase])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setResetMessage(null)
    setIsSubmitting(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      setError(signInError?.message ?? 'Unable to sign in.')
      setIsSubmitting(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut()
      router.replace('/')
      return
    }

    router.replace('/admin')
  }

  const handleForgotPassword = async () => {
    setError(null)
    setResetMessage(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Enter your admin email first.')
      return
    }

    setIsSendingReset(true)
    const redirectTo = `${window.location.origin}/admin/reset-password`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo,
    })

    if (resetError) {
      setError(resetError.message)
      setIsSendingReset(false)
      return
    }

    setResetMessage('If an account exists for this email, a reset link has been sent.')
    setIsSendingReset(false)
  }

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-16">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Admin Access
          </p>
          <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Use your admin credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              disabled={isSubmitting || isSendingReset || isChecking}
            >
              {isSendingReset ? 'Sending reset link...' : 'Forgot password?'}
            </button>
          </div>

          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {resetMessage ? (
            <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
              {resetMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isChecking}
          >
            {isSubmitting || isChecking ? 'Checking access...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </section>
  )
}
