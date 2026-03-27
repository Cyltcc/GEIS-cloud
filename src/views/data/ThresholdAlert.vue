<template>
  <div>
    <div class="threshold-header">
      <div style="display: flex; gap: 10px;">
        <a-input style="width: 300px;"
                 placeholder="输入关键词以检索">
          <template #prefix>
            <i class="i-custom:search-input"
               style="width: 16px; height: 16px; display: inline-block;"></i>
          </template>
        </a-input>
        <a-button class="query-btn"
                  type="primary">查询</a-button>
      </div>
      <a-button ghost
                style="width: 68px;"
                type="primary">刷新</a-button>
    </div>
    <div class="table-box">
      <a-table class="threshold-table"
               :data-source="thresholdData"
               :columns="thresholdColumns">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'operation'">
            --
          </template>
        </template>
      </a-table>
    </div>

  </div>
</template>
 
<script setup lang="ts">
import { ref } from 'vue'

const thresholdColumns = [
  {
    title: '设备名称',
    dataIndex: 'device_name',
    align: 'center',
    key: 'device_name',
  },
  {
    title: '告警项目',
    dataIndex: 'project',
    align: 'center',
    key: 'project',
  },
  {
    title: '监测值',
    dataIndex: 'monitor',
    align: 'center',
    key: 'monitor',
  },
  {
    title: '阈值范围',
    dataIndex: 'threshold_range',
    align: 'center',
    key: 'threshold_range',
  },
  {
    title: '告警时间',
    dataIndex: 'alert_time',
    align: 'center',
    key: 'alert_time',
  },

  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
  },
]

const thresholdData = ref([
  {
    device_name: '黄河水电',
    project: '土壤温度',
    monitor: '60℃',
    threshold_range: '10~30℃',
    alert_time: '2025-11-27 10:59:00',
  },
])
</script>

<style lang="scss" scoped>
.threshold-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-top: 12px;
  width: 100%;
}

:deep(.threshold-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}

:deep(
    .threshold-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .threshold-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>