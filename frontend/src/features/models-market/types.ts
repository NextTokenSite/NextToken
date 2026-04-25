// 公开模型广场接口的 TS 类型，与后端 publicGroupDTO / publicModelDTO / publicPricingDTO 对齐。
// 字段名用 snake_case 与 JSON 响应一致，避免任何 mapper 层。

export type PricingMode = 'token' | 'image' | 'request' | string
export type PriceStatus = 'priced' | 'unpriced'

export interface PublicPricing {
  pricing_mode: PricingMode
  price_status: PriceStatus

  // 上游约定 0 = 未配置；后端通过 omitempty 在零价时省略。可能为 undefined。
  // 单位 USD/token；前端 ×1e6 转 USD/MTok 显示。
  input_price_per_token?: number
  output_price_per_token?: number
  cache_write_price_per_token?: number
  cache_read_price_per_token?: number
  image_output_price_per_token?: number
  per_request_price?: number
}

export interface PublicModelEntry {
  id: string             // mapped 后的最终模型 id（如 "gpt-5.2"）
  display_name: string   // 用户友好名（如 "GPT-5.2"）
  pricing: PublicPricing
}

export interface PublicGroupEntry {
  id: number
  name: string
  description: string
  platform: string
  rate_multiplier: number
  model_count: number
  models: PublicModelEntry[]
}

/** 后端响应顶层 data 直接是数组，无外层包装。 */
export type PublicModelsResponse = PublicGroupEntry[]

/** 顶部统计卡数据，由前端从 groups 派生。 */
export interface PublicModelsStats {
  group_count: number
  model_count: number
  platform_count: number
}

/** 前端筛选状态：类型筛选基于"Token 计费 / 图片计费 / 暂无定价"，由 pricing_mode + price_status 共同决定。 */
export type PriceTypeFilter = '' | 'token' | 'image' | 'unpriced'
