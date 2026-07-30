/**
 * Local wall-clock time a story hit the wire, e.g. "06:12".
 *
 * Deliberately local rather than UTC: readers scan the feed against their own
 * clock. Times will not match the UTC values in stories.json.
 */
export function formatFiled(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
