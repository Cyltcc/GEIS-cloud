<script setup lang="ts">
import { ref } from 'vue'
import DevInfo from './devInfo.vue'
type TabKey =
  | 'device-info'
  | 'device-setting'
  | 'threshold-setting'
  | 'device-data'
  | 'cal-data'
  | 'device-share'
  | 'log'
  | 'operate'

interface TabItem {
  key: TabKey
  label: string
}

const activeTab = ref<TabKey>('device-info')

const tabItems: TabItem[] = [
  { key: 'device-info', label: '站点信息' },
  { key: 'device-setting', label: '站点设置' },
  { key: 'threshold-setting', label: '阈值设置' },
  { key: 'device-data', label: '站点数据' },
  { key: 'cal-data', label: '计算数据' },
  { key: 'device-share', label: '站点分享' },
  { key: 'log', label: '日志' },
  { key: 'operate', label: '操作历史' },
]
const selectDevice = ref<string>('')

const focus = () => {}
const handleChange = (value: string) => {
  console.log(`selected ${value}`)
}
</script>

<template>
  <div class="detail-content">
    <div class="detail-content-header">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane v-for="tab in tabItems"
                    :key="tab.key"
                    :tab="tab.label" />
      </a-tabs>
      <div class="device-select">
        <a-select ref="select"
                  v-model:value="selectDevice"
                  style="width: 100%"
                  @focus="focus"
                  @change="handleChange">
          <a-select-option value="1">
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="detail-content-body">
      <DevInfo v-if="activeTab === 'device-info'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-content {
  width: 100%;
  height: 100%;
  padding: 15px;

  .detail-content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .device-select {
      width: 500px;
    }
  }
  .detail-content-body {
    width: 100%;
    background: #fff;
    border-radius: 4px;
    padding: 15px;
  }
}
</style>
