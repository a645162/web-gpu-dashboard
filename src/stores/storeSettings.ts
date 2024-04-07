import {ref, type Ref} from 'vue';
import {defineStore} from 'pinia';
// Default Value
import {
    Default_MachineIndex
} from "../default/default_value.ts";

export const useStoreSettings = defineStore('storeSettings', () => {
    const DebugMode: Ref<boolean> = ref(false);
    const DefaultMachineIndex: Ref<number> = ref(Default_MachineIndex);

    const settingsAutoOpenSettingMenu: Ref<boolean> = ref(false);

    const filterUserName = ref("")
    const filterProjectName = ref("")

    return {
        DebugMode,
        DefaultMachineIndex,

        filterUserName,
        filterProjectName,

        settingsAutoOpenSettingMenu,
    };
});
