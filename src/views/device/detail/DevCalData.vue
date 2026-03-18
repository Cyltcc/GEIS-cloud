<template>
  <div>
    <div class="Cal-Nav">
      <div style="cursor: pointer;"
           v-for="item in navOpt"
           :key="item.key"
           :class="{
             'active-nav': activeKey === item.key,
             'ndvi-bold': item.key === 'NDVI',
           }"
           @click="setActive(item.key)">
        {{ item.label }}
      </div>
    </div>
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
      </div>
      <div class="time-box-right">

        <a-button class="query-btn"
                  type="primary">查询</a-button>
        <a-button type="primary"
                  ghost>重置</a-button>

      </div>
    </div>
    <div class="chart-box">
      <GEchart v-if="currentSeries"
               :title="currentSeries.title"
               :unit="currentSeries.unit"
               :color="currentSeries.color"
               :x-data="chartXData"
               :y-data="currentSeries.yData"
               :min="currentSeries.min"
               :max="currentSeries.max"
               :tooltip-date="tooltipDate" />
    </div>
    <div class="table-box">
      <a-table class="cal-table"
               :columns="calDataColumns"
               :data-source="calData"
               :pagination="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import GEchart from '@/components/GEchart.vue'

const now = dayjs()
const rangeValue = ref<[Dayjs, Dayjs] | null>([now.subtract(3, 'day'), now])

const activeKey = ref('cover')
const navOpt = [
  {
    label: '植被盖度',
    key: 'cover',
  },
  {
    label: 'NDVI',
    key: 'NDVI',
  },
  {
    label: '叶面积',
    key: 'leafArea',
  },
  {
    label: '物候',
    key: 'phenology',
  },
]

const calDataColunms = [
  {
    title: '创建时间',
    dataIndex: 'created_time',
    align: 'center',
  },
  {
    title: '原始图片',
    dataIndex: 'original_image',
    align: 'center',
  },
  {
    title: '处理图片',
    dataIndex: 'edit_img',
    align: 'center',
  },
  {
    title: '盖度',
    dataIndex: 'cover',
    align: 'center',
  },
  {
    title: '相机',
    dataIndex: 'camera',
    align: 'center',
  },
]

const calDataColumns = computed(() => {
  const titleMap: Record<string, string> = {
    NDVI: 'NDVI',
    leafArea: '叶面积',
  }
  const dataIndexMap: Record<string, string> = {
    NDVI: 'NDVI',
    leafArea: 'leafArea',
  }
  return calDataColunms.map((col, index) => {
    if (index !== 3) return col
    return {
      ...col,
      title: titleMap[activeKey.value] || col.title,
      dataIndex: dataIndexMap[activeKey.value] || col.dataIndex,
    }
  })
})

const calData = ref([])

const setActive = (key: string) => {
  activeKey.value = key
}

const chartXData = [
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

const chartSeries = {
  cover: {
    title: '植被盖度',
    color: '#62d488',
    min: 0,
    max: 100,
    yData: [12, 18, 25, 32, 28, 36, 42, 38, 30, 35, 40, 45],
  },
  NDVI: {
    title: 'NDVI',
    color: '#6aa9ff',
    min: 0.6,
    max: 1.2,
    yData: [
      0.7, 0.82, 0.92, 0.88, 0.86, 1.01, 1.03, 0.98, 0.92, 1.02, 0.9, 0.72,
    ],
  },
  leafArea: {
    title: '叶面积指数',
    color: '#ff8a34',
    min: 0,
    max: 500,
    yData: [120, 160, 210, 260, 230, 300, 340, 320, 280, 310, 360, 400],
  },
  phenology: {
    title: '物候',
    color: '#8a74ff',
    min: 0,
    max: 100,
    yData: [15, 22, 30, 38, 36, 48, 55, 50, 42, 46, 58, 62],
  },
} as const

const currentSeries = computed(
  () => chartSeries[activeKey.value as keyof typeof chartSeries]
)
const tooltipDate = computed(() => dayjs().format('YYYY-MM-DD'))

const onRangeChange = (
  value: [Dayjs, Dayjs] | null,
  dateString: [string, string]
) => {
  console.log('Selected Time: ', value)
  console.log('Formatted Selected Time: ', dateString)
  rangeValue.value = value ?? null
}

const onRangeOk = (value: [Dayjs, Dayjs]) => {
  console.log('onOk: ', value)
}
</script>

<style lang="scss" scoped>
.Cal-Nav {
  display: flex;
  gap: 60px;
  width: 100%;
  height: 38px;
  background-color: #f9fafe;
  line-height: 38px;
  padding: 0 16px;
}

.Cal-Nav > div:hover {
  color: #3969fa;
}

.active-nav {
  color: #3969fa;
}

.ndvi-bold {
  font-weight: 700;
}

.time-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 72px;
  margin-bottom: 15px;
  gap: 15px;
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

.chart-box {
  width: 100%;
  margin-bottom: 20px;
}

.table-box {
  width: 100%;
}

:deep(.cal-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}

:deep(
    .cal-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .cal-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>
