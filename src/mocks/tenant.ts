import type { ApiResponse } from '@/types/api'
import type {
  CreateTenantData,
  CurrentTenantData,
  TenantEntitlementData,
  UpdateTenantEntitlementData,
} from '@/types/tenant'
import { mockDelay, mockFail, mockOk } from './utils'

let currentTenant: CurrentTenantData = {
  id: 'ocop-demo',
  name: 'GEIS Mock Tenant',
}

let entitlements: TenantEntitlementData[] = [
  {
    id: 'ent-device',
    tenant_id: currentTenant.id,
    feature_code: 'device.management',
    status: 'active',
    starts_at: '2026-07-01T00:00:00+08:00',
    created_at: '2026-07-01T00:00:00+08:00',
    updated_at: '2026-07-27T09:00:00+08:00',
    metadata: { label: '设备管理' },
  },
  {
    id: 'ent-sensor',
    tenant_id: currentTenant.id,
    feature_code: 'sensor.management',
    status: 'active',
    starts_at: '2026-07-01T00:00:00+08:00',
    created_at: '2026-07-01T00:00:00+08:00',
    updated_at: '2026-07-27T09:00:00+08:00',
    metadata: { label: '传感器管理' },
  },
  {
    id: 'ent-data',
    tenant_id: currentTenant.id,
    feature_code: 'data.export',
    status: 'disabled',
    starts_at: '2026-07-10T00:00:00+08:00',
    created_at: '2026-07-01T00:00:00+08:00',
    updated_at: '2026-07-20T14:30:00+08:00',
    metadata: { label: '数据导出' },
  },
]

export const getMockCurrentTenant = (): Promise<ApiResponse<CurrentTenantData>> => {
  return mockDelay(mockOk(currentTenant))
}

export const createMockTenant = (
  data: CreateTenantData
): Promise<ApiResponse<CurrentTenantData>> => {
  const id = data.id.trim()
  const name = data.name.trim()

  if (!id || !name) {
    return mockDelay(mockFail('租户 ID 和名称不能为空'))
  }

  currentTenant = { id, name }
  entitlements = entitlements.map((item) => ({
    ...item,
    tenant_id: id,
  }))

  return mockDelay(mockOk(currentTenant, '租户创建成功'))
}

export const getMockTenantEntitlements = (
  tenantId: string
): Promise<ApiResponse<TenantEntitlementData[]>> => {
  if (!tenantId.trim()) {
    return mockDelay(mockFail('tenant_id missing'))
  }

  return mockDelay(
    mockOk(
      entitlements.map((item) => ({ ...item, tenant_id: tenantId })),
      'ok'
    )
  )
}

export const updateMockTenantEntitlement = (
  tenantId: string,
  featureCode: string,
  data: UpdateTenantEntitlementData
): Promise<ApiResponse<TenantEntitlementData>> => {
  const index = entitlements.findIndex((item) => item.feature_code === featureCode)

  const current = entitlements[index]

  if (!current) {
    return mockDelay(mockFail('权益不存在', 404))
  }

  const nextItem: TenantEntitlementData = {
    ...current,
    tenant_id: tenantId,
    status: data.status,
    starts_at: data.starts_at,
    updated_at: new Date().toISOString(),
    metadata: data.metadata,
  }
  entitlements[index] = nextItem

  return mockDelay(mockOk(nextItem, '权益已更新'))
}
