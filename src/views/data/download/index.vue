<template>
  <div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane
        key="1"
        :tab="t('dataDownload.dataDownloadTab')"
      >
        <DataDownload />
      </a-tab-pane>
      <a-tab-pane
        key="2"
        :tab="t('dataDownload.packageDownloadTab')"
      >
        <PackageDownload />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DataDownload from './DataDownload.vue'
import PackageDownload from './PackageDownload.vue'

const { t } = useI18n()
const activeKey = ref('1')
</script>

<style scoped lang="scss"></style>
