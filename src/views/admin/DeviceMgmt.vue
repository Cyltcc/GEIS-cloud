<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import GModal from '@/components/GModal.vue'
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

type DeviceStatus = 'normal' | 'warning' | 'offline'

interface DeviceRow {
  id: number
  sn: string
  name: string
  iccid: string
  model: string
  batch: string
  scene: string
  power: number
  signal: number
  status: DeviceStatus
  location: string
  enabledTime: string
  lastOnline: string
  lastReport: string
}

const filters = reactive<{
  scene?: string
  status?: DeviceStatus
  keyword: string
}>({
  scene: undefined,
  status: undefined,
  keyword: '',
})

const activeKey = ref('standard')

const visibleColumns = ref([
  'index',
  'sn',
  'name',
  'iccid',
  'model',
  'batch',
  'scene',
  'power',
  'signal',
  'status',
  'location',
  'enabledTime',
  'lastOnline',
  'lastReport',
])

const allColumns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    align: 'center',
    width: 60,
  },
  { title: 'SN', key: 'sn', dataIndex: 'sn', align: 'center', width: 220 },
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
    width: 220,
  },
  {
    title: 'iccid',
    key: 'iccid',
    dataIndex: 'iccid',
    align: 'center',
    width: 220,
  },
  {
    title: '设备型号',
    key: 'model',
    dataIndex: 'model',
    align: 'center',
    width: 220,
  },
  { title: '出厂批次', key: 'batch', dataIndex: 'batch', width: 220 },
  {
    title: '场景',
    key: 'scene',
    dataIndex: 'scene',
    align: 'center',
    width: 100,
  },
  {
    title: '电量',
    key: 'power',
    dataIndex: 'power',
    align: 'center',
    width: 60,
  },
  {
    title: '信号',
    key: 'signal',
    dataIndex: 'signal',
    align: 'center',
    width: 60,
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    width: 60,
  },
  {
    title: '位置',
    key: 'location',
    dataIndex: 'location',
    align: 'center',
    width: 60,
  },
  {
    title: '设备启用时间',
    key: 'enabledTime',
    dataIndex: 'enabledTime',
    align: 'center',
    width: 220,
    sorter: true,
  },
  {
    title: '最新上线时间',
    key: 'lastOnline',
    dataIndex: 'lastOnline',
    sorter: true,
    align: 'center',
    width: 220,
  },
  {
    title: '最新数据上报时间',
    key: 'lastReport',
    dataIndex: 'lastReport',
    sorter: true,
    width: 220,
    align: 'center',
  },
  { title: '操作', key: 'action', align: 'center', width: 160, fixed: 'right' },
]

const tableColumns = computed(() => {
  return allColumns.filter((col) => {
    if (col.key === 'action') return true
    return visibleColumns.value.includes(col.key)
  })
})

