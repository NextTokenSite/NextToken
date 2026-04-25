import type { Router } from 'vue-router'

/** 模型广场扩展路由注册（fork-friendly：不动 router/index.ts）。
 *  必须在 main.ts 的 app.use(router) 之前调用。 */
export function registerModelsMarketRoute(router: Router): void {
  router.addRoute({
    path: '/models',
    name: 'ModelsMarket',
    component: () => import('./ModelsMarketView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Models Market',
    },
  })
}
