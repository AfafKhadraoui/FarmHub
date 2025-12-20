// Simple cookie helper for client-side read/write/delete
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  // Escape name for use in RegExp
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  const escaped = escapeRegExp(name);
  const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, days: number = 7, path: string = '/') {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // Note: this sets a non-httpOnly cookie. For best security, prefer httpOnly cookies set by the backend.
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=${path}; SameSite=Lax`;
}

export function deleteCookie(name: string, path: string = '/') {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax`;
}
