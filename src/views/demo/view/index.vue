<template>
  <div class="container">
    <Breadcrumb :items="['menu.test', 'menu.test.demo']"/>
    <div class="layout">
      <a-row>
        <a-col :span="24">
          <a-card
              style="width: 80vw; height: 70vh; padding: 15px 0"
              class="general-card"
              :bordered="false"
          >
            <a-button status="success" @click="clickTest">成功按钮</a-button>
            <a-button status="success" @click="userInfo">getUserInfo</a-button>
            <div>
              <json-viewer :value="state.tree" copyable boxed sort expand/>
            </div>
            <div>
              {{ state.tree }}
            </div>
          </a-card>

        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {hello, Hello} from '@/api/test';
import {getUserInfo} from '@/api/user';
import {reactive} from "vue";

const state = reactive({
  tree: []
});

const clickTest = async () => {
  const res = await hello();
};

const userInfo = () => {
  getUserInfo().then(res => {
    console.log("res.data: ", res.data)
    const {menus}: any = res.data

    const accessRoutes: any = []
    // find roots
    for (let i = 0; i < menus.length; i += 1) {
      if (menus[i].parentId === 0) {
        const child: any = {}
        child.id = menus[i].id
        child.name = menus[i].componentName
        child.path = menus[i].path
        child.component = `() => Promise.resolve(require('@/views/${menus[i].path}/index.vue'))`
        child.meta = {
          locale: menus[i].localeKey === '' ? undefined : menus[i].localeKey,
          icon: menus[i].icon === '' ? undefined : menus[i].icon
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
        const child: any = {}
        child.id = accessRoutes[i].id
        child.name = accessRoutes[i].componentName
        child.path = accessRoutes[i].path
        child.component = `() => Promise.resolve(require('@/views/${child.path}/index.vue'))`
        child.meta = {
          locale: accessRoutes[i].localeKey === '' ? undefined : accessRoutes[i].localeKey,
          icon: accessRoutes[i].icon === '' ? undefined : accessRoutes[i].icon
        }
        children.push(child)
        accessRoutes[i].children = children
      } else {
        accessRoutes[i].children = recurRoutes(accessRoutes[i].id, accessRoutes[i].path, menus)
      }
    }
    state.tree = accessRoutes
    console.log("accessRoutes: ", accessRoutes)
  })

}

function recurRoutes(parentId, parentPath, flatMenus) {
  const children: any = []
  flatMenus.forEach(each => {
    if (parentId === each.parentId) {
      const child: any = {}
      child.id = each.id
      child.name = each.componentName
      child.fullPath = `${parentPath}/${each.path}`
      child.path = each.path
      child.component = `() => Promise.resolve(require(@/views/${child.fullPath}/index.vue'))`
      child.meta = {
        locale: each.localeKey === '' ? undefined : each.localeKey,
        icon: each.icon === '' ? undefined : each.icon
      }
      child.children = recurRoutes(each.id, child.fullPath, flatMenus)
      children.push(child)
    }
  })
  return children.length === 0 ? undefined : children
}
</script>

<script lang="ts">
export default {
  name: 'Demo' // If you want the include property of keep-alive to take effect, you must name the component
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 15px;
  background-color: var(--color-fill-2);
  //padding-bottom: 0;
  //display: flex;
}

.left-side {
  flex: 1;
  overflow: auto;
}

.right-side {
  width: 280px;
  margin-left: 16px;
}

.panel {
  overflow: auto;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.panel-border) {
  margin-bottom: 0;
  border-bottom: 1px solid rgb(var(--gray-2));
}

.moduler-wrap {
  background-color: var(--color-bg-2);
  border-radius: 4px;

  :deep(.text) {
    color: rgb(var(--gray-8));
    font-size: 12px;
    text-align: center;
  }

  :deep(.wrapper) {
    margin-bottom: 8px;
    text-align: center;
    cursor: pointer;

    &:last-child {
      .text {
        margin-bottom: 0;
      }
    }

    &:hover {
      .icon {
        color: rgb(var(--arcoblue-6));
        background-color: #e8f3ff;
      }

      .text {
        color: rgb(var(--arcoblue-6));
      }
    }
  }

  :deep(.icon) {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    color: rgb(var(--dark-gray-1));
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    background-color: rgb(var(--gray-1));
    border-radius: 4px;
  }
}

.layout {
  display: flex;

  &-left-side {
    flex-basis: 300px;
  }

  &-content {
    flex: 1;
    padding: 0 16px;
  }

  &-right-side {
    flex-basis: 280px;
  }
}

@media (max-width: @screen-lg) {
  .layout {
    flex-wrap: wrap;

    &-left-side {
      flex: 1;
      flex-basis: 100%;
      margin-bottom: 16px;
    }

    &-content {
      flex: none;
      flex-basis: 100%;
      order: -1;
      margin-bottom: 16px;
      padding: 0;
    }

    &-right-side {
      flex-basis: 100%;
    }
  }
}
</style>
