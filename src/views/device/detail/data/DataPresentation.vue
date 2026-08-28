<template>
  <div class="data-presentation">
    <a-collapse class="data-collapse"
                :bordered="false"
                expand-icon-position="end"
                @change="handleClick">
      <a-collapse-panel key="data">
        <template #header>
          <div class="header">
            <div class="header-left"
                 @click.stop>
              <i class="header-icon i-custom:data-pr"
                 aria-hidden="true"></i>
              <span class="header-text">数据展示</span>
              <a-button class="share-btn"
                        type="primary">共享下载</a-button>
              <span class="share-tip">点击后跳转到共享下载平台</span>
            </div>
            <div class="header-right">
              <span class="collapse-text">{{ isCollapse ? '展开' : '折叠' }}</span>
            </div>
          </div>
        </template>
        <div>
          <div class="time-box">
            <div class="time-box-left">
              <span class="time-box-text">时间范围：</span>
              <a-range-picker style="width: 400px; margin-left: 20px;"
                              :show-time="{ format: 'HH:mm' }"
                              format="YYYY-MM-DD HH:mm"
                              :placeholder="['Start Time', 'End Time']"
                              v-model:value="rangeValue"
                              @change="onRangeChange"
                              @ok="onRangeOk">
                <template #suffixIcon>
                  <i class="i-custom:time"
                     style="width: 15px; height: 15px; display: inline-block;"></i>
                </template>
              </a-range-picker>
              <div style="margin-left: 20px; display: flex; gap: 10px;">
                <a-button v-for="item in quickRanges"
                          :key="item.key"
                          :type="activeQuickKey === item.key ? 'primary' : 'default'"
                          @click="setQuickRange(item.key)">
                  {{ item.label }}
                </a-button>
              </div>
            </div>
            <div class="time-box-right">

              <a-button class="query-btn"
                        type="primary">查询</a-button>
              <a-button>重置</a-button>

            </div>
          </div>
          <div class="data-box">
            <div class="data-chart-box">
              <div class="checked-box">
                <div class="checked-box-text">显示：</div>
                <div class="checked-options">
                  <a-checkbox class="check-all"
                              :indeterminate="dataIndeterminate"
                              :checked="dataCheckAll"
                              @change="onDataCheckAllChange">全选</a-checkbox>
                  <a-checkbox-group class="checked-group"
                                    v-model:value="checkedDataValue"
                                    name="checkboxgroup"
                                    :options="dataOptions" />
                </div>
              </div>
              <div class="data-chart-list">
                <GEchart v-for="item in selectedDataSeries"
                         :key="item.key"
                         :title="item.title"
                         :unit="item.unit"
                         :color="item.color"
                         :x-data="item.xData"
                         :y-data="item.yData"
                         :min="item.min"
                         :max="item.max"
                         :tooltip-date="item.tooltipDate" />
              </div>
            </div>
            <div class="data-image-box">
              <div class="checked-box">
                <div class="checked-box-text">显示：</div>
                <div class="checked-options">
                  <a-checkbox class="check-all"
                              :indeterminate="imageIndeterminate"
                              :checked="imageCheckAll"
                              @change="onImageCheckAllChange">全选</a-checkbox>
                  <a-checkbox-group class="checked-group"
                                    v-model:value="checkedImageValue"
                                    name="checkboxgroup"
                                    :options="imageOptions" />
                </div>
              </div>
              <div class="data-image-list">
                <GImage v-for="item in selectedImageSeries"
                        :key="item.key"
                        :title="item.title"
                        :images="item.images" />
              </div>
            </div>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import GEchart from '@/components/GEchart.vue'
import GImage from '@/components/GImage.vue'

const isCollapse = ref(false)
const now = dayjs()
const rangeValue = ref<[Dayjs, Dayjs] | null>([now.subtract(3, 'day'), now])
const activeQuickKey = ref<string | null>('3d')

const quickRanges = [
  { key: '3d', label: '最近三天', unit: 'day', amount: 3 },
  { key: '1w', label: '最近一周', unit: 'day', amount: 7 },
  { key: '2w', label: '最近两周', unit: 'day', amount: 14 },
  { key: '1m', label: '最近一个月', unit: 'month', amount: 1 },
  { key: '3m', label: '最近三个月', unit: 'month', amount: 3 },
] as const

