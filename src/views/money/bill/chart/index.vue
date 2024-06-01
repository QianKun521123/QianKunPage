<!-- 饼图 -->
<template>
  <div>
    <div style="float: left;width: 50%;">
      <el-card class="allMoneyChartDiv">
        <allMoneyChart
            id="pieChart"
            height="700px"
            width="100%"
            class="bg-[var(--el-bg-color-overlay)]"
          />
      </el-card>
    </div>
    <div style="float: left;width: 50%;">
      <div style="height: 350px;">
        <el-card class="alllMoneyByName">
          <allMoneyChart
              id="pieChart"
              height="600px"
              width="100%"
              class="bg-[var(--el-bg-color-overlay)]"
            />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import allMoneyChart from "./allMoneyChart.vue";

onMounted(() => {
});
</script>
