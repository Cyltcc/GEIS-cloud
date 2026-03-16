<template>
  <div class="ge-chart">
    <div class="ge-chart__header">
      <div class="ge-chart__title">
        <span class="ge-chart__dot"
              :style="{ backgroundColor: color }"></span>
        <span class="ge-chart__title-text">{{ title }}</span>
        <span class="ge-chart__unit">({{ unit }})</span>
      </div>
      <i style="width: 16px; height: 15px; cursor: pointer;"
         class="i-custom:chart"></i>
    </div>
    <div ref="chartRef"
         class="ge-chart__canvas"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

type Props = {
  title?: string
  unit?: string
  color?: string
  xData?: string[]
  yData?: number[]
  min?: number
  max?: number
  tooltipDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '土壤钾',
  unit: 'mg/kg',
  color: '#62d488',
  xData: () => [
    '8:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '22:00',
    '24:00',
    '2:00',
    '4:00',
    '6:00',
  ],
  yData: () => [35, 120, 160, 125, 90, 180, 160, 130, 110, 165, 120, 140],
  min: -50,
  max: 250,
  tooltipDate: '',
})

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const mergedXData = computed(() =>
  props.xData && props.xData.length ? props.xData : []
)
const mergedYData = computed(() =>
  props.yData && props.yData.length ? props.yData : []
)

const buildOptions = (): echarts.EChartsOption => {
  const gradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: withAlpha(props.color, 0.45) },
    { offset: 1, color: withAlpha(props.color, 0.02) },
  ])

  return {
    grid: {
      left: 28,
      right: 18,
      top: 24,
      bottom: 24,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#f0f0f0',
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: '#8b8b8b',
        fontSize: 12,
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(31, 31, 31, 0.08);',
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''
        const item = params[0]
        const timeLabel = item.axisValueLabel ?? ''
        const value = item.data ?? '-'
        const title = props.tooltipDate
          ? `${props.tooltipDate} ${timeLabel}`
          : timeLabel
        return `${title}<br/>${props.title}：<b style="color:#1f1f1f">${value}</b>`
      },
    },
    xAxis: {
      type: 'category',
      data: mergedXData.value,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#8b8b8b',
        fontSize: 12,
        margin: 12,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: props.min,
      max: props.max,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#8b8b8b',
        fontSize: 12,
        margin: 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e9ecef',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'line',
        data: mergedYData.value,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: props.color,
        },
        areaStyle: {
          color: gradient,
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
}

const withAlpha = (hex: string, alpha: number) => {
  const match = hex.match(/^#?([0-9a-fA-F]{6})$/)
  if (!match) return hex
  const value = Number.parseInt(match[1], 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const renderChart = () => {
  if (!chartRef.value) return
  if (!chart) {
    chart = echarts.init(chartRef.value)
  }
  chart.setOption(buildOptions(), true)
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  renderChart()
  if (chartRef.value && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(chartRef.value)
  }
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (chart) {
    chart.dispose()
    chart = null
  }
})

watch(
  [
    mergedXData,
    mergedYData,
    () => props.color,
    () => props.min,
    () => props.max,
  ],
  () => {
    renderChart()
  }
)
</script>

<style scoped lang="scss">
.ge-chart {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px 16px 8px;
  box-shadow: 0 1px 2px rgba(31, 31, 31, 0.04);
}

.ge-chart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ge-chart__title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f1f1f;
  font-size: 14px;
  font-weight: 600;
}

.ge-chart__dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.ge-chart__title-text {
  font-family: Source Han Sans CN;
  font-weight: 600;
}

.ge-chart__unit {
  color: #1f1f1f;
  font-weight: 600;
}

.ge-chart__menu {
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  padding: 0;
}

.ge-chart__menu span {
  display: block;
  width: 14px;
  height: 2px;
  background: #4a73ff;
  border-radius: 2px;
}

.ge-chart__canvas {
  width: 100%;
  height: 220px;
}
</style>
