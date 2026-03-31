<template>
  <div>
    <a-tabs v-model:activeKey="activeKey"
            v-if="!isDetailRoute">
      <a-tab-pane key="data"
                  tab="数据类">
        <SensorDataMgmt />
      </a-tab-pane>
      <a-tab-pane key="image"
                  tab="图片类">
        <SensorImageMgmt />
      </a-tab-pane>
    </a-tabs>
    <router-view v-if="isDetailRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SensorDataMgmt from './SensorDataMgmt.vue'
import SensorImageMgmt from './SensorImageMgmt.vue'

const activeKey = ref('data')
const route = useRoute()
const isDetailRoute = computed(
  () =>
    route.name === 'SensorDataDetail' ||
    route.name === 'SensorImageDetail' ||
    route.name === 'SensorDataAdd' ||
    route.name === 'SensorImageAdd'
)
</script>

<style scoped lang="scss">
</style>
