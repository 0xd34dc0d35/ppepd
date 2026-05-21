export interface ShareResult {
  id: string
  url: string
  title: string
  shortPath: string
  shortUrl: string
}

export const useShare = () => {
  function fullUrl(shortPath: string): string {
    if (import.meta.client) return `${window.location.origin}${shortPath}`
    return shortPath
  }

  async function createShareLink(url: string, title = '', customId?: string): Promise<ShareResult> {
    const data = await $fetch<Omit<ShareResult, 'shortUrl'>>('/api/s', {
      method: 'POST',
      body: { url, title, customId },
    })
    return { ...data, shortUrl: fullUrl(data.shortPath) }
  }

  async function copyShareLink(url: string, title = ''): Promise<ShareResult> {
    const result = await createShareLink(url, title)
    if (navigator?.clipboard) await navigator.clipboard.writeText(result.shortUrl)
    return result
  }

  return { createShareLink, copyShareLink, fullUrl }
}
