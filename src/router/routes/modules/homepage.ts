export default {
  path: '/homepage',
  name: 'Homepage',
  component: () => import('@/views/homepage/index/index.vue'),
  meta: {
    locale: 'menu.dashboard',
    icon: 'icon-dashboard'
  }
};
