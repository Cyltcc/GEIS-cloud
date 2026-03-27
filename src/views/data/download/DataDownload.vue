<template>
  <div>
    <a-alert show-icon
             message="单次下载任务只能选择3个设备，且时间范围最大1天，如有其他下载需求请使用打包下载。"
             type="warning"
             closable
             @close="onClose" />

    <div class="down-form">
      <a-form class="download-form"
              layout="horizontal">
        <a-form-item label="站点选择">
          <a-select v-model:value="formData.selectDevice"
                    mode="multiple"
                    class="device-select"
                    placeholder="请选择站点"
                    :options="deviceOpt"
                    @change="handleChange" />
        </a-form-item>

        <a-form-item label="数据类型">
          <a-checkbox-group v-model:value="formData.type"
                            :options="typeOptions" />
        </a-form-item>

        <a-form-item label="筛选数据">
          <div class="check-row">
            <a-checkbox v-model:checked="dataCheckAll"
                        @change="onDataCheckAllChange">全选</a-checkbox>
            <a-checkbox-group v-model:value="formData.dataFields"
                              class="inline-checks"
                              :options="dataFieldOptions"
                              @change="onDataGroupChange" />
          </div>
        </a-form-item>

        <a-form-item label="筛选图片">
          <div class="check-row">
            <a-checkbox v-model:checked="imageCheckAll"
                        @change="onImageCheckAllChange">全选</a-checkbox>
            <a-checkbox-group v-model:value="formData.imageTypes"
                              class="inline-checks"
                              :options="imageTypeOptions"
                              @change="onImageGroupChange" />
          </div>
        </a-form-item>

        <a-form-item label="时间范围">
          <div class="time-row">
            <div class="time-left">
              <a-range-picker style="width: 400px; margin-left: 20px;"
                              :show-time="{ format: 'HH:mm' }"
                              format="YYYY-MM-DD HH:mm"
                              :placeholder="['Start Time', 'End Time']"
                              v-model:value="formData.timeRange"
                              @change="onRangeChange"
                              @ok="onRangeOk">
                <template #suffixIcon>
                  <i class="i-custom:time"
                     style="width: 15px; height: 15px; display: inline-block;"></i>
                </template>
              </a-range-picker>
              <a-space size="small"
                       class="quick-range">
                <a-button v-for="item in quickRanges"
                          :key="item.key"
                          type="default"
                          class="quick-btn"
                          :class="{ 'is-active': activeQuickKey === item.key }"
                          @click="setQuickRange(item.key)">
                  {{ item.label }}
                </a-button>
              </a-space>
            </div>
            <div class="time-right">
              <a-button class="share-btn"
                        type="primary"
                        @click="submitForm">创建下载任务</a-button>
              <a-button @click="resetForm">重置</a-button>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <div class="download-list">
      <div class="list-hearder">
        <div class="list-title">
          <i class="header-icon i-custom:data-pr"
             aria-hidden="true"></i>
          下载任务列表
        </div>
        <div style="display: flex; gap: 10px;">
          <a-button type="primary"
                    class="share-btn">模版上传</a-button>
          <a-button type="primary"
                    class="share-btn">模板下载</a-button>
          <a-button type="primary"
                    class="share-btn">批量下载</a-button>
          <a-button type="primary"
                    danger>删除</a-button>
        </div>
      </div>
      <div class="table-box">
        <a-table class="download-table"
                 :columns="downloadColumns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <div style="display: flex; justify-content: center; align-items: center;">
                <a-button style="color: #3969FA"
                          type="text"
                          @click="handleDownload(record)">下载</a-button>
                <span style="width: 2px; height: 8px; background-color: #C5C5C5;"></span>
                <a-button style="color: #F6685D"
                          type="text">删除</a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import { ref } from 'vue'

type RangeValue = [Dayjs, Dayjs] | null

type FormState = {
  selectDevice: string[]
  type: string[]
  dataFields: string[]
  imageTypes: string[]
  timeRange: RangeValue
}

