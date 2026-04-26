//go:build embed

package web

import (
	"embed"
	"io"
	"io/fs"
	"mime"
	"net/http"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

// docsFS 嵌入由 VitePress 构建出的文档静态站点。
// 实际内容由构建脚本从 docs-site/.vitepress/dist 拷贝至 docs_dist 目录。
//
//go:embed all:docs_dist
var docsFS embed.FS

const (
	docsURLPrefix = "/docs/"    // 对外访问前缀(必须和 VitePress base 一致)
	docsFSRoot    = "docs_dist" // embed 子目录
)

// HasEmbeddedDocs 判断本次构建是否成功嵌入了文档站。
// 仅当 docs_dist/index.html 存在时认为可用——空目录(只有 .gitkeep)时返回 false。
func HasEmbeddedDocs() bool {
	_, err := docsFS.ReadFile(docsFSRoot + "/index.html")
	return err == nil
}

// ServeEmbeddedDocs 返回一个 Gin 中间件,负责在 /docs/* 路径下提供 VitePress 静态产物。
// 行为:
//   - 仅拦截 /docs 与 /docs/ 前缀;其余请求 c.Next() 继续后续中间件。
//   - /docs(无尾斜线)301 跳转到 /docs/,确保相对路径解析正确。
//   - /docs/foo 命中文件则直接返回;未命中(VitePress cleanUrls 路径)回退到 index.html。
//   - 自行打开嵌入文件并写入响应,避免 http.FileServer 对 index.html / 目录做隐式 301
//     造成的重定向循环。
//   - 不做任何鉴权:文档站对所有访客公开。
func ServeEmbeddedDocs() gin.HandlerFunc {
	docsSubFS, err := fs.Sub(docsFS, docsFSRoot)
	if err != nil {
		// 编译期 //go:embed 已校验,此处理论不可达
		panic("failed to get docs subdirectory: " + err.Error())
	}

	return func(c *gin.Context) {
		reqPath := c.Request.URL.Path

		// 仅处理 /docs 与 /docs/ 前缀,其余放行
		if reqPath != "/docs" && !strings.HasPrefix(reqPath, docsURLPrefix) {
			c.Next()
			return
		}

		// /docs -> /docs/(让浏览器以 /docs/ 为基准解析相对资源)
		if reqPath == "/docs" {
			c.Redirect(http.StatusMovedPermanently, docsURLPrefix)
			c.Abort()
			return
		}

		// 解析目标文件:相对于 docs_dist 的路径
		rel := strings.TrimPrefix(reqPath, docsURLPrefix)
		if rel == "" {
			rel = "index.html"
		}

		// 解析顺序(模拟 VitePress cleanUrls):
		//   1. 原样路径(命中带扩展名的资源,如 /docs/assets/foo.js)
		//   2. 路径 + ".html"(cleanUrls 把 /docs/foo 映射到 foo.html)
		//   3. 路径 + "/index.html"(目录索引)
		//   4. 全部不命中 → SPA fallback 到 /docs/index.html
		resolved := resolveDocsPath(docsSubFS, rel)
		serveDocsFile(c, docsSubFS, resolved)
	}
}

// resolveDocsPath 按 VitePress cleanUrls 的规则解析最终的文件名。
// 找不到任何匹配时返回 "index.html",由调用方做 SPA fallback。
func resolveDocsPath(fsys fs.FS, rel string) string {
	if docsFileExists(fsys, rel) {
		return rel
	}
	if withHTML := rel + ".html"; docsFileExists(fsys, withHTML) {
		return withHTML
	}
	if asIndex := strings.TrimSuffix(rel, "/") + "/index.html"; docsFileExists(fsys, asIndex) {
		return asIndex
	}
	return "index.html"
}

// serveDocsFile 直接读 embed FS 中的文件并写入 ResponseWriter,
// 不经过 http.FileServer——后者会对 "index.html" 与目录路径做内部 301 重定向,
// 在我们的 /docs/ 前缀场景下会产生 redirect loop。
func serveDocsFile(c *gin.Context, fsys fs.FS, name string) {
	f, err := fsys.Open(name)
	if err != nil {
		c.String(http.StatusNotFound, "not found")
		c.Abort()
		return
	}
	defer func() { _ = f.Close() }()

	// MIME 类型基于扩展名;未知扩展时让浏览器自行嗅探
	if ctype := mime.TypeByExtension(path.Ext(name)); ctype != "" {
		c.Header("Content-Type", ctype)
	}

	// 静态资源默认 1 小时缓存,index.html 不缓存(便于发布后立即生效)
	if name == "index.html" {
		c.Header("Cache-Control", "no-cache")
	} else {
		c.Header("Cache-Control", "public, max-age=3600")
	}

	// 显式设置 200——Gin 的 ResponseWriter 默认状态码为 0,若不显式声明,
	// 中间件链结束后没有路由 handler 命中 /docs/*,Gin 兜底会写成 404。
	c.Status(http.StatusOK)

	if _, err := io.Copy(c.Writer, f); err != nil {
		// 写入过程中失败——连接可能已断开,记一下不抛
		_ = err
	}
	c.Abort()
}

// docsFileExists 判断给定相对路径在嵌入的文档站中是否存在(且非目录)。
func docsFileExists(fsys fs.FS, p string) bool {
	f, err := fsys.Open(p)
	if err != nil {
		return false
	}
	defer func() { _ = f.Close() }()
	info, err := f.Stat()
	if err != nil || info.IsDir() {
		return false
	}
	return true
}
