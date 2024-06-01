<!-- 饼图 -->
<template>
  <el-card>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { getBillChartAllData } from "@/api/money/bill/chart";

const chart = ref<any>("");
const props = defineProps({
  id: {
    type: String,
    default: "pieChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "100%",
    required: true,
  },
  height: {
    type: String,
    default: "100%",
    required: true,
  },
});
const options = {
  title: {
    text: '收益总览',
    left: 'center'
  },
  grid: {
    left: "2%",
    right: "2%",
    bottom: "10%",
    containLabel: true,
  },
  legend: {
    top: "bottom",
    textStyle: {
      color: "#999",
    },
  },
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  series: [
    {
      name: "总览",
      type: "pie",
      radius: '60%',
      itemStyle: {
        borderRadius: 1,
        color: function (params: any) {
          const colorList = ["#409EFF", "#67C23A"];
          return colorList[params.dataIndex];
        },
      },
      data: [
        { value: 26, name: "纯利" },
        { value: 27, name: "支出" },
      ],
      label: {
          show: true, // 是否显示标签
          formatter: '{b}: {c} ({d}%)' // 标签文案的格式器
      }
    },
  ],
};
function initChart(){
  chart.value = markRaw(
    echarts.init(document.getElementById(props.id) as HTMLDivElement)
  );
  chart.value.setOption(options);
  window.addEventListener("resize", () => {
    chart.value.resize();
  });
}
function getAllData(){
  getBillChartAllData().then(({ data }) => {
      alert(data.money)
  });
}
onActivated(() => {
  getAllData();
  if (chart.value) {
    chart.value.resize();
  }
});
onMounted(() => {
  initChart();
});
</script>
