<template>
  <div class="market-page">
    <!-- 装饰背景层：teal blur 球 + 网格点阵，与 HomeView 设计语言保持一致 -->
    <div class="market-bg" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="market-grid"></div>
    </div>

    <!-- 顶部导航：sticky + glass，避免长滚动时失去定位 -->
    <header class="market-header">
      <div class="market-header-inner">
        <router-link to="/home" class="market-brand">
          <img :src="siteLogo || '/logo.png'" alt="Logo" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-name">{{ siteName }}</span>
            <span class="brand-section">{{ t('title') }}</span>
          </div>
        </router-link>

        <div class="header-actions">
          <!-- 语言切换：复用全局 LocaleSwitcher，与 HomeView 保持一致 -->
          <LocaleSwitcher />

          <!-- 文档链接（仅当后台配置了 doc_url 时显示） -->
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            :title="t('header.docs')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </a>

          <!-- 主题切换 -->
          <button
            type="button"
            class="icon-btn"
            :title="isDark ? t('header.switchToLight') : t('header.switchToDark')"
            @click="toggleTheme"
          >
            <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>

          <!-- 返回首页 -->
          <router-link to="/home" class="header-link">{{ t('header.backHome') }}</router-link>

          <!-- 登录 / 控制台 -->
          <router-link v-if="!isAuthenticated" to="/login" class="btn btn-primary btn-sm">{{ t('header.login') }}</router-link>
          <router-link v-else :to="dashboardPath" class="btn btn-primary btn-sm">{{ t('header.dashboard') }}</router-link>
        </div>
      </div>
    </header>

    <main class="market-main">
      <Hero :stats="store.stats" />

      <Filters
        v-model="filterState"
        :platforms="availablePlatforms"
        :groups="availableGroupNames"
      />

      <!-- Loading（首次） -->
      <div v-if="store.loading && !store.fetchedAt" class="skeleton-grid">
        <div v-for="i in 6" :key="i" class="skeleton-card" />
      </div>

      <!-- Error -->
      <div v-else-if="store.error" class="state state-error">
        <div class="state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4M12 16h.01"></path>
          </svg>
        </div>
        <h3>{{ t('error.title') }}</h3>
        <p>{{ store.error }}</p>
        <button class="btn btn-secondary" @click="store.load(true)">{{ t('error.retry') }}</button>
      </div>

      <!-- 空数据 -->
      <div v-else-if="store.groups.length === 0" class="state state-empty">
        <div class="state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"></path>
          </svg>
        </div>
        <h3>{{ t('empty.title') }}</h3>
        <p>{{ t('empty.desc') }}</p>
        <router-link to="/home" class="btn btn-primary">{{ t('empty.backHome') }}</router-link>
      </div>

      <!-- 筛选无结果 -->
      <div v-else-if="filteredGroups.length === 0" class="state state-empty">
        <div class="state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <p>{{ t('empty.filtered') }}</p>
        <button class="btn btn-secondary" @click="resetFilters">{{ t('empty.reset') }}</button>
      </div>

      <!-- 分组列表 -->
      <div v-else class="group-list">
        <GroupSection
          v-for="g in filteredGroups"
          :key="g.id"
          :group="g"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useModelsMarketStore } from './store'
import { useModelsMarketText } from './i18n'
import Hero from './components/Hero.vue'
import Filters, { type FilterState } from './components/Filters.vue'
import GroupSection from './components/GroupSection.vue'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import type { PublicModelEntry } from './types'

const appStore = useAppStore()
const authStore = useAuthStore()
const store = useModelsMarketStore()
const { t } = useModelsMarketText()

