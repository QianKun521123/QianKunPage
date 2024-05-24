<!--  线 + 柱混合图 -->
<template>
    <div ref="echartsRef" style="width: 700px; height: 400px"></div>
</template>

<script setup lang="ts">
/** 引入 */
import axios from "axios";
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts";


/** 变量 */
const parentData = defineProps(['parentCode']);
const echartsRef = ref<HTMLElement>();
const dataListX = ref<Array<string>>([]);
const dataListY = ref<Array<number>>([]);
const maxY = ref<number>();
const minY = ref<number>();

/** 方法 */
/** 获取分时数据 */
function getTimeSharingData(code: string) {
    let timeSharingUrl: string;
    if (code.substring(0, 2) == "sh") {
        // sh 上海
        timeSharingUrl = "https://push2ex.eastmoney.com/getStockFenShi?pagesize=5000&ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wzfscj&pageindex=0&sort=2&ft=1&cb=jQuery35100409589474327261_1716448465087&code=" + code.substring(2, 8) + "&market=1&_=" + new Date().getTime();
    } else {
        // sz 深圳1716450464322
        timeSharingUrl = "https://push2ex.eastmoney.com/getStockFenShi?pagesize=5000&ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wzfscj&pageindex=0&sort=2&ft=1&cb=jQuery351047124033678725796_1716448847665&code=" + code.substring(2, 8) + "&market=0&_=" + new Date().getTime();
    }
    axios.get(timeSharingUrl).then((res) => {
        res = JSON.parse(String(res.data.split("(")[1].split(")")[0]))["data"];
        if (res != null || res != undefined) {
            res = res["data"];
            if (res != null || res != undefined) {
                dataEncapsulation(res)
            }
        }
    });
}
/** 数据处理 */
function dataEncapsulation(res:any){
    // Array(res)[0].forEach((item:any)=> {
    //     const timeStr = item["t"];
    //     dataListX.value.push(item["t"])
    //     // dataListX.value.push((timeStr/10000).toFixed(0)+"："+(Array(2).join("0") + (timeStr%10000/100).toFixed(0)).slice(-2));// (timeStr%10000/100).toFixed(0))
    //     dataListY.value.push(item["p"]/1000)
    // });
    
    // maxY.value = Math.max(...dataListY.value);
    // minY.value = Math.min(...dataListY.value);
    dataListX.value.push("0930")
    dataListX.value.push("0930")
    dataListX.value.push("0935")


    dataListY.value.push(16.30)
dataListY.value.push(16.32)
dataListY.value.push(16.35)
dataListX.value = ["9:30", '90:30', '11:30/13:00','14:00',"15:00"];
dataListY.value = [16.00, 16.30, 16.20,15.00,15.80];

    console.log(dataListX.value )
    console.log(dataListY.value)
}

/** 画时分图 */
function drawTimeSharingChartInit() {
    var option = {
        tooltip:{
            // 是否显示提示框
            show: true,
            // 触发类型，axis 移动到坐标轴就触发
            trigger: "axis",
            axisPointer: { // 坐标轴指示器配置项。
                type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
                axis: 'auto', // 指示器的坐标轴。 
                snap: true, // 坐标轴指示器是否自动吸附到点上
            },
        },
        borderWidth:1,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:[1, 1, 2,3,4] // dataListX.value
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [16.00, 16.30, 16.20,15.00,15.80] ,//dataListY.value,
                type: 'line'
            }
        ]
    };
    let timeSharingCharts = echarts.init(echartsRef.value)
    option && timeSharingCharts.setOption(option);
}

/** 初始化加载 */
onMounted(() => {
    if (parentData.parentCode != undefined && parentData.parentCode != '') {
        getTimeSharingData(parentData.parentCode);
    }
    // /** 初始化时分图 */
    drawTimeSharingChartInit();
});
</script>
<style lang="scss" scoped>

.title {
    display: flex;
    justify-content: space-between;

    .download {
        cursor: pointer;

        &:hover {
            color: #409eff;
        }
    }
}
</style>