<script setup lang="ts">
import {
  getStockBuyPage,
  getStockBuyForm,
  getStockOption,
  addStockBuy,
  updateStockBuy,
  deleteStockBuys,
} from "@/api/money/stock/buy";
import {
  StockBuyPageVO,
  StockBuyQuery,
  StockBuyForm,
} from "@/api/money/stock/buy/types";
import { convertDateTimeFormat } from "@/utils/dateUtils";
import axios from "axios";
import moreInfo from "./moreInfo.vue";
components:{
  moreInfo
}
const queryFormRef = ref(ElForm);
const stockBuyFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const options: Ref<OptionType[]> = ref([]); // 字典下拉数据源
const queryParams = reactive<StockBuyQuery>({
  pageNum: 1,
  pageSize: 10,
});

const StockBuyList = ref<StockBuyPageVO[]>();

const dialog = reactive({
  title: "",
  visible: false,
});
const moreInfodialog = reactive({
  title: "",
  visible: false,
});


let parentCode: string | undefined;
let updateTime = 1;
let autoupdate: any;
const formData = reactive<StockBuyForm>({});

const rules = reactive({
  name: [{ required: true, message: "请选择股票名称", trigger: "blur" }],
  buyPrice: [
    {
      pattern: /^[1-9]\d*.\d*|0\.\d*[1-9]\d*$/,
      required: true,
      message: "购买金额不能为空且必须是数字",
      trigger: "blur",
    },
  ],
  buyNum: [
    {
      pattern: /^(0|[1-9][0-9]*)$/,
      required: true,
      message: "购买数量不能为空且必须是数字",
      trigger: "blur",
    },
  ],
});

