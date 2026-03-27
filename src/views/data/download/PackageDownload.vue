<template>
  <div>
    <div class="package-header">
      <a-form class="package-form">
        <a-form-item label="站点选择">
          <a-select v-model:value="selectDevice"
                    placeholder="请选择站点"
                    style="width: 300px"
                    :options="deviceOpt">
          </a-select>
        </a-form-item>
        <div style="display: flex; justify-content: space-between;">
          <a-form-item label="年份选择">
            <a-radio-group v-model:value="selectYear"
                           :options="yearGroup" />
          </a-form-item>
          <div style="display: flex; gap: 10px;">
            <a-button class="query-btn"
                      type="primary">查询</a-button>
            <a-button type="primary"
                      ghost>重置</a-button>
          </div>
        </div>
      </a-form>
    </div>
    <div>
      <div class="list-hearder">
        <div class="list-title">
          <i class="header-icon i-custom:data-pr"
             aria-hidden="true"></i>
          数据列表
        </div>
        <div style="display: flex; gap: 10px;">
          <a-button type="primary"
                    class="share-btn">模版上传</a-button>
          <a-button type="primary"
                    class="share-btn">模板下载</a-button>
          <a-button type="primary"
                    class="share-btn">批量下载</a-button>
        </div>
      </div>
      <div class="table-box">
        <a-table class="package-table"
                 :columns="packageColumns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <a-button style="color: #3969FA"
                        type="text"
                        @click="handleDownload(record)">下载</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectDevice = ref(null)
const selectYear = ref('2026')
const deviceOpt = ref([])

const yearGroup = [
  {
    label: '2026',
    value: '2026',
  },
  {
    label: '2025',
    value: '2025',
  },
  {
    label: '2024',
    value: '2024',
  },
]

const packageColumns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    align: 'center',
    key: 'ID',
  },
  {
    title: '月份',
    dataIndex: 'month',
    align: 'center',
    key: 'month',
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    align: 'center',
    key: 'created_time',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    align: 'center',
    key: 'update_time',
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

const handleDownload = (value: any) => {
  console.log(value)
}
</script>

<style lang="scss" scoped>
.package-header {
  width: 100%;
  height: 106px;
  background-color: #f9fafe;
  padding: 16px;
}

:deep(.package-form .ant-form-item) {
  margin-bottom: 6px;
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

.query-btn {
  width: 68px;
  height: 32px;
  background: linear-gradient(180deg, #375bf5 0%, #5b89fa 100%);
}

.query-btn:hover,
.query-btn:focus {
  background: linear-gradient(180deg, #2f54eb 0%, #4a75f3 100%);
}

.share-btn:hover,
.share-btn:focus {
  background: linear-gradient(180deg, #2f54eb 0%, #4a75f3 100%);
}

.table-box {
  width: 100%;
}

:deep(.package-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}

:deep(
    .package-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .package-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>