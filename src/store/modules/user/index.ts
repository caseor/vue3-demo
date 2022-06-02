import {defineStore} from 'pinia';
import {getUserInfo} from '@/api/user';

import {
    token as userLogin,
    invalidateToken as userLogout,
    LoginData,
} from '@/api/auth';
import {setToken, clearToken} from '@/utils/auth';
import {removeRouteListener} from '@/utils/route-listener';
import {UserState} from './types';

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        loginName: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phoneNumber: undefined,
        sex: undefined,
        birthday: undefined,
        createDt: undefined,
        roleKeys: [],
        menus: [],
        permissionKeys: undefined
    }),

    getters: {
        userInfo(state: UserState): UserState {
            return {...state};
        },
    },

    actions: {
        // Set user's information
        setInfo(partial: Partial<UserState>) {
            this.$patch(partial);
        },

        // Reset user's information
        resetInfo() {
            this.$reset();
        },

        // Get user's information
        async info() {
            const res = await getUserInfo();
            // console.log("userInfo: ", res)

            const userState = {
                loginName: res.data.user.loginName,
                firstName: res.data.user.firstName,
                lastName: res.data.user.lastName,
                email: res.data.user.email,
                phoneNumber: res.data.user.phoneNumber,
                sex: res.data.user.sex,
                birthday: res.data.user.birthday,
                createDt: res.data.user.createDt,
                roleKeys: res.data.roleKeys,
                menus: res.data.menus,
                permissionKeys: new Set(res.data.permissionKeys)
            }

            // console.log('userState: ', userState)
            this.setInfo(userState);
        },

        // Login
        async login(loginForm: LoginData) {
            // console.log("loginForm: ", loginForm)
            try {
                const res = await userLogin(loginForm);
                // console.log("res: ", res)
                setToken(res.data.token);
            } catch (err) {
                clearToken();
                throw err;
            }
        },

        // Logout
        async logout() {
            await userLogout();

            this.resetInfo();
            clearToken();
            removeRouteListener();
        },
    },
});

export default useUserStore;
