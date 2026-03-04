<template>
  <a-modal v-model:open="open"
           :title="title"
           :width="width"
           @ok="handleOk"
           @cancel="handleCancel">
    <!-- 内容由调用方通过 slot 填充 -->
    <slot />
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ModalProps } from 'ant-design-vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  width: {
    type: [Number, String] as PropType<ModalProps['width']>,
    default: 520,
  },
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