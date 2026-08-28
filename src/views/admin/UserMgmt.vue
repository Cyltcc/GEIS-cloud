<template>
  <div class="admin-page">
    <div class="user-header">
      <div style="display: flex; gap: 10px">
        <a-input v-model:value="keyword"
                 style="width: 300px"
                 placeholder="用户名、手机号">
          <template #prefix>
            <i class="i-custom:search-input"
               style="width: 16px; height: 16px; display: inline-block"></i>
          </template>
        </a-input>
        <a-button class="query-btn"
                  type="primary">查询</a-button>
      </div>
      <div style="display: flex; gap: 10px">
        <a-button style="width: 96px"
                  type="primary"
                  class="query-btn"
                  @click="openAddModal">添加用户</a-button>
        <a-button danger
                  type="primary"
                  @click="handleBatchDelete">删除</a-button>
      </div>
    </div>
    <div class="table-box">
      <a-table class="user-table"
               :columns="userColumns"
               :data-source="filteredUsers"
               :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
               row-key="id"
               :pagination="false">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>

          <template v-if="column.key === 'operation'">
            <div style="display: flex; justify-content: center; align-items: center">
              <a-button style="color: #3969fa"
                        type="text"
                        @click="openEditModal(record)">编辑</a-button>
              <span style="width: 2px; height: 8px; background-color: #c5c5c5"></span>
              <a-button style="color: #f6685d"
                        type="text"
                        @click="openDeleteModal(record)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <GModal v-model="userModalVisible"
            :title="userModalTitle"
            :width="520"
            @ok="handleUserConfirm"
            @cancel="handleUserCancel">
      <a-form ref="formRef"
              :model="userForm"
              :rules="rules"
              layout="horizontal"
              :label-col="{ style: { width: '82px' } }"
              :wrapper-col="{ span: 24 }">
        <a-form-item label="用户名"
                     name="username"
                     required>
          <a-input v-model:value="userForm.username"
                   placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码"
                     name="password"
                     required>
          <a-input v-model:value="userForm.password"
                   placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="手机号"
                     name="phone">
          <a-input v-model:value="userForm.phone"
                   placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="邮箱"
                     name="email">
          <a-input v-model:value="userForm.email"
                   placeholder="请输入邮箱" />
        </a-form-item>
      </a-form>
    </GModal>

    <GModal v-model="deleteModalVisible"
            title="删除用户"
            :width="360"
            @ok="handleDeleteConfirm"
            @cancel="handleDeleteCancel">
      <div class="delete-content">
        确定要删除该用户吗？
      </div>
    </GModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import GModal from '@/components/GModal.vue'

type Key = string | number

interface UserRow {
  id: number
  username: string
  password: string
  phone: string
  email: string
}

const keyword = ref('')
const selectedRowKeys = ref<Key[]>([])
const userColumns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    align: 'center',
    width: 60,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '密码',
    dataIndex: 'password',
    key: 'password',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    align: 'center',
  },
  {
    title: '操作',
    key: 'operation',
    dataIndex: 'operation',
    align: 'center',
  },
]

const users = ref<UserRow[]>([
  {
    id: 1,
    username: '张鹏鹏',
    password: '123456',
    phone: '17866564321',
    email: '17866564321@gmail.com',
  },
])

const filteredUsers = computed(() => {
  const query = keyword.value.trim()
  if (!query) return users.value
  return users.value.filter(
    (item) => item.username.includes(query) || item.phone.includes(query)
  )
})

const userModalVisible = ref(false)
const userModalMode = ref<'add' | 'edit'>('add')
const editingId = ref<number | null>(null)
const userModalTitle = computed(() =>
  userModalMode.value === 'edit' ? '编辑用户' : '添加用户'
)
const formRef = ref()
const userForm = reactive({
  username: '',
  password: '',
  phone: '',
  email: '',
})

const validatePhone = (_rule: unknown, value: string) => {
  if (!value) return Promise.resolve()
  if (!/^1\d{10}$/.test(value)) {
    return Promise.reject('请输入正确手机号')
  }
  return Promise.resolve()
}

const validateEmail = (_rule: unknown, value: string) => {
  if (!value) return Promise.resolve()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return Promise.reject('请输入正确邮箱')
  }
  return Promise.resolve()
}

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
}

const deleteModalVisible = ref(false)
const deletingIds = ref<number[]>([])

const resetForm = () => {
  userForm.username = ''
  userForm.password = ''
  userForm.phone = ''
  userForm.email = ''
  formRef.value?.clearValidate?.()
}

const onSelectChange = (keys: Key[]) => {
  selectedRowKeys.value = keys
}

const openAddModal = () => {
  userModalMode.value = 'add'
  editingId.value = null
  resetForm()
  userModalVisible.value = true
}

const openEditModal = (record: UserRow) => {
  userModalMode.value = 'edit'
  editingId.value = record.id
  userForm.username = record.username
  userForm.password = record.password
  userForm.phone = record.phone
  userForm.email = record.email
  formRef.value?.clearValidate?.()
  userModalVisible.value = true
}

const handleUserConfirm = async () => {
  try {
    await formRef.value?.validate()
    if (userModalMode.value === 'edit') {
      const row = users.value.find((item) => item.id === editingId.value)
      if (!row) {
        message.warning('未找到要编辑的用户')
        return
      }
      row.username = userForm.username
      row.password = userForm.password
      row.phone = userForm.phone
      row.email = userForm.email
      message.success('用户信息已更新')
    } else {
      const nextId =
        users.value.reduce((max, item) => Math.max(max, item.id), 0) + 1
      users.value.push({
        id: nextId,
        username: userForm.username,
        password: userForm.password,
        phone: userForm.phone,
        email: userForm.email,
      })
      message.success('用户添加成功')
    }
    userModalVisible.value = false
  } catch (_error) {
    // 表单未通过校验时保留弹窗
  }
}

const handleUserCancel = () => {
  userModalVisible.value = false
}

const openDeleteModal = (record: UserRow) => {
  deletingIds.value = [record.id]
  deleteModalVisible.value = true
}

const handleBatchDelete = () => {
  if (!selectedRowKeys.value.length) {
    message.warning('请先选择用户')
    return
  }
  deletingIds.value = selectedRowKeys.value.map((id) => Number(id))
  deleteModalVisible.value = true
}

const handleDeleteConfirm = () => {
  if (!deletingIds.value.length) {
    deleteModalVisible.value = false
    return
  }
  users.value = users.value.filter(
    (item) => !deletingIds.value.includes(item.id)
  )
  selectedRowKeys.value = []
  deletingIds.value = []
  deleteModalVisible.value = false
  message.success('删除成功')
}

const handleDeleteCancel = () => {
  deletingIds.value = []
  deleteModalVisible.value = false
}
</script>

<style scoped lang="scss">
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-box {
  margin-top: 12px;
  width: 100%;
}

.delete-content {
  font-size: 14px;
  color: #1d2129;
  padding: 8px 0 12px;
}

:deep(.user-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #f3f3f3;
  height: 44px;
}

:deep(
    .user-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .user-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>
