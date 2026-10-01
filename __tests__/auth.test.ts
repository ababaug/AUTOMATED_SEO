/**
 * Authentication Tests (M1)
 */
import { describe, expect, it, jest } from '@jest/globals'
import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '../src/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

describe('Authentication Flow Tests via Middleware', () => {
  it('Expired session redirects to login for protected routes', async () => {
    // Mock the Supabase client to return no user (e.g. expired or invalid session)
    ;(createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn<() => Promise<{ data: { user: any | null } }>>().mockResolvedValue({ data: { user: null } }),
      },
    })

    const request = new NextRequest('http://localhost/dashboard', {
      method: 'GET',
    })

    const response = await updateSession(request)

    // The middleware should redirect unauthenticated requests away from /dashboard
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost/login')
  })

  it('Valid session allows access to protected routes', async () => {
    // Mock the Supabase client to return a valid user
    ;(createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn<() => Promise<{ data: { user: any | null } }>>().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
      },
    })

    const request = new NextRequest('http://localhost/dashboard', {
      method: 'GET',
    })

    const response = await updateSession(request)

    // Middleware allows the request to proceed (NextResponse.next())
    // which internally just returns a 200/empty response indicating it's a pass-through
    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('Unauthenticated users can access public routes', async () => {
    ;(createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn<() => Promise<{ data: { user: any | null } }>>().mockResolvedValue({ data: { user: null } }),
      },
    })

    const request = new NextRequest('http://localhost/login', {
      method: 'GET',
    })

    const response = await updateSession(request)

    // No redirection for the login page
    expect(response.status).toBe(200)
  })
})
