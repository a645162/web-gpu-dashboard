import type {StateTree, Store} from "pinia";
import {watch} from "vue";

export function restoreStateFromLocalStorage(store: Store) {
    const savedState = localStorage.getItem(store.$id);
    if (savedState) {
        try {
            const currentStateKeyValue: [key: string] =
                JSON.parse(
                    JSON.stringify(store.$state) as string
                ) as [key: string];
            const savedJsonResult: [key: string] =
                JSON.parse(savedState) as [key: string];

            if (currentStateKeyValue.length !== savedJsonResult.length) {
                console.error("restoreStateFromLocalStorage: Error in length")
                return;
            }

            const key1 = Object.keys(currentStateKeyValue);
            const key2 = Object.keys(savedJsonResult);

            const keysAreEqual = (
                key1.length === key2.length &&
                key1.every(key => key2.includes(key))
            );

            if (!keysAreEqual) {
                console.error("restoreStateFromLocalStorage: Error in keys")
                saveStateToLocalStorage(store);
                return;
            }

            console.log("currentStateKeyValue", currentStateKeyValue)
            console.log("savedJsonResult", savedJsonResult)

            store.$state = JSON.parse(savedState) as StateTree;
            console.log("Restored state from local storage.")
        } catch (e) {
            console.error(e);
        }
    }
}

export function saveStateToLocalStorage(store: Store) {
    localStorage.setItem(store.$id, JSON.stringify(store.$state));
}

export function autoPersistedStateSettings(store: Store) {
    // 从本地存储恢复状态
    restoreStateFromLocalStorage(store);

    // 订阅 store 的变化并保存到本地存储
    watch(
        () => store.$state,
        () => {
            saveStateToLocalStorage(store);
        },
        {deep: true}
    );
}
