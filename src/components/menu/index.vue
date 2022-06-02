<script lang="tsx">
  import { defineComponent, ref, h, compile, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter, RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
  import { useAppStore } from '@/store';
  // import usePermission from '@/hooks/permission';
  import { listenerRouteChange } from '@/utils/route-listener';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t } = useI18n();
      const appStore = useAppStore();
      // const permission = usePermission();
      const router = useRouter();
      const collapsed = computed({
        get() {
          if (appStore.device === 'desktop') return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        },
      });
      const appRoute = computed(() => {
        return router
          .getRoutes()
          .find((el) => el.name === 'root') as RouteRecordNormalized;
      });
      const menuTree = computed(() => {
        const copyRouter = JSON.parse(JSON.stringify(appRoute.value.children));
        copyRouter.sort(
          (a: RouteRecordNormalized, b: RouteRecordNormalized) => {
            return (a.meta.order || 0) - (b.meta.order || 0);
          }
        );
        function travel(_routes: RouteRecordRaw[], layer: number) {
          if (!_routes) return null;
          const collector: any = _routes.map((element) => {
            // no access
            // if (!permission.accessRouter(element)) {
            //   return null;
            // }

            // leaf node
            if (!element.children) {
              return element;
            }

            // route filter hideInMenu true
            element.children = element.children.filter(
              (x) => x.meta?.hideInMenu !== true
            );

            // Associated child node
            const subItem = travel(element.children, layer);
            if (subItem.length) {
              element.children = subItem;
              return element;
            }
            // the else logic
            if (layer > 1) {
              element.children = subItem;
              return element;
            }

            if (element.meta?.hideInMenu === false) {
              return element;
            }

            return null;
          });
          return collector.filter(Boolean);
        }
        return travel(copyRouter, 0);
      });

      // In this case only two levels of menus are available
      // You can expand as needed

      const selectedKey = ref<string[]>([]);
      const goto = (item: RouteRecordRaw) => {
        router.push({
          name: item.name,
        });
      };
      listenerRouteChange((newRoute) => {
        if (!newRoute.meta.hideInMenu) {
          // 获取点击节点的componentName
          const lastLevel = newRoute.matched?.length - 1
          const key = newRoute.matched[lastLevel]?.name as string;
          selectedKey.value = [key];
        }
      }, true);
      const setCollapse = (val: boolean) => {
        if (appStore.device === 'desktop')
          appStore.updateSettings({ menuCollapse: val });
      };

      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // This is view, modify nodes as needed
              const icon = element?.meta?.icon  ? `<${element?.meta?.icon}/>` : ``;
              if (element.children === undefined) {
                const menuItem = (
                    <a-menu-item
                        key={element?.name}
                        onClick={() => goto(element)}
                        v-slots={{
                          icon: () => h(compile(icon))
                        }}
                    >
                      {t(element?.meta?.locale || '')}
                    </a-menu-item>
                );
                nodes.push(menuItem as never);
              } else {
                const subMenu = (
                    <a-sub-menu
                        key={element?.name}
                        v-slots={{
                          icon: () => h(compile(icon)),
                          title: () => h(compile(t(element?.meta?.locale || ''))),
                        }}
                    >
                      {element?.children?.map((elem) => {
                        return (
                            <a-menu-item key={elem.name} onClick={() => goto(elem)}>
                              {t(elem?.meta?.locale || '')}
                              {travel(elem.children ?? [])}
                            </a-menu-item>
                        );
                      })}
                    </a-sub-menu>
                );
                nodes.push(subMenu as never);
              }
            });
          }
          return nodes;
        }
        return travel(menuTree.value);
      };
      return () => (
        <a-menu
          v-model:collapsed={collapsed.value}
          show-collapse-button={appStore.device !== 'mobile'}
          auto-open={false}
          selected-keys={selectedKey.value}
          auto-open-selected={true}
          level-indent={34}
          style="height: 100%"
          onCollapse={setCollapse}
        >
          {renderSubMenu()}
        </a-menu>
      );
    },
  });
</script>

<style lang="less" scoped>
  :deep(.arco-menu-inner) {
    .arco-menu-inline-header {
      display: flex;
      align-items: center;
    }
    .arco-icon {
      &:not(.arco-icon-down) {
        font-size: 18px;
      }
    }
  }
</style>
