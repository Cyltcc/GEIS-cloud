<script lang="ts" setup>
import { ref } from 'vue'

const sensorColumns = [
  {
    title: '传感器类型',
    dataIndex: 'sensorType',
    align: 'center',
  },
  {
    title: '端口号',
    dataIndex: 'port',
    align: 'center',
  },
  {
    title: '等待时间',
    dataIndex: 'time',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
]

const sensorData = ref([])

const cameraColumns = [
  {
    title: '相机类型',
    dataIndex: 'cameraType',
    align: 'center',
  },
  {
    title: '端口号',
    dataIndex: 'port',
    align: 'center',
  },
  {
    title: '键值',
    dataIndex: 'key',
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
]

const cameraData = ref([])
</script>

<template>
  <div class="sensor-box">
    <div class="sensor-header">
      <span style="font-weight: 700; font-size: 16px;">传感器配置(V2.0)</span>
      <a-button style="width: 96px; background: linear-gradient(180deg, #375BF5 0%, #5B89FA 100%);"
                type="primary">修改数据</a-button>
    </div>
    <div class="snesor-content">
      <div class="content-left">
        <a-table :columns="sensorColumns"
                 :data-source="sensorData"
                 :pagination="false"
                 bordered></a-table>
      </div>
      <div class="content-right">
        <a-table :columns="cameraColumns"
                 :data-source="cameraData"
                 :pagination="false"
                 bordered></a-table>
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
}
</style>
