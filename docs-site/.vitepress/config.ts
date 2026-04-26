import { defineConfig } from 'vitepress'

// VitePress 站点配置
// 部署形态:作为主站后端的子路径 /docs/ 提供,因此 base 固定 '/docs/'。
// 若日后切换为独立子域名(如 docs.nexttoken.online),将 base 改回 '/'。
export default defineConfig({
  base: '/docs/',
  lang: 'zh-CN',
  title: 'NextToken 文档',
  description: 'NextToken 用户与开发者文档:快速开始、计费、客户端配置、FAQ',
  // cleanUrls 默认 false:产物里渲染出的 doc 链接保留 .html 后缀,与参考站对齐
  lastUpdated: true,
  appearance: true,
  // 屏蔽本地误拷或残留目录,避免被当成文档源扫描
  srcExclude: ['**/node_modules/**', '**/backend/**', '**/.git/**', '**/README.md'],

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],

  themeConfig: {
    siteTitle: 'NextToken',
    // 后续放好 svg 后启用:logo: '/logo.svg'

    nav: [
      { text: 'Home', link: '/' },
      { text: '指南', link: '/quickstart', activeMatch: '^/(quickstart|faq)(\\.html)?$' },
      { text: 'FAQ', link: '/faq' },
    ],

    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: '快速开始', link: '/quickstart' },
          { text: 'FAQ', link: '/faq' },
        ],
      },
      {
        text: 'NextToken',
        items: [
          { text: '创建 API Key', link: '/platform/create-key' },
          { text: '计费说明', link: '/platform/billing' },
          { text: '邀请返利', link: '/platform/affiliate' },
        ],
      },
      {
        text: 'Agents',
        items: [
          { text: 'CC-Switch', link: '/agents/cc-switch' },
          { text: 'Claude Code', link: '/agents/claude-code' },
          { text: 'Codex', link: '/agents/codex' },
          { text: 'Hermes', link: '/agents/hermes' },
          { text: 'OpenCode', link: '/agents/opencode' },
        ],
      },
      {
        text: 'ChatBot',
        items: [
          { text: 'Cherry Studio', link: '/chatbot/cherry-studio' },
          { text: 'RikkaHub', link: '/chatbot/rikkahub' },
        ],
      },
      {
        text: '条款与政策',
        items: [
          { text: '使用政策', link: '/policy/usage' },
        ],
      },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详情',
                resetButtonTitle: '清除',
                backButtonTitle: '关闭',
                noResultsText: '无结果',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },

    docFooter: { prev: '上一页', next: '下一页' },
    outline: { level: [2, 3], label: '本页目录' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    lastUpdatedText: '最后更新于',

    footer: {
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © 2026 NextToken',
    },
  },
})
