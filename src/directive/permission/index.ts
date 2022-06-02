import {DirectiveBinding} from 'vue';
import {useUserStore} from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
    const reqPermissionKeys = binding.value;
    if (!Array.isArray(reqPermissionKeys)) {
        throw new Error(`need permission! Like v-permission="['user:profile:query']"`);
    }

    const userStore = useUserStore();
    const permissionKeys :Set<string> = userStore.permissionKeys || new Set;

    for (let i = 0; i < reqPermissionKeys.length; i += 1) {
        if (!permissionKeys.has(reqPermissionKeys[i]) && el.parentNode) {
            el.parentNode.removeChild(el);
            break;
        }
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding);
    },
};
