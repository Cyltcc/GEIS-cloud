<template>
  <div>
    <div class="time-box">
      <div class="time-box-left">
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
        <a-input style="width: 300px; margin-left: 20px;"
                 placeholder="输入关键词以检索">
          <template #prefix>
            <i class="i-custom:search-input"
               style="width: 16px; height: 16px; display: inline-block;"></i>
          </template>
        </a-input>
      </div>
      <div class="time-box-right">

        <a-button class="query-btn"
                  type="primary">查询</a-button>
        <a-button style="margin-right: 15px;"
                  type="primary"
                  ghost>重置</a-button>
        <a-checkbox style="font-size: 12px; color: #8B8B8B;"
                    v-model:checked="checked">仅看与我相关</a-checkbox>
      </div>
    </div>
    <div class="table-box">
      <a-table class="ope-table"
               :columns="opeolumns"
               :data-source="opeData">
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'

const now = dayjs()
const rangeValue = ref<[Dayjs, Dayjs] | null>([now.subtract(3, 'day'), now])
const checked = ref(false)

const opeolumns = [
  {
    title: '操作详情',
    dataIndex: 'ope_detail',
    align: 'left',
    key: 'ope_detail',
  },
  {
    title: '时间',
    dataIndex: 'time',
    align: 'right',
    key: 'time',
  },
]

const opeData = ref([
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },

  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },

  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
  {
    ope_detail: 'Admin查询黄河水电6设备的实时数据信息',
    time: '2025-11-27 10:13:00',
  },
])

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
.time-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 72px;
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
  width: 68px;
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

.table-box {
  width: 100%;
}

:deep(.ope-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}

:deep(
    .ope-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .ope-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>