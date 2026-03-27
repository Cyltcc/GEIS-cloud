<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDevicesList } from '@/api/devices/devices'
import {
  applyLocalFilters,
  extractPagination,
  mapDeviceRows,
} from '../deviceList.helpers'
import type {
  DeviceListResponse,
  DeviceStatus,
  DeviceTableItem,
} from '../deviceList.helpers'
import battery0Icon from '@/assets/icons/battery-0.svg'
import battery1Icon from '@/assets/icons/battery-1.svg'
import battery2Icon from '@/assets/icons/battery-2.svg'
import signal0Icon from '@/assets/icons/signal-0.svg'
import signal1Icon from '@/assets/icons/signal-1.svg'
import signal2Icon from '@/assets/icons/signal-2.svg'
import signal3Icon from '@/assets/icons/signal-3.svg'
import signal4Icon from '@/assets/icons/signal-4.svg'
import normalIcon from '@/assets/icons/normal.svg'
import warningIcon from '@/assets/icons/warning.svg'
import offlineIcon from '@/assets/icons/offline.svg'

const router = useRouter()

const filters = reactive<{
  group?: string
  scene?: string
  status?: DeviceStatus
  keyword: string
}>({
  group: undefined,
  scene: undefined,
  status: undefined,
  keyword: '',
})

const visibleColumns = ref([
  'index',
  'name',
  'scene',
  'power',
  'signal',
  'status',
  'enabledTime',
  'lastOnline',
  'lastReport',
])

const allColumns = [
  { title: '序号', key: 'index', dataIndex: 'index', width: 60 },
  { title: 'SN', key: 'sn', dataIndex: 'sn' },
  { title: '名称', key: 'name', dataIndex: 'name' },
  { title: 'ICCID', key: 'iccid', dataIndex: 'iccid' },
  { title: '分组', key: 'group', dataIndex: 'group' },
  { title: '场景', key: 'scene', dataIndex: 'scene' },
  { title: '电量', key: 'power', dataIndex: 'power', width: 80 },
  { title: '信号', key: 'signal', dataIndex: 'signal', width: 80 },
  { title: '状态', key: 'status', dataIndex: 'status', width: 80 },
  { title: '位置', key: 'location', dataIndex: 'location' },
  {
    title: '设备启用时间',
    key: 'enabledTime',
    dataIndex: 'enabledTime',
    sorter: true,
  },
  {
    title: '最新上线时间',
    key: 'lastOnline',
    dataIndex: 'lastOnline',
    sorter: true,
  },
  {
    title: '最新数据上报时间',
    key: 'lastReport',
    dataIndex: 'lastReport',
    sorter: true,
  },
  { title: '操作', key: 'action', width: 200, fixed: 'right' },
]

const tableColumns = computed(() => {
  return allColumns.filter((col) => {
    if (col.key === 'action') return true
    return visibleColumns.value.includes(col.key)
  })
})

const dataSource = ref<DeviceTableItem[]>([])
const selectedRowKeys = ref<Array<number | string>>([])
const loading = ref(false)

