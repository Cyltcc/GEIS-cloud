<template>
  <div class="g-image">
    <div class="g-image__header">
      <div class="g-image__title">
        <span class="g-image__dot"></span>
        <span class="g-image__title-text">{{ title }}</span>
      </div>
    </div>
    <div ref="viewerRef"
         class="g-image__viewer">
      <a-image v-if="currentItem"
               class="g-image__img"
               :src="currentItem.url"
               :alt="title"
               :preview="previewOptions" />
      <div v-else
           class="g-image__empty">暂无图片</div>

      <button class="g-image__nav g-image__nav--left"
              type="button"
              :disabled="!hasImages"
              @click="goPrev">
        <LeftOutlined />
      </button>
      <button class="g-image__nav g-image__nav--right"
              type="button"
              :disabled="!hasImages"
              @click="goNext">
        <RightOutlined />
      </button>

      <div class="g-image__overlay">
        <span class="g-image__time">{{ currentItem?.time ?? '--' }}</span>
        <span class="g-image__index">{{ indexText }}</span>
        <div class="g-image__actions">
          <i style="width: 16px; height: 16px; cursor: pointer;"
             :disabled="!hasImages"
             @click="downloadImage"
             class="i-custom:download"></i>
          <i style="border: #c4d2fe 1px solid; border-radius: 4px; background-color: #fff; width: 16px; height: 16px; cursor: pointer;"
             :disabled="!hasImages"
             @click="toggleFullscreen"
             class="i-custom:fullscreen"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'

type ImageItem = {
  url: string
  time?: string
}

type Props = {
  title?: string
  images?: ImageItem[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '相机',
  images: () => [],
})

const viewerRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const previewVisible = ref(false)

const previewOptions = computed(() => ({
  visible: previewVisible.value,
  onVisibleChange: (visible: boolean) => {
    previewVisible.value = visible
  },
}))

const hasImages = computed(() => props.images.length > 0)
const currentItem = computed(() =>
  props.images.length ? props.images[currentIndex.value] : null
)
const indexText = computed(() =>
  hasImages.value ? `${currentIndex.value + 1}/${props.images.length}` : '0/0'
)

const normalizeIndex = (value: number) => {
  if (!hasImages.value) return 0
  const total = props.images.length
  return (value + total) % total
}

const goPrev = () => {
  if (!hasImages.value) return
  currentIndex.value = normalizeIndex(currentIndex.value - 1)
}

const goNext = () => {
  if (!hasImages.value) return
  currentIndex.value = normalizeIndex(currentIndex.value + 1)
}

const downloadImage = () => {
  if (!currentItem.value) return
  const link = document.createElement('a')
  link.href = currentItem.value.url
  link.target = '_blank'
  link.rel = 'noopener'
  link.download = ''
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const toggleFullscreen = () => {
  if (!hasImages.value) return
  previewVisible.value = true
}

watch(
  () => props.images,
  (next) => {
    if (!next || next.length === 0) {
      currentIndex.value = 0
      return
    }
    if (currentIndex.value >= next.length) {
      currentIndex.value = 0
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.g-image {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px 16px 16px;
  box-shadow: 0 1px 2px rgba(31, 31, 31, 0.04);
}

.g-image__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.g-image__title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f1f1f;
  font-size: 14px;
  font-weight: 600;
}

.g-image__dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  background: #2f54eb;
}

.g-image__title-text {
  font-family: Source Han Sans CN;
  font-weight: 600;
}

.g-image__viewer {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 6px;
  overflow: hidden;
  background: #f3f4f6;
}

.g-image__img {
  width: 100%;
  height: 100%;
  display: block;
}

.g-image__img :deep(.ant-image-img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.g-image__empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b8b8b;
  font-size: 14px;
}

.g-image__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(31, 31, 31, 0.45);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.g-image__nav:disabled {
  cursor: not-allowed;
  background: rgba(31, 31, 31, 0.2);
}

.g-image__nav--left {
  left: 12px;
}

.g-image__nav--right {
  right: 12px;
}

.g-image__overlay {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-size: 12px;
  background: #00000080;
  padding: 0 10px;
}

.g-image__time {
  opacity: 0.95;
}

.g-image__index {
  font-weight: 600;
}

.g-image__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.g-image__action {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.g-image__action:hover {
  background: rgba(255, 255, 255, 0.35);
}

.g-image__action:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.g-image__action-icon {
  width: 16px;
  height: 16px;
  display: block;
}
</style>
