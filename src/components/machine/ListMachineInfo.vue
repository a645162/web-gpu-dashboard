<script setup lang="ts">

import {PropType, watch} from "vue";
import {MachineListItem} from "../../ts/type/MachineListItem.ts";
import MachineInfoComponent from "./MachineInfoComponent.vue";

const props = defineProps({
  machineList: {
    type: Array as PropType<MachineListItem[]>,
    required: true,
  },
});

// console.log("ListMachineInfo.vue: props.machineList: ", props.machineList);

const setDocumentTitleByMachineList = (machineList: MachineListItem[]) => {
  if (machineList.length > 0) {

    if (machineList.length == 1) {
      document.title = machineList[0].machineName + " - GPU看板"
    } else {
      document.title = "GPU看板"
    }
  }
}

setDocumentTitleByMachineList(props.machineList);

watch(() => props.machineList, (newVal, _) => {
  setDocumentTitleByMachineList(newVal);
});

</script>

<template>

  <div class="div-container-machine-list">

    <div
        class="div-container-machine-list-content"
        v-for="(machine_item,index) in props.machineList"
        :key="index"
    >

      <MachineInfoComponent
          :machine-name="machine_item.machineName"
          :machine-url="machine_item.machineUrl"
      />

    </div>

  </div>

</template>

<style scoped>

.div-container-machine-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.div-container-machine-list-content {
  flex: 1;
  margin: 10px;
}

</style>
