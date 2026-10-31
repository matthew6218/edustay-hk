// Next.js may normalize the request URL's hostname (including loopback hosts).
// Host retains the browser's destination. Never trust an arbitrary forwarded host.
export function requestOrigin(request: Request, https = false): string {
  const url = new URL(request.url);
  const host = request.headers.get('host') || url.host;
  if (/[\s,/@\\?#]/.test(host)) throw new Error('Invalid request host.');
  const protocol = https ? 'https:' : url.protocol;
  const origin = new URL(`${protocol}//${host}`);
  if (origin.username || origin.password || origin.pathname !== '/') {
    throw new Error('Invalid request host.');
  }
  return origin.origin;
}
