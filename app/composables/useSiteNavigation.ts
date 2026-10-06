// Profil portal memakai menu yang sama pada desktop dan drawer mobile.
export const PERMATA_NAV = [
  { label: 'Beranda', to: '/permata#beranda' },
  { label: 'Artikel', to: '/permata#artikel' },
  { label: 'Desa Peduli Sumber Air', to: '/permata#desa-peduli-sumber-air' },
  { label: 'Kebijakan', to: '/permata#kebijakan' },
  { label: 'Sebaran Mata Air', to: '/permata#sebaran-mata-air' },
]

export const PRODANAU_NAV = [
  { label: 'Beranda', to: '/prodanau#beranda' },
  { label: 'Tentang', to: '/prodanau#tentang' },
  { label: 'Danau Prioritas', to: '/prodanau#danau-prioritas' },
  { label: 'Peta Sebaran', to: '/prodanau#peta-sebaran' },
  { label: 'Kebijakan', to: '/prodanau#kebijakan' },
  { label: 'Kelembagaan', to: '/prodanau#kelembagaan' },
  { label: 'Kontak', to: '/prodanau#kontak' },
]

export function useSiteNavigation() {
  const route = useRoute()
  const { visibleNav: globalNav } = useRole()
  const profiles = {
    ppepd: { brand: 'PPEPD', description: 'Ekosistem Perairan Darat · KLH/BPLH', home: '/', items: globalNav },
    permata: { brand: 'PERMATA', description: 'Perlindungan Mata Air · KLH/BPLH', home: '/permata', items: computed(() => PERMATA_NAV) },
    prodanau: { brand: 'PRODANAU', description: 'Profil Danau Indonesia · KLH/BPLH', home: '/prodanau', items: computed(() => PRODANAU_NAV) },
  }
  const profile = computed(() => profiles[route.meta.navigation === 'permata' ? 'permata' : route.meta.navigation === 'prodanau' ? 'prodanau' : 'ppepd'])
  const visibleNav = computed(() => profile.value.items.value)
  const primaryPaths = ['/', '/data', '/layanan', '/about']
  const primaryNav = computed(() => profile.value.brand === 'PERMATA' ? visibleNav.value : profile.value.brand === 'PRODANAU' ? visibleNav.value.slice(0, 4) : visibleNav.value.filter(item => primaryPaths.includes(item.to)))
  const secondaryNav = computed(() => profile.value.brand === 'PERMATA' ? [] : profile.value.brand === 'PRODANAU' ? visibleNav.value.slice(4) : visibleNav.value.filter(item => !primaryPaths.includes(item.to)))
  return { profile, visibleNav, primaryNav, secondaryNav }
}
