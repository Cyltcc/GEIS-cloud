<script setup lang="ts">
type RecognitionRow = {
  cameraKey: string
  way: string
}

import { ref } from 'vue'

const isEdit = ref(false)

const editBtn = () => {
  isEdit.value = !isEdit.value
}

const recognitionColums = [
  {
    title: '相机key值',
    dataIndex: 'cameraKey',
    key: 'cameraKey',
    align: 'center',
  },
  {
    title: '识别方式',
    dataIndex: 'way',
    key: 'way',
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

const recognitionData = ref<RecognitionRow[]>([
  {
    cameraKey: 'key1',
    way: '物候识别',
  },
])

const cameraKeyOptions = [
  {
    label: 'key1',
    value: 'key1',
  },
  {
    label: 'key2',
    value: 'key2',
  },
]

const wayOptions = [
  {
    label: '物候识别',
    value: 'key1',
  },
  {
    label: '天气识别',
    value: 'key2',
  },
]

const addRecognitionRow = () => {
  recognitionData.value.push({
    cameraKey: '',
    way: '',
  })
}
</script>

<template>
  <div class="recognition-box">
    <div class="recognition-header">
      <span style="font-weight: 700; font-size: 16px;">识别任务配置</span>
      <div>
        <a-button @click="editBtn"
                  v-if="!isEdit"
                  style="width: 96px; background: linear-gradient(180deg, #375BF5 0%, #5B89FA 100%);"
                  type="primary">修改数据</a-button>
        <div v-else
             style="display: flex; gap: 10px;">
          <a-button style="width: 96px; background: linear-gradient(180deg, #375BF5 0%, #5B89FA 100%);"
                    type="primary">确认修改</a-button>
          <a-button style="width: 96px; color: #3969FA">取消修改</a-button>
        </div>
      </div>
    </div>
    <div class="recognition-content">
      <a-table class="recognition-table"
               :pagination="false"
               :columns="recognitionColums"
               :data-source="recognitionData">
        <template #headerCell="{ column }">
          <span class="th-with-action">
            {{ column.title }}
            <i style="width: 20px; height: 20px;"
               class="i-custom:add"
               v-if="column.key === 'cameraKey'"
               @click.stop="addRecognitionRow">
            </i>
          </span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'cameraKey'">
            <a-select style="width: 310px; height: 36px;"
                      v-model:value="record.cameraKey"
                      :options="cameraKeyOptions" />
          </template>
          <template v-else-if="column.key === 'way'">
            <a-select style="width: 310px; height: 36px;"
                      v-model:value="record.way"
                      :options="wayOptions" />
          </template>
          <template v-if="column.key === 'operation'">
            <a-button style="color: #F6685D"
                      type="text">删除</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recognition-box {
  width: 100%;
  height: 100%;
  padding: 15px;
  background-color: #f9fafe;

  .recognition-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .th-with-action {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .th-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #7b96ff;
    color: #4462f6;
    font-weight: 700;
    background: #ffffff;
    cursor: pointer;
  }

  .cell-control {
    width: 100%;
  }
  :deep(.recognition-table .expand-table .ant-table-thead > tr > th) {
    background: #fff;
  }

  :deep(.recognition-table .ant-table) {
    background: #ffffff;
  }

  :deep(.recognition-table .ant-table-thead > tr > th) {
    background: #eef2ff;
    color: #1d2129;
    font-weight: 600;
    text-align: center;
    border-bottom: 1px solid #e5e9f2;
    height: 44px;
  }

  :deep(.recognition-table .ant-table-tbody > tr > td) {
    padding: 12px 10px;
    text-align: center;
  }

  :deep(.recognition-table .ant-select-selector) {
    height: 32px !important;
    border-radius: 6px;
    border-color: #e5e6eb;
  }

  :deep(.recognition-table .ant-select-selection-item),
  :deep(.recognition-table .ant-input-number-input),
  :deep(.recognition-table .ant-input) {
    line-height: 30px;
    height: 32px;
  }

  :deep(.recognition-table .ant-input-number),
  :deep(.recognition-table .ant-input) {
    border-radius: 6px;
    border-color: #e5e6eb;
  }

  :deep(.ant-table-expanded-row > td) {
    background: #f7f8fc;
    padding: 12px 16px;
  }

  :deep(.metric-table .ant-table-thead > tr > th) {
    background: #f2f4ff;
    font-weight: 600;
  }

  :deep(.metric-table .ant-table-tbody > tr > td) {
    padding: 10px 8px;
    background: #ffffff;
  }

  :deep(.ant-table-row-expand-icon) {
    border: 1px solid #d6dbe7;
    border-radius: 4px;
  }
}
</style>