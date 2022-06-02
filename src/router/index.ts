import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import Login from "@/router/routes/modules/login";
import DefaultLayout from "@/layout/default-layout.vue";
import Homepage from "@/router/routes/modules/homepage";
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: true }); // NProgress Configuration

const basicRoutes = [
  Login,
  {
    name: 'root',
    path: '/',
    redirect: 'homepage',
    component: DefaultLayout,
    children: [Homepage],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
