export interface SourceConfig {
  id: string
  label: string
  domain: string
  description: string
  flag: string
}

export const SOURCES: SourceConfig[] = [
  {
    id: 'dawn',
    label: 'Dawn',
    domain: 'dawn.com',
    description: "Pakistan's largest English-language newspaper",
    flag: '🇵🇰',
  },
  {
    id: 'tribune',
    label: 'Express Tribune',
    domain: 'tribune.com.pk',
    description: "Pakistan's leading English-language newspaper",
    flag: '🇵🇰',
  },
  // { id: 'geo',     label: 'Geo News',        domain: 'geo.tv',         description: '...', flag: '🇵🇰' },
  // { id: 'guardian',label: 'The Guardian',    domain: 'theguardian.com',description: '...', flag: '🇬🇧' },
]

export const DEFAULT_SOURCE = SOURCES[0].id

export function getSourceConfig(id: string): SourceConfig {
  return SOURCES.find(s => s.id === id) ?? SOURCES[0]
}
