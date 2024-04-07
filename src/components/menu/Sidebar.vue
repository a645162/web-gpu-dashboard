<template>
  <div class="sidebar">

    <SidebarMenu/>

  </div>
</template>

<script setup lang="ts">

import SidebarMenu from "./SidebarMenu.vue";

</script>

<style scoped>

.sidebar {
  position: fixed; /* 固定位置 */
  left: 0; /* 贴着左侧 */
  top: 0; /* 顶部对齐 */
  bottom: 0; /* 底部对齐，使竖直方向充满 */
  width: auto; /* 自定义宽度 */
  border-right: 1px solid #ccc; /* 右边框 */
}

</style>
