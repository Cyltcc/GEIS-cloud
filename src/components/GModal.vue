<template>
  <a-modal v-model:open="open"
           :title="title"
           :width="width"
           :ok-text="okText"
           :cancel-text="cancelText"
           @ok="handleOk"
           @cancel="handleCancel">
    <!-- 内容由调用方通过 slot 填充 -->
    <slot />
  </a-modal>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { ModalProps } from 'ant-design-vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  width: {
    type: [Number, String] as PropType<ModalProps['width']>,
    default: 520,
  },
  okText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
})
const emit = defineEmits(['update:modelValue', 'ok', 'cancel'])

const open = computed({
  get: () => props.modelValue,
  set(v: boolean) {
    emit('update:modelValue', v)
  },
})

const handleOk = () => emit('ok')
const handleCancel = () => emit('cancel')
</script>

<style scoped lang="scss">
:deep(.ant-modal-footer) {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding: 12px 24px 22px;
}

:deep(.ant-modal-footer .ant-btn) {
  min-width: 88px;
  height: 40px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: none;
}

:deep(.ant-modal-footer .ant-btn-default) {
  color: #3969fa;
  border: 1px solid #3969fa;
  background: #fff;
}

:deep(.ant-modal-footer .ant-btn-default:hover) {
  color: #3969fa;
  border-color: #3969fa;
  background: #fff;
}

:deep(.ant-modal-footer .ant-btn-primary) {
  border: 1px solid #3969fa;
  background: linear-gradient(180deg, #3b67f9 0%, #4f79f0 100%);
}

:deep(.ant-modal-footer .ant-btn-primary:hover) {
  border-color: #3969fa;
  background: linear-gradient(180deg, #3b67f9 0%, #4f79f0 100%);
}
</style>
