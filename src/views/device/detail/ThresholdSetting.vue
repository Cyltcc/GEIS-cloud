<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import GModal from '@/components/GModal.vue'

type Key = string | number

type ThresholdRow = {
  key: string
  index: number
  name: string
  alarmType: string
  min: string | number
  max: string | number
  unit: string
}

const thresholdData = ref<ThresholdRow[]>([])
const thresholdColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 60,
  },
  {
    title: '阈值告警',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '最低值',
    dataIndex: 'min',
    key: 'min',
    align: 'center',
  },
  {
    title: '最高值',
    dataIndex: 'max',
    key: 'max',
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 80,
  },
]
const state = ref<{
  selectedRowKeys: Key[]
  loading: boolean
}>({
  selectedRowKeys: [],
  loading: false,
})

const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys)
  state.value.selectedRowKeys = selectedRowKeys
}

const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const editingKey = ref<string | null>(null)
const modalTitle = computed(() =>
  modalMode.value === 'edit' ? '修改阈值告警' : '添加阈值告警',
)
const alarmOptions = [
  { label: '土壤氮', value: 'soil_n', unit: 'mg/kg' },
  { label: '土壤磷', value: 'soil_p', unit: 'mg/kg' },
  { label: '土壤水分', value: 'soil_moisture', unit: '%' },
  { label: '土壤电导率', value: 'soil_ec', unit: 'us/cm' },
]

const formState = reactive({
  alarmType: '',
  unit: '',
  min: '',
  max: '',
})

const openAddModal = () => {
  modalMode.value = 'add'
  editingKey.value = null
  formState.alarmType = ''
  formState.unit = ''
  formState.min = ''
  formState.max = ''
  modalVisible.value = true
}

const openEditModal = (record: ThresholdRow) => {
  modalMode.value = 'edit'
  editingKey.value = record.key
  formState.alarmType = record.alarmType
  formState.unit = record.unit
  formState.min = record.min
  formState.max = record.max
  modalVisible.value = true
}

const handleAlarmChange = (value: string) => {
  const option = alarmOptions.find((item) => item.value === value)
  formState.unit = option?.unit || ''
}

const handleAddConfirm = () => {
  if (!formState.alarmType) {
    message.warning('请选择阈值告警项目')
    return
  }
  const option = alarmOptions.find((item) => item.value === formState.alarmType)
  if (!option) {
    message.warning('阈值告警项目无效')
    return
  }

  if (modalMode.value === 'edit') {
    const row = thresholdData.value.find((item) => item.key === editingKey.value)
    if (!row) {
      message.warning('未找到需要修改的阈值告警')
      return
    }
    row.alarmType = formState.alarmType
    row.name = option.label
    row.min = formState.min
    row.max = formState.max
    row.unit = formState.unit
  } else {
    thresholdData.value.push({
      key: `${Date.now()}-${Math.random()}`,
      index: thresholdData.value.length + 1,
      name: option.label,
      alarmType: formState.alarmType,
      min: formState.min,
      max: formState.max,
      unit: formState.unit,
    })
  }
  modalVisible.value = false
}

const handleAddCancel = () => {
  modalVisible.value = false
}
</script>
<template>
  <div>
    <div class="threshold-header">
      <a-button style="width: 124px; background: linear-gradient(180deg, #375BF5 0%, #5B89FA 100%);"
                type="primary"
                @click="openAddModal">添加阈值告警</a-button>
      <a-button type="primary"
                danger>删除</a-button>
    </div>
    <div>
      <a-table class="threshold-table"
               :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
               :columns="thresholdColumns"
               :data-source="thresholdData"
               :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <div style="display: flex; justify-content: center; align-items: center;">
              <a-button style="color: #3969FA"
                        type="text"
                        @click="openEditModal(record)">编辑</a-button>
              <span style="width: 2px; height: 8px; background-color: #C5C5C5;"></span>
              <a-button style="color: #F6685D"
                        type="text">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <GModal v-model="modalVisible"
            :title="modalTitle"
            width="520px"
            @ok="handleAddConfirm"
            @cancel="handleAddCancel">
      <a-form layout="vertical">
        <a-form-item label="阈值告警"
                     required>
          <a-select v-model:value="formState.alarmType"
                    placeholder="请选择阈值告警"
                    @change="handleAlarmChange">
            <a-select-option v-for="option in alarmOptions"
                             :key="option.value"
                             :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="formState.alarmType"
                     label="单位">
          <a-input v-model:value="formState.unit"
                   placeholder="自动生成"
                   disabled />
        </a-form-item>
        <a-form-item label="最低值">
          <a-input v-model:value="formState.min"
                   placeholder="请输入最低值" />
        </a-form-item>
        <a-form-item label="最高值">
          <a-input v-model:value="formState.max"
                   placeholder="请输入最高值" />
        </a-form-item>
      </a-form>
    </GModal>
  </div>
</template>


<style lang="scss" scoped>
.threshold-header {
  display: flex;
  justify-content: end;
  gap: 20px;
  margin-bottom: 20px;
}

:deep(.threshold-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #e5e9f2;
  height: 44px;
}
</style>
