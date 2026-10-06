<script setup lang="ts">
// Header situs — pola "Navbar Sub-Brand" DS KLH/BPLH v2.1 §04:
// utility bar (tautan ke situs induk + toolbar aksesibilitas) → navbar brand ganda + tautan datar + aksi.
// Item navigasi bersumber dari useRole() (lihat docs/NAVIGATION.md).
const { visibleNav, profile, primaryNav, secondaryNav } = useSiteNavigation()
const { user, isLoggedIn, logout, fetchMe } = useAuth()
const route = useRoute()
const router = useRouter()

onMounted(() => { fetchMe().catch(() => {}) })

const displayName = computed(() => user.value?.display_name || user.value?.username || '')
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase())

const isActive = (to: string) => {
  const [path, hash] = to.split('#')
  if (hash) return route.path === path && (route.hash === `#${hash}` || (!route.hash && hash === 'beranda'))
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)
}

// ── Menu pengguna ──────────────────────────────────────────────────────────
const userMenuOpen = ref(false)
const moreOpen = ref(false)
const moreRef = ref<HTMLElement | null>(null)
const moreButtonRef = ref<HTMLButtonElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)
const onDocClick = (e: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) userMenuOpen.value = false
  if (moreRef.value && !moreRef.value.contains(e.target as Node)) moreOpen.value = false
}
const handleLogout = async () => {
  userMenuOpen.value = false
  closeDrawer()
  await logout()
  router.push('/')
}

// ── Drawer mobile: fokus terkelola, Esc menutup, scrim dapat diklik ──────────
const drawerOpen = ref(false)
const drawerRef = ref<HTMLElement | null>(null)
const burgerRef = ref<HTMLButtonElement | null>(null)

const focusables = () =>
  Array.from(drawerRef.value?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? [])

const openDrawer = async () => {
  drawerOpen.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  focusables()[0]?.focus()
}
const closeDrawer = (restoreFocus = false) => {
  if (!drawerOpen.value) return
  drawerOpen.value = false
  document.body.style.overflow = ''
  if (restoreFocus) burgerRef.value?.focus()
}
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (moreOpen.value) { moreOpen.value = false; moreButtonRef.value?.focus() }
    if (drawerOpen.value) closeDrawer(true)
    userMenuOpen.value = false
    return
  }
  if (e.key === 'Tab' && drawerOpen.value) {
    const items = focusables()
    if (!items.length) return
    const first = items[0]!
    const last = items[items.length - 1]!
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

watch(() => route.fullPath, () => { closeDrawer(); userMenuOpen.value = false; moreOpen.value = false })

// Tinggi header → --klh-header-h, dipakai halaman setinggi viewport (katalog, beranda).
// Diukur ulang karena berubah saat teks diperbesar lewat toolbar aksesibilitas.
const headerRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
  if (headerRef.value) {
    resizeObserver = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty('--klh-header-h', `${Math.round(entry!.borderBoxSize[0]!.blockSize)}px`)
    })
    resizeObserver.observe(headerRef.value)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  resizeObserver?.disconnect()
})
</script>