const allRows = ref<DeviceRow[]>([
  {
    id: 1,
    sn: 'abddcdjs1234ddsjdfj',
    name: '黄河水电6',
    iccid: 'abddcdjs1234ddsjdfj',
    model: '设备型号',
    batch: '2025112701',
    scene: '农田',
    power: 0.7,
    signal: 3,
    status: 'normal',
    location: '农田',
    enabledTime: '2025-11-20 11:10:12',
    lastOnline: '2025-12-01 09:20:12',
    lastReport: '2025-12-01 09:30:12',
  },
  {
    id: 2,
    sn: 'abddcdjs1234ddsjdfj',
    name: '黄河水电6',
    iccid: '绑定物联网卡',
    model: '设备型号',
    batch: '2025112701',
    scene: '森林',
    power: 0.25,
    signal: 2,
    status: 'warning',
    location: '森林',
    enabledTime: '2025-11-18 08:10:12',
    lastOnline: '2025-11-30 18:20:12',
    lastReport: '2025-11-30 18:30:12',
  },
  {
    id: 3,
    sn: 'abddcdjs1234ddsjdfj',
    name: '黄河水电6',
    iccid: 'abddcdjs1234ddsjdfj',
    model: '设备型号',
    batch: '2025112701',
    scene: '草地、荒漠',
    power: 0.12,
    signal: 1,
    status: 'offline',
    location: '草地',
    enabledTime: '2025-11-12 10:10:12',
    lastOnline: '2025-11-22 12:20:12',
    lastReport: '2025-11-22 12:30:12',
  },
  {
    id: 4,
    sn: 'abddcdjs1234ddsjdfj',
    name: '黄河水电6',
    iccid: '绑定物联网卡',
    model: '设备型号',
    batch: '2025112701',
    scene: '水体、湿地',
    power: 0.55,
    signal: 4,
    status: 'normal',
    location: '湿地',
    enabledTime: '2025-11-10 09:10:12',
    lastOnline: '2025-12-01 08:12:12',
    lastReport: '2025-12-01 08:30:12',
  },
  {
    id: 5,
    sn: 'abddcdjs1234ddsjdfj',
    name: '黄河水电6',
    iccid: 'abddcdjs1234ddsjdfj',
    model: '设备型号',
    batch: '2025112701',
    scene: '药材',
    power: 0.68,
    signal: 4,
    status: 'normal',
    location: '药材',
    enabledTime: '2025-11-05 14:10:12',
    lastOnline: '2025-12-01 06:10:12',
    lastReport: '2025-12-01 06:30:12',
  },
  {
    id: 6,
    sn: 'abddcdjs1234ddsjdfj',
    name: '黄河水电6',
    iccid: '绑定物联网卡',
    model: '设备型号',
    batch: '2025112701',
    scene: '农田',
    power: 0.6,
    signal: 4,
    status: 'normal',
    location: '农田',
    enabledTime: '2025-11-03 10:10:12',
    lastOnline: '2025-12-01 10:10:12',
    lastReport: '2025-12-01 10:30:12',
  },
  {
    id: 7,
    sn: 'abddcdjs1234ddsjdfj',
    name: '黄河水电6',
    iccid: 'abddcdjs1234ddsjdfj',
    model: '设备型号',
    batch: '2025112701',
    scene: '农田',
    power: 0.5,
    signal: 2,
    status: 'normal',
    location: '农田',
    enabledTime: '2025-10-29 10:10:12',
    lastOnline: '2025-11-30 10:10:12',
    lastReport: '2025-11-30 10:30:12',
  },
  {
    id: 8,
    sn: 'abddcdjs1234ddsjdfj',
    name: '地理所生境兼捕萤',
    iccid: '绑定物联网卡',
    model: '设备型号',
    batch: '2025112701',
    scene: '农田',
    power: 0.72,
    signal: 2,
    status: 'normal',
    location: '农田',
    enabledTime: '2025-10-21 10:10:12',
    lastOnline: '2025-11-29 10:10:12',
    lastReport: '2025-11-29 10:30:12',
  },
  {
    id: 9,
    sn: 'abddcdjs1234ddsjdfj',
    name: '贵州省珍稀濒危野生植物监测项目',
    iccid: 'abddcdjs1234ddsjdfj',
    model: '设备型号',
    batch: '2025112701',
    scene: '农田',
    power: 0.65,
    signal: 3,
    status: 'normal',
    location: '农田',
    enabledTime: '2025-10-12 10:10:12',
    lastOnline: '2025-11-28 10:10:12',
    lastReport: '2025-11-28 10:30:12',
  },
  {
    id: 10,
    sn: 'abddcdjs1234ddsjdfj',
    name: '自动气象站-正蓝旗-ZC900',
    iccid: 'abddcdjs1234ddsjdfj',
    model: '设备型号',
    batch: '2025112701',
    scene: '农田',
    power: 0.62,
    signal: 3,
    status: 'normal',
    location: '农田',
    enabledTime: '2025-10-05 10:10:12',
    lastOnline: '2025-11-27 10:10:12',
    lastReport: '2025-11-27 10:30:12',
  },
])

