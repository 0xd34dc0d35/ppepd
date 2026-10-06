export function useSafeRedirect(value: unknown, fallback = '/apps') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return fallback
  if (/^\/(login|register)(?:[/?#]|$)/.test(value)) return fallback
  return value
}
