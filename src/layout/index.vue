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
          <a-dropdown :trigger="['click']">
            <a class="dropdown-trigger"
               @click.prevent>
              <span>{{ currentLanguageLabel }}</span>
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu :items="languageItems"
                      :selected-keys="[locale]"
                      @click="onLanguageMenuClick" />
            </template>
          </a-dropdown>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="dropdown-trigger"
               @click.prevent>
              <span>{{ currentTimezoneLabel }}</span>
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu :items="timezoneItems"
                      :selected-keys="[currentTimezone]"
                      @click="onTimezoneMenuClick" />
            </template>
          </a-dropdown>
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
                      theme="light"
                      class="sidebar">
        <div class="sidebar-inner">
          <a-menu v-model:selectedKeys="state.selectedKeys"
                  class="sidebar-menu"
                  mode="inline"
                  :open-keys="state.openKeys"
                  :items="menuItems"
                  @openChange="onOpenChange"
                  @select="onSelect" />
          <div class="sidebar-footer"
               @click="toggleMenuMode">
            <span class="switch-icon">≡</span>
            <span class="switch-text">{{ switchLabel }}</span>
          </div>
        </div>
      </a-layout-sider>
      <a-layout>
        <div class="breadcrumb-container">
          <a-breadcrumb separator=">">
            <a-breadcrumb-item v-for="(item, index) in breadcrumbItems"
                               :key="`${item.path || item.title}-${index}`">
              <span v-if="item.title"
                    :class="{ 'breadcrumb-link': item.clickable }"
                    @click="item.clickable && navigateTo(item.path)">
                {{ item.title }}
              </span>
            </a-breadcrumb-item>
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
import { useI18n } from 'vue-i18n'
import { DownOutlined } from '@ant-design/icons-vue'
import Home from '@/assets/icons/home.svg'
import HomeActive from '@/assets/icons/home-actice.svg'
import Device from '@/assets/icons/device.svg'
import DeviceActive from '@/assets/icons/device-active.svg'
import Data from '@/assets/icons/data.svg'
import DataActive from '@/assets/icons/data-active.svg'
import Vision from '@/assets/icons/vision.svg'
import VisionActive from '@/assets/icons/vision-active.svg'
import OTAIcon from '@/assets/icons/OTA.svg'
import OTAActiveIcon from '@/assets/icons/OTA-active.svg'
import admin_mgmtIcon from '@/assets/icons/admin-mgmt.svg'
import admin_mgmtActiveIcon from '@/assets/icons/admin-mgmt-active.svg'
import sensor_adminIcon from '@/assets/icons/sensor-admin.svg'
import sensor_adminActiveIcon from '@/assets/icons/sensor-admin-active.svg'
import device_adminIcon from '@/assets/icons/deivce-admin.svg'
import device_adminActiveIcon from '@/assets/icons/deivce-admin-active.svg'
import searchIcon from '@/assets/icons/search.svg'
import informIcon from '@/assets/icons/inform.svg'
import adminIcon from '@/assets/icons/admin.svg'
import type { ItemType } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const { t } = useI18n()
const { locale, setLocale } = useLocale()
const currentTimezone = ref('UTC+8')

const languageItems = computed(() => [
  { key: 'zh-CN', label: '中文简体' },
  { key: 'en-US', label: 'English' },
])

const timezoneItems = [
  { key: 'UTC+8', label: 'UTC+8' },
  { key: 'UTC+0', label: 'UTC+0' },
]

const currentLanguageLabel = computed(() =>
  locale.value === 'zh-CN' ? '中文简体' : 'English'
)

const currentTimezoneLabel = computed(() => currentTimezone.value)

const onLanguageMenuClick: MenuProps['onClick'] = ({ key }) => {
  setLocale(key as 'zh-CN' | 'en-US')
}

const onTimezoneMenuClick: MenuProps['onClick'] = ({ key }) => {
  currentTimezone.value = String(key)
}

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

const getRootMenuKey = (selectedKey?: string) => {
  if (!selectedKey) return undefined
  if (selectedKey === 'Dashboard') return 'Dashboard'
  if (selectedKey === 'DataViz') return 'DataViz'
  if (
    selectedKey === 'Device' ||
    selectedKey === 'DeviceGroup' ||
    selectedKey === 'DeviceList' ||
    selectedKey === 'standard' ||
    selectedKey === 'video' ||
    selectedKey === 'LORA' ||
    selectedKey === 'Tiantong' ||
    selectedKey === 'DeviceFavorites' ||
    selectedKey === 'DeviceDetail'
  ) {
    return 'Device'
  }
  if (
    selectedKey === 'DataMgmt' ||
    selectedKey === 'DataDownload' ||
    selectedKey === 'DataCompute' ||
    selectedKey === 'ThresholdAlert' ||
    selectedKey === 'AbnormalData'
  ) {
    return 'DataMgmt'
  }
  return undefined
}

const getActiveRootMenuKey = () => {
  const selectedKey = state.selectedKeys[0]
  return getRootMenuKey(selectedKey)
}

