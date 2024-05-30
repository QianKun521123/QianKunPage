<!-- 饼图 -->
<template>
  <div>
  <el-card class="allMoneyChartDiv">
    <allMoneyChart
        id="pieChart"
        height="400px"
        width="100%"
        class="bg-[var(--el-bg-color-overlay)]"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import allMoneyChart from "./allMoneyChart.vue";

onMounted(() => {
});
</script>
