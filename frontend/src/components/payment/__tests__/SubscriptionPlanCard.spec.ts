import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SubscriptionPlanCard from '@/components/payment/SubscriptionPlanCard.vue'
import type { SubscriptionPlan } from '@/types/payment'
import type { UserSubscription } from '@/types'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => ({
      'payment.subscribeNow': '立即开通',
      'payment.renewNow': '续费',
      'payment.days': '天',
      'payment.planCard.rate': '倍率',
      'payment.planCard.quota': '额度',
      'payment.planCard.unlimited': '不限',
    }[key] ?? key),
  }),
}))

const basePlan: SubscriptionPlan = {
  id: 7,
  group_id: 3,
  name: 'Starter',
  description: '',
  price: 128,
  original_price: 0,
  validity_days: 30,
  validity_unit: 'day',
  rate_multiplier: 1,
  daily_limit_usd: null,
  weekly_limit_usd: null,
  monthly_limit_usd: null,
  features: [],
  group_platform: 'openai',
  sort_order: 1,
  for_sale: true,
  group_name: 'OpenAI',
}

// 挂载套餐卡片，便于分别验证开通和续费按钮状态。
function mountPlanCard(activeSubscriptions: UserSubscription[] = []) {
  return mount(SubscriptionPlanCard, {
    props: {
      plan: basePlan,
      activeSubscriptions,
    },
  })
}

describe('SubscriptionPlanCard action button', () => {
  it('keeps the subscribe button disabled and does not emit select', async () => {
    const wrapper = mountPlanCard()
    const button = wrapper.get('button')

    expect(button.text()).toBe('立即开通')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('keeps the renewal button disabled and does not emit select', async () => {
    const wrapper = mountPlanCard([
      {
        id: 1,
        user_id: 2,
        group_id: basePlan.group_id,
        status: 'active',
        expires_at: '2099-01-01T00:00:00Z',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      } as UserSubscription,
    ])
    const button = wrapper.get('button')

    expect(button.text()).toBe('续费')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')

    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
