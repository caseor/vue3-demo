

export const staticRoutes: any = [
    {
        path: 'demo',
        name: 'Demo',
        component: () => import('@/views/demo/index.vue'),
        meta: {
            locale: 'menu.demo',
            icon: 'icon-dashboard'
        },
        children: [
            {
                path: 'demo1',
                name: 'Demo1',
                component: () => import('@/views/demo/view1/index.vue'),
                meta: {
                    locale: 'menu.demo.view1'
                }
            },
            {
                path: 'demo2',
                name: 'Demo2',
                component: () => import('@/views/demo/view2/index.vue'),
                meta: {
                    locale: 'menu.demo.view2'
                }
            }
        ]
    },
    {
        path: 'routes',
        name: 'Routes',
        component: () => import('@/views/routes/index.vue'),
        meta: {
            locale: 'menu.routes',
            icon: 'icon-dashboard'
        },
        children: [
            {
                path: 'gen',
                name: 'Gen',
                component: () => import('@/views/routes/gen/index.vue'),
                meta: {
                    locale: 'menu.routes.gen'
                }
            }
        ]
    }
]

export const fallbackRoutes: any = [
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('@/views/not-found/index.vue'),
    }
]