<template>
  <header ref="headerRef" class="sticky top-0 z-50">
    <!-- Utility bar -->
    <div class="bg-klh-green-900 text-klh-green-100">
      <div class="mx-auto flex max-w-header items-center justify-between gap-2 px-4 md:px-6">
        <a
          href="https://kemenlh.go.id"
          class="inline-flex min-h-[44px] items-center gap-1.5 truncate text-xs font-medium text-klh-green-100 hover:text-white"
        >
          <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          <span class="hidden sm:inline">Situs Utama KLH/BPLH</span>
          <span class="sm:hidden">KLH/BPLH</span>
        </a>
        <KlhA11yToolbar />
      </div>
    </div>

    <!-- Navbar -->
    <nav class="border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/90" aria-label="Navigasi utama">
      <div class="mx-auto flex h-16 max-w-header items-center justify-between gap-4 px-4 md:px-6">
        <NuxtLink :to="profile.home" class="flex min-w-0 items-center gap-3" :aria-label="`${profile.brand} — Beranda`">
          <img src="/logo.png" alt="" width="40" height="40" class="h-10 w-10 shrink-0">
          <span class="flex min-w-0 flex-col leading-tight">
            <span class="font-display text-lg font-extrabold tracking-tight text-klh-green-700">{{ profile.brand }}</span>
            <span class="truncate text-[11px] font-medium text-ink-500">{{ profile.description }}</span>
          </span>
        </NuxtLink>

        <!-- Tautan datar (≥1280) -->
        <ul class="hidden items-center gap-1 xl:flex">
          <li v-for="item in primaryNav" :key="item.to">
            <NuxtLink
              :to="item.to"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              :class="[
                'relative inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold transition-colors',
                isActive(item.to)
                  ? 'text-klh-green-700 after:absolute after:inset-x-3 after:-bottom-[10px] after:h-[3px] after:rounded-full after:bg-klh-green-600'
                  : 'text-ink-700 hover:bg-klh-green-50 hover:text-klh-green-700',
              ]"
            >{{ item.label }}</NuxtLink>
          </li>
          <li v-if="secondaryNav.length" ref="moreRef" class="relative">
            <button ref="moreButtonRef" type="button" class="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-semibold hover:bg-klh-green-50" :class="moreOpen || secondaryNav.some(item => isActive(item.to)) ? 'text-klh-green-700' : 'text-ink-700'" :aria-expanded="moreOpen" aria-controls="ppepd-more-nav" @click="moreOpen = !moreOpen">
              Lainnya
              <svg aria-hidden="true" class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <ul v-if="moreOpen" id="ppepd-more-nav" class="absolute right-0 top-full mt-2 w-60 rounded-xl border border-line bg-surface p-2 shadow-klh-2">
              <li v-for="item in secondaryNav" :key="item.to">
                <NuxtLink :to="item.to" :aria-current="isActive(item.to) ? 'page' : undefined" class="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold hover:bg-klh-green-50" :class="isActive(item.to) ? 'text-klh-green-700 bg-klh-green-50' : 'text-ink-700'">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>

        <div class="flex shrink-0 items-center gap-2">
          <NuxtLink v-if="profile.brand !== 'PPEPD'" to="/" class="btn btn-outline btn-sm hidden sm:inline-flex">PPEPD</NuxtLink>
          <!-- Aksi khusus halaman (mis. CTA dashboard) -->
          <slot name="actions" />
          <!-- Aksi akun -->
          <NuxtLink v-if="!isLoggedIn" to="/login" class="btn btn-primary btn-sm hidden sm:inline-flex">
            <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5M15 12H3"/></svg>
            Masuk
          </NuxtLink>
          <div v-else ref="userMenuRef" class="relative hidden sm:block">
            <button
              type="button"
              class="flex min-h-[44px] items-center gap-2 rounded-lg px-2 hover:bg-klh-green-50"
              :aria-expanded="userMenuOpen"
              aria-haspopup="menu"
              @click="userMenuOpen = !userMenuOpen"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-klh-green-600 text-sm font-bold text-white" aria-hidden="true">{{ userInitial }}</span>
              <span class="max-w-[120px] truncate text-sm font-semibold text-ink-700">{{ displayName }}</span>
              <svg :class="['icon--sm text-ink-500 transition-transform', userMenuOpen && 'rotate-180']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <Transition name="dropdown">
              <div v-if="userMenuOpen" role="menu" class="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface shadow-klh-3">
                <div class="border-b border-line px-4 py-3">
                  <p class="text-xs text-ink-500">Masuk sebagai</p>
                  <p class="truncate text-sm font-semibold text-ink-900">{{ displayName }}</p>
                </div>
                <div class="py-1">
                  <NuxtLink to="/apps" role="menuitem" class="flex min-h-[44px] items-center gap-2 px-4 text-sm text-ink-700 hover:bg-klh-green-50 hover:text-klh-green-700">Aplikasi</NuxtLink>
                  <NuxtLink to="/my-profiles" role="menuitem" class="flex min-h-[44px] items-center gap-2 px-4 text-sm text-ink-700 hover:bg-klh-green-50 hover:text-klh-green-700">
                    <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    Profil Saya
                  </NuxtLink>
                  <button type="button" role="menuitem" class="flex min-h-[44px] w-full items-center gap-2 px-4 text-left text-sm text-danger hover:bg-danger-bg" @click="handleLogout">
                    <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>
                    Keluar
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Burger (<1280) -->
          <button
            ref="burgerRef"
            type="button"
            class="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-700 hover:border-klh-green-600 hover:text-klh-green-700 xl:hidden"
            :aria-expanded="drawerOpen"
            aria-controls="klh-drawer"
            @click="openDrawer"
          >
            <svg class="icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            Menu
          </button>
        </div>
      </div>
    </nav>

    <!-- Drawer mobile -->
    <Transition name="fade-backdrop">
      <div v-if="drawerOpen" class="fixed inset-0 z-[60] bg-ink-900/40 xl:hidden" aria-hidden="true" @click="closeDrawer(true)" />
    </Transition>
    <Transition name="slide-drawer">
      <div
        v-if="drawerOpen"
        id="klh-drawer"
        ref="drawerRef"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        class="fixed inset-y-0 right-0 z-[70] flex w-[min(320px,88vw)] flex-col bg-surface shadow-klh-3 xl:hidden"
      >
        <div class="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <span class="font-display text-base font-bold text-ink-900">Menu</span>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-500 hover:bg-klh-green-50 hover:text-klh-green-700"
            aria-label="Tutup menu"
            @click="closeDrawer(true)"
          >
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <nav class="flex-grow overflow-y-auto p-3" aria-label="Navigasi utama (mobile)">
          <NuxtLink
            v-for="item in visibleNav"
            :key="item.to"
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            :class="[
              'flex min-h-[44px] items-center rounded-lg px-3 text-[15px] font-semibold transition-colors',
              isActive(item.to) ? 'bg-klh-green-50 text-klh-green-700' : 'text-ink-700 hover:bg-surface-2 hover:text-klh-green-700',
            ]"
          >{{ item.label }}</NuxtLink>
        </nav>

        <div class="shrink-0 space-y-2 border-t border-line p-4">
          <NuxtLink v-if="profile.brand !== 'PPEPD'" to="/" class="btn btn-outline w-full">Kembali ke PPEPD</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/login" class="btn btn-primary w-full">Masuk</NuxtLink>
          <template v-else>
            <p class="px-1 text-xs text-ink-500">Masuk sebagai <span class="font-semibold text-ink-900">{{ displayName }}</span></p>
            <NuxtLink to="/my-profiles" class="btn btn-outline w-full">Profil Saya</NuxtLink>
            <NuxtLink to="/apps" class="btn btn-outline w-full">Aplikasi</NuxtLink>
            <button type="button" class="btn w-full text-danger hover:bg-danger-bg" @click="handleLogout">Keluar</button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fade-backdrop-enter-active, .fade-backdrop-leave-active { transition: opacity .25s ease; }
.fade-backdrop-enter-from, .fade-backdrop-leave-to { opacity: 0; }
.slide-drawer-enter-active, .slide-drawer-leave-active { transition: transform .3s cubic-bezier(.16, 1, .3, 1); }
.slide-drawer-enter-from, .slide-drawer-leave-to { transform: translateX(100%); }
.dropdown-enter-active, .dropdown-leave-active { transition: opacity .15s ease, transform .15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
