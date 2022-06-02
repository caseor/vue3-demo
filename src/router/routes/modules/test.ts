export default {
  path: 'test',
  name: 'Test',
  component: () => import('@/views/demo/index.vue'),
  meta: {
    locale: 'menu.test',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0
  },
  children: [
    {
      path: 'demo',
      name: 'Demo',
      component: () => import('@/views/demo/view/index.vue'),
      meta: {
        locale: 'menu.test.demo',
        requiresAuth: true,
        roles: ['*']
      }
    },
    {
      path: 'demo1',
      name: 'Demo1',
      component: () => import('@/views/demo/view1/index.vue'),
      meta: {
        locale: 'menu.test.demo1',
        requiresAuth: true,
        roles: ['*']
      }
    },
    {
      path: 'demo2',
      name: 'Demo2',
      component: () => import('@/views/demo/view2/index.vue'),
      meta: {
        locale: 'menu.test.demo2',
        requiresAuth: true,
        roles: ['*'],
        visible: true
      }
    }
  ]
};
