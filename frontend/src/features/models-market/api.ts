import { apiClient } from '@/api/client'
import type { PublicModelsResponse } from './types'

/** 拉取公开模型广场数据。无需认证。 */
export async function fetchPublicModels(options?: { signal?: AbortSignal }): Promise<PublicModelsResponse> {
  const { data } = await apiClient.get<PublicModelsResponse>('/public/models', {
    signal: options?.signal,
  })
  return data
}
