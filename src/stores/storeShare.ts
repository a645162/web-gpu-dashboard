import {defineStore} from "pinia";
import type {Ref} from "vue";
import {ref} from "vue";

import {getDeviceType} from "../ts/mobile/DeviceType.ts"

export const useStoreShare = defineStore('storeShare', () => {
    const DeviceType = getDeviceType();

    const MenuIsShow: Ref<boolean> = ref(false);

    function ToggleMenuAside() {
        MenuIsShow.value = !MenuIsShow.value;
    }

    const DrawerNavigationGpu: Ref<boolean> = ref(false);

    return {
        DeviceType,

        MenuIsShow,
        ToggleMenuAside,

        DrawerNavigationGpu,

    };
});
