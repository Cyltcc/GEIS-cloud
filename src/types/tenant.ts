export interface CreateTenantData {
  id: string
  name: string
}

export interface CurrentTenantData {
  id: string
  name: string
}

export interface TenantEntitlementData {
  id: string
  tenant_id: string
  feature_code: string
  status: string
  starts_at?: string
  created_at?: string
  updated_at?: string
  metadata?: Record<string, unknown>
}

export interface UpdateTenantEntitlementData {
  status: string
  starts_at?: string
  expires_at?: string
  metadata?: Record<string, unknown>
}