interface CheckedStockBuy {
  id?: number;
  name?: string;
}
/** 查询 */
function handleQuery() {
  loading.value = true;
  getStockBuyPage(queryParams)
    .then(({ data }) => {
      StockBuyList.value = data.list;
      total.value = data.total;
      clearTimeout(autoupdate);
      if (new Date().getHours() >= 15 || new Date().getHours() < 9) {
        updateData();
      } else {
        autoupdate = setInterval(() => {
          updateData();
        }, updateTime * 1000);
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 打开角色表单弹窗 */
function openDialog(StockBuyId?: number) {
  dialog.visible = true;
  if (StockBuyId) {
    dialog.title = "修改角色";
    getStockBuyForm(StockBuyId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增角色";
  }
}

/** 保存提交 */
function handleSubmit() {
  stockBuyFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const StockBuyId = formData.id;
      if (StockBuyId) {
        updateStockBuy(formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addStockBuy(formData)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭表单弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单 */
function resetForm() {
  console.log(formData);
  stockBuyFormRef.value.resetFields();
  stockBuyFormRef.value.clearValidate();
  formData.id = undefined;
  console.log(formData);
}

/** 删除角色 */
function handleDelete(StockBuyId?: number) {
  const StockBuyIds = [StockBuyId || ids.value].join(",");
  if (!StockBuyIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    deleteStockBuys(StockBuyIds)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}
function updateData() {
  StockBuyList.value?.forEach((element) => {
    axios.get("https://sqt.gtimg.cn/q=" + element.code).then((res) => {
      let stockData = res.data.split("~");
      element.price = stockData[3];
      element.allEarnings = (
        (stockData[3] - element.buyPrice!) *
        element.buyNum!
      ).toFixed(2);
      element.dayGain = stockData[31];
      element.dayReturn = Number((stockData[31] * element.buyNum!).toFixed(2));
      element.searchTime = convertDateTimeFormat(stockData[30]);
      element.costAmount = (element.buyNum! * element.buyPrice!).toFixed(2);
      element.netAmount = Number(netIncome(element));
    });
  });
}

function stockOption(query: string) {
  getStockOption(query).then(({ data }) => {
    options.value = data;
  });
}
function selectOptions(option: OptionType) {
  formData.code = option.value;
  formData.name = option.label;
}

/**
 *
 */

//  function getSummaries(val){
//   const { columns, data } = val;
//   const sums = [];
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = '合计';
//       return;
//     }
//     let values = []
//     if (selectData.value.length===0) {
//       values = data.map(item => Number(item[column.property]));
//     }else{
//       values = selectData.value.map(item => Number(item[column.property]));
//     }
//     // 对需要统计的列进行判断
//     if (column.property === 'fpriceqty' ||column.property ==='fallAmount') {
//       sums[index] = values.reduce((prev, curr) => {
//         const value = Number(curr);
//         if (!isNaN(value)) {
//           return prev + curr;
//         } else {
//           return prev;
//         }
//       }, 0).toFixed(2);
//     }
//   });
//   return sums
// }
function netIncome(item?: StockBuyPageVO) {
  const allMoney: number = Number((item!.price! * item!.buyNum!).toFixed(2));
  const handleMoney: number = Number((allMoney! * 0.00001).toFixed(2)); // 过户0.001%
  let procedureMoney: number = Number((allMoney! * 0.0003).toFixed(2)); //手续 0.03%
  const printingMoney: number = Number((allMoney * 0.0005).toFixed(2)); //印花 0.05%
  if (procedureMoney < 5) {
    procedureMoney = 5;
  }
  return (
    allMoney -
    handleMoney -
    procedureMoney -
    printingMoney -
    Number(item?.costAmount)
  ).toFixed(2);
}
/** 关闭详情表单弹窗 */
function closeMoreInfoDialog() {
  moreInfodialog.visible = false;
}

/** 打开角色表单弹窗 */
function openMoreInfoDialog(item?: StockBuyPageVO) {
  moreInfodialog.visible = true;
  moreInfodialog.title = item?.code + " " + item?.name;
  parentCode = item?.code;
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.keywords"
            placeholder="账单名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="openDialog()"
          ><i-ep-plus />新增</el-button
        >
        <el-button
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
          ><i-ep-delete />删除</el-button
        >
        9:00~15:00高频刷新
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="StockBuyList"
        highlight-current-row
        show-summary
        border
        @selection-change="handleSelectionChange"
      >
        <!-- :summary-method="getSummaries" -->
        <el-table-column type="selection" width="65" align="center" />
        <el-table-column label="股票编码" prop="code" width="90" />
        <el-table-column label="股票名称" prop="name" width="85">
          <template #default="scope">
            <span
              @click="openMoreInfoDialog(scope.row)"
              style="cursor: pointer; color: rgb(64, 158, 255)"
              >{{ scope.row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="购买数量" prop="buyNum" width="85" />
        <el-table-column label="成本价格" width="85">
          <template #default="scope">
            {{ scope.row.buyPrice }}
          </template>
        </el-table-column>
        <el-table-column label="成本金额" prop="costAmount" width="85" />
        <el-table-column label="市价" width="80">
          <template #default="scope">
            <span
              :style="{
                color: scope.row.price > scope.row.buyPrice ? 'red' : 'green',
              }"
              >{{ scope.row.price }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="当日涨跌" prop="dayGain" width="85">
          <template #default="scope">
            <span :style="{ color: scope.row.dayGain > 0 ? 'red' : 'green' }">{{
              scope.row.dayGain
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当日收益" prop="dayReturn" width="85">
          <template #default="scope">
            <span
              :style="{ color: scope.row.dayReturn > 0 ? 'red' : 'green' }"
              >{{ scope.row.dayReturn }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="毛利" prop="allEarnings" width="85">
          <template #default="scope">
            <span
              :style="{ color: scope.row.allEarnings > 0 ? 'red' : 'green' }"
              >{{ scope.row.allEarnings }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="净利" prop="netAmount" width="95">
          <template #default="scope">
            <span
              :style="{ color: scope.row.netAmount > 0 ? 'red' : 'green' }"
              >{{ scope.row.netAmount }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="最近查询时间" prop="searchTime" width="160" />
        <el-table-column label="创建时间" prop="createTime" width="160" />
        <el-table-column label="修改时间" prop="updateTime" width="160" />

        <el-table-column fixed="right" label="操作" min-width="140">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="openDialog(scope.row.id)"
            >
              <i-ep-edit />编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 股票表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="closeDialog"
    >
      <el-form
        ref="stockBuyFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="股票名称" prop="name">
          <el-select
            v-model="formData.name"
            filterable
            remote
            reserve-keyword
            placeholder="请输入账单名称"
            :remote-method="stockOption"
            :loading="loading"
            style="width: 240px"
            @change="selectOptions"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="购买价格" prop="buyPrice">
          <el-input v-model="formData.buyPrice" placeholder="请输入购买价格" />
        </el-form-item>
        <el-form-item label="购买数量" prop="buyNum">
          <el-input v-model="formData.buyNum" placeholder="请输入购买数量" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 股票详情弹窗 -->
    <el-dialog
      v-model="moreInfodialog.visible"
      :title="moreInfodialog.title"
      width="1000px"
      append-to-body
      @close="closeMoreInfoDialog">
      <moreInfo v-if="moreInfodialog.visible" :parentCode="parentCode"></moreInfo>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeMoreInfoDialog">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>