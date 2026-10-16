export interface MangroveLayer {
  id: string
  title: string
  kind: 'mangrove' | 'habitat' | 'grid' | 'province' | 'village'
  year: number | null
  url: string
  provider: string | null
  attribution: string | null
  recovered: boolean
  recoveryDate: string | null
  metadataComplete: boolean
  extent: number[] | null
  sourceLayer: string
  field: string | null
  categories: { value: string; label: string; color: string }[]
  color: string
  minZoom: number
  maxZoom: number
}

const color = (value: unknown, fallback: string) => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value) ? value : fallback
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null

export function formatMangroveDensity(value: unknown): string {
  const label = typeof value === 'string' ? value.trim() : ''
  const key = label.replace(/^mangrove\s+/i, '').toLowerCase()
  return ({ lebat: 'Lebat', sedang: 'Sedang', jarang: 'Jarang' } as Record<string, string>)[key] || label
}

// Only consume the anonymous, active catalog. A cache URL is not proof of authorship.
export function normalizeMangroveCatalog(rows: unknown): MangroveLayer[] {
  if (!Array.isArray(rows)) throw new Error('Invalid catalog response')
  const seen = new Set<string>()
  return rows.flatMap((row): MangroveLayer[] => {
    if (!row || typeof row !== 'object' || row.is_active !== true || row.restricted || row.can_access === false) return []
    if (typeof row.id !== 'string' || seen.has(row.id)) return []
    const title = text(row.title)
    if (!title) return []
    let kind: MangroveLayer['kind']
    const edition = title.match(/^Mangrove (\d{4})$/i)
    if (edition) kind = 'mangrove'
    else if (/^Potensi habitat mangrove\s*\/\s*KLM$/i.test(title)) kind = 'habitat'
    else if (/^Grid KLM 25K$/i.test(title)) kind = 'grid'
    else if (/^Batas provinsi Indonesia$/i.test(title)) kind = 'province'
    else if (/^Batas administrasi desa Indonesia$/i.test(title)) kind = 'village'
    else return []
    let url: URL
    try { url = new URL(row.data_url) } catch { return [] }
    // Public shared storage only. Do not expose private/internal service URLs.
    if (url.origin !== 'https://ppepd.kemenlh.go.id' || !url.pathname.startsWith('/storage/ppepd/') || !url.pathname.endsWith('.pmtiles') || url.search || url.username || url.password) return []
    const metadata = row.metadata || {}
    const style = row.style || {}
    const vector = Array.isArray(metadata.vector_layers) ? metadata.vector_layers[0] : null
    if (!text(vector?.id)) return []
    const categories = Array.isArray(style.categories) ? style.categories.flatMap((entry: any) => {
      if (!entry || !text(entry.value) || !text(entry.label) || !/^#[\da-f]{6}$/i.test(entry.fill)) return []
      return [{ value: entry.value, label: formatMangroveDensity(entry.label), color: entry.fill }]
    }) : []
    const year = Number.isInteger(row.year) ? row.year : null
    // Reject contradictory editions instead of silently relabeling a layer.
    if (edition && year !== Number(edition[1])) return []
    const provider = text(row.provider)
    const attribution = text(row.attribution)
    const recovered = Boolean(metadata.recovery)
    seen.add(row.id)
    return [{
      id: row.id, title, kind, year, url: url.href, provider, attribution, recovered,
      recoveryDate: text(metadata.recovery?.date),
      metadataComplete: Boolean(provider && attribution && metadata.recovery?.original_catalog_metadata_available !== false),
      extent: Array.isArray(row.extent) && row.extent.length === 4 && row.extent.every(Number.isFinite) && row.extent[0] < row.extent[2] && row.extent[1] < row.extent[3] ? row.extent : null,
      sourceLayer: vector.id, field: text(style.field), categories,
      color: color(style.fill, '#005952'),
      // Cache metadata describes native tile zoom, unlike the catalog display zoom.
      minZoom: Number.isFinite(metadata.min_zoom) ? metadata.min_zoom : 0,
      maxZoom: Number.isFinite(metadata.max_zoom) ? metadata.max_zoom : 18,
    }]
  }).sort((a, b) => (b.year || 0) - (a.year || 0))
}
