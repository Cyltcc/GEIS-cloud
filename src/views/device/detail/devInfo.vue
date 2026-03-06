<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'

const labelCol = { style: { width: '88px' } }
const wrapperCol = { style: { maxWidth: '720px' } }
const enableModalOpen = ref(false)
const isEditing = ref(false)

interface DevInfoForm {
  name: string
  type: string
  sn: string
  iccid: string
  timezone: string
  longitude: string
  latitude: string
  altitude: string
  address: string
}

const formState = reactive<DevInfoForm>({
  name: '',
  type: '',
  sn: '',
  iccid: '',
  timezone: '',
  longitude: '',
  latitude: '',
  altitude: '',
  address: '',
})

const formSnapshot = ref<DevInfoForm | null>(null)

const warning = () => {
  enableModalOpen.value = true
}

const handleEnableCancel = () => {
  enableModalOpen.value = false
}

const handleEnableConfirm = () => {
  enableModalOpen.value = false
}

const startEdit = () => {
  formSnapshot.value = { ...formState }
  isEditing.value = true
}

const cancelEdit = () => {
  if (formSnapshot.value) {
    Object.assign(formState, formSnapshot.value)
  }
  isEditing.value = false
}

const confirmEdit = () => {
  formSnapshot.value = { ...formState }
  isEditing.value = false
}
</script>

<template>
  <div class="dev-info">
    <a-form label-align="left"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
      <div class="image-header">
        <span class="image-label">站点图片</span>
        <a-button @click="warning"
                  class="enable-btn">启用设备</a-button>
      </div>

      <a-form-item label="站点名称">
        <a-input v-model:value="formState.name"
                 :disabled="!isEditing"
                 style="width: 720px; height: 36px;" />
      </a-form-item>
      <a-form-item label="站点类型">
        <a-input v-model:value="formState.type"
                 :disabled="!isEditing"
                 style="width: 320px; height: 36px;" />
      </a-form-item>
      <a-form-item label="SN">
        <a-input v-model:value="formState.sn"
                 :disabled="!isEditing"
                 style="width: 320px; height: 36px;" />
      </a-form-item>
      <a-form-item label="ICCID">
        <a-input v-model:value="formState.iccid"
                 :disabled="!isEditing"
                 style="width: 720px; height: 36px;" />
      </a-form-item>
      <a-form-item label="时区">
        <a-input v-model:value="formState.timezone"
                 :disabled="!isEditing"
                 style="width: 320px; height: 36px;" />
      </a-form-item>
      <a-form-item label="经度">
        <a-input v-model:value="formState.longitude"
                 :disabled="!isEditing"
                 style="width: 320px; height: 36px;" />
      </a-form-item>
      <a-form-item label="纬度">
        <a-input v-model:value="formState.latitude"
                 :disabled="!isEditing"
                 style="width: 320px; height: 36px;" />
      </a-form-item>
      <a-form-item label="海拔">
        <a-input v-model:value="formState.altitude"
                 :disabled="!isEditing"
                 style="width: 320px; height: 36px;" />
      </a-form-item>
      <a-form-item label="站点地址">
        <a-input v-model:value="formState.address"
                 :disabled="!isEditing"
                 style="width: 720px; height: 36px;" />
      </a-form-item>

      <a-form-item class="edit-action-row">
        <a-button v-if="!isEditing"
                  class="edit-btn"
                  type="primary"
                  @click="startEdit">
          修改数据
        </a-button>
        <template v-else>
          <a-button @click="cancelEdit">取消修改</a-button>
          <a-button type="primary"
                    @click="confirmEdit">确认修改</a-button>
        </template>
      </a-form-item>
    </a-form>

    <a-modal v-model:open="enableModalOpen"
             :footer="null"
             :mask-closable="false"
             :width="460"
             :mask-style="{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }"
             centered
             wrap-class-name="enable-device-modal">
      <template #title>
        <div class="enable-modal-title">
          <ExclamationCircleFilled class="enable-modal-icon" />
          <span>启用设备</span>
        </div>
      </template>

      <div class="enable-modal-content">确定要启用该设备吗?</div>

      <div class="enable-modal-footer">
        <a-button class="modal-cancel-btn"
                  @click="handleEnableCancel">取消</a-button>
        <a-button type="primary"
                  class="modal-confirm-btn"
                  @click="handleEnableConfirm">
          确认
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.dev-info {
  width: 100%;
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.image-label {
  color: rgba(0, 0, 0, 0.88);
  line-height: 22px;
}

.enable-btn.ant-btn {
  width: 96px;
  height: 32px;
  border-radius: 4px;
  color: #fff;
  background: #56c08d;
  border-color: #56c08d;
}

.enable-btn.ant-btn:hover,
.enable-btn.ant-btn:focus,
.enable-btn.ant-btn:active {
  color: #fff;
  background: #56c08d;
  border-color: #56c08d;
  box-shadow: none;
  outline: none;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.edit-action-row .ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

:deep(.enable-device-modal .ant-modal-content) {
  border-radius: 2px;
  padding: 0;
}

:deep(.enable-device-modal .ant-modal-header) {
  border-bottom: 0;
  padding: 24px 32px 8px;
}

:deep(.enable-device-modal .ant-modal-close) {
  top: 18px;
  right: 20px;
  color: #8c8c8c;
}

:deep(.enable-device-modal .ant-modal-body) {
  padding: 0 32px 24px;
}

.enable-modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1f1f1f;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
}

.enable-modal-icon {
  color: #d46b08;
  font-size: 20px;
}

.enable-modal-content {
  margin-top: 12px;
  color: #1f1f1f;
  font-size: 14px;
  line-height: 1.45;
}

.enable-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

.modal-cancel-btn.ant-btn {
  min-width: 74px;
  height: 36px;
  border-radius: 6px;
  color: #3f6cf6;
  border-color: #3f6cf6;
}

.modal-cancel-btn.ant-btn:hover,
.modal-cancel-btn.ant-btn:focus,
.modal-cancel-btn.ant-btn:active {
  color: #3f6cf6;
  border-color: #3f6cf6;
  box-shadow: none;
}

.modal-confirm-btn.ant-btn {
  min-width: 74px;
  height: 36px;
  border-radius: 6px;
  background: #3f6cf6;
  border-color: #3f6cf6;
  box-shadow: none;
}

.modal-confirm-btn.ant-btn:hover,
.modal-confirm-btn.ant-btn:focus,
.modal-confirm-btn.ant-btn:active {
  background: #3f6cf6;
  border-color: #3f6cf6;
  box-shadow: none;
}
</style>
