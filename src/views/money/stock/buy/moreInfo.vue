

<script setup lang="ts">
/** 引入 */
import {StockBuyMoreInfoBase} from "@/api/money/stock/buy/types";
import axios from "axios";
import timeSharingChart from "./timeSharingChart.vue";
/** 注册组件 */
components:{
  timeSharingChart
}
/** 初始化参数 */
let autoUpdateMoreinfo: any;
const parentData = defineProps(['parentCode']) ;
const moreInfoData = ref<StockBuyMoreInfoBase>({});
const activeName = ref('timeSharingChart');

/** 打开角色表单弹窗 */
function openMoreInfoDialog(code?: string) {
  clearTimeout(autoUpdateMoreinfo);
  if (new Date().getHours() >= 15 || new Date().getHours() < 9) {
    updateMoreInfoData(code);
  } else {
    autoUpdateMoreinfo = setInterval(() => {
      updateMoreInfoData(code);
    },  1000);
  }
}

onMounted(() => {
  if(parentData.parentCode != undefined && parentData.parentCode !=''){
    openMoreInfoDialog(parentData.parentCode);
  }
});

/** 获取股票信息 */
function updateMoreInfoData(code?: string) {
  axios.get("https://sqt.gtimg.cn/q=" + code).then((res) => {
    let stockData = res.data.split("~");
    moreInfoData.value.price = stockData[3];
    moreInfoData.value.range = stockData[31]+"%";
    moreInfoData.value.priceLimit = stockData[32];
    moreInfoData.value.code = stockData[2];
    moreInfoData.value.name = stockData[1];
    moreInfoData.value.todayOpen = stockData[5];
    moreInfoData.value.theTallest = stockData[33];
    moreInfoData.value.limitUp = stockData[47];
    moreInfoData.value.limitDown = stockData[48];
    moreInfoData.value.yesterdayClosing = stockData[4];
    moreInfoData.value.minimum = stockData[34];
    moreInfoData.value.changeHands = stockData[38]+"%"; // 换手
    moreInfoData.value.volumeRatio = stockData[49]; // 量比
    moreInfoData.value.tradingVolume = (Number(stockData[36])/10000).toFixed(2)+"万" ; // 成交量
    moreInfoData.value.volumeBusiness = (Number(stockData[37])/10000).toFixed(3)+"亿"; // 成交额
    moreInfoData.value.marketSurplus = stockData[52];  // 市盈(动) 
    moreInfoData.value.marketNet = stockData[46]; // 市净
    moreInfoData.value.totalMarketValue = stockData[45]+"亿"; // 总市值
    moreInfoData.value.circulatingMarketValue = stockData[44]+"亿"; // 流通市值
    moreInfoData.value.staticSurplus = stockData[52]; // 静态市盈
    moreInfoData.value.rollingSurplus = stockData[39];
   });
}
</script>
<template>
  <div class="moreInfo">
    <div class="baseinfo">
      <el-row style="height: 30px;">
        <el-col :span="3" style="text-align: center;border-right: 1px solid #ccc;">
          <span :style="{ color: Number(moreInfoData.priceLimit) > 0 ? 'red' : 'green' }" style="font-weight: 600;font-size: 20px;">{{ moreInfoData.price }}</span>
          <el-icon v-if="Number(moreInfoData.priceLimit) > 0" color="red" style="font-size: 20px;font-weight: 600;"><Top /></el-icon>
          <el-icon v-if="Number(moreInfoData.priceLimit) < 0" color="green" style="font-size: 20px;font-weight: 600;"><Bottom /></el-icon>
        </el-col>

        <el-col :span="2" style="display: flex;">
          <span style="width: 56%;">今开：</span><span style="width: 47%;">{{ moreInfoData.todayOpen }}</span>
        </el-col>
        <el-col :span="3" style="display: flex;">
          <span class="span1">最高：</span><span  class="span2">{{ moreInfoData.theTallest }}</span>
        </el-col>
        <el-col :span="2" style="display: flex;">
          <span style="width: 56%;">涨停：</span><span  style="width: 47%;" :style="{ color: Number(moreInfoData.limitUp) > 0 ? 'red' : 'green' }">{{ moreInfoData.limitUp }}</span>
        </el-col>
        <el-col :span="3" style="display: flex;">
          <span class="span1">换手：</span><span class="span2">{{ moreInfoData.changeHands }}</span>
        </el-col>
        <el-col :span="3" style="display: flex;">
          <span class="span1">成交量：</span><span class="span2">{{ moreInfoData.tradingVolume }}</span>
        </el-col>
        <el-col :span="4" style="display: flex;">
          <span style="width: 65%;text-align: right;">市盈(动) 
            <el-tooltip placement="bottom" effect="light">
              <template #content> 
                  <ul>
                    <li style="font-weight: 600;">· 动态市盈率：{{ moreInfoData.marketSurplus }}</li>
                    <li>总市值除以全年预估净利润，例如当前一季度净利润1000万,则预估全年净利润4000万</li>
                    <li style="font-weight: 600;">· 静态市盈率：{{ moreInfoData.staticSurplus }}</li>
                    <li>总市值除以上一年度净利润</li>
                    <li style="font-weight: 600;">·滚动市盈率：{{ moreInfoData.rollingSurplus }}</li>
                    <li>最新价除以最近4个季度的每股收益</li>
                  </ul>
              </template>
              <el-icon :size="13" color="#ff9518"><View /></el-icon>
            </el-tooltip>：
          </span>
          <span style="width: 35%;text-align:left">{{ moreInfoData.marketSurplus }}</span>
        </el-col>
        <el-col :span="4" style="display: flex;">
          <span class="span1">总市值：</span><span class="span2">{{ moreInfoData.totalMarketValue }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3" style="text-align: center;display: flex;border-right: 1px solid #ccc;">
          <span style="width: 50%;" :style="{ color: Number(moreInfoData.priceLimit) > 0 ? 'red' : 'green' }">{{ moreInfoData.priceLimit }}</span>
          <span style="width: 50%;" :style="{ color: Number(moreInfoData.priceLimit) > 0 ? 'red' : 'green' }">{{ moreInfoData.range }}</span>
        </el-col>
        <el-col :span="2" style="display: flex;">
          <span style="width: 56%;">昨收：</span><span style="width: 47%;">{{ moreInfoData.yesterdayClosing }}</span>
        </el-col>
        <el-col :span="3" style="display: flex;">
          <span class="span1">最低：</span><span class="span2">{{ moreInfoData.minimum }}</span>
        </el-col>
        <el-col :span="2" style="display: flex;">
          <span style="width: 56%;">跌停：</span><span  style="width: 47%;color:rgb(0, 153, 0)">{{moreInfoData.limitDown}}</span>
        </el-col>
        <el-col :span="3" style="display: flex;">
          <span class="span1">量比：</span><span class="span2">{{ moreInfoData.volumeRatio }}</span>
        </el-col>
        <el-col :span="3" style="display: flex;">
          <span class="span1">成交额：</span><span class="span2">{{ moreInfoData.volumeBusiness }}</span>
        </el-col>
        <el-col :span="4" style="display: flex;">
          <span style="width: 65%;text-align: right;">市净：</span><span style="width: 35%;text-align:left">{{ moreInfoData.marketNet }}</span>
        </el-col>
        <el-col :span="4" style="display: flex;">
          <span class="span1">流通市值：</span><span class="span2">{{ moreInfoData.circulatingMarketValue }}</span>
        </el-col>
      </el-row>
    </div>
    
    <!-- Echarts 图表 -->
    <div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="分时" name="timeSharingChart">

          <el-row :gutter="10" class="mt-3">
            <el-col :sm="24" :lg="18" class="mb-2">
              <timeSharingChart
                id="timeSharingChart"
                height="400px"
                width="100%"
                :parentCode="parentData.parentCode"
                class="bg-[var(--el-bg-color-overlay)]"/>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="日K" name="dayChart">Config</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>
<style>
.span1{
  width:50%;text-align: right;
}
.span2{
  width:50%;text-align: left;
}
</style>