import type {LocationQueryRaw, Router} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import {useUserStore} from '@/store';
import {isLogin} from '@/utils/auth';
import { Notification } from '@arco-design/web-vue';
import {staticRoutes, fallbackRoutes } from '../routes'

// 必须使用绝对路径/或相对路径../
const components = import.meta.glob("../../views/**/**.vue")

// 是否开启动态路由, 如果不开启则使用默认staticRoutes
const enableDynamicRoutes = false

function recurRoutes(parentId, parentPath, flatMenus) {
    const children: any = []
    flatMenus.forEach(each => {
        if (parentId === each.parentId) {
            const childFullPath = `${parentPath}/${each.path}`
            const child: any = {
                id: each.id,
                name: each.componentName,
                path: each.path,
                // component: defineAsyncComponent(() => import(`@/views/${childFullPath}/index.vue`)),
                // component: () => import(`@/views/${childFullPath}/index.vue`),
                component: components[`../../views/${childFullPath}/index.vue`],
                meta: {
                    locale: each.localeKey === '' ? undefined : each.localeKey,
                    icon: each.icon === '' ? undefined : each.icon
                }
            }
            child.children = recurRoutes(each.id, childFullPath, flatMenus)
            children.push(child)
        }
    })
    return children.length === 0 ? undefined : children
}

function generateRoutes(router: Router) {
    const userStore = useUserStore();
    const {menus}: any = userStore
    if (enableDynamicRoutes) {
        const accessRoutes: any = []
        // find roots
        for (let i = 0; i < menus.length; i += 1) {
            if (menus[i].parentId === 0) {
                const child: any = {
                    id: menus[i].id,
                    name: menus[i].componentName,
                    path: menus[i].path,
                    // component: defineAsyncComponent(() => import(`@/views/${menus[i].path}/index.vue`)),
                    // component: () => import(`@/views/${menus[i].path}/index.vue`),
                    component: components[`../../views/${menus[i].path}/index.vue`],
                    meta: {
                        locale: menus[i].localeKey === '' ? undefined : menus[i].localeKey,
                        icon: menus[i].icon === '' ? undefined : menus[i].icon
                    }
                }
                accessRoutes.push(child)
            }
        }

        for (let i = 0; i < accessRoutes.length; i += 1) {
            let hasChild = false
            for (let j = 0; j < menus.length; j += 1) {
                if (accessRoutes[i].id === menus[j].parentId) {
                    hasChild = true
                    break
                }
            }
            if (!hasChild) {
                const children: any = []
                const child: any = {
                    id: accessRoutes[i].id,
                    name: accessRoutes[i].componentName,
                    path: accessRoutes[i].path,
                    // component: defineAsyncComponent(() => import(`@/views/${accessRoutes[i].path}/index.vue`)),
                    // component: () => import(`@/views/${accessRoutes[i].path}/index.vue`),
                    component: components[`../../views/${accessRoutes[i].path}/index.vue`],
                    meta: {
                        locale: accessRoutes[i].localeKey === '' ? undefined : accessRoutes[i].localeKey,
                        icon: accessRoutes[i].icon === '' ? undefined : accessRoutes[i].icon
                    }
                }
                children.push(child)
                accessRoutes[i].children = children
            } else {
                accessRoutes[i].children = recurRoutes(accessRoutes[i].id, accessRoutes[i].path, menus)
            }
        }

        
        console.log("accessRoutes: ", accessRoutes)
        
        accessRoutes.forEach(item => {
            router.addRoute('root', item)
        })
    } else {
        
        console.log("hasRoutes: ", router.hasRoute('root'))
        staticRoutes.forEach(item => {
            router.addRoute('root', item)
        })
        
    }

    fallbackRoutes.forEach(item => {
        router.addRoute(item)
    })

}
const allowedUris = ['/register']

// 严格按照顺序过滤
// 1. 白名单
export default function setupPermissionGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        NProgress.start();
        console.log("routes: ", router.getRoutes())
        const userStore = useUserStore();
        let isAllowedUri = false
        for (let i = 0; i < allowedUris.length; i += 1) {
            if (to.path.indexOf(allowedUris[i]) === 0) {
                isAllowedUri = true
                break
            }
        }
        if (isAllowedUri) {
            next()
        } else if (isLogin()) {
            if (userStore.roleKeys && userStore.roleKeys.length > 0) {
                // 登录了还想回到登录页面, 那就从哪儿来就回到哪儿去
                if (to.path === '/login') {
                    Notification.info({
                        title: "Info",
                        content: "已经登录",
                        duration: 5000,
                        position: "topRight",
                        showIcon: true,
                        closable: true,
                    })
                    next({...from, replace: true})
                }else {
                    next();
                }
            } else {
                try {
                    await userStore.info();
                    generateRoutes(router);
                    next({...to, replace: true})
                } catch (error) {
                    next({
                        name: 'login',
                        query: {
                            redirect: to.name,
                            ...to.query,
                        } as LocationQueryRaw,
                    });
                }
            }
        } else if (to.name === 'login') {
            // No token
            next();
        } else {
            next({
                name: 'login',
                query: {
                    redirect: to.name,
                    ...to.query,
                } as LocationQueryRaw,
            });
        }

    });
    router.afterEach(async () => {
        NProgress.done();
    })
}
