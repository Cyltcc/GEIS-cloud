<template>
  <div>
    <div class="video-header">
      <div style="display: flex; gap: 10px;">
        <a-input style="width: 300px;"
                 placeholder="输入设备名检索">
          <template #prefix>
            <i class="i-custom:search-input"
               style="width: 16px; height: 16px; display: inline-block;"></i>
          </template>
        </a-input>
        <a-button class="query-btn"
                  type="primary">查询
        </a-button>
      </div>
      <a-button ghost
                style="width: 68px;"
                type="primary">刷新
      </a-button>
    </div>
    <div class="video-container">
      <div v-for="i in 9"
           :key="i"
           class="video-item">
        <div class="video-cover">
          <div class="video-play">
            <i class="i-custom:video-play video-icon"></i>
          </div>
        </div>
        <div class="video-name"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.query-btn {
  height: 32px;
  width: 68px;
  padding: 0 12px;
  background: linear-gradient(180deg, #375bf5 0%, #5b89fa 100%);
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(55, 91, 245, 0.25);
}

.query-btn:hover,
.query-btn:focus {
  background: linear-gradient(180deg, #2f54eb 0%, #4a75f3 100%);
}

.video-container {
  width: 100%;
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.video-item {
  width: 390px;
  height: 265px;
  background-color: #f2f4f8;
  padding: 12px;
}

.video-cover {
  width: 366px;
  height: 207px;
  background-color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-play {
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
}

.video-icon {
  position: absolute;
  width: 12px;
  height: 14px;
  left: 40%;
  top: 32%;
}

.video-name {
  width: 144px;
  height: 22px;
  background-color: #eee;
  margin: 12px auto;
}
</style>