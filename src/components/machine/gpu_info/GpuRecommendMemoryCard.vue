<script lang="ts">

import {computed, defineComponent, PropType} from 'vue';
import {GpuTaskInfoItemType} from '../../../ts/api/GpuTaskInfoItemType.ts';
import GpuTasksListItem from "./GpuTasksListItem.vue";

export default defineComponent({
  name: 'GpuRecommendMemoryCard',
  components: {GpuTasksListItem},
  props: {
    current_gpu_memory_used_percent: {
      type: Number,
      required: false,
      default: -1,
    },
    total_gpu_memory_mb: {
      type: Number,
      required: true,
    },
    gpu_task_info_items: {
      type: Array as PropType<GpuTaskInfoItemType[]>,
      required: true,
    },
  },
  setup(props) {

    const current_used_memory_mb = computed(() => {
      if (props.current_gpu_memory_used_percent < 0) {
        return 0;
      }
      if (props.current_gpu_memory_used_percent > 100) {
        return props.total_gpu_memory_mb;
      }

      return props.total_gpu_memory_mb * (
          props.current_gpu_memory_used_percent / 100
      );
    });

    const usage_memory_mb = computed(() => {

      let usage_memory_mb = 0;
      for (let i = 0; i < props.gpu_task_info_items.length; i++) {
        var current_memory = props.gpu_task_info_items[i].gpuMemoryUsageMax;
        if (current_memory === undefined) {
          current_memory = props.gpu_task_info_items[i].gpuMemoryUsage;
        }
        usage_memory_mb += current_memory;
      }

      if (usage_memory_mb < current_used_memory_mb.value) {
        usage_memory_mb = current_used_memory_mb.value;
      }

      return usage_memory_mb;
    });

    const remain_memory_mb = computed(() => {
      return props.total_gpu_memory_mb - usage_memory_mb.value;
    });

    const remain_memory_human = computed(() => {
      if (remain_memory_mb.value < 1000) {
        return remain_memory_mb.value + "MB";
      } else {
        return (remain_memory_mb.value / 1024).toFixed(2) + "GB";
      }
    });

    return {
      remain_memory_mb,
      remain_memory_human,
    };
  },
});

</script>

<template>

  <el-card class="gpu-recommend-memory-card">
    <div class="gpu-recommend-memory-card-content">

      <div
          class="gpu-recommend-memory-remain"
          v-if="remain_memory_mb > 0"
      >
        建议可用显存:{{ remain_memory_human }}
      </div>

      <div
          class="gpu-recommend-memory-leak"
          v-else>
        GPU显存不足<span :style="{ color: 'red' }">不推荐</span>使用
      </div>

    </div>
  </el-card>

</template>

<style scoped>

</style>
