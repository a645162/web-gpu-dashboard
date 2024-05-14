<template>
  <div
      class="gpu-component"
      v-show="(testFilterResult)"
  >

    <!--    <button @click="fetchGPUUsage">Get GPU Usage</button>-->
    <!--    <button @click="fetchGPUTasks">Get GPU Tasks</button>-->

    <div v-if="gpuUsageData === null">

      <el-card class="gpu-component-get-error">
        <div style="text-align: center">
          <h3 class="error-text">GPU {{ gpuIndex }} 信息获取失败！</h3>
          <h4 class="error-text">请联系管理员！</h4>
        </div>
      </el-card>

    </div>

    <div v-if="gpuUsageData">

      <!--GPU使用情况-->
      <div class="gpu-component-task">
        <GpuUsageCard
            :gpu-index="gpuIndex"
            :gpu-name="gpuUsageData.gpuName"
            :task-count="gpuTaskCount"

            :core-usage="gpuUsageData.coreUsage.valueOf()"
            :memory-usage="gpuUsageData.memoryUsage.valueOf()"

            :gpu-power-usage="gpuUsageData.gpuPowerUsage.valueOf()"
            :gpu-t-d-p="gpuUsageData.gpuTDP.valueOf()"
            :gpu-temperature="gpuUsageData.gpuTemperature.valueOf()"

            :gpu-memory-total-m-b="gpuUsageData.gpuMemoryTotalMB.valueOf()"
        />
      </div>

      <!--GPU推荐剩余显存-->
      <div class="gpu-recommend-memory">
        <GpuRecommendMemoryCard
            :total_gpu_memory_mb="gpuUsageData.gpuMemoryTotalMB.valueOf()"
            :gpu_task_info_items="gpuTaskInfoItems"
        />
      </div>

      <!--GPU任务-->
      <div
          class="gpu-component-task"
          v-show="gpuTaskCount > 0"
          style="margin-top: 2px"
      >
        <GpuTasksList
            :gpu-name="gpuUsageData.gpuName"
            :gpu_task_info_items="gpuTaskInfoItems"
        />
      </div>

    </div>

  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted, onUnmounted, ref, computed, watch} from 'vue';
import axios from 'axios';

import GpuUsageCard from "./GpuUsageCard.vue";
import {GpuTaskInfoItemType, updateAllTaskInfo} from "../../../ts/api/GpuTaskInfoItemType.ts";
import {GPUUsage} from "../../../ts/api/TypeGpuUsage.ts";
import GpuTasksList from "./GpuTasksList.vue";
import {useStoreSettings} from "../../../stores/storeSettings.ts";
import GpuRecommendMemoryCard from "./GpuRecommendMemoryCard.vue";

export default defineComponent({
  name: 'GpuComponent',
  components: {GpuRecommendMemoryCard, GpuTasksList, GpuUsageCard},
  props: {
    url: {
      type: String,
      require: true
    },
    gpuIndex: {
      type: Number,
      required: true
    },
    time_interval: {
      type: Number,
      default: 2000, // 默认2秒刷新一次
    },
  },
  setup(props, {emit}) {
    const storeSettings = useStoreSettings();

    const filterUserName = computed(() => {
      return storeSettings.filterUserName;
    });
    const filterProjectName = computed(() => {
      return storeSettings.filterProjectName;
    });

    // 使用 ref 初始化为 null，以确保它是响应式的
    const gpuUsageData = ref<GPUUsage | null>(null);

    const fetchGPUUsage = async () => {
      try {
        const response =
            await axios.get(
                `${props.url}/get_gpu_usage?gpu_index=${props.gpuIndex}`
            );
        gpuUsageData.value = response.data as GPUUsage;
        // console.log(gpuUsageData.value);
      } catch (error) {
        gpuUsageData.value = null;
        // console.error('Error fetching GPU usage:', error);
      }
    };

    const gpuTaskInfoItems = ref<GpuTaskInfoItemType[]>([]);
    const gpuTaskCount = computed(() => gpuTaskInfoItems.value.length);

    const fetchGPUTasks = async () => {
      try {
        const response =
            await axios.get(
                `${props.url}/get_gpu_task?gpu_index=${props.gpuIndex}`
            );

        // 预处理获取到的信息
        updateAllTaskInfo(response.data.taskList);

        gpuTaskInfoItems.value = response.data.taskList;
      } catch (error) {
        // console.error('Error fetching GPU tasks:', error);
      }
    };

    const updateGPUInfo = async () => {
      await fetchGPUUsage();
      await fetchGPUTasks();
    };

    // 自动更新数据
    let intervalId: number | null = null;
    onMounted(() => {
      // 首次加载时立即获取数据
      updateGPUInfo();

      // 设置定时器定期获取数据
      intervalId = setInterval(updateGPUInfo, props.time_interval) as unknown as number;
    });

    onUnmounted(() => {
      if (intervalId) {
        // 组件卸载时清除定时器
        clearInterval(intervalId);
      }
    });


    const testFilterUserNameForGpuComponent = computed(
        () => {
          if (filterUserName.value.trim() === "") {
            return true;
          }

          let includeUser = false;

          for (let i = 0; i < gpuTaskInfoItems.value.length; i++) {
            const gpuTaskInfoItem = gpuTaskInfoItems.value[i];
            if (filterUserName.value.trim() === gpuTaskInfoItem.name.trim()) {
              includeUser = true;
              break;
            }
          }

          return includeUser;
        }
    );
    const testFilterProjectNameForGpuComponent = computed(
        () => {
          if (filterProjectName.value === "") {
            return true;
          }

          let includeProject = false;

          for (let i = 0; i < gpuTaskInfoItems.value.length; i++) {
            const gpuTaskInfoItem = gpuTaskInfoItems.value[i];
            if (gpuTaskInfoItem.mainName.includes(filterProjectName.value)) {
              includeProject = true;
              break;
            }
          }

          return includeProject;
        }
    );

    const testFilterResult = computed(() => {
      return (
          testFilterUserNameForGpuComponent.value &&
          testFilterProjectNameForGpuComponent.value
      )
    });

    watch(testFilterResult, () => {
      emit('filterResultChanged', props.gpuIndex, testFilterResult.value);
    });
    // 页面刷新时先把初始状态发送过去
    emit('filterResultChanged', props.gpuIndex, testFilterResult.value);

    return {
      gpuUsageData,
      fetchGPUUsage,

      gpuTaskCount,
      gpuTaskInfoItems,
      fetchGPUTasks,

      testFilterResult,
    };
  },
})
</script>

<style scoped>

.gpu-component {
  width: 100%;
}

.gpu-component-get-error {
  width: 100%;
  background-color: #E8F5E9;
  border-radius: 8px;
}

.error-text {
  color: #D50000;
}

</style>
