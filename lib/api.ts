export const browserDemo = process.env.NEXT_PUBLIC_DATA_MODE !== 'server';

export async function apiResponse(path: string, body?: unknown): Promise<Response> {
  if (browserDemo) return (await import('./browser-demo')).browserDemoResponse(path, body);
  return fetch('/api/' + path, body === undefined ? { cache: 'no-store' } : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
}

export async function api(path: string, body?: unknown): Promise<any> {
  const response = await apiResponse(path, body);
  const result: any = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed.');
  return result;
}
