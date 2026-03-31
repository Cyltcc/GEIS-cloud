<template>
  <div>
    <div class="basic-info">
      <div class="info-header">
        <div class="info-title">
          <span class="info-title-pr"></span>
          <span class="info-title-text">基本信息</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <a-button type="primary"
                    ghost>取消</a-button>
          <a-button type="primary"
                    class="query-btn">确认</a-button>
        </div>
      </div>
      <div class="info-content">
        <a-form class="sensor-form"
                labelAlign="left"
                :label-col="{ style: { width: '80px' } }"
                layout="horizontal"
                :wrapper-col="{ span: 24 }">
          <a-form-item label="传感器图片">
            <div class="update-box">
            </div>
          </a-form-item>

          <a-row :gutter="24"
                 class="form-row">
            <a-col :span="8">
              <a-form-item required
                           label="名称">
                <a-input style="width: 423px;"
                         v-model:value="form.name"
                         placeholder="请输入名称" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="型号"
                           required>
                <a-input style="width: 423px;"
                         v-model:value="form.type"
                         placeholder="请输入型号" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="描述"
                           required>
                <a-input style="width: 423px;"
                         v-model:value="form.description"
                         placeholder="请输入描述" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="key"
                           required>
                <a-input style="width: 423px;"
                         v-model:value="form.key"
                         placeholder="请输入key" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="端口"
                           required>
                <a-input style="width: 423px;"
                         v-model:value="form.port"
                         placeholder="请输入端口" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="厂商"
                           required>
                <a-select style="width: 423px;"
                          v-model:value="form.vendor"
                          placeholder="请选择厂商"
                          allow-clear>
                  <a-select-option value="vendor-a">厂商A</a-select-option>
                  <a-select-option value="vendor-b">厂商B</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  id: '379',
  name: 'HCD6815',
  type: 'hisi',
  key: '可见光',
  port: 'http',
  description: 'http相机1',
  vendor: null,
})
</script>

<style lang="scss" scoped>
.info-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.info-title-pr {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #3969fa;
}

.info-title-text {
  font-family: Source Han Sans CN;
  font-weight: 700;
  font-style: Bold;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
}

.query-btn {
  height: 32px;
  width: 68px;
  padding: 0 12px;
  background: linear-gradient(180deg, #375bf5 0%, #5b89fa 100%);
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(55, 91, 245, 0.25);
}

.query-btn:hover,
.query-btn:focus {
  background: linear-gradient(180deg, #2f54eb 0%, #4a75f3 100%);
}

.sensor-form :deep(.ant-form-item) {
  margin-bottom: 12px;
}

.update-box {
  width: 100%;
  height: 220px;
  border: 1px solid #eeeeee;
  border-radius: 6px;
  background: #fff;
}

.form-row {
  margin-top: 8px;
}
</style>
