// 把白名单目录下的源 .md 拷贝到 .vitepress/dist 同相对路径,
// 让"复制 Markdown"按钮可以通过 /docs/<relativePath> fetch 到原始 markdown。
//
// 用白名单(不递归整个 docs-site)避免误抓:
//   - 历史回收站污染(docs-site/backend/...)
//   - node_modules 内的 README
//   - 顶层 README.md(它是开发者文档,不是站内文档)
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, '.vitepress', 'dist')

// 白名单:[相对 docs-site 根的目录, 是否递归]
// null = 文件本身;否则是目录,递归一层即可(我们目前没有更深结构)
const sources = [
  // 根目录的两个独立文档
  { type: 'file', rel: 'quickstart.md' },
  { type: 'file', rel: 'faq.md' },
  // 各分组目录下的所有 .md
  { type: 'dir', rel: 'platform' },
  { type: 'dir', rel: 'agents' },
  { type: 'dir', rel: 'chatbot' },
  { type: 'dir', rel: 'policy' },
]

if (!existsSync(DIST)) {
  console.error(`[copy-md] dist 不存在: ${DIST}`)
  console.error('[copy-md] 请先执行 vitepress build,再运行本脚本')
  process.exit(1)
}

let copied = 0

for (const item of sources) {
  if (item.type === 'file') {
    const src = join(ROOT, item.rel)
    const dst = join(DIST, item.rel)
    if (!existsSync(src)) {
      console.warn(`[copy-md] 跳过不存在的文件: ${item.rel}`)
      continue
    }
    mkdirSync(dirname(dst), { recursive: true })
    copyFileSync(src, dst)
    copied++
  } else if (item.type === 'dir') {
    const dirPath = join(ROOT, item.rel)
    if (!existsSync(dirPath)) {
      console.warn(`[copy-md] 跳过不存在的目录: ${item.rel}`)
      continue
    }
    const entries = readdirSync(dirPath)
    for (const name of entries) {
      if (!name.endsWith('.md')) continue
      const src = join(dirPath, name)
      if (!statSync(src).isFile()) continue
      const rel = join(item.rel, name).replace(/\\/g, '/')
      const dst = join(DIST, rel)
      mkdirSync(dirname(dst), { recursive: true })
      copyFileSync(src, dst)
      copied++
    }
  }
}

console.log(`[copy-md] 已拷贝 ${copied} 个 .md 到 dist/`)
