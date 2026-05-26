<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: false })

interface AppMeta {
  url?: string
  link?: string
  href?: string
  icon?: string
  image?: string
  img?: string
  logo?: string
  color?: string
  description?: string
}

interface AppItem {
  id: number
  name: string
  description?: string
  meta?: AppMeta
}

const { user, logout } = useAuth()
const { apiFetch } = useApi()
const router = useRouter()

const apps = ref<AppItem[]>([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(0)
const searchQuery = ref('')

// Responsive window width — SSR-safe default, updated client-side
const windowWidth = ref(640)
let resizeTimer: ReturnType<typeof setTimeout>
const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => { windowWidth.value = window.innerWidth }, 150)
}

const colCount = computed(() => {
  if (windowWidth.value < 640) return 2
  if (windowWidth.value < 1024) return 3
  return 4
})

const rowCount = computed(() => (colCount.value === 2 ? 2 : 3))
const pageSize = computed(() => colCount.value * rowCount.value)

const containerMaxW = computed(() => {
  if (colCount.value === 2) return 'max-w-xs'
  if (colCount.value === 3) return 'max-w-md'
  return 'max-w-xl'
})

const now = ref(new Date())
let clockTimer: ReturnType<typeof setInterval>
const timeStr = computed(() =>
  now.value.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
)
const dateStr = computed(() =>
  now.value.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
)

const filteredApps = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return apps.value
  return apps.value.filter(a => a.name.toLowerCase().includes(q))
})

const chunks = computed(() => {
  const ps = pageSize.value
  const result: AppItem[][] = []
  for (let i = 0; i < filteredApps.value.length; i += ps) {
    result.push(filteredApps.value.slice(i, i + ps))
  }
  return result.length ? result : [[]]
})

const totalPages = computed(() => chunks.value.length)
const visibleApps = computed(() => chunks.value[currentPage.value] ?? [])

// Reset page when search or grid size changes
watch([searchQuery, pageSize], () => { currentPage.value = 0 })

const prev = () => { if (currentPage.value > 0) currentPage.value-- }
const next = () => { if (currentPage.value < totalPages.value - 1) currentPage.value++ }

let touchStartX = 0
const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX }
const onTouchEnd = (e: TouchEvent) => {
  const dx = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(dx) > 50) dx > 0 ? next() : prev()
}

const getAppUrl   = (app: AppItem) => app.meta?.url || app.meta?.link || app.meta?.href || '#'
const getAppIcon  = (app: AppItem) => app.meta?.icon || app.meta?.image || app.meta?.img || app.meta?.logo || null
const getAppColor = (app: AppItem) => app.meta?.color || null

