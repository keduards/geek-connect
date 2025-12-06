import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next') ?? '/onboarding'
  
  // For local auth, just redirect to the next page
  // The login form already handles authentication
  return NextResponse.redirect(`${origin}${next}`)
}

