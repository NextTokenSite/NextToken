import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchPublicModels } from './api'
import type { PublicGroupEntry } from './types'

const CACHE_TTL_MS = 5 * 60 * 1000

/** 公开模型广场数据 store，5 分钟内重复调用不发请求。 */
export const useModelsMarketStore = defineStore('modelsMarket', () => {
  const groups = ref<PublicGroupEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fetchedAt = ref<number | null>(null)

  // 派生的统计信息（不需要后端返回 stats，本地算）
  const stats = computed(() => {
    let modelCount = 0
    const platformSet = new Set<string>()
    for (const g of groups.value) {
      modelCount += g.models.length
      platformSet.add(g.platform)
    }
    return {
      group_count: groups.value.length,
      model_count: modelCount,
      platform_count: platformSet.size,
    }
  })

  async function load(force = false): Promise<void> {
    if (!force && fetchedAt.value && Date.now() - fetchedAt.value < CACHE_TTL_MS) {
      return
    }
    loading.value = true
    error.value = null
    try {
      const resp = await fetchPublicModels()
      groups.value = resp
      fetchedAt.value = Date.now()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load models'
    } finally {
      loading.value = false
    }
  }

  return { groups, stats, loading, error, fetchedAt, load }
})
