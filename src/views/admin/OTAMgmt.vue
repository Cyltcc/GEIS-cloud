<template>
  <div class="admin-page">
    <div class="OTA-header">
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
    </div>
    <div class="table-box">
      <a-table :columns="OTAColumns"
               class="OTA-table"></a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
const OTAColumns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    key: 'ID',
    align: 'center',
  },
  {
    title: '设备ID',
    dataIndex: 'deviceID',
    key: 'deviceID',
    align: 'center',
  },
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    align: 'center',
  },
  {
    title: '固件下载',
    dataIndex: 'firmware_download',
    key: 'firmware_download',
    align: 'center',
  },
  {
    title: '哈希算法',
    dataIndex: 'hash_algorithm',
    key: 'hash_algorithm',
    align: 'center',
  },
  {
    title: '哈希值',
    dataIndex: 'hash_value',
    key: 'hash_value',
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    align: 'center',
  },
]
</script>

<style scoped lang="scss">
.OTA-header {
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

:deep(.OTA-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #f3f3f3;
  height: 44px;
}

:deep(
    .OTA-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .OTA-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>