const selectedRowKeys = ref<Array<number | string>>([])

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条数据`,
})

const filteredRows = computed(() => {
  const keyword = filters.keyword.trim()
  return allRows.value.filter((row) => {
    const matchScene = filters.scene ? row.scene === filters.scene : true
    const matchStatus = filters.status ? row.status === filters.status : true
    const matchKeyword = keyword
      ? [row.sn, row.name, row.iccid].some((val) => val.includes(keyword))
      : true
    return matchScene && matchStatus && matchKeyword
  })
})

const pagedRows = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return filteredRows.value.slice(start, start + pagination.pageSize)
})

watch(
  filteredRows,
  (rows) => {
    pagination.total = rows.length
    const maxPage = Math.max(1, Math.ceil(rows.length / pagination.pageSize))
    if (pagination.current > maxPage) {
      pagination.current = maxPage
    }
  },
  { immediate: true }
)

const onSelectChange = (keys: Array<number | string>) => {
  selectedRowKeys.value = keys
}

const handleSearch = (): void => {
  pagination.current = 1
}

const handleReset = (): void => {
  filters.scene = undefined
  filters.status = undefined
  filters.keyword = ''
  pagination.current = 1
}

const handleTableChange = (pager: {
  current?: number
  pageSize?: number
}): void => {
  pagination.current = pager.current ?? pagination.current
  pagination.pageSize = pager.pageSize ?? pagination.pageSize
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

const showAdd = ref(false)
const formRef = ref()
const form = reactive({
  name: '',
  model: '',
  iccid: '',
  batch: '',
  location: '',
})

const rules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  batch: [{ required: true, message: '请输入出厂批次', trigger: 'blur' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
}

const resetForm = () => {
  form.name = ''
  form.model = ''
  form.iccid = ''
  form.batch = ''
  form.location = ''
  formRef.value?.clearValidate?.()
}

const handleAddDevice = () => {
  resetForm()
  showAdd.value = true
}

const handleAddOk = async () => {
  try {
    await formRef.value?.validate()
    showAdd.value = false
  } catch (error) {
    // keep modal open when validation fails
  }
}

const handleAddCancel = () => {
  showAdd.value = false
}
</script>

<template>
  <div class="device-admin-container">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="standard"
                  tab="定位观测站">
      </a-tab-pane>
    </a-tabs>
    <div class="filter-container">
      <a-row :gutter="16"
             align="middle">
        <a-col>
          <a-select v-model:value="filters.scene"
                    placeholder="选择场景"
                    style="width: 160px">
            <a-select-option value="农田">农田</a-select-option>
            <a-select-option value="森林">森林</a-select-option>
            <a-select-option value="草地、荒漠">草地、荒漠</a-select-option>
            <a-select-option value="水体、湿地">水体、湿地</a-select-option>
            <a-select-option value="药材">药材</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-select v-model:value="filters.status"
                    placeholder="选择状态"
                    style="width: 160px">
            <a-select-option value="normal">正常</a-select-option>
            <a-select-option value="warning">预警</a-select-option>
            <a-select-option value="offline">离线</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-input v-model:value="filters.keyword"
                   placeholder="输入关键词以检索"
                   style="width: 300px"
                   enter-button
                   @search="handleSearch">
            <template #prefix>
              <i class="i-custom:search-input"
                 style="width: 16px; height: 16px; display: inline-block;"></i>
            </template>
          </a-input>
        </a-col>
        <a-col>
          <a-button type="primary"
                    @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px"
                    @click="handleReset">重置</a-button>
        </a-col>
        <a-col style="margin-left: auto">
          <a-button type="primary"
                    class="action-btn"
                    @click="handleAddDevice">添加设备</a-button>
          <a-button type="primary"
                    danger
                    class="action-btn">解绑</a-button>
          <a-button class="action-btn">刷新</a-button>
        </a-col>
      </a-row>
    </div>

    <div class="column-control">
      <span>表头字段显示控制</span>
      <a-checkbox-group v-model:value="visibleColumns">
        <a-checkbox value="index">序号</a-checkbox>
        <a-checkbox value="sn">SN</a-checkbox>
        <a-checkbox value="name">名称</a-checkbox>
        <a-checkbox value="iccid">iccid</a-checkbox>
        <a-checkbox value="model">设备型号</a-checkbox>
        <a-checkbox value="batch">出厂批次</a-checkbox>
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

    <a-table class="device-table"
             :columns="tableColumns"
             :data-source="pagedRows"
             :scroll="{ x: 1500 }"
             :row-selection="{
        selectedRowKeys,
        onChange: onSelectChange,
      }"
             :pagination="pagination"
             row-key="id"
             @change="handleTableChange">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>

        <template v-if="column.key === 'iccid'">
          <span>{{ record.iccid }}</span>
          <a class="action-link"
             style="margin-left: 8px">换绑</a>
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
        </template>
      </template>
    </a-table>

    <g-modal v-model="showAdd"
             title="添加设备"
             :width="560"
             @ok="handleAddOk"
             @cancel="handleAddCancel">
      <a-form ref="formRef"
              :model="form"
              :rules="rules"
              layout="horizontal"
              :label-col="{ style: { width: '90px' } }"
              :wrapper-col="{ span: 24 }">
        <a-form-item label="名称"
                     name="name"
                     required>
          <a-input v-model:value="form.name"
                   placeholder="请输入设备名称" />
        </a-form-item>
        <a-form-item label="型号"
                     name="model"
                     required>
          <a-input v-model:value="form.model"
                   placeholder="请输入设备型号" />
        </a-form-item>
        <a-form-item label="iccid"
                     name="iccid">
          <a-input v-model:value="form.iccid"
                   placeholder="请输入iccid" />
        </a-form-item>
        <a-form-item label="出厂批次"
                     name="batch"
                     required>
          <a-input v-model:value="form.batch"
                   placeholder="请输入出厂批次" />
        </a-form-item>
        <a-form-item label="位置"
                     name="location"
                     required>
          <a-input v-model:value="form.location"
                   placeholder="请输入位置" />
        </a-form-item>
      </a-form>
    </g-modal>
  </div>
</template>

<style scoped lang="scss">
.device-admin-container {
  background: #fff;
  min-height: 100%;
  padding: 0 0 8px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #0a56ff;
  padding: 12px 0;
  border-bottom: 2px solid #0a56ff;
  display: inline-block;
  margin-bottom: 12px;
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

:deep(.device-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}

:deep(
    .device-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .device-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}

.icon-svg {
  width: 22px;
  height: 22px;
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
