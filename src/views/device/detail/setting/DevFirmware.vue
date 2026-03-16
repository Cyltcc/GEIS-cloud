
<script setup lang="ts">
</script>

<template>
  <div class="firmware-box">
    <div class="firmware-header">
      <span style="font-weight: 700; font-size: 16px;">固件配置</span>
      <a-button style="width: 96px; background: linear-gradient(180deg, #375BF5 0%, #5B89FA 100%);"
                type="primary">上传固件</a-button>
    </div>
    <div class="firmware-content">
      设备版本：2.2.0
    </div>
  </div>
</template>


<style lang="scss" scoped>
.firmware-box {
  width: 100%;
  height: 100%;
  padding: 15px;
  background-color: #f9fafe;

  .firmware-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .firmware-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: #eff2fd;
    font-family: Source Han Sans CN;
    font-weight: 500;
    font-style: Medium;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
  }
}
</style>