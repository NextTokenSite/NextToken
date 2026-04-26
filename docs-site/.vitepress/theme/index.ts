// 扩展 VitePress 默认主题:
//   1. 引入 custom.css 做品牌色与组件样式覆盖
//   2. 通过 Layout slot 'doc-before' 注入"复制 Markdown"按钮(仅文档页生效)
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CopyMarkdownButton from './CopyMarkdownButton.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(CopyMarkdownButton),
    })
  },
}
