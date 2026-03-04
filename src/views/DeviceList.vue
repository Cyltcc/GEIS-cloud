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
          <a-button class="action-btn">刷新</a-button>
        </a-col>
      </a-row>
    </div>

    <div class="column-control">
      <span>表头字段显示控制：</span>
      <a-checkbox-group v-model:value="visibleColumns">
        <a-checkbox value="index">序号</a-checkbox>
        <a-checkbox value="sn">SN</a-checkbox>
        <a-checkbox value="name">名称</a-checkbox>
        <a-checkbox value="iccid">iccid</a-checkbox>
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
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
             :pagination="pagination"
             row-key="id">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
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
          <a class="action-link">详情</a>
          <a-divider type="vertical" />
          <a class="action-link">分享</a>
          <a-divider type="vertical" />
          <a class="action-link"
             v-if="!record.isFavorite">收藏</a>
          <a class="action-link"
             v-else>取消收藏</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
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

const filters = reactive({
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

const dataSource = ref([
  {
    id: 1,
    name: '黄河水电6',
    scene: '农田',
    power: 80,
    signal: 3,
    status: 'normal',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
  {
    id: 2,
    name: '黄河水电6',
    scene: '森林',
    power: 60,
    signal: 2,
    status: 'warning',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: true,
  },
  {
    id: 3,
    name: '黄河水电6',
    scene: '草地、荒漠',
    power: 10,
    signal: 1,
    status: 'error',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
  {
    id: 4,
    name: '黄河水电6',
    scene: '水体、湿地',
    power: 90,
    signal: 4,
    status: 'normal',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
  {
    id: 5,
    name: '黄河水电6',
    scene: '药材',
    power: 95,
    signal: 4,
    status: 'normal',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
  {
    id: 6,
    name: '黄河水电6',
    scene: '农田',
    power: 95,
    signal: 4,
    status: 'normal',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
  {
    id: 7,
    name: '黄河水电6',
    scene: '农田',
    power: 50,
    signal: 2,
    status: 'normal',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
  {
    id: 8,
    name: '地理所生境束捕赛',
    scene: '农田',
    power: 90,
    signal: 2,
    status: 'normal',
    location: '--',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
  {
    id: 9,
    name: '贵州省珍稀濒危野生植物监测',
    scene: '农田',
    power: 90,
    signal: 2,
    status: 'normal',
    location: '贵州省梵净山',
    enabledTime: '2025/11/24 10:33:33',
    lastOnline: '2025/11/24 10:33:33',
    lastReport: '2025/11/24 10:33:33',
    isFavorite: false,
  },
])

const selectedRowKeys = ref([])
const onSelectChange = (keys: any) => {
  selectedRowKeys.value = keys
}

const pagination = reactive({
  total: 200,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共${total}条数据`,
})

const handleSearch = () => {
  console.log('Search:', filters)
}

const handleReset = () => {
  filters.group = undefined
  filters.scene = undefined
  filters.status = undefined
  filters.keyword = ''
}

const getBatteryIcon = (power: number) => {
  if (power >= 70) return battery2Icon
  if (power >= 30) return battery1Icon
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

const getStatusIcon = (status: string) => {
  if (status === 'normal') return normalIcon
  if (status === 'warning') return warningIcon
  return offlineIcon
}
</script>

<style scoped lang="scss">
.device-list-container {
  background: #fff;
  padding: 24px;
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
