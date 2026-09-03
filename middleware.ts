import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = (forwardedHost || request.headers.get('host') || '')
    .split(',')[0]
    .trim()
    .split(':')[0]
    .toLowerCase()

  if (host === 'zaynclock.com') {
    const destination = request.nextUrl.clone()
    destination.protocol = 'https:'
    destination.hostname = 'www.zaynclock.com'
    destination.port = ''
    return NextResponse.redirect(destination, 301)
  }

  return NextResponse.next()
}
