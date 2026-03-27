<template>
  <div>
    <div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="item in listTabs"
                    :key="item.key"
                    :tab="item.tab">
        </a-tab-pane>
      </a-tabs>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const listTabs = [
  {
    key: 'standard',
    tab: '定位观测站',
  },
  {
    key: 'video',
    tab: '视频监测站',
  },
  {
    key: 'LORA',
    tab: 'LORA组网站',
  },
  {
    key: 'Tiantong',
    tab: '天通',
  },
]

const activeKey = computed({
  get: () => {
    const key = route.path.split('/').pop()
    return listTabs.some((item) => item.key === key) ? (key as string) : 'standard'
  },
  set: (key) => {
    router.push({ path: `/device/list/${key}` })
  },
})
</script>

<style lang="scss" scoped>
</style>
