// Middleware disabled for local database mode
// Auth is handled client-side with localStorage
export async function middleware() {
  // No-op for local database
}

export const config = {
  matcher: [
    // Match nothing - middleware disabled
    '/__non-existent__',
  ],
}

