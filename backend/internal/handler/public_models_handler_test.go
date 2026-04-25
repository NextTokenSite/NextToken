//go:build unit

package handler

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/stretchr/testify/require"
)

// makeChannel 构造一个测试用 service.AvailableChannel。
func makeChannel(name, status string, groups []service.AvailableGroupRef, models []service.SupportedModel) service.AvailableChannel {
	return service.AvailableChannel{
		Name:            name,
		Status:          status,
		Groups:          groups,
		SupportedModels: models,
	}
}

// floatPtr 返回 *float64 字面量辅助。
func floatPtr(v float64) *float64 { return &v }

// stubResolver 测试用 idResolver：把 display 名小写、空格替换为 -。
// 模拟 "GPT-5.2" → "gpt-5.2"、"Claude Opus 4.6" → "claude-opus-4-6"。
func stubResolver(_ int64, name string) string {
	return strings.ReplaceAll(strings.ToLower(name), " ", "-")
}

// identityResolver 等价于 mapping 缺失时的 fallback：直接返回 display name。
func identityResolver(_ int64, name string) string { return name }

func TestAggregatePublicModels_BasicShape(t *testing.T) {
	// 验证响应顶层是 []publicGroupDTO，每个分组含 id/name/platform/rate_multiplier/model_count/models。
	channels := []service.AvailableChannel{
		makeChannel("OpenAI", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "ChatGPT Plus", Platform: "openai", RateMultiplier: 1.3, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "GPT-5.2", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken,
					InputPrice:  floatPtr(0.00000175),
					OutputPrice: floatPtr(0.000014),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Len(t, out, 1)
	g := out[0]
	require.Equal(t, int64(4), g.ID)
	require.Equal(t, "ChatGPT Plus", g.Name)
	require.Equal(t, "openai", g.Platform)
	require.InDelta(t, 1.3, g.RateMultiplier, 1e-9)
	require.Equal(t, 1, g.ModelCount)
	require.Len(t, g.Models, 1)

	m := g.Models[0]
	require.Equal(t, "gpt-5.2", m.ID, "id 来自 resolver（mapping 后小写）")
	require.Equal(t, "GPT-5.2", m.DisplayName, "display_name 是渠道里设的原名")
}

func TestAggregatePublicModels_RateMultiplierApplied(t *testing.T) {
	// 价格 = base × rate_multiplier；单位仍是 USD/token（前端 ×1e6）。
	channels := []service.AvailableChannel{
		makeChannel("OpenAI", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "ChatGPT Plus", Platform: "openai", RateMultiplier: 1.3, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "GPT-5.2", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode:    service.BillingModeToken,
					InputPrice:     floatPtr(0.00000175),
					OutputPrice:    floatPtr(0.000014),
					CacheReadPrice: floatPtr(1.75e-7),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Len(t, out, 1)
	p := out[0].Models[0].Pricing
	// 0.00000175 × 1.3 = 0.000002275
	require.NotNil(t, p.InputPricePerToken)
	require.InDelta(t, 0.000002275, *p.InputPricePerToken, 1e-12)
	require.NotNil(t, p.OutputPricePerToken)
	require.InDelta(t, 0.0000182, *p.OutputPricePerToken, 1e-12)
	require.NotNil(t, p.CacheReadPricePerToken)
	require.InDelta(t, 2.275e-7, *p.CacheReadPricePerToken, 1e-15)
}

func TestAggregatePublicModels_ZeroPriceOmitted(t *testing.T) {
	// 上游约定 0 = 未配置；响应不应出现该字段（json:omitempty）。
	channels := []service.AvailableChannel{
		makeChannel("OpenAI", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "ChatGPT Plus", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "GPT-5.2", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode:      service.BillingModeToken,
					InputPrice:       floatPtr(0.0000025),
					OutputPrice:      floatPtr(0.000015),
					CacheReadPrice:   floatPtr(2.5e-7),
					CacheWritePrice:  floatPtr(0), // 占位 0
					ImageOutputPrice: floatPtr(0), // 占位 0
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	raw, err := json.Marshal(out[0].Models[0].Pricing)
	require.NoError(t, err)
	var decoded map[string]any
	require.NoError(t, json.Unmarshal(raw, &decoded))

	require.Contains(t, decoded, "input_price_per_token")
	require.Contains(t, decoded, "output_price_per_token")
	require.Contains(t, decoded, "cache_read_price_per_token")
	require.NotContains(t, decoded, "cache_write_price_per_token", "0 应被 omitempty 省略")
	require.NotContains(t, decoded, "image_output_price_per_token", "0 应被 omitempty 省略")
}

func TestAggregatePublicModels_HidesExclusiveGroups(t *testing.T) {
	// 专属分组（IsExclusive=true）不应出现。
	channels := []service.AvailableChannel{
		makeChannel("OpenAI", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "ChatGPT Plus", Platform: "openai", RateMultiplier: 1.3, IsExclusive: false},
				{ID: 5, Name: "openai x0.5", Platform: "openai", RateMultiplier: 0.5, IsExclusive: true},
			},
			[]service.SupportedModel{
				{Name: "GPT-5.2", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken, InputPrice: floatPtr(0.0000025),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Len(t, out, 1)
	require.Equal(t, int64(4), out[0].ID, "只应包含公开分组")
}

func TestAggregatePublicModels_HidesInactiveChannels(t *testing.T) {
	channels := []service.AvailableChannel{
		makeChannel("Active", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "G1", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "m1", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken, InputPrice: floatPtr(0.0000025),
				}},
			},
		),
		makeChannel("Disabled", "disabled",
			[]service.AvailableGroupRef{
				{ID: 5, Name: "G2", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "m2", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken, InputPrice: floatPtr(0.0000025),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Len(t, out, 1)
	require.Equal(t, int64(4), out[0].ID)
}

func TestAggregatePublicModels_PriceStatusUnpriced(t *testing.T) {
	// 所有价格字段都 nil/0 → price_status=unpriced
	channels := []service.AvailableChannel{
		makeChannel("ch", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "G", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "m", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken,
					// 所有价格字段都 nil
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Len(t, out, 1)
	require.Equal(t, "unpriced", out[0].Models[0].Pricing.PriceStatus)
}

func TestAggregatePublicModels_PriceStatusPriced(t *testing.T) {
	channels := []service.AvailableChannel{
		makeChannel("ch", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "G", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "m", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken, InputPrice: floatPtr(0.0000025),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Equal(t, "priced", out[0].Models[0].Pricing.PriceStatus)
}

func TestAggregatePublicModels_BillingModeFallback(t *testing.T) {
	channels := []service.AvailableChannel{
		makeChannel("ch", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "G", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "m", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: "", InputPrice: floatPtr(0.0000025),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Equal(t, string(service.BillingModeToken), out[0].Models[0].Pricing.PricingMode)
}

func TestAggregatePublicModels_ModelDeduplicationByMappedID(t *testing.T) {
	// 同一公开分组同一 mapped id 在多渠道下重复 → 只保留一份。
	channels := []service.AvailableChannel{
		makeChannel("c1", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "G", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "GPT-5.2", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken, InputPrice: floatPtr(0.0000025),
				}},
			},
		),
		makeChannel("c2", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "G", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "GPT-5.2", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken, InputPrice: floatPtr(0.0000099),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, stubResolver)
	require.Len(t, out, 1)
	require.Equal(t, 1, out[0].ModelCount, "同 mapped id 只保留一份（先到为准）")
}

func TestAggregatePublicModels_NoSensitiveFieldsRecursive(t *testing.T) {
	channels := []service.AvailableChannel{
		makeChannel("ch", service.StatusActive,
			[]service.AvailableGroupRef{
				{ID: 4, Name: "G", Platform: "openai", RateMultiplier: 1.0, IsExclusive: false},
			},
			[]service.SupportedModel{
				{Name: "m", Platform: "openai", Pricing: &service.ChannelModelPricing{
					BillingMode: service.BillingModeToken, InputPrice: floatPtr(0.0000025),
				}},
			},
		),
	}
	out := aggregatePublicModels(channels, identityResolver)
	raw, err := json.Marshal(out)
	require.NoError(t, err)
	var generic any
	require.NoError(t, json.Unmarshal(raw, &generic))

	deny := map[string]struct{}{
		"channel_id":           {},
		"upstream_url":         {},
		"api_key":              {},
		"account":              {},
		"restrict_models":      {},
		"billing_model_source": {},
		"base_price":           {},
		"base_input_price":     {},
		"base_output_price":    {},
		"pricing_id":           {},
		"sort_order":           {},
		"interval_ids":         {},
		"intervals":            {},
		"group_ids":            {},
	}
	var hits []string
	scanForKeys(t, generic, deny, &hits, "")
	require.Empty(t, hits, "敏感字段在响应中泄漏：%v", hits)
}

// scanForKeys 递归扫描任意 JSON 结构（map / []any 嵌套），如果发现任何 deny key，
// 把它们累加到 hits（带路径，便于定位泄漏点）。
func scanForKeys(t *testing.T, v any, deny map[string]struct{}, hits *[]string, path string) {
	t.Helper()
	switch x := v.(type) {
	case map[string]any:
		for k, val := range x {
			if _, ok := deny[k]; ok {
				*hits = append(*hits, path+"."+k)
			}
			scanForKeys(t, val, deny, hits, path+"."+k)
		}
	case []any:
		for i, item := range x {
			scanForKeys(t, item, deny, hits, fmt.Sprintf("%s[%d]", path, i))
		}
	}
}
