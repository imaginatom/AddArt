import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnv } from '@/lib/supabase/env'

export const config = {
  matcher: ['/admin/:path*'],
}

export async function middleware(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const applyCookies = (target: NextResponse) => {
    response.cookies.getAll().forEach((cookie) => {
      target.cookies.set(cookie)
    })
    return target
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isLoginRoute = pathname.startsWith('/admin/login')
  const isResetPasswordRoute = pathname.startsWith('/admin/reset-password')

  if (isResetPasswordRoute) {
    return response
  }

  if (isLoginRoute) {
    if (!user) {
      return response
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin'
      return applyCookies(NextResponse.redirect(redirectUrl))
    }

    return response
  }

  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/login'
    return applyCookies(NextResponse.redirect(redirectUrl))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return applyCookies(NextResponse.redirect(redirectUrl))
  }

  return response
}
