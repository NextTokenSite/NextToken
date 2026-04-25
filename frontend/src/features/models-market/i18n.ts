import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// feature-local i18n。不调用 i18n.global.mergeLocaleMessage（避免被 lazy load
// 的 setLocaleMessage 覆盖）。直接使用全局 locale 值做本地查表。
const messages = {
  zh: {
    title: '模型广场',
    subtitle: '按公开分组浏览当前可用模型与已包含分组倍率的实际扣费价格。',
    eyebrow: '公开模型 · 透明定价',
    unitNote: '价格单位为 USD / 1M Token，已按渠道基础价 × 分组倍率计算。',
    'stats.groupCount': '匹配分组',
    'stats.modelCount': '匹配模型',
    'stats.platformCount': '个平台',
    'search.placeholder': '搜索分组名、模型 ID 或显示名称',
    'filter.allPlatforms': '全部平台',
    'filter.allTypes': '全部类型',
    'filter.allGroups': '全部分组',
    'filter.typeToken': 'Token 计费',
    'filter.typeImage': '图片计费',
    'filter.typeUnpriced': '暂无定价',
    'group.rate': '分组倍率 x{rate}',
    'group.modelCount': '{n} 个模型',
    'card.tokenBilling': 'Token 计费',
    'card.imageBilling': '图片计费',
    'card.requestBilling': '按次计费',
    'card.unpriced': '暂无定价',
    'price.input': '输入',
    'price.output': '输出',
    'price.cacheRead': '缓存读取',
    'price.cacheWrite': '缓存写入',
    'price.image': '图像输出',
    'price.perRequest': '按次',
    'price.unitToken': 'USD / 1M Token',
    'price.unitRequest': 'USD / 次',
    'empty.title': '暂无公开模型',
    'empty.desc': '当前没有公开分组可展示。',
    'empty.filtered': '未找到匹配的模型，请调整筛选条件',
    'empty.reset': '重置筛选',
    'empty.backHome': '返回首页',
    'error.title': '加载失败',
    'error.retry': '重试',
    'header.docs': '文档',
    'header.backHome': '返回首页',
    'header.login': '登录',
    'header.dashboard': '控制台',
    'header.switchToLight': '切换到浅色模式',
    'header.switchToDark': '切换到深色模式',
  },
  en: {
    title: 'Models Market',
    subtitle: 'Browse currently available models by public group, with the final billing price already calculated by group rate multiplier.',
    eyebrow: 'Public models · Transparent pricing',
    unitNote: 'Prices are in USD per 1M tokens, calculated as channel base × group rate multiplier.',
    'stats.groupCount': 'Groups',
    'stats.modelCount': 'Models',
    'stats.platformCount': 'Platforms',
    'search.placeholder': 'Search group name, model ID or display name',
    'filter.allPlatforms': 'All Platforms',
    'filter.allTypes': 'All Types',
    'filter.allGroups': 'All Groups',
    'filter.typeToken': 'Token-based',
    'filter.typeImage': 'Image-based',
    'filter.typeUnpriced': 'Unpriced',
    'group.rate': 'Group rate x{rate}',
    'group.modelCount': '{n} models',
    'card.tokenBilling': 'Token-based',
    'card.imageBilling': 'Image-based',
    'card.requestBilling': 'Per-request',
    'card.unpriced': 'Unpriced',
    'price.input': 'Input',
    'price.output': 'Output',
    'price.cacheRead': 'Cache read',
    'price.cacheWrite': 'Cache write',
    'price.image': 'Image output',
    'price.perRequest': 'Per request',
    'price.unitToken': 'USD / 1M tokens',
    'price.unitRequest': 'USD / request',
    'empty.title': 'No public models',
    'empty.desc': 'No public groups available at the moment.',
    'empty.filtered': 'No models match the current filters',
    'empty.reset': 'Reset filters',
    'empty.backHome': 'Back to home',
    'error.title': 'Failed to load',
    'error.retry': 'Retry',
    'header.docs': 'Docs',
    'header.backHome': 'Back to home',
    'header.login': 'Sign in',
    'header.dashboard': 'Dashboard',
    'header.switchToLight': 'Switch to light mode',
    'header.switchToDark': 'Switch to dark mode',
  },
} as const

type Lang = keyof typeof messages
type MessageKey = keyof (typeof messages)['zh']

export function useModelsMarketText() {
  const { locale } = useI18n()
  const lang = computed<Lang>(() => (locale.value === 'zh' ? 'zh' : 'en'))

  function t(key: MessageKey, params?: Record<string, string | number>): string {
    let s: string = messages[lang.value][key]
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      }
    }
    return s
  }

  return { t, locale: lang }
}