const onSelectChange = (keys: Array<number | string>) => {
  selectedRowKeys.value = keys
}

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条数据`,
})

const requestParams = computed(() => ({
  page: pagination.current,
  limit: pagination.pageSize,
  per_page: pagination.pageSize,
  keyword: filters.keyword || undefined,
}))

const fetchDeviceList = async (): Promise<void> => {
  loading.value = true
  try {
    const response = (await getDevicesList(
      requestParams.value
    )) as DeviceListResponse

    const rawList = Array.isArray(response?.data) ? response.data : []
    const mappedList = mapDeviceRows(rawList)
    const filteredList = applyLocalFilters(mappedList, filters)
    const paginationMeta = extractPagination(response, filteredList.length)

    dataSource.value = filteredList
    pagination.current = paginationMeta.current ?? pagination.current
    pagination.pageSize = paginationMeta.pageSize ?? pagination.pageSize
    pagination.total = paginationMeta.total
  } finally {
    loading.value = false
  }
}

const handleSearch = (): void => {
  pagination.current = 1
  fetchDeviceList()
}

const handleReset = (): void => {
  filters.group = undefined
  filters.scene = undefined
  filters.status = undefined
  filters.keyword = ''
  pagination.current = 1
  fetchDeviceList()
}

const handleTableChange = (pager: {
  current?: number
  pageSize?: number
}): void => {
  pagination.current = pager.current ?? pagination.current
  pagination.pageSize = pager.pageSize ?? pagination.pageSize
  fetchDeviceList()
}

const getBatteryIcon = (power: number) => {
  if (power >= 0.5) return battery2Icon
  if (power >= 0.2) return battery1Icon
  return battery0Icon
}

const getSignalIcon = (signal: number) => {
  const signalMap = [
    signal0Icon,
    signal1Icon,
    signal2Icon,
    signal3Icon,
    signal4Icon,
  ]
  const level = Math.max(0, Math.min(4, Number(signal) || 0))
  return signalMap[level]
}

const getStatusIcon = (status: DeviceStatus) => {
  if (status === 'normal') return normalIcon
  if (status === 'warning') return warningIcon
  return offlineIcon
}

const handleViewDetail = (record: DeviceTableItem) => {
  const deviceName = record.name && record.name !== '--' ? record.name : ''
  router.push({
    name: 'DeviceDetail',
    params: { id: String(record.id) },
    query: deviceName ? { name: deviceName } : undefined,
  })
}

onMounted(() => {
  fetchDeviceList()
})
</script>

<template>
  <div class="device-list-container">
    <div class="filter-container">
      <a-row :gutter="16"
             align="middle">
        <a-col>
          <a-select v-model:value="filters.group"
                    placeholder="选择分组"
                    style="width: 150px">
            <a-select-option value="group1">分组1</a-select-option>
            <a-select-option value="group2">分组2</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-select v-model:value="filters.scene"
                    placeholder="选择场景"
                    style="width: 150px">
            <a-select-option value="farm">农田</a-select-option>
            <a-select-option value="forest">森林</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-select v-model:value="filters.status"
                    placeholder="选择状态"
                    style="width: 150px">
            <a-select-option value="normal">正常</a-select-option>
            <a-select-option value="offline">离线</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-input-search v-model:value="filters.keyword"
                          placeholder="输入关键词以检索"
                          style="width: 250px"
                          enter-button
                          @search="handleSearch" />
        </a-col>
        <a-col>
          <a-button type="primary"
                    @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px"
                    @click="handleReset">重置</a-button>
        </a-col>
        <a-col style="margin-left: auto">
          <a-button type="primary"
                    class="action-btn">收藏</a-button>
          <a-button class="action-btn"
                    @click="fetchDeviceList">刷新</a-button>
        </a-col>
      </a-row>
    </div>

    <div class="column-control">
      <span>表头字段显示控制：</span>
      <a-checkbox-group v-model:value="visibleColumns">
        <a-checkbox value="index">序号</a-checkbox>
        <a-checkbox value="sn">SN</a-checkbox>
        <a-checkbox value="name">名称</a-checkbox>
        <a-checkbox value="iccid">ICCID</a-checkbox>
        <a-checkbox value="group">分组</a-checkbox>
        <a-checkbox value="scene">场景</a-checkbox>
        <a-checkbox value="power">电量</a-checkbox>
        <a-checkbox value="signal">信号</a-checkbox>
        <a-checkbox value="status">状态</a-checkbox>
        <a-checkbox value="location">位置</a-checkbox>
        <a-checkbox value="enabledTime">设备启用时间</a-checkbox>
        <a-checkbox value="lastOnline">最新上线时间</a-checkbox>
        <a-checkbox value="lastReport">最新数据上报时间</a-checkbox>
      </a-checkbox-group>
    </div>

    <a-table :columns="tableColumns"
             :data-source="dataSource"
             :row-selection="{
        selectedRowKeys,
        onChange: onSelectChange,
      }"
             :pagination="pagination"
             :loading="loading"
             row-key="id"
             @change="handleTableChange">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>

        <template v-if="column.key === 'power'">
          <img :src="getBatteryIcon(record.power)"
               class="icon-svg"
               alt="battery" />
        </template>

        <template v-if="column.key === 'signal'">
          <img :src="getSignalIcon(record.signal)"
               class="icon-svg"
               alt="signal" />
        </template>

        <template v-if="column.key === 'status'">
          <img :src="getStatusIcon(record.status)"
               class="icon-svg"
               alt="status" />
        </template>

        <template v-if="column.key === 'action'">
          <a class="action-link"
             @click="handleViewDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a class="action-link">分享</a>
          <a-divider type="vertical" />
          <a v-if="!record.isFavorite"
             class="action-link">收藏</a>
          <a v-else
             class="action-link">取消收藏</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="scss">
.device-list-container {
  background: #fff;
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-right: 16px;
  }

  .link {
    color: #1890ff;
  }
}

.filter-container {
  margin-bottom: 16px;

  .action-btn {
    margin-left: 8px;
  }
}

.column-control {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.icon-svg {
  width: 24px;
  height: 24px;
  display: block;
}

.action-link {
  color: #1890ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