const handleClick = (keys: string | string[]) => {
  const nextKeys = Array.isArray(keys) ? keys : keys ? [keys] : []
  isCollapse.value = nextKeys.length === 0
}

const onRangeChange = (
  value: [Dayjs, Dayjs] | null,
  dateString: [string, string]
) => {
  console.log('Selected Time: ', value)
  console.log('Formatted Selected Time: ', dateString)
  rangeValue.value = value ?? null
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
  rangeValue.value = [start, end]
  activeQuickKey.value = key
}

const dataOptions = [
  { label: '土壤钾', value: 'SP' },
  { label: '土壤磷', value: 'Sp' },
  { label: '土壤PH', value: 'SPH' },
  { label: '土壤水分', value: 'SM' },
  { label: '土壤氮', value: 'SN' },
  { label: '土壤电导率', value: 'SEC' },
  { label: '土壤盐分', value: 'SS' },
  { label: '土壤温度', value: 'ST' },
]
const imageOptions = [
  { label: '远景', value: 'key1' },
  { label: '近景', value: 'key2' },
  { label: '红外', value: 'key3' },
  { label: '可见光', value: 'key4' },
]

const dataAllValues = dataOptions.map((item) => item.value)
const imageAllValues = imageOptions.map((item) => item.value)

type CheckboxChangeEvent = { target: { checked: boolean } }

const checkedDataValue = ref<string[]>([...dataAllValues])
const checkedImageValue = ref<string[]>([...imageAllValues])

const dataCheckAll = computed(
  () => checkedDataValue.value.length === dataAllValues.length
)
const dataIndeterminate = computed(
  () =>
    checkedDataValue.value.length > 0 &&
    checkedDataValue.value.length < dataAllValues.length
)
const imageCheckAll = computed(
  () => checkedImageValue.value.length === imageAllValues.length
)
const imageIndeterminate = computed(
  () =>
    checkedImageValue.value.length > 0 &&
    checkedImageValue.value.length < imageAllValues.length
)

const onDataCheckAllChange = (e: CheckboxChangeEvent) => {
  checkedDataValue.value = e.target.checked ? [...dataAllValues] : []
}

const onImageCheckAllChange = (e: CheckboxChangeEvent) => {
  checkedImageValue.value = e.target.checked ? [...imageAllValues] : []
}

const mockTimeLabels = [
  '8:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
  '24:00',
  '2:00',
  '4:00',
  '6:00',
]

const mockDataSeries = {
  SP: {
    key: 'SP',
    title: '土壤钾',
    unit: 'mg/kg',
    color: '#62d488',
    min: -50,
    max: 250,
    xData: mockTimeLabels,
    yData: [35, 120, 160, 125, 90, 180, 160, 130, 110, 165, 120, 140],
  },
  Sp: {
    key: 'Sp',
    title: '土壤磷',
    unit: 'mg/kg',
    color: '#8a74ff',
    min: -10,
    max: 40,
    xData: mockTimeLabels,
    yData: [6, 12, 18, 16, 10, 25, 22, 15, 11, 26, 14, 17],
  },
  SPH: {
    key: 'SPH',
    title: '土壤PH',
    unit: 'PH',
    color: '#34a3ff',
    min: 4,
    max: 9,
    xData: mockTimeLabels,
    yData: [5.2, 6.1, 6.5, 6.2, 6.0, 6.8, 7.1, 6.7, 6.4, 6.9, 6.3, 6.0],
  },
  SM: {
    key: 'SM',
    title: '土壤水分',
    unit: '%',
    color: '#36cfc9',
    min: 0,
    max: 100,
    xData: mockTimeLabels,
    yData: [22, 34, 48, 42, 36, 55, 62, 58, 50, 66, 54, 46],
  },
  SN: {
    key: 'SN',
    title: '土壤氮',
    unit: 'mg/kg',
    color: '#f5a623',
    min: 0,
    max: 120,
    xData: mockTimeLabels,
    yData: [15, 28, 45, 38, 32, 70, 66, 52, 40, 78, 60, 48],
  },
  SEC: {
    key: 'SEC',
    title: '土壤电导率',
    unit: 'ms/cm',
    color: '#ff6b6b',
    min: 0,
    max: 20,
    xData: mockTimeLabels,
    yData: [3, 5, 9, 8, 6, 12, 11, 9, 7, 13, 10, 8],
  },
  SS: {
    key: 'SS',
    title: '土壤盐分',
    unit: 'g/kg',
    color: '#ff9f43',
    min: 0,
    max: 15,
    xData: mockTimeLabels,
    yData: [2, 4, 6, 5, 4, 9, 8, 6, 5, 10, 7, 6],
  },
  ST: {
    key: 'ST',
    title: '土壤温度',
    unit: '°C',
    color: '#ff7a45',
    min: -5,
    max: 35,
    xData: mockTimeLabels,
    yData: [6, 10, 14, 16, 15, 18, 20, 19, 17, 21, 18, 16],
  },
}