const deviceOpt = ref([
  { label: '武汉农科院1', value: 'wh-1' },
  { label: '武汉农科院2', value: 'wh-2' },
  { label: '武汉农科院3', value: 'wh-3' },
  { label: '武汉农科院4', value: 'wh-4' },
])

const typeOptions = [
  { label: '数据', value: 'data' },
  { label: '图片', value: 'image' },
]

const dataFieldOptions = [
  { label: '土壤温度', value: 'soil_temp' },
  { label: '土壤水分', value: 'soil_moisture' },
  { label: '土壤盐分', value: 'soil_salinity' },
  { label: '土壤电导率', value: 'soil_conductivity' },
  { label: '土壤氮', value: 'soil_n' },
  { label: '土壤磷', value: 'soil_p' },
  { label: '土壤PH', value: 'soil_ph' },
  { label: '电压', value: 'voltage' },
]

const imageTypeOptions = [
  { label: '远景', value: 'far' },
  { label: '近景', value: 'near' },
  { label: '红外', value: 'infrared' },
  { label: '可见光', value: 'visible' },
]

const quickRanges = [
  { key: '3d', label: '最近三天', amount: 3, unit: 'day' },
  { key: '1w', label: '最近一周', amount: 1, unit: 'week' },
  { key: '2w', label: '最近两周', amount: 2, unit: 'week' },
  { key: '1m', label: '最近一个月', amount: 1, unit: 'month' },
  { key: '3m', label: '最近三个月', amount: 3, unit: 'month' },
] as const

const dataFieldValues = dataFieldOptions.map((item) => item.value)
const imageTypeValues = imageTypeOptions.map((item) => item.value)

const formData = ref<FormState>({
  selectDevice: ['wh-1', 'wh-2', 'wh-3'],
  type: ['data', 'image'],
  dataFields: ['soil_temp', 'soil_moisture'],
  imageTypes: ['near', 'infrared'],
  timeRange: [dayjs().subtract(3, 'day'), dayjs()],
})

const downloadColumns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    align: 'center',
    key: 'ID',
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    align: 'center',
    key: 'created_time',
  },
  {
    title: '包含设备',
    dataIndex: 'device',
    align: 'center',
    key: 'device',
  },
  {
    title: '内容',
    dataIndex: 'content',
    align: 'center',
    key: 'content',
  },
  {
    title: '内容起止时间',
    dataIndex: 'start_end',
    align: 'center',
    key: 'start_end',
  },
  {
    title: '条目数目',
    dataIndex: 'count',
    align: 'center',
    key: 'count',
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    align: 'center',
    key: 'size',
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    key: 'status',
  },
  {
    title: '进度',
    dataIndex: 'progress',
    align: 'center',
    key: 'progress',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
  },
]

const lastValidSelectDevice = ref<string[]>([...formData.value.selectDevice])
const activeQuickKey = ref<string | null>('3d')

const dataCheckAll = ref(false)
const imageCheckAll = ref(false)

const updateCheckAll = () => {
  dataCheckAll.value =
    formData.value.dataFields.length === dataFieldValues.length
  imageCheckAll.value =
    formData.value.imageTypes.length === imageTypeValues.length
}

updateCheckAll()

const handleChange = (value: string[]) => {
  if (value.length > 3) {
    message.warning('最多只能选择3个站点')
    formData.value.selectDevice = [...lastValidSelectDevice.value]
    return
  }
  lastValidSelectDevice.value = [...value]
}

const onDataCheckAllChange = (event: { target: { checked: boolean } }) => {
  const checked = event.target.checked
  formData.value.dataFields = checked ? [...dataFieldValues] : []
  dataCheckAll.value = checked
}

const onImageCheckAllChange = (event: { target: { checked: boolean } }) => {
  const checked = event.target.checked
  formData.value.imageTypes = checked ? [...imageTypeValues] : []
  imageCheckAll.value = checked
}

