<script setup lang="ts">
// "复制 Markdown" 按钮:从同源 fetch 当前页对应的 .md 源文件,写入剪贴板。
// 与参考站行为对齐——把整篇 markdown 直接喂给 LLM 时方便。
import { computed, ref, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'

const { page, frontmatter } = useData()

// 当前页对应的源 markdown 相对路径(如 "quickstart.md"、"platform/create-key.md")
const relativePath = computed(() => page.value.relativePath || '')

// 仅在文档页(.md 结尾)显示按钮;首页 layout: home 也排除
const visible = computed(() => {
  if (frontmatter.value?.layout === 'home') return false
  return relativePath.value.endsWith('.md')
})

const state = ref<'idle' | 'copying' | 'copied' | 'error'>('idle')
const errorMsg = ref('')
const mounted = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // SSR 期间不执行交互;client hydration 后才允许点击
  mounted.value = true
})

function scheduleReset(ms: number) {
  // 清掉上一次的 reset 计时器,避免连续点击时旧 timer 提前把 state 改回 idle
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    state.value = 'idle'
    errorMsg.value = ''
    resetTimer = null
  }, ms)
}

async function copy() {
  if (state.value === 'copying') return
  state.value = 'copying'
  errorMsg.value = ''
  try {
    if (!navigator?.clipboard?.writeText) {
      throw new Error('当前浏览器不支持自动复制,请手动选择文字')
    }
    // withBase 会把 /docs/ 前缀拼上,得到 /docs/<relativePath>
    const url = withBase('/' + relativePath.value)
    const resp = await fetch(url, { credentials: 'same-origin' })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const text = await resp.text()
    await navigator.clipboard.writeText(text)
    state.value = 'copied'
    scheduleReset(1800)
  } catch (e) {
    state.value = 'error'
    errorMsg.value = e instanceof Error ? e.message : String(e)
    scheduleReset(3000)
  }
}

const label = computed(() => {
  switch (state.value) {
    case 'copying':
      return '复制中…'
    case 'copied':
      return '✓ 已复制'
    case 'error':
      return '复制失败'
    default:
      return '复制 Markdown'
  }
})
</script>

<template>
  <div v-if="visible && mounted" class="copy-md-wrapper">
    <button
      class="copy-md-button"
      :class="{ ['is-' + state]: true }"
      :disabled="state === 'copying'"
      @click="copy"
      :title="errorMsg || '复制本页原始 Markdown 到剪贴板'"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span>{{ label }}</span>
    </button>
  </div>
</template>

<style scoped>
.copy-md-wrapper {
  margin-bottom: 16px;
}
.copy-md-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  line-height: 1;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;
}
.copy-md-button:hover:not(:disabled) {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}
.copy-md-button:disabled {
  cursor: wait;
  opacity: 0.7;
}
.copy-md-button.is-copied {
  color: #16a34a;
  border-color: #86efac;
  background: rgba(34, 197, 94, 0.08);
}
.copy-md-button.is-error {
  color: #dc2626;
  border-color: #fca5a5;
  background: rgba(239, 68, 68, 0.08);
}
.copy-md-button svg {
  flex-shrink: 0;
}
</style>
