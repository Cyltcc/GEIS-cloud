<template>
  <div style="margin-top: 30px;">
    <div class="header">
      <div class="header-left"
           @click.stop>
        <i class="header-icon i-custom:data-pr"
           aria-hidden="true"></i>
        <span class="header-text">动图生成</span>
      </div>
    </div>
    <div class="content">
      <div v-for="item in 4"
           :key="item"
           class="content-item">
        <a-collapse class="GIF-collapse"
                    :bordered="false"
                    expand-icon-position="end">
          <a-collapse-panel>
            <template #header>
              <div class="collapse-header">
                <div class="collapse-header-left"
                     @click.stop>
                  <span class="collapse-header-text">相机：远景1</span>
                </div>
                <div class="header-right">
                  <span class="collapse-text">{{ isCollapse ? '展开' : '折叠' }}</span>
                </div>
              </div>
            </template>
            <div class="collapse-content-title">
              动图
            </div>
            <div class="collapse-content-image">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                  <div style="width: 8px; height: 8px; background-color: #3969FA;"></div>
                  图片选择
                </div>
                <div style="font-weight: 400; color: #3969FA;">
                  已选择{{ choiseImageCount }}张图片
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 30px;">
                <span>根据序号过滤照片(1表示当天的第1张图片)</span>
                <a-input style="width: 270px; height: 32px; font-size: 12px;"
                         placeholder="填写序号后，下方只能看到对应序号的图片"></a-input>
              </div>
              <div class="content-image-box">
                <div class="content-image-item"
                     v-for="item in 10"
                     :key="item">
                  <img class="content-image"
                       src=""
                       alt="">
                  {{ item }}
                </div>
              </div>
            </div>
            <div class="GIF-setting">
              <div style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                <div style="width: 8px; height: 8px; background-color: #3969FA;"></div>
                动图设置
              </div>
              <div class="setting-box">
                <div class="setting-left">
                  <div>
                    每张照片持续时间(亳秒)

                  </div>
                  <div class="duration-control">
                    <a-button class="duration-btn"
                              @click="decreaseDuration">
                      <template #icon>
                        <MinusOutlined />
                      </template>
                    </a-button>
                    <a-input-number class="duration-input"
                                    v-model:value="duration"
                                    :min="1"
                                    :controls="false" />
                    <a-button class="duration-btn"
                              @click="increaseDuration">
                      <template #icon>

                        <PlusOutlined />
                      </template>
                    </a-button>
                  </div>
                </div>
                <div>
                  <a-button style="width: 68px; height: 32px; margin-right: 10px;"
                            class="setting-btn"
                            type="primary">预览</a-button>
                  <a-button style="width: 96px; height: 32px;"
                            class="setting-btn"
                            type="primary">生成动图</a-button>
                </div>
              </div>
            </div>
            <div class="result-box">
              <div style="font-weight: bold; display: flex; align-items: center; gap: 10px;">
                <div style="width: 8px; height: 8px; background-color: #3969FA;"></div>
                生成结果
              </div>
              <div class="result-gif-box">
                <div class="gif-img">
                  <img style="width: 100%; height: 100%;"
                       src=""
                       alt="">
                </div>
                <a-button type="primary"
                          style="width: 96px; height: 32px; margin-right: 10px;"
                          class="setting-btn">下载动图</a-button>
              </div>

            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'

const isCollapse = ref(false)
const choiseImageCount = ref(3)
const duration = ref(200)

const decreaseDuration = () => {
  if (duration.value > 1) {
    duration.value -= 1
  }
}

const increaseDuration = () => {
  duration.value += 1
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}

.header-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
}

.header-text {
  font-family: Source Han Sans CN;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #1f1f1f;
}

.content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

.content-item {
  width: 790px;
}

.GIF-collapse {
  background: #ffffff;
  border: 1px #eeeeee solid;
  border-radius: 0px;
  margin-top: 15px;
}

.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

:deep(.ant-collapse-header) {
  background-color: #f3f3f3;
}

.collapse-header-text {
  font-family: Source Han Sans CN;
  font-weight: 700;
  font-style: Bold;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
}

.collapse-content-title {
  width: 100%;
  height: 36px;
  margin-top: 15px;
  background-color: #eff2fd;
  text-align: center;
  line-height: 36px;
  font-family: Source Han Sans CN;
  font-weight: 700;
  font-style: Bold;
  font-size: 14px;
  letter-spacing: 0%;
  margin-bottom: 10px;
}

.collapse-content-image {
  width: 100%;
  height: 328px;
  padding: 16px 12px;
  background-color: #fbfbfc;
}

.content-image-box {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.content-image-item {
  width: 148px;
  height: 107px;
}

.content-image {
  width: 148px;
  height: 83px;
}

.GIF-setting {
  width: 100%;
  height: 106px;
  padding: 16px 12px;
  background-color: #fbfbfc;
  margin-top: 15px;
}

.setting-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.duration-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 10px;
  color: #1f1f1f;
  background: #ffffff;
}

.duration-input {
  width: 72px;
}

:deep(.duration-input.ant-input-number) {
  height: 32px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
}

:deep(.duration-input .ant-input-number-input) {
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 16px;
}

.setting-btn {
  height: 32px;
  padding: 0 12px;
  background: linear-gradient(180deg, #375bf5 0%, #5b89fa 100%);
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(55, 91, 245, 0.25);
}

.setting-btn:hover,
.setting-btn:focus {
  background: linear-gradient(180deg, #2f54eb 0%, #4a75f3 100%);
}

.result-box {
  width: 100%;
  height: 364px;
  padding: 16px 12px;
  background-color: #fbfbfc;
  margin-top: 15px;
}

.result-gif-box {
  display: flex;
  align-items: end;
  justify-content: space-between;
}

.gif-img {
  width: 519px;
  height: 290px;
  margin-top: 12px;
}
</style>
