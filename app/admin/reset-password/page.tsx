'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminInfoPanel, AdminPageShell } from '@/components/admin/admin-ui'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminResetPasswordPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hasRecoverySession, setHasRecoverySession] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!isMounted) {
        return
      }

      if (sessionError) {
        setError(sessionError.message)
      }

      setHasRecoverySession(Boolean(data.session))
      setIsChecking(false)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return
      }

      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasRecoverySession(Boolean(session))
        setIsChecking(false)
      }
    })

    void checkSession()

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!hasRecoverySession) {
      setError('Invalid or expired reset link. Request a new one from the login page.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setIsSubmitting(false)
      return
    }

    await supabase.auth.signOut()
    setSuccessMessage('Password updated. Redirecting to login...')
    setIsSubmitting(false)
    window.setTimeout(() => router.replace('/admin/login'), 1200)
  }

  return (
    <AdminPageShell className="max-w-md py-20">
      <Card className="border-border/80 bg-card/95 shadow-xl shadow-black/5">
        <CardHeader className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Access</p>
          <CardTitle className="text-3xl">Reset password</CardTitle>
          <CardDescription>Choose a new password for your admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-new-password">New password</Label>
              <Input
                id="admin-new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-confirm-password">Confirm password</Label>
              <Input
                id="admin-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>

            {!isChecking && !hasRecoverySession ? (
              <AdminInfoPanel tone="error">
                Invalid or expired reset link. Go back to login and request a new one.
              </AdminInfoPanel>
            ) : null}

            {error ? (
              <AdminInfoPanel tone="error">{error}</AdminInfoPanel>
            ) : null}

            {successMessage ? (
              <AdminInfoPanel tone="success">{successMessage}</AdminInfoPanel>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isChecking || !hasRecoverySession}
            >
              {isSubmitting ? 'Updating password...' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminPageShell>
  )
}
