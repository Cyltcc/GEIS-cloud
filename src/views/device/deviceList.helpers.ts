import type {
  DeviceApiItem,
  DeviceListResponse,
  DeviceStatus,
} from '@/api/devices/types'

export type { DeviceApiItem, DeviceListResponse, DeviceStatus }

export interface DeviceTableItem {
  id: number | string
  sn: string
  name: string
  iccid: string
  group: string
  scene: string
  power: number
  signal: number
  status: DeviceStatus
  location: string
  enabledTime: string
  lastOnline: string
  lastReport: string
  isFavorite: boolean
}

export interface DeviceTableFilters {
  group?: string
  scene?: string
  status?: DeviceStatus
}

export interface NormalizedPagination {
  current?: number
  pageSize?: number
  total: number
}

const PLACEHOLDER = '--'

const toText = (value: unknown): string => {
  if (typeof value === 'string') {
    const text = value.trim()
    return text || PLACEHOLDER
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }
  return PLACEHOLDER
}

const clampNumber = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

const parseBatteryLevel = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clampNumber(value <= 1 ? value * 100 : value, 0, 100)
  }

  const text = String(value ?? '').replace('%', '').trim()
  const parsed = Number(text)
  if (!Number.isFinite(parsed)) {
    return 0
  }

  return clampNumber(parsed <= 1 ? parsed * 100 : parsed, 0, 100)
}

const parseSignalLevel = (value: unknown): number => {
  const parsed = Number(String(value ?? '').trim())
  if (!Number.isFinite(parsed)) {
    return 0
  }

  if (parsed >= 0 && parsed <= 4) {
    return Math.round(parsed)
  }

  if (parsed < 0) {
    if (parsed >= -75) return 4
    if (parsed >= -90) return 3
    if (parsed >= -105) return 2
    if (parsed >= -120) return 1
    return 0
  }

  return clampNumber(Math.round(parsed / 25), 0, 4)
}

const normalizeStatus = (value: unknown): DeviceStatus => {
  const status = String(value ?? '').trim().toLowerCase()
  if (status === 'normal') return 'normal'
  if (status === 'warning') return 'warning'
  return 'offline'
}

const pickTimeText = (device: DeviceApiItem, keys: string[]): string => {
  for (const key of keys) {
    const value = device[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }
  return PLACEHOLDER
}

const getGroupText = (device: DeviceApiItem): string => {
  const perms = Array.isArray(device.perms) ? device.perms : []
  if (!perms.length) {
    return PLACEHOLDER
  }
  return toText(perms[0]?.display_name || perms[0]?.name)
}

const getLocationText = (device: DeviceApiItem): string => {
  const address = toText(device.addr)
  if (address !== PLACEHOLDER) {
    return address
  }

  const lat = Number(device.lat)
  const lon = Number(device.lon)
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return `${lat}, ${lon}`
  }

  return PLACEHOLDER
}

export const mapDeviceToRow = (device: DeviceApiItem, index: number): DeviceTableItem => {
  const rowId = device.id ?? device.uuid ?? device.sn ?? device.iccid ?? `row-${index}`

  return {
    id: rowId,
    sn: toText(device.sn),
    name: toText(device.name),
    iccid: toText(device.iccid),
    group: getGroupText(device),
    scene: toText(device.device_type),
    power: parseBatteryLevel(device.battery),
    signal: parseSignalLevel(device.signal),
    status: normalizeStatus(device.status),
    location: getLocationText(device),
    enabledTime: pickTimeText(device, ['enabled_time', 'activated_at', 'created_at']),
    lastOnline: pickTimeText(device, ['last_online', 'last_online_at', 'updated_at']),
    lastReport: pickTimeText(device, ['last_report', 'last_report_at', 'reported_at']),
    isFavorite: false,
  }
}

export const mapDeviceRows = (devices: DeviceApiItem[]): DeviceTableItem[] => {
  return devices.map(mapDeviceToRow)
}

export const applyLocalFilters = (rows: DeviceTableItem[], filters: DeviceTableFilters) => {
  return rows.filter((row) => {
    const matchGroup = !filters.group || row.group === filters.group
    const matchScene = !filters.scene || row.scene === filters.scene
    const matchStatus = !filters.status || row.status === filters.status
    return matchGroup && matchScene && matchStatus
  })
}

export const extractPagination = (
  payload: DeviceListResponse,
  fallbackTotal: number
): NormalizedPagination => {
  const metaPagination = payload.meta?.pagination

  const total =
    typeof metaPagination?.total === 'number'
      ? metaPagination.total
      : typeof payload.total === 'number'
      ? payload.total
      : typeof payload.meta?.total === 'number'
      ? payload.meta.total
      : fallbackTotal

  return {
    current: metaPagination?.current_page,
    pageSize: metaPagination?.per_page,
    total,
  }
}
