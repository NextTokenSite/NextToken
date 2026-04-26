//go:build !embed

package web

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// HasEmbeddedDocs 在非 embed 构建下始终为 false。
func HasEmbeddedDocs() bool { return false }

// ServeEmbeddedDocs 在非 embed 构建下:仅当请求落在 /docs 或 /docs/* 时返回 404 提示,
// 其它路径透传给后续中间件,不影响主路由。
// 开发模式下请直接访问 docs-site 的 vite dev server。
func ServeEmbeddedDocs() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		if path != "/docs" && !strings.HasPrefix(path, "/docs/") {
			c.Next()
			return
		}
		c.String(http.StatusNotFound,
			"Docs not embedded. Build with -tags embed and place VitePress dist at backend/internal/web/docs_dist/.")
		c.Abort()
	}
}
