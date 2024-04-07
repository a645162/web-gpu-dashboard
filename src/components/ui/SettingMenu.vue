<script setup lang="ts">

import DarkModeSwitch from "./DarkModeSwitch.vue";
import {useStoreSettings} from "../../stores/storeSettings.ts";
import {onMounted, onUnmounted, ref} from "vue";
import {useStoreShare} from "../../stores/storeShare.ts";

const storeShare = useStoreShare();
const storeSettings = useStoreSettings();

// 根据屏幕宽度调整抽屉的默认显示状态
const lastWindowInnerWidth = ref(window.innerWidth);
const handleResize = () => {
  const currentWidth = window.innerWidth;
  if (lastWindowInnerWidth.value !== currentWidth) {
    lastWindowInnerWidth.value = currentWidth;

    // 水平距离改变才操作
    if (currentWidth < 550) {
      storeShare.MenuIsShow = false;
    } else {
      if (storeSettings.settingsAutoOpenSettingMenu) {
        storeShare.MenuIsShow = true;
      }
    }

  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <el-aside
      class="app-aside"
      :width="storeShare.MenuIsShow ? '200px' : '0'"
  >

    <div style="margin-top: 16px"/>

    <p class="aside-title">
      设置
    </p>

    暗色模式:
    <DarkModeSwitch/>

    <div class="div-filter">

      用户名(完全匹配):
      <el-input
          v-model="storeSettings.filterUserName"
          placeholder="请输入用户名"
          clearable
          size="small"
          style="width: 100%"
      />

      项目名称关键词:
      <el-input
          v-model="storeSettings.filterProjectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          style="width: 100%"
      />

    </div>

    <div>

      自动打开设置菜单

      <el-switch
          v-model="storeSettings.settingsAutoOpenSettingMenu"
          class="switch-auto-open-setting"
      />

    </div>

    <div>

      Debug Mode

      <el-switch
          v-model="storeSettings.DebugMode"
          class="switch-debug-mode"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />

    </div>

  </el-aside>

</template>

<style scoped>

.app-aside {
  border-right: 1px solid #ccc;

  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
}

.aside-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 35px;
}

.div-filter {
  padding: 10px;
}

</style>
