<template>
  <h1>Nvitop:</h1>
  <div>
    <pre>{{ result }}</pre>
  </div>
  <h1>end</h1>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'NvitopInfo',
  props: {
    time: {
      type: Number,
      default: 5000, // 默认5秒刷新一次
    },
  },
  setup(props) {
    const result = ref('');

    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.23.245.114:8080/get_result');
        result.value = response.data.result;
      } catch (error) {
        console.error('There has been a problem with your axios operation:', error);
      }
    };

    let intervalId: number | null = null;
    onMounted(() => {
      fetchData(); // 首次加载时立即获取数据
      intervalId = setInterval(fetchData, props.time) as unknown as number; // 设置定时器定期获取数据
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId); // 组件卸载时清除定时器
      }
    });

    return {
      result,
    };
  },
});
</script>

<style scoped>

</style>
