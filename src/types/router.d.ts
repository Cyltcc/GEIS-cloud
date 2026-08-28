import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
    public?: boolean
    requiresAuth?: boolean
    featureCode?: string
  }
}

