<template>
  <div style="padding:0 20px;">
    <div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1"
                    tab="数据下载">
          <DataDownload />
        </a-tab-pane>
        <a-tab-pane key="2"
                    tab="打包下载">
          <PackageDownload />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataDownload from './DataDownload.vue'
import PackageDownload from './PackageDownload.vue'

const activeKey = ref('1')
</script>

<style scoped lang="scss"></style>