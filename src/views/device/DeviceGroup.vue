<script setup lang="ts">
import { ref } from 'vue'
import GModal from '@/components/GModal.vue'

const showAdd = ref(false)
const form = ref({ name: '', devices: [] })
const formRef = ref()

const keyword = ref('')

const columns = [
  { title: '序号', key: 'index', width: 80 },
  { title: '分组名称', dataIndex: 'name', key: 'name' },
  { title: '设备数量', dataIndex: 'count', key: 'count' },
  { title: '设备状态', key: 'status' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 200, align: 'right' },
]

const dataSource = ref([
  {
    id: 1,
    name: '分组名称一',
    count: 8,
    status: {
      normal: 5,
      warning: 2,
      error: 1,
    },
    createTime: '2025-11-12 13:20:12',
  },
])

const handleSearch = () => {
  console.log('Search:', keyword.value)
}

const submitAddGroup = () => {
  console.log('Submit Add Group:', form.value)
  showAdd.value = false
}
</script>

<template>
  <div class="device-group-container">

    <div class="filter-container">
      <div class="left">
        <a-input-search v-model:value="keyword"
                        placeholder="输入关键词以检索"
                        style="width: 300px"
                        enter-button="查询"
                        @search="handleSearch" />
      </div>
      <div class="right">
        <a-button type="primary"
                  @click="showAdd = true"
                  class="action-btn">添加分组</a-button>
        <a-button class="action-btn">刷新</a-button>
      </div>
    </div>

    <a-table :columns="columns"
             :data-source="dataSource"
             :pagination="false"
             row-key="id">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>

        <template v-if="column.key === 'status'">
          <span class="status-text normal">{{ record.status.normal }}</span>
          <span class="separator">/</span>
          <span class="status-text warning">{{ record.status.warning }}</span>
          <span class="separator">/</span>
          <span class="status-text error">{{ record.status.error }}</span>
        </template>

        <template v-if="column.key === 'action'">
          <a class="action-link">编辑</a>
          <a-divider type="vertical" />
          <a class="action-link delete">删除</a>
        </template>
      </template>
    </a-table>
  </div>
  <g-modal v-model="showAdd"
           title="添加分组"
           @ok="submitAddGroup">
    <a-form :model="form"
            ref="formRef">
      <a-form-item label="分组名称"
                   name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="设备选择"
                   name="devices">
        <!-- 自定义下拉或树形选择 -->
      </a-form-item>
    </a-form>
  </g-modal>
</template>

<style scoped lang="scss">
.device-group-container {
  background: #fff;
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

.filter-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  .action-btn {
    margin-left: 8px;
  }
}

.status-text {
  font-weight: 500;

  &.normal {
    color: #52c41a;
  }
  &.warning {
    color: #faad14;
  }
  &.error {
    color: #ff4d4f;
  }
}

.separator {
  margin: 0 4px;
  color: #d9d9d9;
}

.action-link {
  color: #1890ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &.delete {
    color: #ff4d4f;
  }
}
</style>
