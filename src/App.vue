<template>

  <div class="app-layout">
    <el-container class="app-container">
      <el-header class="app-header">
        <div class="app-header-content">

          <el-menu
              class="app-menu"
              mode="horizontal"
              :ellipsis="false"
          >

            <el-menu-item
                index="0"
                @click="storeShare.ToggleMenuAside"
            >
              <img
                  style="width: 54px;height: 54px"
                  src="./assets/nvidia-color.svg"
                  alt="logo"
              />
            </el-menu-item>

            <div class="flex-grow"/>

            <el-menu-item
                index="1"
                v-show="false"
                @click="OpenDrawerNavigationGpu"
            >
              导航
            </el-menu-item>

            <el-sub-menu index="2">
              <template #title>切换服务器</template>

              <el-menu-item
                  class="menu-gpu-item"
                  :index="`2-0`"
                  @click="onClickAllGpuServer"
              >
                =>全家福<=
                <a v-show="todayIsAprilFoolsDay">(愚人节快乐~)</a>
              </el-menu-item>

              <el-menu-item
                  class="menu-gpu-item"
                  v-for="(machineListItem, index) in allMachineList"
                  :key="index"
                  :index="`2-${index + 1}`"
                  @click="onClickChangeGpuServer(machineListItem, index)"
              >
                <!--[{{ index + 1 }}]-->
                {{ machineListItem.machineName }}
              </el-menu-item>
            </el-sub-menu>

            <!--http://guide.329509.xyz/内部服务/GPU看板/-->
            <el-menu-item
                index="3"
                @click="openNewWindow('http://guide.329509.xyz/内部服务/GPU看板/')"
            >
              使用帮助
            </el-menu-item>

          </el-menu>

        </div>

      </el-header>

      <div style="margin-top: 8px"/>

      <el-container class="app-container-main">


        <SettingMenu/>


        <el-main
            class="app-main"
            :style="{
              left: storeShare.MenuIsShow ? '200px' : '0'
            }"
        >

          <div class="div-app">

            <div class="container-main">

              <ListMachineInfo
                  :machineList="currentMachineList"
              />

            </div>

          </div>

        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script setup lang="ts">

import {computed, provide, ref} from "vue";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";

import {Default_MachineIndex} from "./default/default_value.ts";
import {
  autoPersistedStateSettings
} from "./stores/PiniaDataPersistence.ts";
import {useStoreSettings} from "./stores/storeSettings.ts";
import {useStoreShare} from "./stores/storeShare.ts";

import {machineList} from "./ts/MachineList.ts";
import {MachineListItem} from "./ts/type/MachineListItem.ts";
import ListMachineInfo from "./components/machine/ListMachineInfo.vue";
import SettingMenu from "./components/ui/SettingMenu.vue";
import {todayIsAprilFoolsDay} from "./ts/funny/FunnyDays.ts";

const storeShare = useStoreShare();
const storeSettings = useStoreSettings();
autoPersistedStateSettings(storeSettings);

const nightMode = ref(false)
provide('nightMode', nightMode);

const OpenDrawerNavigationGpu = () => {
  if (currentMachineList.value.length > 1) {
    storeShare.DrawerNavigationGpu = false;
    ElNotification({
      title: '严重错误',
      message: '全家福的导航代码你来写?!你行你上!',
      type: 'error',
    })
    return;
  }
  storeShare.DrawerNavigationGpu = true;
}

const fullMachineList = ref<MachineListItem[]>(machineList);
const allMachineList = computed<MachineListItem[]>(
    () => {
      if (storeSettings.DebugMode) {
        return fullMachineList.value;
      }

      return fullMachineList.value.filter(
          (item) => !item.machineName.includes('Test')
      );
    }
);

const finalDefaultIndex = computed(
    () => {
      let defaultIndex = storeSettings.DefaultMachineIndex;
      // console.log('defaultIndex:', defaultIndex);
      const length = allMachineList.value.length;
      if (defaultIndex >= length) {
        defaultIndex = Default_MachineIndex;
      }
      if (defaultIndex >= length) {
        defaultIndex = 0;
      }
      storeSettings.DefaultMachineIndex = defaultIndex;
      return defaultIndex;
    }
);

const currentMachineList = ref<MachineListItem[]>([]);

// 判断当前Url中是否包含某个关键字，如果包含则默认选中这个GPU服务器
const currentUrl = window.location.href;
for (let i = 0; i < allMachineList.value.length; i++) {
  if (allMachineList.value[i].urlKeywords === '') {
    continue;
  }

  if (currentUrl.includes(allMachineList.value[i].urlKeywords)) {
    currentMachineList.value = [allMachineList.value[i]];
    storeSettings.DefaultMachineIndex = i;
    break;
  }
}

// 为了防止用户在浏览器地址栏中输入错误的url，导致页面空白，所以这里加了一个默认的GPU服务器
if (currentMachineList.value.length === 0) {
  currentMachineList.value = [
    allMachineList.value[finalDefaultIndex.value]
  ];
}

const onClickAllGpuServer = () => {
  ElMessageBox.confirm(
      '全家福模式(同时请求所有GPU服务器)，不但对服务器压力大，' +
      '对你的浏览器也是巨大的考验，你确定要这么做吗?',
      '警告',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
      .then(() => {
        currentMachineList.value = allMachineList.value;
        ElMessage({
          type: 'success',
          message: '全家福模式启动成功~',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '终于把你劝住了~',
        })
      })
}

const onClickChangeGpuServer =
    (machineItem: MachineListItem, index: number) => {
      storeSettings.DefaultMachineIndex = index;
      currentMachineList.value = [machineItem];
    }

const openNewWindow = (url: string) => {
  window.open(url, '_blank');
}

</script>

<style scoped>

.app-layout {
  width: 100%;
  height: 100vh;
  display: flex;
}

/* Header */
.app-header {
  position: relative;
  padding: 0;
  width: 100%;
  height: 60px;
  z-index: 5;
}

.app-menu {
  width: 100%;
  height: 100%;
  z-index: 5;
}

.app-header-content {
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
  z-index: 5;
}

/* Body */
.app-container-main {
  height: 94vh;
}

/* Main */
.app-main {
  padding: 0;

  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

.container-main {
  box-sizing: border-box; /* 包括padding和border在内的宽度 */
}

.div-app {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
