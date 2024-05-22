<!--  线 + 柱混合图 -->
<template>
   
</template>
  
<script setup lang="ts">
/** 引入 */
import * as echarts from "echarts";
import axios from "axios";

/** 变量 */
const parentData = defineProps(['parentCode']) ;

/** 方法 */
/** 初始化加载 */
onMounted(() => {
    if(parentData.parentCode != undefined && parentData.parentCode !=''){
        getData(parentData.parentCode);
    }
});
  
/** 获取分时数据 */
function getData(code:string){

    // axios.get("https://data.gtimg.cn/flashdata/hushen/minute/" + code+".js").then((res) => {
        
    // });
}

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
  