const iconStyle = (app: AppItem): Record<string, string> => {
  const icon = getAppIcon(app)
  const color = getAppColor(app)
  if (icon) {
    return {
      backgroundImage: `url('${icon}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  if (color) {
    return { background: `linear-gradient(135deg,${color}44,${color}18)` }
  }
  return {}
}

const displayName = computed(() => user.value?.display_name || user.value?.username || 'Pengguna')
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase())

const handleLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(async () => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)
  clockTimer = setInterval(() => { now.value = new Date() }, 1000)
  try {
    const res = await apiFetch<AppItem[] | { data: AppItem[] }>('/app')
    apps.value = Array.isArray(res) ? res : (res as any).data ?? []
  } catch (err: any) {
    error.value = err?.data?.message || 'Gagal memuat daftar aplikasi.'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  clearInterval(clockTimer)
  clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="os-shell min-h-screen flex flex-col items-center justify-center select-none overflow-hidden px-4 py-6">

    <!-- Wallpaper -->
    <div class="wallpaper" aria-hidden="true">
      <div class="wallpaper-glow glow-1"></div>
      <div class="wallpaper-glow glow-2"></div>
      <div class="wallpaper-glow glow-3"></div>
    </div>

    <!-- Central column — width adapts to grid size -->
    <div class="relative z-10 flex flex-col items-center gap-3 w-full" :class="containerMaxW">

      <!-- Info bar — same width as search -->
      <div class="info-bar w-full">
        <div class="flex items-center gap-1.5">
          <div class="w-5 h-5 rounded-full bg-white/15 text-white text-[9px] font-black flex items-center justify-center shrink-0">
            {{ userInitial }}
          </div>
          <span class="text-white/60 text-xs font-semibold truncate max-w-[120px]">{{ displayName }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-white/40 text-[11px] font-medium">{{ dateStr }}</span>
          <span class="text-white font-black text-sm tabular-nums">{{ timeStr }}</span>
        </div>
      </div>

      <!-- Search -->
      <div class="spotlight w-full" :class="{ 'spotlight--active': searchQuery }">
        <svg class="text-white/35 shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari aplikasi..."
          class="spotlight-input"
          autocomplete="off"
          spellcheck="false"
        />
        <Transition name="fade-quick">
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-white/30 hover:text-white/70 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </Transition>
      </div>

      <!-- Grid area -->
      <div class="w-full mt-2">

        <!-- Loading skeleton -->
        <div
          v-if="loading"
          :style="`display:grid;grid-template-columns:repeat(${colCount},1fr);gap:1rem`"
        >
          <div v-for="i in pageSize" :key="i" class="flex flex-col items-center gap-2.5">
            <div class="w-full aspect-square rounded-2xl bg-white/5 animate-pulse"></div>
            <div class="w-14 h-2 rounded-full bg-white/5 animate-pulse"></div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="glass-card p-6 flex flex-col items-center gap-2 text-center">
          <div class="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <p class="text-white/50 text-sm">{{ error }}</p>
        </div>

        <!-- No search result -->
        <div v-else-if="apps.length && !filteredApps.length" class="flex flex-col items-center gap-2 py-6 text-center">
          <svg class="text-white/15" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <p class="text-white/30 text-xs">Tidak ada hasil untuk <span class="text-white/50">"{{ searchQuery }}"</span></p>
        </div>

        <!-- Empty -->
        <div v-else-if="!apps.length" class="flex flex-col items-center gap-2 py-6 text-center">
          <svg class="text-white/15" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          <p class="text-white/30 text-xs">Belum ada aplikasi</p>
        </div>

        <!-- Carousel grid -->
        <template v-else-if="filteredApps.length">
          <div @touchstart="onTouchStart" @touchend="onTouchEnd">
            <Transition name="page-slide" mode="out-in">
              <div
                :key="currentPage"
                :style="`display:grid;grid-template-columns:repeat(${colCount},1fr);gap:1rem`"
              >
                <component
                  :is="getAppUrl(app) !== '#' ? 'a' : 'button'"
                  v-for="app in visibleApps"
                  :key="app.id"
                  :href="getAppUrl(app) !== '#' ? getAppUrl(app) : undefined"
                  :target="getAppUrl(app) !== '#' ? '_blank' : undefined"
                  :rel="getAppUrl(app) !== '#' ? 'noopener noreferrer' : undefined"
                  class="app-item"
                >
                  <!-- Icon card — image fills cover -->
                  <div class="app-icon" :style="iconStyle(app)">
                    <!-- SVG fallback only when no image -->
                    <svg
                      v-if="!getAppIcon(app)"
                      xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                      :style="getAppColor(app) ? `color:${getAppColor(app)}` : ''"
                      :class="!getAppColor(app) ? 'text-white/35' : ''"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1"/>
                      <rect width="7" height="7" x="14" y="3" rx="1"/>
                      <rect width="7" height="7" x="14" y="14" rx="1"/>
                      <rect width="7" height="7" x="3" y="14" rx="1"/>
                    </svg>
                  </div>
                  <span class="app-label">{{ app.name }}</span>
                </component>

                <!-- Empty slots for last incomplete page -->
                <div
                  v-for="i in (pageSize - visibleApps.length)"
                  :key="`e-${i}`"
                  class="flex flex-col items-center gap-2.5"
                >
                  <div class="w-full aspect-square rounded-2xl border border-dashed border-white/5"></div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Dots nav -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-5">
            <button @click="prev" :disabled="currentPage === 0"
              class="text-white/25 hover:text-white/60 disabled:opacity-20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div class="flex gap-1.5 items-center">
              <button
                v-for="i in totalPages" :key="i"
                @click="currentPage = i - 1"
                :class="['rounded-full transition-all duration-300',
                  currentPage === i - 1
                    ? 'w-4 h-[5px] bg-white'
                    : 'w-[5px] h-[5px] bg-white/20 hover:bg-white/40']"
              />
            </div>
            <button @click="next" :disabled="currentPage === totalPages - 1"
              class="text-white/25 hover:text-white/60 disabled:opacity-20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Dock -->
    <footer class="dock">
      <div class="dock-inner">
        <NuxtLink to="/" class="dock-btn" title="Beranda">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span class="dock-label">Beranda</span>
        </NuxtLink>
        <div class="dock-divider"></div>
        <button @click="handleLogout" class="dock-btn dock-btn--danger" title="Keluar">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          <span class="dock-label">Keluar</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.os-shell {
  background: #0b1a12;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  position: relative;
}

/* Wallpaper */
.wallpaper { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.wallpaper-glow { position: absolute; border-radius: 9999px; filter: blur(120px); opacity: 0.22; }
.glow-1 { width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, #1a6b3a, transparent 70%); animation: pulse-slow 8s ease-in-out infinite; }
.glow-2 { width: 50%; height: 50%; bottom: -15%; right: -10%; background: radial-gradient(circle, #0d4a7a, transparent 70%); animation: pulse-slow 10s ease-in-out infinite 3s; }
.glow-3 { width: 40%; height: 40%; top: 35%; left: 30%; background: radial-gradient(circle, #0f3d28, transparent 70%); animation: pulse-slow 12s ease-in-out infinite 6s; }
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.22; }
  50%       { transform: scale(1.1); opacity: 0.32; }
}

/* Info bar */
.info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
}

/* Spotlight search */
.spotlight {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 0.875rem;
  padding: 0.55rem 0.875rem;
  box-shadow: 0 6px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.09);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.spotlight:focus-within {
  border-color: rgba(255,255,255,0.22);
  box-shadow: 0 8px 28px rgba(0,0,0,0.35), 0 0 0 3px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.12);
}
.spotlight-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255,255,255,0.88);
  font-size: 0.83rem;
  font-weight: 500;
}
.spotlight-input::placeholder { color: rgba(255,255,255,0.28); }
.spotlight-input::-webkit-search-cancel-button { display: none; }

/* App items */
.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

/* Icon — image fills entire card (cover) */
.app-icon {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 1.375rem;
  background-color: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.09);
  transition: transform 0.17s ease, box-shadow 0.17s ease, border-color 0.17s ease;
  overflow: hidden;
}
.app-item:hover .app-icon {
  transform: scale(1.06) translateY(-2px);
  border-color: rgba(255,255,255,0.22);
  box-shadow: 0 14px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
}
.app-item:active .app-icon { transform: scale(0.95); }

.app-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  text-align: center;
  line-height: 1.3;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 5px rgba(0,0,0,0.6);
  transition: color 0.15s;
}
.app-item:hover .app-label { color: rgba(255,255,255,0.95); }

/* Glass card */
.glass-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 1.25rem;
}

/* Dock */
.dock { position: fixed; bottom: 1rem; left: 0; right: 0; z-index: 20; display: flex; justify-content: center; pointer-events: none; }
.dock-inner { display: flex; align-items: center; gap: 0.875rem; background: rgba(255,255,255,0.08); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.10); border-radius: 9999px; padding: 0.45rem 1.125rem; box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08); pointer-events: all; }
.dock-btn { display: flex; align-items: center; gap: 0.35rem; color: rgba(255,255,255,0.45); transition: color 0.15s; cursor: pointer; background: none; border: none; padding: 0; }
.dock-btn:hover { color: rgba(255,255,255,0.88); }
.dock-btn--danger { color: rgba(248,113,113,0.6); }
.dock-btn--danger:hover { color: rgb(248,113,113); }
.dock-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.dock-divider { width: 1px; height: 1rem; background: rgba(255,255,255,0.10); }

/* Transitions */
.page-slide-enter-active, .page-slide-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.page-slide-enter-from { opacity: 0; transform: translateX(12px); }
.page-slide-leave-to   { opacity: 0; transform: translateX(-12px); }
.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.1s ease; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
</style>
