// import { getToken } from '@/utils/auth'
// import { getMenuByRoleId, getApiByRoleId, getAllMenu, getAllApi } from '@/api/permission'
//

//

//
// const state = {
//     routes: [],
//     addRoutes: [],
//     token: getToken(),
//     menuTree: [],
//     apis: []
// }
//
// const mutations = {
//     SET_ROUTES: (state, routes) => {
//         state.addRoutes = routes
//         state.routes = constantRoutes.concat(routes)
//     },
//     SET_MENU_TREE: (state, menuTree) => {
//         state.menuTree = menuTree
//     },
//     SET_APIS: (state, apis) => {
//         state.apis = apis
//     }
// }
//
// const actions = {
//     getAllMenu({ commit }) {
//         return new Promise((resolve, reject) => {
//             getAllMenu().then(res => {
//                 const flatMenus = res.data
//                 // 存放所有菜单
//                 const menuTree = []
//                 for (let i = 0; i < flatMenus.length; i++) {
//                     if (flatMenus[i].pid === 0) {
//                         const child = {}
//                         child.id = flatMenus[i].id
//                         child.label = flatMenus[i].title
//                         menuTree.push(child)
//                         flatMenus.splice(i, 1)
//                         i -= 1
//                     }
//                 }
//                 // console.log('flatMenus: ', flatMenus)
//                 for (let i = 0; i < menuTree.length; i++) {
//                     menuTree[i].children = asyncMenus(menuTree[i].id, flatMenus)
//                 }
//
//                 resolve(menuTree)
//             }).catch(err => {
//                 reject(err)
//             })
//         })
//     },
//     getAllMenuDisableParent({ commit }) {
//         return new Promise((resolve, reject) => {
//             getAllMenu().then(res => {
//                 const flatMenus = res.data
//                 // console.log('flatMenus ', flatMenus)
//                 // 存放所有菜单
//                 const menuTree = []
//                 for (let i = 0; i < flatMenus.length; i++) {
//                     if (flatMenus[i].pid === 0) {
//                         const child = {}
//                         child.id = flatMenus[i].id
//                         child.label = flatMenus[i].title
//                         menuTree.push(child)
//                         flatMenus.splice(i, 1)
//                         i -= 1
//                     }
//                 }
//                 // console.log('menuTree: ', menuTree)
//                 for (let i = 0; i < menuTree.length; i++) {
//                     menuTree[i].children = asyncMenus(menuTree[i].id, flatMenus)
//                     if (menuTree[i].children.length > 0) {
//                         menuTree[i].disabled = true
//                     }
//                 }
//
//                 resolve(menuTree)
//             }).catch(err => {
//                 reject(err)
//             })
//         })
//     },
//     getMenuByRoleId({ commit }, roleId) {
//         return new Promise((resolve, reject) => {
//             getMenuByRoleId(roleId).then(res => {
//                 const { data } = res
//                 resolve(data)
//             }).catch(err => {
//                 reject(err)
//             })
//         })
//     },
//     getAllApi({ commit }) {
//         return new Promise((resolve, reject) => {
//             getAllApi().then(res => {
//                 const { data } = res
//                 // 存放所有后端接口权限
//                 resolve(data)
//             }).catch(err => {
//                 reject(err)
//             })
//         })
//     },
//     getApiByRoleId({ commit }, roleId) {
//         return new Promise((resolve, reject) => {
//             getApiByRoleId(roleId).then(res => {
//                 const { data } = res
//                 resolve(data)
//             }).catch(err => {
//                 reject(err)
//             })
//         })
//     },

// }
//
// export default {
//     namespaced: true,
//     state,
//     mutations,
//     actions
// }