const renderMenuIcon =
  (
    normalSrc: string,
    activeSrc: string,
    menuKey:
      | 'Dashboard'
      | 'DataViz'
      | 'Device'
      | 'DataMgmt'
      | 'AdminDevice'
      | 'AdminSensor'
      | 'AdminOta'
      | 'AdminUser'
	  | 'AdminTenant'
  ) =>
  () => {
    const activeRootKey = getActiveRootMenuKey()
    const isActive =
      activeRootKey === menuKey || state.selectedKeys[0] === menuKey
    return h('img', {
      src: isActive ? activeSrc : normalSrc,
      alt: 'menu-icon',
      style: {
        width: '16px',
        height: '16px',
        display: 'block',
      },
    })
  }

const frontItems = computed<ItemType[]>(() => [
  getItem(
    t('menu.dashboard'),
    'Dashboard',
    renderMenuIcon(Home, HomeActive, 'Dashboard')
  ),
  getItem(
    t('menu.dataViz'),
    'DataViz',
    renderMenuIcon(Vision, VisionActive, 'DataViz')
  ),
  getItem(
    t('menu.deviceMgmt'),
    'Device',
    renderMenuIcon(Device, DeviceActive, 'Device'),
    [
      getItem(t('menu.deviceGroup'), 'DeviceGroup'),
      getItem(t('menu.deviceList'), 'DeviceList'),
      getItem(t('menu.deviceFavorites'), 'DeviceFavorites'),
    ]
  ),
  getItem(
    t('menu.dataMgmt'),
    'DataMgmt',
    renderMenuIcon(Data, DataActive, 'DataMgmt'),
    [
      getItem(t('menu.dataDownload'), 'DataDownload'),
      getItem(t('menu.dataCompute'), 'DataCompute'),
      getItem(t('menu.thresholdAlert'), 'ThresholdAlert'),
      getItem(t('menu.abnormalData'), 'AbnormalData'),
    ]
  ),
])

const adminItems = computed<ItemType[]>(() => [
  getItem(
    t('menu.adminDevice'),
    'AdminDevice',
    renderMenuIcon(device_adminIcon, device_adminActiveIcon, 'AdminDevice')
  ),
  getItem(
    t('menu.adminSensor'),
    'AdminSensor',
    renderMenuIcon(sensor_adminIcon, sensor_adminActiveIcon, 'AdminSensor')
  ),
  getItem(
    t('menu.adminOta'),
    'AdminOta',
    renderMenuIcon(OTAIcon, OTAActiveIcon, 'AdminOta')
  ),
    getItem(
    t('menu.adminTenant'),
    'AdminTenant',
    renderMenuIcon(admin_mgmtIcon, admin_mgmtActiveIcon, 'AdminTenant')
  ),
  getItem(
    t('menu.adminUser'),
    'AdminUser',
    renderMenuIcon(admin_mgmtIcon, admin_mgmtActiveIcon, 'AdminUser')
  ),
])

const isBackend = computed(() => route.path.startsWith('/admin'))
const menuItems = computed(() =>
  isBackend.value ? adminItems.value : frontItems.value
)

const getSelectedKeyFromRoute = (routeName?: string) => {
  if (!routeName) return 'Dashboard'
  if (
    routeName === 'DeviceDetail' ||
    routeName === 'standard' ||
    routeName === 'video' ||
    routeName === 'LORA' ||
    routeName === 'Tiantong'
  ) {
    return 'DeviceList'
  }
  if (
    routeName === 'Admin' ||
    routeName === 'AdminDevice' ||
    routeName === 'AdminSensor' ||
    routeName === 'SensorDataAdd' ||
    routeName === 'SensorImageAdd' ||
    routeName === 'SensorDataDetail' ||
    routeName === 'SensorImageDetail' ||
    routeName === 'AdminOta' ||
    routeName === 'AdminUser' ||
    routeName === 'AdminTenant'
  ) {
    if (
      routeName === 'SensorDataAdd' ||
      routeName === 'SensorImageAdd' ||
      routeName === 'SensorDataDetail' ||
      routeName === 'SensorImageDetail'
    ) {
      return 'AdminSensor'
    }
    return routeName === 'Admin' ? 'AdminDevice' : routeName
  }
  return routeName
}

const initialSelectedKey = getSelectedKeyFromRoute(
  route.name as string | undefined
)
const initialOpenKey = getRootMenuKey(initialSelectedKey)

const state = reactive({
  openKeys:
    initialOpenKey && ['Device', 'DataMgmt'].includes(initialOpenKey)
      ? [initialOpenKey]
      : [],
  selectedKeys: [initialSelectedKey],
})

const routesMap: Record<string, string> = {
  Dashboard: '/dashboard',
  DataViz: '/data-viz',
  DeviceGroup: '/device/group',
  DeviceList: '/device/list',
  DeviceFavorites: '/device/favorites',
  DataDownload: '/data-mgmt/download',
  DataCompute: '/data-mgmt/compute',
  ThresholdAlert: '/data-mgmt/threshold',
  AbnormalData: '/data-mgmt/abnormal',
  AdminDevice: '/admin/device',
  AdminSensor: '/admin/sensor',
  AdminOta: '/admin/ota',
  AdminUser: '/admin/user',
  AdminTenant: '/admin/tenant',
}