// —— 主题切换（与 HomeView 完全对齐：localStorage + html.dark class） ——
const isDark = ref(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const siteName = computed(() => appStore.siteName)
const siteLogo = computed(() => appStore.siteLogo)
const docUrl = computed(() => (appStore.cachedPublicSettings as Record<string, unknown> | null)?.doc_url as string | undefined ?? '')
const isAuthenticated = computed(() => authStore.isAuthenticated)
const dashboardPath = computed(() => (authStore.isAdmin ? '/admin/dashboard' : '/dashboard'))

const filterState = ref<FilterState>({ search: '', platform: '', priceType: '', group: '' })

const availablePlatforms = computed(() => Array.from(new Set(store.groups.map((g) => g.platform))).sort())
const availableGroupNames = computed(() => Array.from(new Set(store.groups.map((g) => g.name))).sort())

// matchesPriceType 决定一个模型是否匹配"类型"筛选项。
// '' 不筛选；'unpriced' 仅匹配 price_status=unpriced；'token' / 'image' 匹配 priced 且 pricing_mode 对应。
function matchesPriceType(m: PublicModelEntry, priceType: FilterState['priceType']): boolean {
  if (priceType === '') return true
  if (priceType === 'unpriced') return m.pricing.price_status === 'unpriced'
  if (m.pricing.price_status !== 'priced') return false
  return m.pricing.pricing_mode === priceType
}

const filteredGroups = computed(() => {
  const q = filterState.value.search.trim().toLowerCase()
  const { platform, priceType, group } = filterState.value

  return store.groups
    .filter((g) =>
      (!platform || g.platform === platform) &&
      (!group || g.name === group),
    )
    .map((g) => ({
      ...g,
      models: g.models.filter((m) => {
        if (!matchesPriceType(m, priceType)) return false
        if (!q) return true
        return (
          m.display_name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          g.name.toLowerCase().includes(q)
        )
      }),
    }))
    .filter((g) => g.models.length > 0)
})

function resetFilters() {
  filterState.value = { search: '', platform: '', priceType: '', group: '' }
}

onMounted(() => store.load())
</script>

<style scoped>
/* 页面壳：浅 slate 底，避免和卡片白底之间产生明显色阶；装饰层负责氛围。 */
.market-page { @apply relative min-h-screen overflow-hidden bg-gray-50 dark:bg-dark-950; }

/* —— 装饰背景：4 个 teal blur 球 + 1 层网格 —— */
.market-bg { @apply pointer-events-none absolute inset-0 overflow-hidden; }
.blob { @apply absolute rounded-full blur-3xl; }
.blob-1 { @apply -right-40 -top-40 h-96 w-96 bg-primary-400/15; }
.blob-2 { @apply -bottom-40 -left-40 h-96 w-96 bg-primary-500/10; }
.blob-3 { @apply left-1/3 top-1/4 h-72 w-72 bg-primary-300/10; }
.market-grid {
  @apply absolute inset-0;
  background-image:
    linear-gradient(rgba(20, 184, 166, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20, 184, 166, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}
:global(.dark) .market-grid {
  background-image:
    linear-gradient(rgba(45, 212, 191, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45, 212, 191, 0.05) 1px, transparent 1px);
}

/* —— Header（sticky + glass） —— */
.market-header {
  @apply sticky top-0 z-30;
  @apply border-b border-gray-200/60 dark:border-dark-700/60;
  @apply bg-white/70 backdrop-blur-xl dark:bg-dark-900/70;
}
.market-header-inner { @apply mx-auto flex max-w-7xl items-center justify-between px-6 py-3; }
.market-brand { @apply flex items-center gap-3 transition-opacity hover:opacity-90; }
.brand-logo { @apply h-9 w-9 rounded-xl object-contain shadow-sm ring-1 ring-gray-200/60 dark:ring-dark-700/60; }
.brand-text { @apply flex flex-col leading-tight; }
.brand-name { @apply text-sm font-semibold text-gray-900 dark:text-white; }
.brand-section { @apply text-xs text-gray-500 dark:text-dark-400; }
.header-actions { @apply flex items-center gap-2 sm:gap-3; }
.header-link {
  @apply hidden text-sm font-medium text-gray-600 transition-colors sm:inline-flex;
  @apply hover:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400;
}
.icon-btn {
  @apply inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors;
  @apply hover:bg-gray-100 hover:text-gray-700 dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-white;
}
.icon-btn svg { @apply h-[18px] w-[18px]; }

/* —— Main —— */
.market-main { @apply relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-20 pt-8; }

/* —— Skeleton —— */
.skeleton-grid { @apply grid gap-4 md:grid-cols-2 lg:grid-cols-3; }
.skeleton-card {
  @apply h-52 animate-pulse rounded-2xl;
  @apply border border-gray-200/60 bg-white/60 dark:border-dark-700/60 dark:bg-dark-800/60;
}

/* —— 状态卡（error / empty / 无结果），共用一套 —— */
.state {
  @apply flex flex-col items-center rounded-2xl px-6 py-12 text-center;
  @apply border border-gray-200/70 bg-white/70 backdrop-blur-sm shadow-sm;
  @apply dark:border-dark-700/60 dark:bg-dark-800/70;
}
.state-icon {
  @apply mb-4 flex h-14 w-14 items-center justify-center rounded-2xl;
  @apply bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400;
}
.state-icon svg { @apply h-7 w-7; }
.state h3 { @apply mb-1.5 text-lg font-semibold text-gray-900 dark:text-white; }
.state p { @apply mb-5 max-w-md text-sm text-gray-500 dark:text-dark-400; }

.group-list { @apply flex flex-col gap-6; }
</style>
