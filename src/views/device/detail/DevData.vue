<script setup lang="ts">
import { ref } from 'vue'
import DataPresentation from './data/DataPresentation.vue'
import DataGIF from './data/DataGIF.vue'

const lastDataColumns = [
  {
    title: '空气温度(℃)',
    dataIndex: 'temp',
    key: 'temp',
    align: 'center',
  },
  {
    title: '相对湿度(%)',
    dataIndex: 'humi',
    key: 'humi',
    align: 'center',
  },
  {
    title: '光和有效(umol/㎡·s)',
    dataIndex: 'photon',
    key: 'photon',
    align: 'center',
  },
  {
    title: '降雨量(mm)',
    dataIndex: 'rain',
    key: 'rain',
    align: 'center',
  },
  {
    title: '土壤温度(℃)',
    dataIndex: 'st',
    key: 'st',
    align: 'center',
  },
  {
    title: '土壤水分(%)',
    dataIndex: 'sh',
    key: 'sh',
    align: 'center',
  },
  {
    title: '电压(V)',
    dataIndex: 'bat',
    key: 'bat',
    align: 'center',
  },
]

const lastData = ref([
  {
    temp: '20.04',
    humi: '44.32',
    photon: '19.00',
    rain: '0.00',
    st: '18.44',
    sh: '0.00',
    bat: '12.75',
  },
])
</script>

<template>
  <div>
    <div class="header">
      <div style="width: 259px;"
           class="header-box">设备启用时间：2025-11-25 13：20：23</div>
      <div style="width: 112px;"
           class="header-box">时区：UTC-8</div>
    </div>
    <div class="last-data">
      <div class="last-data-title">
        <span class="last-data-pr"></span>
        <span class="last-data-text">设备最新一条数据</span>
      </div>
      <div>
        <a-table class="last-data-table"
                 :columns="lastDataColumns"
                 :data-source="lastData"
                 :pagination="false"></a-table>
      </div>

    </div>
    <div>
      <DataPresentation />
    </div>
    <div>
      <DataGIF />
    </div>
  </div>
</template>



<style lang="scss" scoped>
.header {
  display: flex;
  gap: 10px;

  .header-box {
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-size: 12px;
    height: 32px;
    border: 1px #3969fa solid;
    background-color: #eff2fd;
    color: #3969fa;
    text-align: center;
    line-height: 32px;
  }
}

.last-data {
  margin-top: 15px;
  margin-bottom: 15px;

  .last-data-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }

  .last-data-pr {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #3969fa;
  }

  .last-data-text {
    font-family: Source Han Sans CN;
    font-weight: 700;
    font-style: Bold;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
  }

  :deep(.last-data-table .ant-table-thead > tr > th) {
    background: #eef2ff;
    color: #1d2129;
    font-weight: 600;
    text-align: center;
    border-bottom: 1px solid #e5e9f2;
    height: 44px;
  }
}
</style>