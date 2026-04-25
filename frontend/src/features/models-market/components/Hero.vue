<template>
  <section class="hero">
    <!-- 左：标题 + 副标题 + 计价单位说明 -->
    <div class="hero-text">
      <span class="hero-eyebrow">{{ t('eyebrow') }}</span>
      <h1 class="hero-title">{{ t('title') }}</h1>
      <p class="hero-subtitle">{{ t('subtitle') }}</p>
      <p class="hero-note">{{ t('unitNote') }}</p>
    </div>

    <!-- 右：三个统计卡（图标 + 数值 + 标签） -->
    <div class="hero-stats">
      <div class="stat">
        <div class="stat-icon stat-icon-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          </svg>
        </div>
        <div class="stat-meta">
          <p class="stat-value">{{ stats.group_count }}</p>
          <p class="stat-label">{{ t('stats.groupCount') }}</p>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon stat-icon-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"></path>
          </svg>
        </div>
        <div class="stat-meta">
          <p class="stat-value">{{ stats.model_count }}</p>
          <p class="stat-label">{{ t('stats.modelCount') }}</p>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon stat-icon-soft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div class="stat-meta">
          <p class="stat-value">{{ stats.platform_count }}</p>
          <p class="stat-label">{{ t('stats.platformCount') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useModelsMarketText } from '../i18n'
import type { PublicModelsStats } from '../types'

defineProps<{ stats: PublicModelsStats }>()
const { t } = useModelsMarketText()
</script>

<style scoped>
/* 卡壳：玻璃化容器 + 与全局 card 风格一致的圆角 / 边框 / 阴影 */
.hero {
  @apply rounded-3xl border border-gray-200/70 bg-white/70 p-6 backdrop-blur-xl;
  @apply shadow-card dark:border-dark-700/60 dark:bg-dark-800/70;
  @apply md:p-8;
  @apply grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center;
}

/* —— 左列：标题 + 副标题 —— */
.hero-text { @apply lg:col-span-7; }
.hero-eyebrow {
  @apply inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider;
  @apply bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300;
}
.hero-title {
  @apply mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl;
  @apply bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-dark-300;
}
.hero-subtitle { @apply mt-3 max-w-xl text-base leading-relaxed text-gray-600 dark:text-dark-300; }
.hero-note {
  @apply mt-4 inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium;
  @apply bg-gray-100 text-gray-600 dark:bg-dark-900/50 dark:text-dark-300;
}

/* —— 右列：3 个统计卡 ——
   单卡布局：图标在上、数值大字、label 在数值下方（垂直布局），比左右更稳，避免标签被截断 */
.hero-stats { @apply grid grid-cols-3 gap-2.5 sm:gap-3 lg:col-span-5; }
.stat {
  @apply flex flex-col items-start gap-2 rounded-2xl px-4 py-4 transition-all;
  @apply border border-gray-200/60 bg-white/90;
  @apply hover:-translate-y-0.5 hover:shadow-card-hover hover:border-primary-200;
  @apply dark:border-dark-700/60 dark:bg-dark-900/40 dark:hover:border-primary-700/60;
}
.stat-icon {
  @apply flex h-9 w-9 flex-none items-center justify-center rounded-lg;
}
.stat-icon svg { @apply h-4 w-4; }
.stat-icon-primary { @apply bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300; }
.stat-icon-accent { @apply bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400; }
.stat-icon-soft { @apply bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400; }
.stat-meta { @apply min-w-0 w-full; }
.stat-value { @apply text-2xl font-bold leading-none tabular-nums text-gray-900 dark:text-white md:text-[1.75rem]; }
.stat-label { @apply mt-1.5 text-xs text-gray-500 dark:text-dark-400; }
</style>
