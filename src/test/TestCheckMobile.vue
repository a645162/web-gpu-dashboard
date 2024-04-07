<script lang="ts">

import {defineComponent} from 'vue';
import {getDeviceType} from '../ts/mobile/DeviceType.ts';

export default defineComponent({
  name: 'DeviceType',
  setup() {
    const device = getDeviceType();

    return {
      device
    };
  }
});
</script>

<template>
  <div>
    <p>设备类型： {{ device.isMobile ? '手机' : device.isTablet ? '平板' : '电脑' }}</p>
  </div>
</template>
