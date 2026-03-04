<template>
  <a-layout class="layout-container">
    <div class="header">
      <div class="header-left">
        <img style="width: 28px; height: 28px;"
             src="@/assets/imgs/logo.png"
             alt="logo" />
        <span class="logo-text"
              v-if="!collapsed">FAO OCOP</span>
      </div>
      <div class="header-right">
        <img :src="searchIcon"
             class="icon-btn"
             alt="search" />
        <img :src="informIcon"
             class="icon-btn"
             alt="inform" />
        <div class="lang-select">
          <span>中文简体</span>
        </div>
        <div class="user-profile">
          <img :src="adminIcon"
               class="icon-btn"
               alt="admin" />
          <span>Admin</span>
        </div>
      </div>
    </div>

    <a-layout>
      <a-layout-sider width="232"
                      theme="light">
        <a-menu v-model:selectedKeys="state.selectedKeys"
                style="width: 100%;"
                mode="inline"
                :open-keys="state.openKeys"
                :items="items"
                @openChange="onOpenChange"
                @select="onSelect" />
      </a-layout-sider>
      <a-layout>
        <!-- 面包屑导航 -->
        <div class="breadcrumb-container">
          <a-breadcrumb :routes="breadcrumbItems">
            <template #itemRender="{ route: item }">
              <span v-if="item.title"
                    :class="{ 'breadcrumb-link': item.clickable }"
                    @click="item.clickable && navigateTo(item.path)">
                {{ item.title }}
              </span>
            </template>
          </a-breadcrumb>
        </div>

        <div class="content">
          <router-view />
        </div>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Home from '@/assets/icons/home.svg'
import HomeActive from '@/assets/icons/home-actice.svg'
import Device from '@/assets/icons/device.svg'
import DeviceActive from '@/assets/icons/device-active.svg'
import Data from '@/assets/icons/data.svg'
import DataActive from '@/assets/icons/data-active.svg'
import Vision from '@/assets/icons/vision.svg'
import VisionActive from '@/assets/icons/vision-active.svg'
import searchIcon from '@/assets/icons/search.svg'
import informIcon from '@/assets/icons/inform.svg'
import adminIcon from '@/assets/icons/admin.svg'
import type { ItemType } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)

interface BreadcrumbItem {
  title: string
  path?: string
  clickable?: boolean
}

function getItem(
  label: any,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group'
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType
}

const getActiveRootMenuKey = () => {
  const selectedKey = state.selectedKeys[0]
  if (selectedKey === 'Dashboard') return 'Dashboard'
  if (selectedKey === 'DataViz') return 'DataViz'
  if (
    selectedKey === 'Device' ||
    selectedKey === 'DeviceGroup' ||
    selectedKey === 'DeviceList' ||
    selectedKey === 'DeviceFavorites'
  ) {
    return 'Device'
  }
  if (selectedKey === 'DataMgmt' || selectedKey === 'DataList')
    return 'DataMgmt'
  return ''
}

const renderMenuIcon =
  (
    normalSrc: string,
    activeSrc: string,
    menuKey: 'Dashboard' | 'DataViz' | 'Device' | 'DataMgmt'
  ) =>
  () =>
    h('img', {
      src: getActiveRootMenuKey() === menuKey ? activeSrc : normalSrc,
      alt: 'menu-icon',
      style: {
        width: '16px',
        height: '16px',
        display: 'block',
      },
    })

const items: ItemType[] = reactive([
  getItem('首页', 'Dashboard', renderMenuIcon(Home, HomeActive, 'Dashboard')),
  getItem(
    '数据可视化',
    'DataViz',
    renderMenuIcon(Vision, VisionActive, 'DataViz')
  ),
  getItem(
    '设备管理',
    'Device',
    renderMenuIcon(Device, DeviceActive, 'Device'),
    [
      getItem('设备分组', 'DeviceGroup'),
      getItem('设备列表', 'DeviceList'),
      getItem('设备收藏', 'DeviceFavorites'),
    ]
  ),
  getItem(
    '数据管理',
    'DataMgmt',
    renderMenuIcon(Data, DataActive, 'DataMgmt'),
    [getItem('数据列表', 'DataList')]
  ),
])

const state = reactive({
  rootSubmenuKeys: ['Device', 'DataMgmt'],
  openKeys: ['Device'],
  selectedKeys: ['Dashboard'],
})

const routesMap: Record<string, string> = {
  Dashboard: '/dashboard',
  DataViz: '/data-viz',
  DeviceGroup: '/device/group',
  DeviceList: '/device/list',
  DeviceFavorites: '/device/favorites',
  DataList: '/data/list',
}

const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find(
    (key) => state.openKeys.indexOf(key) === -1
  )
  if (state.rootSubmenuKeys.indexOf(latestOpenKey as string) === -1) {
    state.openKeys = openKeys
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : []
  }
}

const onSelect = ({ key }: { key: string }) => {
  const path = routesMap[key]
  if (path) {
    router.push(path)
  }
  state.selectedKeys = [key]
}

// 生成面包屑数据
const breadcrumbItems = computed(() => {
  const items: BreadcrumbItem[] = []

  // 只获取最后一个路由（跳过根路径），显示当前页面名称
  const currentRoute = route.matched[route.matched.length - 1]
  if (currentRoute?.meta?.title) {
    items.push({
      title: currentRoute.meta.title as string,
      path: currentRoute.path,
      clickable: false,
    })
  }

  return items
})

// 面包屑导航跳转
const navigateTo = (path: string | undefined) => {
  if (path) {
    router.push(path)
  }
}

watch(
  () => route.name,
  (val) => {
    if (val) {
      state.selectedKeys = [val as string]
      // Auto expand submenu if needed
      if (val.toString().startsWith('Device')) {
        if (!state.openKeys.includes('Device')) {
          state.openKeys.push('Device')
        }
      }
    }
  },
  { immediate: true }
)
</script>


<style scoped lang="scss">
.layout-container {
  width: 100vw;
  height: 100vh;

  .header {
    height: 56px;
    width: 100%;
    background: #fff;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 1px;

    .header-left {
      height: 56px;
      width: 140px;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      .logo-text {
        font-family: Source Han Sans CN;
        font-weight: 700;
        font-style: Bold;
        font-size: 18px;
        line-height: 26px;
        letter-spacing: 4%;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .icon-btn {
        width: 18px;
        height: 18px;
        display: block;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
    }
  }

  .breadcrumb-container {
    height: 40px;
    opacity: 1;
    margin: 24px 16px 0;
    padding: 8px 16px;
    background-color: #fff;

    :deep(.ant-breadcrumb) {
      font-size: 14px;

      .ant-breadcrumb-link {
        color: #000;

        .breadcrumb-link {
          color: #666;
          cursor: pointer;

          &:hover {
            color: #40a9ff;
            text-decoration: underline;
          }
        }
      }

      .ant-breadcrumb-separator {
        color: #bfbfbf;
        margin: 0 4px;
      }
    }
  }

  .content {
    margin: 24px 16px;
    padding: 0;
    overflow: auto;
    background: #fff; // Let views decide background
  }
}
</style>
