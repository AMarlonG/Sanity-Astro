import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Disable draft mode by removing the cookie
  cookies.delete('sanity-preview-mode', {
    path: '/',
  });

  // Redirect to homepage
  return redirect('/');
};

export const POST = GET;