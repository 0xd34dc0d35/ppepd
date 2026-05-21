import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

export interface RedirectEntry {
  url: string
  title: string
  created: string
  hits: number
}

export type RedirectMap = Record<string, RedirectEntry>

function dataPath() {
  return resolve(process.cwd(), 'server/data/redirects.json')
}

export function readRedirects(): RedirectMap {
  try {
    return JSON.parse(readFileSync(dataPath(), 'utf-8'))
  } catch {
    return {}
  }
}

export function writeRedirects(data: RedirectMap): void {
  const path = dataPath()
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
}

export function generateId(length = 6): string {
  // Excludes visually ambiguous chars: 0, o, 1, i, l
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let id = ''
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}
