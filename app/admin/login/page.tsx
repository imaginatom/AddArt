'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminInfoPanel, AdminPageShell } from '@/components/admin/admin-ui'
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
    <AdminPageShell className="max-w-md py-20">
      <Card className="border-border/80 bg-card/95 shadow-xl shadow-black/5">
        <CardHeader className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Access</p>
          <CardTitle className="text-3xl">Sign in</CardTitle>
          <CardDescription>Use your admin credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <AdminInfoPanel tone="error">{error}</AdminInfoPanel>
            ) : null}

            {resetMessage ? (
              <AdminInfoPanel tone="success">{resetMessage}</AdminInfoPanel>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isChecking}
            >
              {isSubmitting || isChecking ? 'Checking access...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminPageShell>
  )
}
