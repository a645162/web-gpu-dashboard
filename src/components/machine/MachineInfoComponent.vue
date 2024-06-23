<template>
  <div>
    <p
        v-show="machineName"
        style="font-size: 1.5rem;font-weight: bold;"
    >
      {{ machineName }}
    </p>
    <!--<p>URL: {{ machineUrl }}</p>-->

    <!--    <div-->
    <!--        v-show="gpuCount !== null"-->
    <!--    >-->
    <!--      共{{ gpuCount }}块GPU.-->
    <!--    </div>-->

    <div
        class="system-info-wrap"
        v-if="machineSystemInfo !== null"
    >
      <div
          class="system-info-memory-wrap"
          v-if="machineSystemInfo.memoryPhysicUsedMb !== undefined"
      >
        <MemoryUsageCard
            :physical-memory-used="machineSystemInfo.memoryPhysicUsedMb"
            :physical-memory-total="machineSystemInfo.memoryPhysicTotalMb"
            :swap-memory-used="machineSystemInfo.memorySwapUsedMb"
            :swap-memory-total="machineSystemInfo.memorySwapTotalMb"
        />
      </div>
    </div>

    <div
        class="gpu-card-wrap"
        ref="containerRef"
        v-if="gpuCount"
    >

      <GpuComponent
          class="gpu-card-context"
          v-for="index in gpuCount"
          @filterResultChanged="filterResultChanged"
          :key="index"
          :id="'gpu-index-' + (index - 1)"
          :url="machineUrl"
          :gpu-index="(index - 1)"
      />

    </div>

    <el-card
        class="not-found-gpu-card"
        v-else
    >
      <h3>没有获取到任何GPU!</h3>
    </el-card>

    <div
        v-show="gpuCount && !(haveShownGpu)"
        style="margin-top: 5px;margin-bottom: 5px;"
    >

      <el-card class="gpu-component-filter-none">
        <div style="text-align: center">
          <h3>暂无<strong style="color: red;">匹配过滤条件</strong>的信息！</h3>
        </div>
      </el-card>

    </div>

    <el-drawer
        class="drawer-navigation"
        v-model="storeShare.DrawerNavigationGpu"
        title="导航"
        direction="ltr"
        :with-header="false"
        :modal="true"
    >
      <!-- 导航抽屉 -->
      <el-anchor
          class="anchor-gpu-container"
          :container="containerRef"
          v-if="gpuCount && gpuCount > 0"
          direction="vertical"
          type="default"
          :offset="30"
      >
        <el-anchor-link
            class="anchor-gpu-link"
            v-for="index in gpuCount"
            :key="index"
            :href="'#gpu-index-' + (index - 1)"
        >
          GPU {{ (index - 1) }}
        </el-anchor-link>
      </el-anchor>

      <div v-else>
        没有获取到任何GPU!
      </div>

    </el-drawer>

  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, ref, watch} from 'vue';
import axios from 'axios';
import GpuComponent from './gpu_info/GpuComponent.vue';
import {ElCard} from "element-plus";
import {useStoreShare} from "../../stores/storeShare.ts";
import MemoryUsageCard from "./system_info/MemoryUsageCard.vue";
import {TypeSystemInfo} from "../../ts/api/TypeSystemInfo.ts"; // 确保导入 GPUUsageComponent

export default defineComponent({
  name: 'MachineInfoComponent',
  components: {
    MemoryUsageCard,
    ElCard,
    GpuComponent
  },
  props: {
    machineUrl: {
      type: String,
      require: true,
    },
    machineName: {
      type: String,
      default: "",
    },
    timeInterval: {
      type: Number,
      default: 1000,
    }
  },
  setup(props) {
    const storeShare = useStoreShare();

    const gpuCount = ref<number | null>(null);

    const eachGpuFilterResult = ref<boolean[]>([]);

    const haveShownGpu = computed(() => {
      const length = eachGpuFilterResult.value.length;

      let haveShown = false;

      for (let i = 0; i < length; i++) {
        if (eachGpuFilterResult.value[i]) {
          haveShown = true;
          break;
        }
      }

      return haveShown;
    })

    const fetchGPUCount = async () => {
      try {
        const response = await axios.get(`${props.machineUrl}/gpu_count`);
        // 接口返回的数据格式为 { result: number }
        const responseGpuCount = response.data.result;

        eachGpuFilterResult.value = Array(responseGpuCount).fill(true)
        gpuCount.value = responseGpuCount;
        console.log('GPU count:', responseGpuCount);
        return true; // 成功获取数据
      } catch (error) {
        // console.error('Error fetching GPU count:', error);
        return false; // 获取数据失败
      }
    };

    // fetchGPUCount();

    const tryToGetGpuCountUntilSuccess = async () => {
      while (true) {
        const success = await fetchGPUCount();
        if (success) {
          break; // 如果成功获取数据，退出循环
        }
        console.log('Retrying in 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒
      }
    };

    // 在组件创建时自动开始获取GPU数量
    tryToGetGpuCountUntilSuccess();

    const containerRef = ref<HTMLElement | null>(null);

    // 监视 machineUrl prop 的变化
    watch(() => props.machineUrl, () => {
      // newUrl, oldUrl
      // console.log('machineUrl changed from', oldUrl, 'to', newUrl);

      // 重置 GPU 数量
      gpuCount.value = null;
      eachGpuFilterResult.value = []

      // 重新获取 GPU 数量
      tryToGetGpuCountUntilSuccess();
    });

    const machineSystemInfo = ref<TypeSystemInfo | null>(null);

    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(`${props.machineUrl}/system_info`);
        machineSystemInfo.value = response.data;
      } catch (e) {
      }
    }

    // 自动更新数据
    let intervalId: number | null = null;
    onMounted(() => {
      if (gpuCount.value === null) {
        fetchSystemInfo();
      }

      intervalId = setInterval(fetchSystemInfo, props.timeInterval) as unknown as number;
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });


    return {
      storeShare,

      machineSystemInfo,

      gpuCount,
      containerRef,

      eachGpuFilterResult,
      haveShownGpu,
    };
  },
  methods: {
    filterResultChanged(gpuIndex: number, result: boolean) {
      // const name = this.machineName;
      // console.log(`${name} filterResultChanged:[${gpuIndex}]${result}`);
      if (gpuIndex < this.eachGpuFilterResult.length) {
        this.eachGpuFilterResult[gpuIndex] = result;
      }
    }
  }
});
</script>

<style scoped>

.system-info-wrap {
  margin: 10px;
}

.gpu-card-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.gpu-card-context {
  flex: 1;
  max-width: 500px;
  min-width: 300px;
  height: auto;
  margin: 10px;
}

.anchor-gpu-container {
  width: auto;
  height: 100%;
  overflow-y: auto;
}

.anchor-gpu-link {
  width: auto;
  height: auto;
}

</style>
