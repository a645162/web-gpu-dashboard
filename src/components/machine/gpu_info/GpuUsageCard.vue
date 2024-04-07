<template>
  <el-card class="gpu-card" :style="cardStyle">
    <div class="gpu-card-content">

      <el-card
          class="gpu-info-index"
          :style="{ borderColor: borderColor }"
      >
        {{ gpuIndex }}
      </el-card>

      <div class="gpu-card-left">

        <div class="gpu-card-first">

          <div class="gpuInfoName">
            <el-tooltip :content="powerString" placement="top">
              <div
                  style="margin-right: 5px"
              >
                {{ gpuName }}
              </div>
            </el-tooltip>
          </div>

        </div>

        <div class="gpu-card-second">

          <div></div>

          <div
              class="gpu-info-memory-detail"
              v-show="gpuMemoryUsageFormatted"
          >
            {{ gpuMemoryUsageFormatted }}/{{ gpuMemoryTotalFormatted }}GiB
          </div>

        </div>

      </div>

      <el-divider direction="vertical"/>

      <div class="gpu-card-right">

        <el-tooltip
            class="gpu-usage-card-progress-tip"
            effect="dark"
            placement="top"
        >
          <template #content>
            <p>显存利用率:{{ memoryUsage }}%</p>
            <p>{{ gpuMemoryUsageFormatted }}/{{ gpuMemoryTotalFormatted }}GiB</p>
            <p>空闲显存:{{ gpuMemoryFreeFormatted }}GiB</p>
          </template>
          <div class="CoreAndMemoryUsage">
            显存
            <el-progress
                class="gpuInfoProgressBar"
                :percentage=Number(memoryUsage)
                :text-inside="true"
                :stroke-width="20"
                :color="memoryColor"
            >
            </el-progress>
          </div>
        </el-tooltip>

        <el-tooltip
            class="gpu-usage-card-progress-tip"
            effect="dark"
            placement="bottom"
        >
          <template #content>
            核心利用率(GPU的使用率):{{ coreUsage }}%
          </template>
          <div class="CoreAndMemoryUsage">
            核心
            <el-progress
                class="gpuInfoProgressBar"
                :percentage=Number(coreUsage)
                :text-inside="true"
                :stroke-width="20"
                :color="coreColor"
            >
            </el-progress>

          </div>
        </el-tooltip>

      </div>


    </div>
  </el-card>
</template>

<script lang="ts">

import {defineComponent, computed, inject, Ref} from 'vue';
import {ElCard, ElProgress} from 'element-plus';
import {convertFromMBToGB, getMemoryString} from '../../../ts/type/MemorySize.ts';

export default defineComponent({
  name: 'GpuUsageCard',
  props: {
    gpuIndex: {
      type: Number,
      required: true
    },
    gpuName: {
      type: String,
      required: true,
    },

    taskCount: {
      type: Number,
      default: "0",
    },

    coreUsage: {
      type: Number,
      required: true,
    },
    memoryUsage: {
      type: Number,
      required: true,
    },

    gpuMemoryTotalMB: {
      type: Number,
      required: true,
    },

    gpuPowerUsage: {
      type: Number,
      default: "",
    },
    gpuTDP: {
      type: Number,
      default: "",
    },
    gpuTemperature: {
      type: Number,
      default: "",
    },

    cardWidth: {
      type: String,
      default: '100%',
    },
  },
  components: {
    ElCard,
    ElProgress,
  },
  setup(props) {

    const nightMode = inject('nightMode') as Ref<boolean>;
    const borderColor = computed(() => {
      return nightMode.value ? 'white' : 'black';
    });

    const gpuMemoryTotalGiB = computed(() => {
      return convertFromMBToGB(props.gpuMemoryTotalMB);
    });
    const gpuMemoryUsage = computed(() => {
      return gpuMemoryTotalGiB.value * (props.memoryUsage / 100);
    });
    const gpuMemoryFree = computed(() => {
      return gpuMemoryTotalGiB.value - gpuMemoryUsage.value;
    });

    const gpuMemoryTotalFormatted = computed(() => {
      return getMemoryString(gpuMemoryTotalGiB.value);
    });
    const gpuMemoryUsageFormatted = computed(() => {
      return getMemoryString(gpuMemoryUsage.value);
    });
    const gpuMemoryFreeFormatted = computed(() => {
      return getMemoryString(gpuMemoryFree.value);
    });

    // 任务数量提示颜色
    // const gpuTaskCountColor = computed(() => {
    //   if (Number(props.taskCount) == 0) return '#67C23A'; // 绿色
    //   if (Number(props.taskCount) == 1) return '#E6A23C'; // 黄色
    //   return '#F56C6C'; // 红色
    // });

    // ["primary", "success", "warning", "info", "danger"]
    // GPU温度提示颜色
    const gpuTemperatureType = computed(() => {
      if (Number(props.gpuTemperature) < 50) return 'primary'; // 蓝色
      if (Number(props.gpuTemperature) < 65) return 'warning'; // 黄色
      return 'danger'; // 红色
    });

    // 核心使用率
    const coreColor = computed(() => {
      if (Number(props.coreUsage) < 50) return '#67C23A'; // 绿色
      if (Number(props.coreUsage) < 80) return '#E6A23C'; // 黄色
      return '#F56C6C'; // 红色
    });

    // 显存使用率
    const memoryColor = computed(() => {
      if (Number(props.memoryUsage) < 50) return '#67C23A'; // 绿色
      if (Number(props.memoryUsage) < 80) return '#E6A23C'; // 黄色
      return '#F56C6C'; // 红色
    });

    const powerString = computed(() => {
      return `${props.gpuPowerUsage}W / ${props.gpuTDP}W(${props.gpuTemperature}℃)`;
    });

    const cardStyle = computed(() => ({
      width: props.cardWidth,
      borderRadius: '8px',
    }));

    return {
      borderColor,
      gpuMemoryTotalFormatted,
      gpuMemoryUsageFormatted,
      gpuMemoryFreeFormatted,
      gpuTemperatureType,
      cardStyle,
      coreColor,
      memoryColor,
      powerString,
    };
  },
});
</script>

<style scoped>

.gpu-card {
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1;
}

.gpu-card-content {
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.gpu-card-first {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.gpu-card-second {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.gpu-card-right {
  flex: 1;
}

.gpu-info-index {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border-width: 2px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  margin-right: 5px;
}

.gpuInfoName {
  width: auto;
}

.gpu-info-memory-detail {
  font-size: small;
}

.CoreAndMemoryUsage {
  display: flex;
  width: 100%;
  user-select: none;
}

.gpuInfoProgressBar {
  flex-grow: 1;
  margin-left: 5px;
  user-select: none;
}

</style>
