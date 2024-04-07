<script setup lang="ts">

import {computed} from "vue";
import {convertFromMBToGB, getMemoryString} from "../../../ts/type/MemorySize.ts";

const props = defineProps({
  physicalMemoryTotal: {
    type: Number,
    required: true
  },
  physicalMemoryUsed: {
    type: Number,
    required: true
  },

  swapMemoryTotal: {
    type: Number,
    required: true
  },
  swapMemoryUsed: {
    type: Number,
    required: true
  },
});

const physicalMemoryFree = computed(() => {
  return props.physicalMemoryTotal - props.physicalMemoryUsed;
});
const physicalMemoryTotalString = computed(() => {
  return getMemoryString(convertFromMBToGB(props.physicalMemoryTotal));
});
const physicalMemoryUsedString = computed(() => {
  return getMemoryString(convertFromMBToGB(props.physicalMemoryUsed));
});
const physicalMemoryFreeString = computed(() => {
  return getMemoryString(convertFromMBToGB(physicalMemoryFree.value));
});
const physicalMemoryPercentage = computed(() => {
  return props.physicalMemoryUsed / props.physicalMemoryTotal;
});
const physicalMemoryPercentageString = computed(() => {
  return getMemoryString(physicalMemoryPercentage.value * 100);
});

const swapMemoryFree = computed(() => {
  return props.swapMemoryTotal - props.swapMemoryUsed;
});
const swapMemoryTotalString = computed(() => {
  return getMemoryString(convertFromMBToGB(props.swapMemoryTotal));
});
const swapMemoryUsedString = computed(() => {
  return getMemoryString(convertFromMBToGB(props.swapMemoryUsed));
});
const swapMemoryFreeString = computed(() => {
  return getMemoryString(convertFromMBToGB(swapMemoryFree.value));
});
const swapMemoryPercentage = computed(() => {
  return props.swapMemoryUsed / props.swapMemoryTotal;
});
const swapMemoryPercentageString = computed(() => {
  return getMemoryString(swapMemoryPercentage.value * 100);
});

const physicalMemoryProgressColor = computed(() => {
  const currentProgress = physicalMemoryPercentage.value * 100;
  if (currentProgress < 30) return '#5cb87a';
  if (currentProgress < 70) return '#e6a23c';
  return '#f56c6c';
});

const swapMemoryProgressColor = computed(() => {
  const currentProgress = swapMemoryPercentage.value * 100;
  if (currentProgress < 30) return '#5cb87a';
  if (currentProgress < 70) return '#e6a23c';
  return '#f56c6c';
});

</script>

<template>

  <div class="system-info-memory-content">
    <el-card class="system-memory-card">

      <div class="system-memory-card-content">

        <div class="system-memory-card-progress">
          <el-tooltip
              class="system-memory-card-progress-tip"
              effect="dark"
              placement="bottom"
          >
            <template #content>
              <p>物理内存</p>
              <p>{{ physicalMemoryUsedString }}/{{ physicalMemoryTotalString }} GB</p>
              <p>可用: {{ physicalMemoryFreeString }} GB</p>
            </template>
            <el-progress
                class="system-memory-progress"
                type="dashboard"
                :percentage="physicalMemoryPercentage * 100"
                :color="physicalMemoryProgressColor"
            >
              <p>物理内存</p>
              <p>{{ physicalMemoryPercentageString }}%</p>
            </el-progress>
          </el-tooltip>

          <el-tooltip
              class="system-memory-card-progress-tip"
              effect="dark"
              placement="bottom"
          >
            <template #content>
              <p>虚拟内存(交换内存)</p>
              <p>{{ swapMemoryUsedString }}/{{ swapMemoryTotalString }} GB</p>
              <p>可用: {{ swapMemoryFreeString }} GB</p>
            </template>
            <el-progress
                class="system-memory-progress"
                type="dashboard"
                :percentage="swapMemoryPercentage * 100"
                :color="swapMemoryProgressColor"
            >
              <p>虚拟内存</p>
              <p>{{ swapMemoryPercentageString }}%</p>
            </el-progress>
          </el-tooltip>
        </div>

        <div
            class="system-memory-card-text"
            v-show="false"
        >
          <p>物理内存: {{ physicalMemoryUsed }} / {{ physicalMemoryTotal }} MB</p>
          <p>虚拟内存: {{ swapMemoryUsed }} / {{ swapMemoryTotal }} MB</p>
        </div>

      </div>

    </el-card>
  </div>

</template>

<style scoped>

.system-info-memory-content {
  width: 100%;
}

.system-memory-card-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.system-memory-card-progress {
  margin: 10px;
}

.system-memory-card-text {
  margin: 10px;
  text-align: left;
}

.system-memory-progress {
  margin: 5px;
  user-select: none;
}

</style>
