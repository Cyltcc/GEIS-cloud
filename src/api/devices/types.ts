export type DeviceStatus = 'normal' | 'warning' | 'offline'

export interface DevicePermission {
  name?: string
  display_name?: string
}

export interface DeviceApiItem extends Record<string, unknown> {
  id?: number | string
  uuid?: string
  name?: string
  iccid?: string
  status?: string
  battery?: string | number
  signal?: string | number
  device_type?: string
  sn?: string
  lat?: number
  lon?: number
  addr?: string
  perms?: DevicePermission[]
}

export interface DevicesQuery {
  limit?: number
  per_page?: number
  page?: number
  keyword?: string
  group?: string
  scene?: string
  status?: DeviceStatus
}

export interface DeviceListResponse {
  data?: DeviceApiItem[]
  total?: number
  meta?: {
    total?: number
    pagination?: {
      total?: number
      count?: number
      per_page?: number
      current_page?: number
      total_pages?: number
      links?: {
        previous?: string | null
        next?: string | null
      }
    }
  }
}

