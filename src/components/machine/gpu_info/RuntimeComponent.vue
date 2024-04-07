<template>
  <div class="component-run-time">
    {{ runtime }}
  </div>
</template>

<script lang="ts" setup>

import {computed, onMounted, onUnmounted, ref} from 'vue';
import {padTime} from '../../../ts/type/DateTimeUtils.ts';

const props = defineProps({
  startTime: {
    type: Number,
    required: true
  }
});

let intervalId: number | null = null;
const currentTime = ref(Date.now());

// 计算运行时间的函数
const calculateRuntime = () => {
  return currentTime.value - props.startTime;
};

// 计算属性，用于显示运行时间
const runtime = computed(() => {
  const runtimeInSeconds = calculateRuntime() / 1000;

  const hours = Math.floor(runtimeInSeconds / 3600);
  const minutes = Math.floor((runtimeInSeconds % 3600) / 60);
  const seconds = Math.floor(runtimeInSeconds % 60);

  const days = Math.floor(hours / 24);
  const hoursInDay = hours % 24;

  if (days > 0) {
    return `${days}天${padTime(hoursInDay)}时${padTime(minutes)}分`
  } else {
    if (hours === 0) {
      return `${padTime(minutes)}分${padTime(seconds)}秒`
    }
    const part_1 = padTime(hours);
    const part_2 = padTime(minutes);
    const part_3 = padTime(seconds);

    return `${part_1}时${part_2}分${part_3}秒`;
  }
});

// 组件挂载时启动定时器
onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});
</script>