const selectedDataSeries = computed(() => {
  const date = dayjs().format('YYYY-MM-DD')
  return checkedDataValue.value
    .map((key) => mockDataSeries[key as keyof typeof mockDataSeries])
    .filter(Boolean)
    .map((item) => ({
      ...item,
      tooltipDate: date,
    }))
})

const mockImageSeries = {
  key1: {
    key: 'key1',
    title: '相机：远景1',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-20 10:12:31',
      },
      {
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-20 12:05:18',
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-20 14:22:05',
      },
      {
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-20 16:41:09',
      },
    ],
  },
  key2: {
    key: 'key2',
    title: '相机：近景1',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-21 09:18:32',
      },
      {
        url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-21 10:52:43',
      },
      {
        url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-21 12:06:11',
      },
    ],
  },
  key3: {
    key: 'key3',
    title: '相机：红外1',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-22 08:35:12',
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-22 11:20:44',
      },
    ],
  },
  key4: {
    key: 'key4',
    title: '相机：可见光1',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-23 07:12:59',
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-23 10:03:27',
      },
      {
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        time: '2025-11-23 13:44:03',
      },
    ],
  },
}

const selectedImageSeries = computed(() => {
  return checkedImageValue.value
    .map((key) => mockImageSeries[key as keyof typeof mockImageSeries])
    .filter(Boolean)
})
</script>

<style lang="scss" scoped>
.data-presentation {
  background: #ffffff;
}

.data-collapse {
  background: #ffffff;
  border: none;

  :deep(.ant-collapse-item) {
    border: none;
  }

  :deep(.ant-collapse-header) {
    align-items: center;
    background: #ffffff;
  }

  :deep(.ant-collapse-header-text) {
    width: 100%;
  }

  :deep(.ant-collapse-expand-icon) {
    color: #8c8c8c;
    font-size: 12px;
  }

  :deep(.ant-collapse-content) {
    border-top: none;
  }
}

:deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
  padding: 0 !important;
  margin-bottom: 15px;
}

:deep(.ant-collapse .ant-collapse-content > .ant-collapse-content-box) {
  padding: 0 !important;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}

.header-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
}

.header-text {
  font-family: Source Han Sans CN;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #1f1f1f;
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

.share-tip {
  font-size: 12px;
  color: #ff4d4f;
  line-height: 20px;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  margin-right: 6px;
}

.collapse-text {
  font-size: 12px;
  color: #8c8c8c;
}

.time-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 72px;
  padding: 20px;
  margin-bottom: 15px;
  background-color: #f9fafe;
}

.time-box-left {
  display: flex;
  align-items: center;
}

.time-box-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-icon {
  width: 15px;
  height: 15px;
  display: inline-block;
  color: #8b8b8b;
}

.time-box-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  color: #8b8b8b;
}

.query-btn {
  height: 32px;
  padding: 0 12px;
  background: linear-gradient(180deg, #375bf5 0%, #5b89fa 100%);
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(55, 91, 245, 0.25);
}

.query-btn:hover,
.query-btn:focus {
  background: linear-gradient(180deg, #2f54eb 0%, #4a75f3 100%);
}

.data-box {
  width: 100%;
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.data-chart-box,
.data-image-box {
  flex: 1;
}

.data-chart-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-image-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checked-box {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.check-all {
  flex: 0 0 auto;
}

.checked-options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 20px;
  flex: 1 1 auto;
  min-width: 0;
}

:deep(.checked-group.ant-checkbox-group) {
  display: contents;
}

:deep(.checked-options .ant-checkbox-wrapper) {
  margin-inline-start: 0;
  margin-inline-end: 0;
}

.checked-box-text {
  font-family: Source Han Sans CN;
  margin-right: 0;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  color: #8b8b8b;
  white-space: nowrap;
  flex: 0 0 auto;
}
</style>
