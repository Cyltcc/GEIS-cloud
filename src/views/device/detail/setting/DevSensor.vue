<script lang="ts" setup>
import { ref } from 'vue'

type SensorMetric = {
  id: string
  key: string
  name: string
}

type SensorRow = {
  id: string
  sensorType: string
  port: number
  time: number
  metrics: SensorMetric[]
}

type CameraRow = {
  id: string
  cameraType: string
  port: number
  key: string
  name: string
}

const sensorTypeOptions = [
  { label: '(376)-HY8H1土壤温湿度盐', value: '(376)-HY8H1土壤温湿度盐' },
  { label: '(104)-VOLT电池电压', value: '(104)-VOLT电池电压' },
]

const cameraTypeOptions = [
  { label: 'http相机1', value: 'http相机1' },
  { label: 'http相机2', value: 'http相机2' },
]

const portOptions = [2, 4, 6, 8]
const waitTimeOptions = [30, 60, 90]
const cameraPortOptions = [610, 630, 710, 730]
const defaultSensorType = sensorTypeOptions[0]?.value ?? ''
const defaultCameraType = cameraTypeOptions[0]?.value ?? ''
const defaultPort = portOptions[0] ?? 0
const defaultWaitTime = waitTimeOptions[0] ?? 0
const defaultCameraPort = cameraPortOptions[0] ?? 0

const sensorColumns = [
  {
    title: '传感器类型',
    dataIndex: 'sensorType',
    key: 'sensorType',
    align: 'center',
  },
  { title: '端口号', dataIndex: 'port', key: 'port', align: 'center' },
  { title: '等待时间', dataIndex: 'time', key: 'time', align: 'center' },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 80,
  },
]

const cameraColumns = [
  {
    title: '相机类型',
    dataIndex: 'cameraType',
    key: 'cameraType',
    align: 'center',
  },
  { title: '端口号', dataIndex: 'port', key: 'port', align: 'center' },
  { title: '键值', dataIndex: 'key', key: 'key', align: 'center' },
  { title: '名称', dataIndex: 'name', key: 'name', align: 'center' },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 80,
  },
]

const metricColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 80,
  },
  { title: '键', dataIndex: 'key', key: 'key', align: 'center' },
  { title: '名称', dataIndex: 'name', key: 'name', align: 'center' },
]

const sensorData = ref<SensorRow[]>([
  {
    id: 's1',
    sensorType: '(376)-HY8H1土壤温湿度盐',
    port: 2,
    time: 30,
    metrics: [
      { id: 'm1', key: 'stemp', name: '土壤温度' },
      { id: 'm2', key: 'shumi', name: '土壤水分' },
      { id: 'm3', key: 'sal', name: '土壤盐分' },
      { id: 'm4', key: 'cond', name: '土壤电导率' },
    ],
  },
  {
    id: 's2',
    sensorType: '(104)-VOLT电池电压',
    port: 2,
    time: 30,
    metrics: [],
  },
])

const cameraData = ref<CameraRow[]>([
  { id: 'c1', cameraType: 'http相机1', port: 610, key: 'key1', name: '远景1' },
  { id: 'c2', cameraType: 'http相机1', port: 630, key: 'key2', name: '近景1' },
  { id: 'c3', cameraType: 'http相机1', port: 710, key: 'key3', name: '远景2' },
  { id: 'c4', cameraType: 'http相机1', port: 730, key: 'key4', name: '近景2' },
])

const expandedRowKeys = ref<string[]>([])

