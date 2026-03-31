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
              <a-form-item label="ID">
                <a-input style="width: 423px;"
                         v-model:value="form.id"
                         placeholder="请输入ID" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="型号"
                           required>
                <a-input style="width: 423px;"
                         v-model:value="form.model"
                         placeholder="请输入型号" />
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
          </a-row>

          <a-row :gutter="24"
                 class="form-row">
            <a-col :span="8">
              <a-form-item label="协议"
                           required>
                <a-input style="width: 423px;"
                         v-model:value="form.protocol"
                         placeholder="请输入协议" />
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
          <div class="info-title">
            <span class="info-title-pr"></span>
            <span class="info-title-text">参数配置</span>
          </div>
          <div class="param-config">
            <a-form-item label="命令"
                         required>
              <a-input style="width: 460px;"
                       v-model:value="form.order"
                       placeholder="请输入命令" />
            </a-form-item>
            <a-form-item label="内容"
                         required>

              <div style="display: flex; justify-content: end;">
                <a-button type="primary"
                          class="param-add-btn"
                          @click="addParamItem">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                </a-button>
              </div>
            </a-form-item>
            <div class="param-list">
              <div v-for="(item, index) in paramList"
                   :key="item.uid"
                   class="param-item">
                <div class="param-item-body">
                  <a-form-item label="key"
                               required>
                    <a-input v-model:value="item.key"
                             style="width: 300px;"
                             placeholder="请输入key" />
                  </a-form-item>
                  <a-form-item label="info"
                               required>
                    <a-table class="info-table"
                             :columns="infoColumns"
                             :data-source="item.info"
                             bordered
                             :pagination="false">
                      <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'name'">
                          <a-input style="width: 270px;"
                                   placeholder="请输入名称"
                                   v-model:value="record.name"></a-input>
                        </template>
                        <template v-if="column.key === 'max'">
                          <a-input style="width: 270px;"
                                   placeholder="请输入最大值"
                                   v-model:value="record.max"></a-input>
                        </template>
                        <template v-if="column.key === 'min'">
                          <a-input style="width: 270px;"
                                   placeholder="请输入最小值"
                                   v-model:value="record.min"></a-input>
                        </template>
                        <template v-if="column.key === 'type'">
                          <a-select style="width: 270px;"
                                    placeholder="请选择数据类型"
                                    v-model:value="record.type"
                                    :options="dataTypeOptions"></a-select>
                        </template>
                        <template v-if="column.key === 'unit'">
                          <a-input style="width: 270px;"
                                   placeholder="请输入单位"
                                   v-model:value="record.unit"></a-input>
                        </template>
                      </template>
                    </a-table>
                  </a-form-item>
                </div>
                <div class="param-item-action">
                  <a-button type="link"
                            class="param-delete-btn"
                            @click="removeParamItem(index)">删除</a-button>
                </div>
              </div>
            </div>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const form = reactive({
  id: '379',
  model: 'HCD6815',
  port: '485',
  protocol: 'Modbus RTU',
  description: 'HCD6815温湿压传感器',
  vendor: '',
  order: '',
  content: {
    key: '',
    info: [
      {
        name: '',
        max: '',
        min: '',
        type: null,
        unit: '',
      },
    ],
  },
})

type ParamInfo = {
  name: string
  max: string
  min: string
  type: string
  unit: string
}

type ParamItem = {
  uid: number
  key: string
  info: ParamInfo[]
}

let paramSeed = 0
const createParamItem = (item?: Partial<ParamItem>): ParamItem => {
  paramSeed += 1
  return {
    uid: item?.uid ?? paramSeed,
    key: item?.key ?? '',
    info: [
      {
        name: item?.info?.[0]?.name ?? '',
        max: item?.info?.[0]?.max ?? '',
        min: item?.info?.[0]?.min ?? '',
        type: item?.info?.[0]?.type ?? '',
        unit: item?.info?.[0]?.unit ?? '',
      },
    ],
  }
}
const paramList = ref<ParamItem[]>([
  createParamItem({
    key: 't',
    info: [
      {
        name: '空气温度',
        max: '85',
        min: '-40',
        type: '--',
        unit: '℃',
      },
    ],
  }),
  createParamItem(),
])

const infoColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', align: 'center' },
  { title: '最大值', dataIndex: 'max', key: 'max', align: 'center' },
  { title: '最小值', dataIndex: 'min', key: 'min', align: 'center' },
  { title: '数据类型', dataIndex: 'type', key: 'type', align: 'center' },
  { title: '单位', dataIndex: 'unit', key: 'unit', align: 'center' },
]

const dataTypeOptions = [
  { label: '--', value: '--' },
  { label: '整数', value: 'int' },
  { label: '浮点数', value: 'float' },
  { label: '字符串', value: 'string' },
]

const addParamItem = () => {
  paramList.value.push(createParamItem())
}

const removeParamItem = (index: number) => {
  if (paramList.value.length <= 1) {
    return
  }
  paramList.value.splice(index, 1)
}
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

.vendor-help {
  font-size: 12px;
  color: #8a8f99;
  margin-top: 6px;
}

.param-config {
  margin-top: 8px;
}

.param-command {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.param-command-input {
  width: 520px;
}

.param-label {
  display: flex;
  align-items: center;
  width: 56px;
  font-size: 14px;
  color: #1f1f1f;
}

.required-star {
  color: #ff4d4f;
  margin-right: 4px;
  font-size: 12px;
}

.param-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.param-content-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.param-tip {
  font-size: 12px;
  color: #8a8f99;
}

.param-add-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  background: #e9efff;
  border: none;
  color: #3969fa;
  box-shadow: none;
}

.param-add-btn:hover,
.param-add-btn:focus {
  background: #dbe5ff;
  color: #3969fa;
}

.param-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.param-item {
  display: flex;
  border: 1px solid #c7d3ff;
  background: #ffffff;
}

.param-item-body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.param-item-action {
  width: 72px;
  border-left: 1px solid #c7d3ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.param-delete-btn {
  color: #ff4d4f;
  padding: 0;
}

:deep(.info-table .ant-table-thead > tr > th) {
  background: #eef2ff;
  color: #1d2129;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #f3f3f3;
  height: 44px;
}

:deep(
    .info-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:first-child
  ) {
  border-start-start-radius: 0 !important;
}

:deep(
    .info-table.ant-table-wrapper
      .ant-table-container
      table
      > thead
      > tr:first-child
      > *:last-child
  ) {
  border-start-end-radius: 0 !important;
}
</style>

