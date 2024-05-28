<!--  线 + 柱混合图 -->
<template>
    <div ref="echartsRef" style="width: 1000px; height: 400px"></div>
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
const flagY = ref<Array<string>>([]);
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
function dataEncapsulation(res: any) {
    let yValue: number = 0;
    let indexTemp: number = 0;
    let mapTemp = new Map();
    Array(res)[0].reverse().forEach((item: any) => {
        mapTemp.set(Math.floor((item["t"] / 100)), Number(item["p"]));
    });
    mapTemp.forEach((item, index, arr) => {
        item = (item / 1000).toFixed(2)
        while (Number(dataListX.value[indexTemp]) < index) {
            dataListY.value.push(yValue)
            indexTemp++;
        }
        dataListY.value.push(item)
        yValue = item
        indexTemp++;
    });
    dataListX.value.forEach((item: any, index) => {
        let time = dataListX.value[index];
        if ("1130/1300" == dataListX.value[index]) {
            dataListX.value[index] = "11:30/13:00"
        } else if ("1500" == dataListX.value[index]) {
            dataListX.value[index] = "15:00"
        } else {
            dataListX.value[index] = time.substring(0, time.length - 2) + ":" + time.substring(time.length - 2, time.length)
        }
    })

    minY.value = Math.min(...dataListY.value);
    maxY.value = Math.max(...dataListY.value);
    let tempValue = (maxY.value - Number(yesterdayClosing.value)) > (Number(yesterdayClosing.value) - minY.value) ? (maxY.value - Number(yesterdayClosing.value)) : (Number(yesterdayClosing.value) - minY.value)
    // for (let i = 0; i < 7; i++) {
    //     flagY.value.push((Number(yesterdayClosing.value) - Number(Number(tempValue / 3).toFixed(2)) * (3 - i)).toFixed(2))
    // }
    
    minY.value = Number((Number(yesterdayClosing.value) - Number(Number(tempValue / 3).toFixed(2)) * 3).toFixed(2))
    maxY.value = Number((Number(yesterdayClosing.value) + Number(Number(tempValue / 3).toFixed(2)) * 3).toFixed(2))
    console.log(flagY.value);
    drawTimeSharingChartInit()
}
var option: any;
/** 画时分图 */
function drawTimeSharingChartInit() {
    option = {
        grid: {
            show: true,       //是否显示坐标系网格
            tooltip: { // 在本坐标系特定的 tooltip 
                show: true,                           //  是否显示提示组件  
            }
        },
        tooltip: {
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
        borderWidth: 1,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataListX.value,
            axisLabel: {
                formatter: function (value: any, index: any) {
                    if (value == "9:30" || value == "10:30" || value == "11:30/13:00" || value == "14:00" || value == "15:00") {
                        return value;
                    } else {
                        return "";
                    }
                },
                showMaxLabel: true
            },
            axisTick: {
                show: false // 隐藏x轴刻度
            },
        },
        yAxis: {
            min: minY.value,
            max: maxY.value,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }
            },
            axisTick: {
                show: false // 隐藏x轴刻度
            },
        },
        series: [
            {
                data: dataListY.value,
                type: 'line',
                lineStyle: {
                    color: '#3979ba',
                    width: 1, // 设置线宽
                },
                markLine: {
                    label: {
                        show: false // 这里设置为 true 以显示标记线的数值
                    },
                    symbol: 'none', // 去掉辅助线首尾圆点和箭头
                    data: [
                        {
                            yAxis: yesterdayClosing.value, // 在 'yesterdayClosing' 的位置添加横线
                            lineStyle: {
                                color: '#cccccc',
                                type: 'solid', // 实线
                            },
                        },
                        {
                            xAxis: "9:30",// 在 'yesterdayClosing' 的位置添加横线
                            lineStyle: {
                                color: '#cccccc',
                                type: 'dashed', // 实线
                            },
                        },
                        {
                            xAxis: "10:30",// 在 'yesterdayClosing' 的位置添加横线
                            lineStyle: {
                                color: '#cccccc',
                                type: 'dashed', // 实线
                            },
                        },
                        {
                            xAxis: "11:30/13:00",// 在 'yesterdayClosing' 的位置添加横线
                            lineStyle: {
                                color: '#cccccc',
                                type: 'dashed', // 实线
                            },
                        },
                        {
                            xAxis: "14:00",// 在 'yesterdayClosing' 的位置添加横线
                            lineStyle: {
                                color: '#cccccc',
                                type: 'dashed', // 实线
                            },
                        }
                    ]
                },
                emphasis: {  // 悬浮
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 1, color: "#e4f6ff" },
                            { offset: 0, color: "#effaff" },
                        ]),
                    },
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 1, color: "#e4f6ff" },
                        { offset: 0, color: "#effaff" },
                    ]),
                },
            }
        ]
    };
    let timeSharingCharts = echarts.init(echartsRef.value)
    option && timeSharingCharts.setOption(option);
}
function initDateList() {
    dataListX.value = ["915", "916", "917", "918", "919", "920", "921", "922", "923", "924", "925", "926", "927", "928", "929", "930", "931", "932", "933", "934", "935", "936", "937", "938", "939", "940", "941", "942", "943", "944", "945", "946", "947", "948", "949", "950", "951", "952", "953", "954", "955", "956", "957", "958", "959"
        , "1000", "1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021", "1022", "1023", "1024", "1025", "1026", "1027", "1028", "1029", "1030", "1031", "1032", "1033", "1034", "1035", "1036", "1037", "1038", "1039", "1040", "1041", "1042", "1043", "1044", "1045", "1046", "1047", "1048", "1049", "1050", "1051", "1052", "1053", "1054", "1055", "1056", "1057", "1058", "1059"
        , "1100", "1101", "1102", "1103", "1104", "1105", "1106", "1107", "1108", "1109", "1110", "1111", "1112", "1113", "1114", "1115", "1116", "1117", "1118", "1119", "1120", "1121", "1122", "1123", "1124", "1125", "1126", "1127", "1128", "1129", "1130/1300"
        , "1301", "1302", "1303", "1304", "1305", "1306", "1307", "1308", "1309", "1310", "1311", "1312", "1313", "1314", "1315", "1316", "1317", "1318", "1319", "1320", "1321", "1322", "1323", "1324", "1325", "1326", "1327", "1328", "1329", "1330", "1331", "1332", "1333", "1334", "1335", "1336", "1337", "1338", "1339", "1340", "1341", "1342", "1343", "1344", "1345", "1346", "1347", "1348", "1349", "1350", "1351", "1352", "1353", "1354", "1355", "1356", "1357", "1358", "1359"
        , "1400", "1401", "1402", "1403", "1404", "1405", "1406", "1407", "1408", "1409", "1410", "1411", "1412", "1413", "1414", "1415", "1416", "1417", "1418", "1419", "1420", "1421", "1422", "1423", "1424", "1425", "1426", "1427", "1428", "1429", "1430", "1431", "1432", "1433", "1434", "1435", "1436", "1437", "1438", "1439", "1440", "1441", "1442", "1443", "1444", "1445", "1446", "1447", "1448", "1449", "1450", "1451", "1452", "1453", "1454", "1455", "1456", "1457", "1458", "1459"
        , "1500"
    ];
}
const yesterdayClosing = ref<number>()
function getNowData() {
    axios.get("https://sqt.gtimg.cn/q=" + parentData.parentCode).then((res) => {
        let stockData = res.data.split("~");
        yesterdayClosing.value = stockData[4];
    });
}
/** 初始化加载 */
onMounted(() => {
    initDateList();
    getNowData();
    if (parentData.parentCode != undefined && parentData.parentCode != '') {
        getTimeSharingData(parentData.parentCode);
    }
    // /** 初始化时分图 */
    // drawTimeSharingChartInit();
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