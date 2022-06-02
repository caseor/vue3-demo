import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]; // Controls roles that have access to the page
    icon?: string; // The icon show in the side menu
    locale?: string; // The locale name show in side menu and breadcrumb
    hideInMenu?: boolean; // If true, it is not displayed in the side menu
    order?: number; // Sort routing menu items. If set key, the higher the value, the more forward it is
    noAffix?: boolean; // if set true, the tag will not affix in the tab-bar
    ignoreCache?: boolean; // if set true, the page will not be cached
  }
}