const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find(
    (key) => state.openKeys.indexOf(key) === -1
  )
  const rootSubmenuKeys = isBackend.value ? [] : ['Device', 'DataMgmt']
  if (rootSubmenuKeys.indexOf(latestOpenKey as string) === -1) {
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

const breadcrumbItems = computed(() => {
  const items: BreadcrumbItem[] = []

  const isSensorAddRoute =
    route.name === 'SensorDataAdd' ||
    route.name === 'SensorImageAdd' ||
    route.path.startsWith('/admin/sensor/data-add') ||
    route.path.startsWith('/admin/sensor/image-add')

  if (isSensorAddRoute) {
    items.push({
      title: t('menu.adminSensor'),
      path: '/admin/sensor',
      clickable: true,
    })
    items.push({
      title:
        route.name === 'SensorImageAdd'
          ? t('route.sensorImageAdd')
          : t('route.sensorDataAdd'),
      clickable: false,
    })
    return items
  }

  const isSensorDetailRoute =
    route.matched.some(
      (record) =>
        record.name === 'SensorDataDetail' ||
        record.name === 'SensorImageDetail'
    ) ||
    route.path.startsWith('/admin/sensor/data-detail/') ||
    route.path.startsWith('/admin/sensor/image-detail/')

  if (isSensorDetailRoute) {
    items.push({
      title: t('menu.adminSensor'),
      path: '/admin/sensor',
      clickable: true,
    })

    const rawName = route.query.name
    const sensorName = String(
      Array.isArray(rawName) ? rawName[0] : rawName ?? ''
    ).trim()
    items.push({
      title: sensorName
        ? t('route.sensorDetailWithName', { name: sensorName })
        : t('route.sensorDetail'),
      clickable: false,
    })
    return items
  }

  const isDeviceDetailRoute =
    route.matched.some((record) => record.name === 'DeviceDetail') ||
    route.path.startsWith('/device/detail/')

  if (isDeviceDetailRoute) {
    items.push({
      title: t('menu.deviceList'),
      path: '/device/list',
      clickable: true,
    })

    const rawName = route.query.name
    const deviceName = String(
      Array.isArray(rawName) ? rawName[0] : rawName ?? ''
    ).trim()
    items.push({
      title: deviceName
        ? t('route.deviceDetailWithName', { name: deviceName })
        : t('route.deviceDetail'),
      clickable: false,
    })
    return items
  }

  const isDeviceListRoute = route.path.startsWith('/device/list')

  if (isDeviceListRoute) {
    items.push({
      title: t('menu.deviceList'),
      path: '/device/list',
      clickable: false,
    })
    return items
  }

  const currentRoute = route.matched[route.matched.length - 1]
  if (currentRoute?.meta?.titleKey) {
    items.push({
      title: t(currentRoute.meta.titleKey as string),
      path: currentRoute.path,
      clickable: false,
    })
  }

  return items
})

const navigateTo = (path: string | undefined) => {
  if (path) {
    router.push(path)
  }
}

const switchLabel = computed(() =>
  isBackend.value ? t('layout.switchToFrontend') : t('layout.switchToBackend')
)

const toggleMenuMode = () => {
  if (isBackend.value) {
    router.push('/dashboard')
    return
  }
  router.push('/admin/device')
}

watch(
  () => route.fullPath,
  () => {
    const routeName = route.name as string | undefined
    const selectedKey = getSelectedKeyFromRoute(routeName)
    state.selectedKeys = [selectedKey]
    if (isBackend.value) {
      state.openKeys = []
      return
    }
    const rootKey = getRootMenuKey(selectedKey)
    if (rootKey && ['Device', 'DataMgmt'].includes(rootKey)) {
      state.openKeys = [rootKey]
    } else {
      state.openKeys = []
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

      .lang-select {
        display: flex;
        align-items: center;
        color: #262626;

        .dropdown-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #262626;
          text-decoration: none;

          &:hover {
            color: #1677ff;
          }
        }
      }
    }
  }

  .sidebar {
    background: #fff;
    border-right: 1px solid #f0f0f0;

    .sidebar-inner {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .sidebar-menu {
      flex: 1;
      width: 100%;
      border-right: none;
    }

    .sidebar-footer {
      height: 52px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      cursor: pointer;
      color: #333;

      .switch-icon {
        font-size: 18px;
        line-height: 1;
      }

      .switch-text {
        font-size: 14px;
      }

      &:hover {
        background: #f7f7f7;
      }
    }
  }

  .breadcrumb-container {
    height: 40px;
    opacity: 1;
    margin: 12px;
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
    height: calc(100vh - 56px - 40px - 36px);
    margin: 0 12px;
    padding: 20px;
    overflow: auto;
    background: #fff; // Let views decide background
  }
}
</style>