const onExpand = (expanded: boolean, record: SensorRow) => {
  expandedRowKeys.value = expanded ? [record.id] : []
}

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`

const addSensorRow = () => {
  sensorData.value.push({
    id: createId('s'),
    sensorType: defaultSensorType,
    port: defaultPort,
    time: defaultWaitTime,
    metrics: [],
  })
}

const removeSensorRow = (id: string) => {
  sensorData.value = sensorData.value.filter((row) => row.id !== id)
  expandedRowKeys.value = expandedRowKeys.value.filter((key) => key !== id)
}

const addCameraRow = () => {
  cameraData.value.push({
    id: createId('c'),
    cameraType: defaultCameraType,
    port: defaultCameraPort,
    key: '',
    name: '',
  })
}

const removeCameraRow = (id: string) => {
  cameraData.value = cameraData.value.filter((row) => row.id !== id)
}

const isEdit = ref(false)

const editBtn = () => {
  isEdit.value = !isEdit.value
}
</script>

<template>
  <div class="sensor-box">
    <div class="sensor-header">
      <span style="font-weight: 700; font-size: 16px;">传感器配置(V2.0)</span>
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
    <div class="snesor-content">
      <div class="content-left">
        <a-table class="sensor-table"
                 :columns="sensorColumns"
                 :data-source="sensorData"
                 :pagination="false"
                 :row-key="(row: SensorRow) => row.id"
                 :expanded-row-keys="expandedRowKeys"
                 @expand="onExpand"
                 bordered>
          <template #headerCell="{ column }">
            <span v-if="column.key !== 'expand' && column.type !== 'expand'"
                  class="th-with-action">
              {{ typeof column.title === 'string' ? column.title : '' }}
              <i style="width: 20px; height: 20px;"
                 class="i-custom:add"
                 v-if="column.key === 'sensorType'"
                 @click.stop="addSensorRow">
              </i>
            </span>
          </template>
          <template #bodyCell="{ column }">
            <template v-if="column.key === 'operation'">
              <a-button @click.stop="removeSensorRow"
                        style="color: #F6685D"
                        type="text">删除</a-button>
            </template>
          </template>
          <template #expandedRowRender="{ record }">
            <div style="width: 100%; height: 100%; background-color: #f3f3f3; padding: 20px;">
              <a-table :columns="metricColumns"
                       bordered
                       class="expand-table"
                       :data-source="record.metrics"
                       :pagination="false">
                <template #bodyCell="{ column,
                                    record:
                                    metric,
                                    index
                                    }">
                  <template v-if="column.key === 'index'">
                    {{ index }}
                  </template>
                  <template v-else-if="column.key === 'key'">
                    <a-input v-model:value="metric.key"
                             class="cell-control" />
                  </template>
                  <template v-else-if="column.key === 'name'">
                    <a-input v-model:value="metric.name"
                             class="cell-control" />
                  </template>
                </template>
              </a-table>
            </div>
          </template>
        </a-table>
      </div>
      <div class="content-right">
        <a-table class="sensor-table"
                 :columns="cameraColumns"
                 :data-source="cameraData"
                 :pagination="false"
                 :row-key="(row: CameraRow) => row.id"
                 bordered>
          <template #headerCell="{ column }">
            <span class="th-with-action">
              {{ column.title }}
              <i style="width: 20px; height: 20px;"
                 class="i-custom:add"
                 v-if="column.key === 'cameraType'"
                 @click.stop="addCameraRow">
              </i>
            </span>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'cameraType'">
              <a-select v-model:value="record.cameraType"
                        :options="cameraTypeOptions"
                        class="cell-control" />
            </template>
            <template v-else-if="column.key === 'port'">
              <a-select v-model:value="record.port"
                        class="cell-control">
                <a-select-option v-for="port in cameraPortOptions"
                                 :key="port"
                                 :value="port">
                  {{ port }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="column.key === 'key'">
              <a-input v-model:value="record.key"
                       class="cell-control" />
            </template>
            <template v-else-if="column.key === 'name'">
              <a-input v-model:value="record.name"
                       class="cell-control" />
            </template>

            <template v-if="column.key === 'operation'">
              <a-button @click.stop="removeCameraRow"
                        style="color: #F6685D"
                        type="text">删除</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sensor-box {
  width: 100%;
  height: 100%;
  padding: 15px;
  background-color: #f9fafe;

  .sensor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .snesor-content {
    display: flex;
    gap: 16px;
  }

  .content-left,
  .content-right {
    flex: 1 1 0;
    min-width: 0;
  }
  .content-left,
  .content-right {
    flex: 1 1 0;
    min-width: 0;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
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
  :deep(.sensor-table .expand-table .ant-table-thead > tr > th) {
    background: #fff;
  }

  :deep(.sensor-table .ant-table) {
    background: #ffffff;
  }

  :deep(.sensor-table .ant-table-thead > tr > th) {
    background: #eef2ff;
    color: #1d2129;
    font-weight: 600;
    text-align: center;
    border-bottom: 1px solid #e5e9f2;
    height: 44px;
  }

  :deep(.sensor-table .ant-table-tbody > tr > td) {
    padding: 12px 10px;
    text-align: center;
  }

  :deep(.sensor-table .ant-select-selector) {
    height: 32px !important;
    border-radius: 6px;
    border-color: #e5e6eb;
  }

  :deep(.sensor-table .ant-select-selection-item),
  :deep(.sensor-table .ant-input-number-input),
  :deep(.sensor-table .ant-input) {
    line-height: 30px;
    height: 32px;
  }

  :deep(.sensor-table .ant-input-number),
  :deep(.sensor-table .ant-input) {
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
