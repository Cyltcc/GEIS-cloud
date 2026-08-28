<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'

const { antLocale } = useLocale()
</script>

<template>
  <a-config-provider :locale="antLocale">
    <router-view />
  </a-config-provider>
</template>

<style>
#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}
</style>
