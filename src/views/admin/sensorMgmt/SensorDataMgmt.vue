<template>
  <div>
    <div class="mgmt-panel">
      <a-row :gutter="16"
             align="middle">
        <a-col>
          <a-input v-model:value="keyword"
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
        </a-col>
        <a-col style="margin-left: auto">
          <a-button class="action-btn">排序</a-button>
          <a-button type="primary"
                    class="action-btn"
                    @click="handleAddSensor">添加传感器</a-button>

          <a-button class="action-btn">刷新</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="mgmt-table">
      <a-table class="senrsor-table"
               :columns="senrsorColumns"
               :data-source="senrsorData"
               :pagination="false">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{  index + 1 }}
          </template>
          <template v-if="column.key === 'operation'">
            <a-button style="color: #3969FA"
                      type="text"
                      @click="handleDetail(record)">详情</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const senrsorColumns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    align: 'center',
    width: 60,
  },
  {
    title: 'ID',
    dataIndex: 'ID',
    align: 'center',
    key: 'ID',
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    key: 'type',
  },
  {
    title: '厂商',
    dataIndex: 'manufacturer',
    align: 'center',
    key: 'manufacturer',
  },
  {
    title: '描述',
    dataIndex: 'describe',
    align: 'center',
    key: 'describe',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
  },
]

const senrsorData = ref([
  {
    ID: 379,
    type: 'HCD6815',
    manufacturer: '厂商名称',
    describe: 'HCD6815温湿压传感器',
  },
])

const keyword = ref('')
const handleSearch = () => {}
const handleAddSensor = () => {
  router.push({ name: 'SensorDataAdd' })
}
const handleDetail = (record: any) => {
  const deviceName = record.type && record.type !== '--' ? record.type : ''
  router.push({
    name: 'SensorDataDetail',
    params: { id: String(record.ID) },
    query: deviceName ? { name: deviceName } : undefined,
  })
}
</script>

<style lang="scss" scoped>
.mgmt-panel {
  width: 100%;
  margin-bottom: 12px;
}

.action-btn {
  margin-left: 8px;
}

:deep(.senrsor-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}

:deep(
    .senrsor-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .senrsor-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>
