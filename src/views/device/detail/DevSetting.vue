<script setup lang="ts">
import { ref } from 'vue'
import DevSensor from './setting/DevSensor.vue'
const plainOptions = ['标准模式', '低功耗模式', '高频模式']
const value1 = ref<string>('标准模式')

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
    withd: 200,
  },
  {
    title: '定时',
    dataIndex: 'time',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
]

const data = [
  {
    name: '图片拍摄时间',
    time: '(小时:8.10,14,16)-(分钟: 10)',
    operation: '编辑',
  },
  {
    name: '图片上传时间',
    time: '(小时:8.10,14,16)-(分钟: 10)',
    operation: '编辑',
  },
  {
    name: '数据采集时间',
    time: '(小时:*)-(分钟: 0.30)',
    operation: '编辑',
  },
  {
    name: '数据上传时间',
    time: '(小时:*)-(分钟: 3,5,33,35,45.55)',
    operation: '编辑',
  },
  {
    name: '杂项',
    time: '(小时:8.22)-(分钟: 7)',
    operation: '编辑',
  },
]
</script>

<template>
  <div>
    <div class="setting-header">
      <div class="header-left">
        <div class="config-version">
          设备配置版本：V2.0
        </div>
        <div class="enble-time">
          设备启用时间：2025-11-25 13：20：23
        </div>
      </div>
      <div class="header-right">
        <a-button style="background: linear-gradient(180deg, #375BF5 0%, #5B89FA 100%);"
                  type="primary">下载配置文件</a-button>
        <a-button>复制</a-button>
      </div>
    </div>
    <div class="setting-content">
      <div class="frequency-box">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 55px;">
            <span style="font-weight: 700; font-size: 16px;">频率配置</span>
            <span>快捷设置 <a-radio-group style="margin-left: 25px;"
                             v-model:value="value1"
                             :options="plainOptions" /></span>

          </div>
          <a-button style="width: 96px; background: linear-gradient(180deg, #375BF5 0%, #5B89FA 100%);"
                    type="primary">修改数据</a-button>
        </div>
        <a-table :columns="columns"
                 :data-source="data"
                 :pagination="false"
                 bordered>

        </a-table>
      </div>
      <div class="sensor-box">
        <DevSensor />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-header {
  display: flex;
  justify-content: space-between;

  .header-left {
    display: flex;
    gap: 10px;
  }

  .config-version {
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    width: 150px;
    height: 32px;
    background-color: #fffbe6;
    color: #e37318;
    border: #ffe58f 1px solid;
  }

  .enble-time {
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    width: 279px;
    height: 32px;
    background-color: #eff2fd;
    color: #1890ff;
    border: #3969fa 1px solid;
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.setting-content {
  margin-top: 15px;

  .frequency-box {
    width: 100%;
    height: 100%;
    background-color: #f9fafe;
    padding: 15px;
  }

  .sensor-box {
    margin-top: 20px;
  }
}
</style>