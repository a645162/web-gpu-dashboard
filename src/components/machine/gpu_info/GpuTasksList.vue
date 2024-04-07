<template>
  <el-card class="gpu-info-list-card">
    <div class="gpu-info-list">

      <!--      <div class="gpu-info-list-title">-->
      <!--        {{ gpu_name }} {{ taskCount }}个任务:-->
      <!--      </div>-->

      <ul>
        <li v-for="(item, index) in gpu_task_info_items" :key="index">

          <GpuTasksListItem :gpu_task_info="item" :index="index"/>

        </li>

      </ul>

    </div>
  </el-card>
</template>

<script lang="ts">

import {computed, defineComponent, PropType} from 'vue';
import {GpuTaskInfoItemType} from '../../../ts/api/GpuTaskInfoItemType.ts';
import GpuTasksListItem from "./GpuTasksListItem.vue";

export default defineComponent({
  name: 'GpuTasksList',
  components: {GpuTasksListItem},
  props: {
    gpu_name: {
      type: String,
      default: "",
    },
    gpu_task_info_items: {
      type: Array as PropType<GpuTaskInfoItemType[]>,
      required: true,
    },
  },
  setup(props) {
    const taskCount = computed(() => {
      return props.gpu_task_info_items.length;
    });


    return {
      taskCount,

      task_items: props.gpu_task_info_items,
    };
  },
});

</script>

<style scoped>

.gpu-info-list-card {
  width: 100%;
}

.gpu-info-list {
  list-style: none;
}

.gpu-info-list ul {
  margin: 0;
}

.gpu-info-list li {
  margin-left: -40px; /* 减去默认的左边距 */
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1px;
}

</style>
