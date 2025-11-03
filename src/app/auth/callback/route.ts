import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin));
      }

      // Successful authentication - redirect to home page
      return NextResponse.redirect(new URL('/?login=success', requestUrl.origin));
    } catch (error) {
      console.error('Unexpected error during auth callback:', error);
      return NextResponse.redirect(new URL('/?error=unexpected', requestUrl.origin));
    }
  }

  // No code found - redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
