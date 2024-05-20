

<script setup lang="ts">
/** 引入 */
import {StockBuyMoreInfoBase} from "@/api/money/stock/buy/types";
import axios from "axios";

/** 初始化参数 */
let autoUpdateMoreinfo: any;
const parentData = defineProps(['parentCode'])
const moreInfoData = ref<StockBuyMoreInfoBase>({

});
/** 打开角色表单弹窗 */
function openMoreInfoDialog(code?: string) {
  clearTimeout(autoUpdateMoreinfo);
  if (new Date().getHours() > 15 || new Date().getHours() < 9) {
    updateMoreInfoData(code);
  } else {
    autoUpdateMoreinfo = setInterval(() => {
      updateMoreInfoData(code);
    },  1000);
  }
}
/** 获取股票信息 */
function updateMoreInfoData(code?: string) {
  axios.get("https://sqt.gtimg.cn/q=" + code).then((res) => {
    let stockData = res.data.split("~");
    moreInfoData.value.code = stockData[2];
    moreInfoData.value.name = stockData[1];
    moreInfoData.value.price = stockData[3];
    moreInfoData.value.todayOpen = stockData[5];
    moreInfoData.value.theTallest = stockData[33];
    console.log(moreInfoData)

   });
}

onMounted(() => {
  if(parentData.parentCode != undefined && parentData.parentCode !=''){
    openMoreInfoDialog(parentData.parentCode);
  }
});

</script>



<template>
  <div>
    <div><span>{{ moreInfoData.todayOpen }}</span></div>
    <el-descriptions :column="7">
      <el-descriptions-item label="今开：">
        {{ moreInfoData.todayOpen }}</el-descriptions-item
      >
      <el-descriptions-item label="最高：">{{
        moreInfoData.theTallest
      }}</el-descriptions-item>
      <el-descriptions-item label="涨停：">
        {{ moreInfoData.price }}</el-descriptions-item
      >
      <el-descriptions-item label="换手：">
        {{ moreInfoData.price }}</el-descriptions-item
      >
      <el-descriptions-item label="成交量：">
        {{ moreInfoData.price }}</el-descriptions-item
      >
      <el-descriptions-item label="市盈(动)：">
        {{ moreInfoData.price }}</el-descriptions-item
      >

      <el-descriptions-item label="总市值：">
        {{ moreInfoData.price }}</el-descriptions-item
      >
      <el-descriptions-item label="涨停：">
        {{ moreInfoData.price }}</el-descriptions-item
      >
      <el-descriptions-item label="换手：">
        {{ moreInfoData.price }}</el-descriptions-item
      >
      <el-descriptions-item label="成交量：">
        {{ moreInfoData.price }}</el-descriptions-item
      >
    </el-descriptions>
  </div>
</template>
