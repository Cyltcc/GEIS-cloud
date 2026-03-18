<template>
  <div class="share-box">
    <div class="share-box-left">
      <div class="share-img">
        <svg class="share-arc"
             viewBox="0 0 1000 180"
             preserveAspectRatio="none">
          <path d="M0,0 H1000 V120 Q500,180 0,120 Z"
                fill="#ffffff" />
        </svg>
        <div class="share-logo">GIES cloud</div>
        <div class="share-qr">
          <img class="share-qr__img"
               src=""
               alt="">
        </div>
        <div class="share-desc">
          <div>Oddar Meanchey Mango</div>
          <div>Tropical Upland Ecosystem</div>
          <div>GIES Station (Cambodia)</div>
        </div>
      </div>
      <a-button class="download-btn"
                type="primary">
        保存二维�?
      </a-button>
    </div>
    <div class="share-box-right">
      <div class="form-row form-row--logo">
        <div class="form-label">Logo</div>
        <div class="logo-list">
          <a-upload class="logo-upload"
                    list-type="picture-card"
                    :show-upload-list="false"
                    :before-upload="() => false">

            <div class="logo-plus">+</div>
            <div class="logo-text">上传logo</div>

          </a-upload>
        </div>
      </div>

      <div class="form-row">
        <div class="form-label">二维码名称</div>
        <div class="form-col">
          <a-input placeholder="请输入作物名称" />
          <a-input placeholder="请输入生态系统名称" />
          <a-input placeholder="请输入地区（省/国家）" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-label">链接</div>
        <div class="form-col">
          <a-input disabled
                   placeholder="https://gr.thcpn.tianhangwisdom.com/#/device/U2FsdGVkX1%2F7" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-label">有效期</div>
        <div class="form-col">
          <div class="form-inline">
            <a-radio-group value="custom">
              <a-radio value="custom">自定义</a-radio>
              <a-radio value="forever">永久有效</a-radio>
            </a-radio-group>
          </div>
          <a-date-picker class="date-picker"
                         placeholder="请选择日期" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-label">
          <a-checkbox>访问密码</a-checkbox>
        </div>
        <div class="form-col">
          <a-input placeholder="请输入访问密码" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.share-box {
  display: flex;
  gap: 15px;
}
.share-box-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 473px;
}
.share-box-right {
  flex: 1;
  padding: 6px 8px;
}

.share-img {
  width: 100%;
  height: 709px;
  position: relative;
  border: 1px solid #e9edf2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
  background-color: #3c76a8;
}

.share-arc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 220px;
  z-index: 1;
}

.share-img > :not(.share-arc) {
  position: relative;
  z-index: 2;
}

.share-logo {
  width: 100%;
  height: 220px;
  line-height: 150px;
  font-size: 50px;
  font-weight: 700;
  color: #3f76a8;
  display: flex;
  justify-content: center;
}

.share-qr {
  width: 280px;
  height: 280px;
  background: #ffffff;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 8px 20px rgba(19, 36, 58, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
}

.share-qr__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 8px;
  background: #ffffff;
}

.share-desc {
  text-align: center;
  color: #eaf1ff;
  font-size: 24px;
  line-height: 1.4;
  font-weight: 600;
  margin-top: 4px;
}

.download-btn {
  width: 110px;
  height: 32px;
  background: linear-gradient(180deg, #375bf5 0%, #5b89fa 100%);
  margin-top: 24px;
}

.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row--logo {
  align-items: center;
}

.form-label {
  width: 90px;
  color: #6b6b6b;
  font-size: 14px;
  line-height: 32px;
  text-align: right;
  flex-shrink: 0;
}

.form-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-inline {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.logo-list {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.logo-card {
  width: 90px;
  height: 90px;
  border: 1px solid #e6e8ee;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.logo-upload :deep(.ant-upload) {
  width: 90px;
  height: 90px;
  border: none;
  background: transparent;
  padding: 0;
}

.logo-card--add {
  flex-direction: column;
  gap: 6px;
  color: #6b6b6b;
  background: #fbfbfd;
}

.logo-plus {
  font-size: 28px;
  color: #2f65ff;
  line-height: 1;
}

.logo-text {
  font-size: 12px;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: #ffffff;
}

.logo-card--active .logo-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logo-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
}

.logo-card--upload {
  flex-direction: column;
  gap: 8px;
  color: #8a8a8a;
}

.upload-text {
  font-size: 12px;
}

.upload-bar {
  width: 68px;
  height: 4px;
  background: #dbe5ff;
  border-radius: 999px;
  overflow: hidden;
}

.upload-bar span {
  display: block;
  width: 40%;
  height: 100%;
  background: #2f65ff;
  border-radius: 999px;
}

.form-col :deep(.ant-input),
.form-col :deep(.ant-input-affix-wrapper),
.form-col :deep(.ant-picker) {
  width: 100%;
  height: 32px;
}

.form-col :deep(.ant-picker) {
  display: inline-flex;
  align-items: center;
}

.form-col :deep(.ant-input) {
  padding: 4px 10px;
}

.form-col :deep(.ant-radio-wrapper) {
  margin-right: 18px;
}

.form-col :deep(.ant-checkbox-wrapper) {
  font-size: 14px;
  color: #6b6b6b;
}
</style>
