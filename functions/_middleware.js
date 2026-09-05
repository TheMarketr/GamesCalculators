const PRIMARY_HOST = 'gamescalculators.com';
const PAGES_HOST = 'gamescalculators.pages.dev';

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === PAGES_HOST) {
    url.protocol = 'https:';
    url.hostname = PRIMARY_HOST;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
