import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  // Enable draft mode by setting a cookie
  cookies.set('sanity-preview-mode', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  // Redirect to the preview URL or homepage
  const previewUrl = url.searchParams.get('url') || '/';
  
  return redirect(previewUrl);
};

export const POST = GET;