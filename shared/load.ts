/**
 * Fetches a JSON file served alongside the page. Fails when the file is
 * missing, including on servers that answer a missing file with a page.
 */
export async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path} answered ${response.status}`);
  if (!response.headers.get('content-type')?.includes('json')) throw new Error(`${path} isn't JSON`);
  return (await response.json()) as T;
}
