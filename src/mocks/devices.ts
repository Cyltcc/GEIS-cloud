import type { DeviceApiItem, DevicesQuery } from '@/api/devices/types'
import type { ApiResponse } from '@/types/api'
import { mockDelay, mockOk, paginate } from './utils'

const DEVICE_GROUPS = ['分组1', '分组2', '实验田', '示范区']
const DEVICE_SCENES = ['farm', 'forest', 'greenhouse', 'water']
const DEVICE_STATUS = ['normal', 'warning', 'offline'] as const

const createDevice = (index: number): DeviceApiItem => {
  const group = DEVICE_GROUPS[index % DEVICE_GROUPS.length]
  const scene = DEVICE_SCENES[index % DEVICE_SCENES.length]
  const status = DEVICE_STATUS[index % DEVICE_STATUS.length]
  const id = index + 1
  const hour = String(8 + (index % 10)).padStart(2, '0')

  return {
    id,
    uuid: `mock-device-${id}`,
    sn: `GEIS-SN-${String(id).padStart(4, '0')}`,
    name: `${group}-${scene}-站点${id}`,
    iccid: `898604${String(1000000000 + id).padStart(10, '0')}`,
    status,
    battery: index % 5 === 0 ? 18 : 40 + ((index * 7) % 58),
    signal: index % 6 === 0 ? -98 : index % 5,
    device_type: scene,
    lat: 13.586 + index * 0.006,
    lon: 103.102 + index * 0.007,
    addr: `Oddar Meanchey mock plot ${id}`,
    perms: [{ name: group, display_name: group }],
    enabled_time: `2026-07-${String((index % 20) + 1).padStart(2, '0')} 09:00:00`,
    last_online: `2026-07-27 ${hour}:15:00`,
    last_report: `2026-07-27 ${hour}:30:00`,
  }
}

const MOCK_DEVICES: DeviceApiItem[] = Array.from({ length: 36 }, (_, index) =>
  createDevice(index)
)

const getDeviceGroup = (device: DeviceApiItem) => {
  const firstPermission = Array.isArray(device.perms) ? device.perms[0] : undefined
  return firstPermission?.display_name || firstPermission?.name || ''
}

const includesKeyword = (device: DeviceApiItem, keyword?: string) => {
  const normalizedKeyword = keyword?.trim().toLowerCase()
  if (!normalizedKeyword) {
    return true
  }

  return [device.name, device.sn, device.iccid, device.addr, device.device_type]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedKeyword))
}

export const getMockDevicesList = (
  query: DevicesQuery
): Promise<ApiResponse<DeviceApiItem[]>> => {
  const filtered = MOCK_DEVICES.filter((device) => {
    const matchKeyword = includesKeyword(device, query.keyword)
    const matchGroup = !query.group || getDeviceGroup(device) === query.group
    const matchScene = !query.scene || device.device_type === query.scene
    const matchStatus = !query.status || device.status === query.status
    return matchKeyword && matchGroup && matchScene && matchStatus
  })

  const page = paginate(filtered, query.page, query.per_page ?? query.limit)

  return mockDelay({
    ...mockOk(page.items),
    total: page.total,
    meta: page.meta,
  })
}

