export async function fetchCsv(path: string) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`CSV not found: ${path}`);
  const text = await res.text();
  const [head, ...rows] = text.trim().split(/\r?\n/);
  const headers = head.split(',').map(h => h.trim());
  return rows.map(r => {
    const cells = r.split(',').map(c => c.trim());
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
  });
}
