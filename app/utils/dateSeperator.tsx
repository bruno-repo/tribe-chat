export function shouldInsertDateSeparator(current: number, previous?: number): boolean {
  if (!previous) return true;
  const cur = new Date(current).toDateString();
  const prev = new Date(previous).toDateString();
  return cur !== prev;
}

export function formatDate(timestamp: number) {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}