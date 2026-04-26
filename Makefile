.PHONY: build build-backend build-frontend build-docs build-embed build-datamanagementd test test-backend test-frontend test-frontend-critical test-datamanagementd secret-scan

FRONTEND_CRITICAL_VITEST := \
	src/views/auth/__tests__/LinuxDoCallbackView.spec.ts \
	src/views/auth/__tests__/WechatCallbackView.spec.ts \
	src/views/user/__tests__/PaymentView.spec.ts \
	src/views/user/__tests__/PaymentResultView.spec.ts \
	src/components/user/profile/__tests__/ProfileInfoCard.spec.ts \
	src/views/admin/__tests__/SettingsView.spec.ts

# 一键编译前后端
build: build-backend build-frontend

# 编译后端（复用 backend/Makefile）
build-backend:
	@$(MAKE) -C backend build

# 编译前端（需要已安装依赖）
build-frontend:
	@pnpm --dir frontend run build

# 编译文档站（VitePress），产物拷贝至后端 embed 目录
# 首次运行前请执行: pnpm --dir docs-site install
build-docs:
	@pnpm --dir docs-site run build
	@find backend/internal/web/docs_dist -mindepth 1 ! -name '.gitkeep' -delete
	@cp -r docs-site/.vitepress/dist/. backend/internal/web/docs_dist/

# 一键产出可投产二进制：前端 + 文档 + 带 embed 的后端
# 输出路径: backend/sub2api
build-embed: build-frontend build-docs
	@cd backend && go build -tags embed -o sub2api ./cmd/server
	@echo "Built: backend/sub2api (with embedded frontend + docs)"

# 编译 datamanagementd（宿主机数据管理进程）
build-datamanagementd:
	@cd datamanagement && go build -o datamanagementd ./cmd/datamanagementd

# 运行测试（后端 + 前端）
test: test-backend test-frontend

test-backend:
	@$(MAKE) -C backend test

test-frontend:
	@pnpm --dir frontend run lint:check
	@pnpm --dir frontend run typecheck
	@$(MAKE) test-frontend-critical

test-frontend-critical:
	@pnpm --dir frontend exec vitest run $(FRONTEND_CRITICAL_VITEST)

test-datamanagementd:
	@cd datamanagement && go test ./...

secret-scan:
	@python3 tools/secret_scan.py
