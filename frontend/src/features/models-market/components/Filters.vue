<template>
  <div class="filters">
    <!-- 搜索框（带左侧 icon） -->
    <div class="search-box">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        type="text"
        :value="modelValue.search"
        @input="onChange('search', ($event.target as HTMLInputElement).value)"
        :placeholder="t('search.placeholder')"
        class="input search-input"
      />
      <button
        v-if="modelValue.search"
        type="button"
        class="search-clear"
        :aria-label="t('empty.reset')"
        @click="onChange('search', '')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- 下拉选择组（移动端两列、桌面端三列） -->
    <div class="select-row">
      <label class="select-wrap">
        <select
          :value="modelValue.platform"
          @change="onChange('platform', ($event.target as HTMLSelectElement).value)"
          class="input select"
        >
          <option value="">{{ t('filter.allPlatforms') }}</option>
          <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
        </select>
        <ChevronIcon />
      </label>

      <label class="select-wrap">
        <select
          :value="modelValue.priceType"
          @change="onChange('priceType', ($event.target as HTMLSelectElement).value as PriceTypeFilter)"
          class="input select"
        >
          <option value="">{{ t('filter.allTypes') }}</option>
          <option value="token">{{ t('filter.typeToken') }}</option>
          <option value="image">{{ t('filter.typeImage') }}</option>
          <option value="unpriced">{{ t('filter.typeUnpriced') }}</option>
        </select>
        <ChevronIcon />
      </label>

      <label class="select-wrap">
        <select
          :value="modelValue.group"
          @change="onChange('group', ($event.target as HTMLSelectElement).value)"
          class="input select"
        >
          <option value="">{{ t('filter.allGroups') }}</option>
          <option v-for="g in groups" :key="g" :value="g">{{ g }}</option>
        </select>
        <ChevronIcon />
      </label>
    </div>

    <button
      v-if="hasActiveFilter"
      type="button"
      class="reset-btn"
      @click="resetAll"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path>
        <path d="M3 3v5h5"></path>
      </svg>
      {{ t('empty.reset') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useModelsMarketText } from '../i18n'
import type { PriceTypeFilter } from '../types'

export interface FilterState {
  search: string
  platform: string
  priceType: PriceTypeFilter
  group: string
}

const props = defineProps<{
  modelValue: FilterState
  platforms: string[]
  groups: string[]
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: FilterState): void }>()
const { t } = useModelsMarketText()

// 任意筛选项被设置即显示重置按钮，避免空状态下显示无意义动作
const hasActiveFilter = computed(() =>
  Boolean(props.modelValue.search || props.modelValue.platform || props.modelValue.priceType || props.modelValue.group),
)

function onChange<K extends keyof FilterState>(key: K, value: FilterState[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
function resetAll() {
  emit('update:modelValue', { search: '', platform: '', priceType: '', group: '' })
}

// 内联 ChevronIcon：避免引入新文件，单一职责的下拉箭头装饰
const ChevronIcon = () =>
  h(
    'svg',
    {
      class: 'select-chevron',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    [h('path', { d: 'm6 9 6 6 6-6' })],
  )
</script>

<style scoped>
/* 容器：玻璃化卡 + 内部网格布局，搜索宽、selects 自适应、reset 末尾 */
.filters {
  @apply flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white/70 p-4 backdrop-blur-xl;
  @apply shadow-card dark:border-dark-700/60 dark:bg-dark-800/70;
  @apply md:flex-row md:items-center md:gap-3 md:p-3;
}

/* —— 搜索框 —— */
.search-box { @apply relative flex-1 min-w-0 md:max-w-md; }
.search-icon {
  @apply pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-dark-400;
}
.search-input {
  @apply pl-10 pr-9;
  @apply h-11;
}
.search-clear {
  @apply absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md;
  @apply text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700;
  @apply dark:hover:bg-dark-700 dark:hover:text-white;
}
.search-clear svg { @apply h-3.5 w-3.5; }

/* —— Select 组 —— */
.select-row {
  @apply grid grid-cols-2 gap-2 md:flex md:flex-1 md:items-center;
}
.select-wrap { @apply relative block min-w-0 md:flex-1 md:max-w-[12rem]; }
.select {
  @apply h-11 cursor-pointer pr-9;
  @apply appearance-none;
}
.select-chevron {
  @apply pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-dark-400;
}

/* —— 重置按钮 —— */
.reset-btn {
  @apply inline-flex items-center gap-1.5 self-end rounded-xl px-3 py-2 text-xs font-medium;
  @apply text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900;
  @apply dark:text-dark-300 dark:hover:bg-dark-700 dark:hover:text-white;
  @apply md:self-auto;
}
.reset-btn svg { @apply h-3.5 w-3.5; }
</style>
