<template>

  <el-switch
      v-model="nightMode"
      @click="toggleDarkMode"
      :active-action-icon="Moon"
      :inactive-action-icon="Sunny"
  />

</template>

<script setup lang="ts">

import {inject, onMounted, onUnmounted, Ref} from "vue";
import {getSystemTheme, setDarkMode} from "../../ts/ui/DarkMode.ts";
import {Moon, Sunny} from "@element-plus/icons-vue";

// const nightMode = ref(false)
// provide('nightMode', nightMode);
const nightMode = inject('nightMode') as Ref<boolean>;

const toggleDarkMode = () => {
  setDarkMode(nightMode.value);
}

const fitSystemTheme = () => {
  nightMode.value = getSystemTheme();
  setDarkMode(nightMode.value);
};

onMounted(() => {
  fitSystemTheme();
  window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', fitSystemTheme);
});

onUnmounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', fitSystemTheme);
});

</script>

<style scoped>

</style>
