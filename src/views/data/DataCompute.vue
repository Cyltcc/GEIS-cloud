<template>
  <div>
    <div class="compute-header">
      <div class="compute-tab"
           :class="{ 'is-active': activeTab === 'device' }"
           @click="activeTab = 'device'">
        设备对比
      </div>
      <div class="compute-tab"
           :class="{ 'is-active': activeTab === 'time' }"
           @click="activeTab = 'time'">
        时间对比
      </div>
    </div>
    <div class="list-hearder">
      <div class="list-title">
        <i class="header-icon i-custom:data-pr"
           aria-hidden="true"></i>
        对比数据
      </div>
    </div>

    <!-- 设备对比 -->
    <div v-if="activeTab === 'device'">
      <div class="panel-box">
        <div class="panel-row">
          <div class="panel-left">
            <div class="field time-range">
              <span class="field-label">时间范围：</span>
              <a-range-picker class="time-picker"
                              format="YYYY-MM-DD"
                              :placeholder="['开始时间', '结束时间']">
                <template #suffixIcon>
                  <i class="i-custom:time"
                     style="width: 15px; height: 15px; display: inline-block;"></i>
                </template>
              </a-range-picker>
            </div>
            <a-space class="quick-list"
                     :size="8">
              <a-button v-for="item in quickRanges"
                        :key="item.key"
                        class="quick-btn"
                        :class="{ 'is-active': quickRange === item.key }"
                        @click="setQuickRange(item.key)">
                {{ item.label }}
              </a-button>
            </a-space>
          </div>
          <div class="panel-right">
            <a-button class="btn-clear"
                      danger>清空</a-button>
            <a-button @click="handleCom"
                      type="primary">对比</a-button>
          </div>
        </div>
        <div class="panel-row panel-row-bottom">
          <a-button class="btn-add"
                    type="primary"
                    ghost
                    @click="addDevice">
            添加对比设备
          </a-button>
          <span v-if="devices.length"
                class="panel-added">已添加{{ devices.length }}个对比设备</span>
        </div>
        <div class="device-list"
             v-if="devices.length">
          <div class="device-card"
               v-for="(device, index) in devices"
               :key="device.id">
            <div class="device-card-head">
              <span class="device-card-title">设备{{ index + 1 }}</span>
              <a-button type="text"
                        danger
                        class="del-btn"
                        @click="removeDevice(device.id)">
                删除
              </a-button>
            </div>
            <div class="device-card-body">
              <div class="form-row">
                <span class="field-label">设备选择：</span>
                <a-select class="device-select"
                          :options="deviceOptions"
                          v-model:value="device.deviceValue"
                          placeholder="请选择设备" />
              </div>
              <div class="form-row form-row-checkbox">
                <span class="field-label">数据选择：</span>
                <div class="checkbox-wrap">
                  <a-checkbox class="checkbox-all"
                              :checked="isAllChecked(device)"
                              :indeterminate="isIndeterminate(device)"
                              @change="toggleAll(device)">
                    全选
                  </a-checkbox>
                  <a-checkbox-group v-model:value="device.checked"
                                    class="checkbox-group">
                    <a-checkbox v-for="item in dataOptions"
                                :key="item"
                                :value="item">
                      {{ item }}
                    </a-checkbox>
                  </a-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showResult">
        <div class="list-hearder">
          <div class="list-title">
            <i class="header-icon i-custom:data-pr"
               aria-hidden="true"></i>
            对比结果
          </div>
        </div>
        <div class="echart-box"></div>
      </div>
    </div>

    <!-- 时间对比 -->
    <div v-if="activeTab === 'time'">
      <div class="panel-box time-panel">
        <div class="panel-row">
          <div class="panel-left">
            <div class="field">
              <span class="field-label">设备选择：</span>
              <a-select class="device-select"
                        :options="deviceOptions"
                        v-model:value="timeDevice"
                        placeholder="请选择设备" />
            </div>
          </div>
          <div class="panel-right">
            <a-button class="btn-clear"
                      danger>清空</a-button>
            <a-button type="primary">对比</a-button>
          </div>
        </div>
        <div class="panel-row panel-row-checkbox">
          <span class="field-label">数据选择：</span>
          <div class="checkbox-wrap">
            <a-checkbox class="checkbox-all"
                        :checked="isAllCheckedTime"
                        :indeterminate="isIndeterminateTime"
                        @change="toggleAllTime">
              全选
            </a-checkbox>
            <a-checkbox-group v-model:value="timeChecked"
                              class="checkbox-group">
              <a-checkbox v-for="item in dataOptions"
                          :key="item"
                          :value="item">
                {{ item }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
        <div class="panel-row panel-row-bottom">
          <a-button class="btn-add"
                    type="primary"
                    ghost
                    @click="addTime">
            添加对比时间
          </a-button>
          <span v-if="timeItems.length"
                class="panel-added">已添加{{ timeItems.length }}个对比时间</span>
        </div>
        <div class="device-list"
             v-if="timeItems.length">
          <div class="time-card"
               v-for="(item, index) in timeItems"
               :key="item.id">
            <div class="time-card-head">
              <span class="time-card-title">时间{{ index + 1 }}</span>
              <a-button type="text"
                        danger
                        class="del-btn"
                        @click="removeTime(item.id)">
                删除
              </a-button>
            </div>
            <div class="time-card-body">
              <div class="form-row">
                <span class="field-label">时间范围：</span>
                <a-range-picker class="time-picker"
                                format="YYYY-MM-DD HH:mm:ss"
                                show-time
                                :placeholder="['开始时间', '结束时间']">
                  <template #suffixIcon>
                    <i class="i-custom:time"
                       style="width: 15px; height: 15px; display: inline-block;"></i>
                  </template>
                </a-range-picker>
                <a-space class="quick-list"
                         :size="8">
                  <a-button v-for="q in quickRanges"
                            :key="q.key"
                            class="quick-btn"
                            :class="{ 'is-active': item.quickKey === q.key }"
                            @click="setTimeQuick(item, q.key)">
                    {{ q.label }}
                  </a-button>
                </a-space>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showResult">
        <div class="list-hearder">
          <div class="list-title">
            <i class="header-icon i-custom:data-pr"
               aria-hidden="true"></i>
            对比结果
          </div>
        </div>
        <div class="echart-box"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type DeviceItem = {
  id: number
  deviceValue: string
  checked: string[]
}

type TimeItem = {
  id: number
  quickKey: string
}

const activeTab = ref<'device' | 'time'>('device')
const showResult = ref(false)

const handleCom = () => {
  showResult.value = !showResult.value
}

const quickRanges = [
  { key: '3d', label: '最近三天' },
  { key: '1w', label: '最近一周' },
  { key: '1m', label: '最近一个月' },
]
const quickRange = ref('3d')

const deviceOptions = [
  { value: 'XXXXXX（2835）', label: 'XXXXXX（2835）' },
  { value: 'XXXXXX（2114）', label: 'XXXXXX（2114）' },
]

const dataOptions = [
  '土壤钾',
  '土壤磷',
  '土壤PH',
  '土壤氮',
  '集沙仪5',
  '空气温度',
  '相对湿度',
  '气压',
  '风速',
  '风向',
  '光照',
  '土壤水分',
  '土壤电导率',
  '土壤温度',
  '土壤水分2',
  '土壤电导率2',
  '土壤温度2',
  '土壤水分3',
  '土壤电导率3',
  '土壤温度3',
  '电压',
]

const devices = ref<DeviceItem[]>([])
const nextId = ref(1)

const addDevice = () => {
  devices.value.push({
    id: nextId.value++,
    deviceValue: '',
    checked: [],
  })
}

const removeDevice = (id: number) => {
  devices.value = devices.value.filter((item) => item.id !== id)
}

const toggleAll = (device: DeviceItem) => {
  if (device.checked.length === dataOptions.length) {
    device.checked = []
  } else {
    device.checked = [...dataOptions]
  }
}

const isAllChecked = (device: DeviceItem) =>
  device.checked.length === dataOptions.length
const isIndeterminate = (device: DeviceItem) =>
  device.checked.length > 0 && device.checked.length < dataOptions.length

const setQuickRange = (key: string) => {
  quickRange.value = key
}

const timeDevice = ref('')
const timeChecked = ref<string[]>([])
const timeItems = ref<TimeItem[]>([])
const nextTimeId = ref(1)

const addTime = () => {
  timeItems.value.push({
    id: nextTimeId.value++,
    quickKey: '',
  })
}

const removeTime = (id: number) => {
  timeItems.value = timeItems.value.filter((item) => item.id !== id)
}

const setTimeQuick = (item: TimeItem, key: string) => {
  item.quickKey = key
}

const toggleAllTime = () => {
  if (timeChecked.value.length === dataOptions.length) {
    timeChecked.value = []
  } else {
    timeChecked.value = [...dataOptions]
  }
}

const isAllCheckedTime = computed(
  () => timeChecked.value.length === dataOptions.length
)
const isIndeterminateTime = computed(
  () =>
    timeChecked.value.length > 0 &&
    timeChecked.value.length < dataOptions.length
)
</script>

<style lang="scss" scoped>
.compute-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.compute-tab {
  width: 104px;
  height: 30px;
  border: 1px solid #c5c5c5;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0%;
  text-align: center;
  cursor: pointer;
}

.compute-tab.is-active {
  border-color: #3b6dff;
  color: #3b6dff;
  font-weight: 500;
}

.list-hearder {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 12px;
  font-family: Source Han Sans CN;
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
}

.header-icon {
  width: 17px;
  height: 17px;
  display: inline-block;
}

.panel-box {
  width: 100%;
  min-height: 124px;
  border: 1px solid #eee;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
}

.time-panel {
  gap: 12px;
}

.panel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-row-bottom {
  align-items: center;
}

.panel-row-checkbox {
  align-items: flex-start;
}

.panel-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.field {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.field-label {
  white-space: nowrap;
  color: #666;
}

.time-picker {
  width: 420px;
}

.quick-list {
  display: flex;
  align-items: center;
}

.quick-btn {
  color: #666;
}

.quick-btn.is-active {
  border-color: #3b6dff;
  color: #3b6dff;
}

.panel-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-clear {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.btn-add {
  border-color: #3b6dff;
}

.panel-added {
  color: #3b6dff;
  font-size: 14px;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.device-card,
.time-card {
  border: 1px solid #eee;
  background: #fff;
}

.device-card-head,
.time-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.device-card-title,
.time-card-title {
  font-weight: 700;
  color: #333;
}

.device-card-body,
.time-card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.form-row-checkbox {
  align-items: flex-start;
}

.device-select {
  width: 320px;
}

.checkbox-wrap {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.checkbox-all {
  margin-right: 12px;
}

:deep(.checkbox-group .ant-checkbox-wrapper) {
  margin-inline-start: 0;
}

.del-btn {
  padding: 0 4px;
}
</style>
