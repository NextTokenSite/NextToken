import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import PriceCard from '../components/PriceCard.vue'
import type { PublicModelEntry } from '../types'

const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh: {}, en: {} } })

const baseModel: PublicModelEntry = {
  id: 'gpt-5.2',
  display_name: 'GPT-5.2',
  pricing: {
    pricing_mode: 'token',
    price_status: 'priced',
    input_price_per_token: 0.0000022750000000000002, // ×1e6 ≈ 2.275 → 2.28（toFixed(2)）
    output_price_per_token: 0.000018200000000000002, // ×1e6 ≈ 18.2 → 18.20
    cache_read_price_per_token: 2.275e-7,            // ×1e6 ≈ 0.2275 → 0.23
  },
}

describe('PriceCard', () => {
  it('显示 display_name 与 id 副标题', () => {
    const w = mount(PriceCard, { props: { model: baseModel }, global: { plugins: [i18n] } })
    expect(w.text()).toContain('GPT-5.2')
    expect(w.text()).toContain('gpt-5.2')
  })

  it('价格 ×1e6 转为 USD/MTok 并保留两位小数', () => {
    const w = mount(PriceCard, { props: { model: baseModel }, global: { plugins: [i18n] } })
    const text = w.text()
    expect(text).toContain('2.28')   // input
    expect(text).toContain('18.20')  // output
    expect(text).toContain('0.23')   // cache read
    expect(text).toContain('USD / 1M Token')
  })

  it('cache_write 字段缺失时不展示该行', () => {
    const w = mount(PriceCard, { props: { model: baseModel }, global: { plugins: [i18n] } })
    expect(w.text()).not.toContain('缓存写入')
  })

  it('price_status=unpriced 显示"暂无定价"', () => {
    const m: PublicModelEntry = {
      id: 'm',
      display_name: 'M',
      pricing: { pricing_mode: 'token', price_status: 'unpriced' },
    }
    const w = mount(PriceCard, { props: { model: m }, global: { plugins: [i18n] } })
    expect(w.text()).toContain('暂无定价')
    // 不应有任何 token 行
    expect(w.text()).not.toContain('输入')
    expect(w.text()).not.toContain('输出')
  })

  it('pricing_mode=request 隐藏 token 行，显示按次价格', () => {
    const m: PublicModelEntry = {
      id: 'm',
      display_name: 'M',
      pricing: {
        pricing_mode: 'request',
        price_status: 'priced',
        per_request_price: 0.05,
        // 即使有 token 字段也应被忽略
        input_price_per_token: 0.0000025,
      },
    }
    const w = mount(PriceCard, { props: { model: m }, global: { plugins: [i18n] } })
    expect(w.text()).not.toContain('输入')
    expect(w.text()).toContain('按次')
    expect(w.text()).toContain('0.05')
    expect(w.text()).toContain('USD / 次')
  })

  it('chip 文案随 pricing_mode 切换', () => {
    const tokenW = mount(PriceCard, { props: { model: baseModel }, global: { plugins: [i18n] } })
    expect(tokenW.text()).toContain('Token 计费')

    const imageW = mount(PriceCard, {
      props: {
        model: {
          ...baseModel,
          pricing: { pricing_mode: 'image', price_status: 'priced', image_output_price_per_token: 0.000032 },
        },
      },
      global: { plugins: [i18n] },
    })
    expect(imageW.text()).toContain('图片计费')

    const reqW = mount(PriceCard, {
      props: {
        model: {
          ...baseModel,
          pricing: { pricing_mode: 'request', price_status: 'priced', per_request_price: 0.01 },
        },
      },
      global: { plugins: [i18n] },
    })
    expect(reqW.text()).toContain('按次计费')
  })

  it('image_output 单独存在时显示图像输出行', () => {
    const m: PublicModelEntry = {
      id: 'gpt-image-2',
      display_name: 'GPT-Image-2',
      pricing: {
        pricing_mode: 'token', // 注意：本项目里图片输出仍可能挂在 token 模式下
        price_status: 'priced',
        input_price_per_token: 0.000005,
        image_output_price_per_token: 0.000032, // ×1e6 = 32
      },
    }
    const w = mount(PriceCard, { props: { model: m }, global: { plugins: [i18n] } })
    expect(w.text()).toContain('图像输出')
    expect(w.text()).toContain('32.00')
  })
})
