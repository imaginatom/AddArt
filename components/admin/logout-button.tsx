'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, type ButtonProps } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type LogoutButtonProps = ButtonProps & {
  redirectTo?: string
}

export function LogoutButton({
  redirectTo = '/',
  children = 'Logout',
  ...props
}: LogoutButtonProps) {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.replace(redirectTo)
    router.refresh()
  }

  return (
    <Button onClick={handleLogout} disabled={isLoading} {...props}>
      {isLoading ? 'Signing out...' : children}
    </Button>
  )
}