const onDataGroupChange = () => {
  dataCheckAll.value =
    formData.value.dataFields.length === dataFieldValues.length
}

const onImageGroupChange = () => {
  imageCheckAll.value =
    formData.value.imageTypes.length === imageTypeValues.length
}

const onRangeChange = (
  value: [Dayjs, Dayjs] | null,
  dateString: [string, string]
) => {
  console.log('Selected Time: ', value)
  console.log('Formatted Selected Time: ', dateString)
  formData.value.timeRange = value ?? null
  activeQuickKey.value = null
}

const onRangeOk = (value: [Dayjs, Dayjs]) => {
  console.log('onOk: ', value)
}
const setQuickRange = (key: string) => {
  const item = quickRanges.find((r) => r.key === key)
  if (!item) return
  const end = dayjs()
  const start = end.subtract(item.amount, item.unit)
  formData.value.timeRange = [start, end]
  activeQuickKey.value = key
}

const resetForm = () => {
  formData.value = {
    selectDevice: ['wh-1', 'wh-2', 'wh-3'],
    type: ['data', 'image'],
    dataFields: ['soil_temp', 'soil_moisture'],
    imageTypes: ['near', 'infrared'],
    timeRange: [dayjs().subtract(3, 'day'), dayjs()],
  }
  lastValidSelectDevice.value = [...formData.value.selectDevice]
  updateCheckAll()
}

const submitForm = () => {
  console.log('submit', formData.value)
}

const onClose = (e: MouseEvent) => {
  console.log(e, 'I was closed.')
}

const handleDownload = (value: any) => {
  console.log(value)
}
</script>

<style scoped lang="scss">
:deep(.ant-alert) {
  border-radius: 0px;
}

.down-form {
  width: 100%;
  min-height: 214px;
  background-color: #f9fafe;
  margin-top: 12px;
  padding: 20px;
}

.download-form {
  width: 100%;
}

:deep(.down-form .ant-form-item) {
  margin-bottom: 6px;
}

:deep(.download-form .ant-form-item-label) {
  width: 84px;
}

:deep(.download-form .ant-form-item-control) {
  flex: 1 1 auto;
}

:deep(.down-form .ant-form-item-label > label) {
  color: #606266;
}

:deep(.ant-select-multiple .ant-select-selector) {
  border-radius: 0px;
}

.device-select {
  width: 100%;
  max-width: 1200px;
}

.check-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.inline-checks {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.time-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1 1 auto;
  min-width: 420px;
}

.time-picker {
  width: 360px;
}

.quick-range :deep(.quick-btn.ant-btn) {
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #e6e8ec;
  background-color: #ffffff;
  color: #606266;
  font-weight: 500;
}

.quick-range :deep(.quick-btn.ant-btn:hover),
.quick-range :deep(.quick-btn.ant-btn:focus) {
  border-color: #3c6eff;
  color: #3c6eff;
}

.quick-range :deep(.quick-btn.is-active.ant-btn) {
  border-color: #3c6eff;
  background-color: #f3f6ff;
  color: #3c6eff;
}

.time-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.time-right :deep(.ant-btn) {
  min-width: 88px;
}

@media (max-width: 1200px) {
  .time-left {
    min-width: 100%;
  }

  .time-picker {
    width: 100%;
  }

  .time-right {
    width: 100%;
    justify-content: flex-end;
  }
}

.download-list {
  width: 100%;
}

.list-hearder {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
  font-family: Source Han Sans CN;
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
}

.header-icon {
  width: 17px;
  height: 17px;
  display: inline-block;
}

.share-btn {
  height: 32px;
  min-width: 96px;
  padding: 0 12px;
  background: linear-gradient(180deg, #375bf5 0%, #5b89fa 100%);
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(55, 91, 245, 0.25);
}

.share-btn:hover,
.share-btn:focus {
  background: linear-gradient(180deg, #2f54eb 0%, #4a75f3 100%);
}

.table-box {
  width: 100%;
}

:deep(.download-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}

:deep(
    .download-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .download-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>
