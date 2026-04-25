<template>
  <section class="group-section">
    <header class="group-head">
      <div class="group-head-main">
        <span class="platform-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m12 2 9 5-9 5-9-5 9-5z"></path>
            <path d="m3 17 9 5 9-5M3 12l9 5 9-5" opacity="0.55"></path>
          </svg>
          {{ group.platform }}
        </span>
        <div class="group-title-block">
          <h2 class="group-title">{{ group.name }}</h2>
          <p v-if="group.description" class="group-desc">{{ group.description }}</p>
        </div>
      </div>

      <div class="group-meta">
        <span class="meta-chip meta-chip-rate" :title="t('group.rate', { rate: group.rate_multiplier.toFixed(2) })">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 5 5 19M9 5h-4v4M19 15v4h-4"></path>
          </svg>
          {{ t('group.rate', { rate: group.rate_multiplier.toFixed(2) }) }}
        </span>
        <span class="meta-chip meta-chip-count">
          {{ t('group.modelCount', { n: group.models.length }) }}
        </span>
      </div>
    </header>

    <div class="model-grid">
      <PriceCard v-for="m in group.models" :key="`${group.id}-${m.id}`" :model="m" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useModelsMarketText } from '../i18n'
import type { PublicGroupEntry } from '../types'
import PriceCard from './PriceCard.vue'

defineProps<{ group: PublicGroupEntry }>()
const { t } = useModelsMarketText()
</script>

<style scoped>
/* —— 分组容器 —— */
.group-section {
  @apply rounded-3xl border border-gray-200/70 bg-white/70 p-5 backdrop-blur-xl shadow-card;
  @apply dark:border-dark-700/60 dark:bg-dark-800/70;
  @apply md:p-6;
}

/* —— 分组头部：左主信息 + 右元数据 chip —— */
.group-head {
  @apply mb-5 flex flex-col gap-3;
  @apply md:flex-row md:items-start md:justify-between md:gap-6;
}
.group-head-main { @apply flex flex-col gap-2 min-w-0; }

.platform-chip {
  @apply inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold;
  @apply bg-primary-50 text-primary-700 ring-1 ring-primary-100;
  @apply dark:bg-primary-900/30 dark:text-primary-300 dark:ring-primary-800/40;
}
.platform-chip svg { @apply h-3.5 w-3.5; }

.group-title-block { @apply min-w-0; }
.group-title { @apply text-xl font-bold tracking-tight text-gray-900 dark:text-white md:text-[1.375rem]; }
.group-desc { @apply mt-0.5 text-sm text-gray-500 dark:text-dark-400; }

/* —— 右侧元数据 —— */
.group-meta { @apply flex flex-wrap items-center gap-2; }
.meta-chip {
  @apply inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium;
}
.meta-chip-rate {
  @apply bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 tabular-nums;
  @apply dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-700/40;
}
.meta-chip-rate svg { @apply h-3 w-3; }
.meta-chip-count {
  @apply bg-gray-100 text-gray-600 ring-1 ring-gray-200/70;
  @apply dark:bg-dark-700/60 dark:text-dark-300 dark:ring-dark-600/50;
}

/* —— 模型卡网格 —— */
.model-grid { @apply grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3; }
</style>
