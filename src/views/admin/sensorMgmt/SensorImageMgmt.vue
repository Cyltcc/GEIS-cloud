<template>
  <div>
    <div class="mgmt-panel">
      <a-row :gutter="16"
             align="middle">
        <a-col>
          <a-input v-model:value="keyword"
                   placeholder="输入关键词以检索"
                   style="width: 300px"
                   enter-button
                   @search="handleSearch">
            <template #prefix>
              <i class="i-custom:search-input"
                 style="width: 16px; height: 16px; display: inline-block;"></i>
            </template>
          </a-input>
        </a-col>
        <a-col>
          <a-button type="primary"
                    @click="handleSearch">查询</a-button>
        </a-col>
        <a-col style="margin-left: auto">
          <a-button class="action-btn">排序</a-button>
          <a-button type="primary"
                    class="action-btn"
                    @click="handleAddSensor">添加传感器</a-button>

          <a-button class="action-btn">刷新</a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const handleSearch = () => {}
const handleAddSensor = () => {}
</script>

<style lang="scss" scoped>
.mgmt-panel {
  width: 100%;
}

.action-btn {
  margin-left: 8px;
}
</style>