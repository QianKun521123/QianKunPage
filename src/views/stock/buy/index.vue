<script setup lang="ts">
import { getStockBuyPage,getStockBuyForm } from "@/api/stock/buy";

import { StockBuyPageVO, StockBuyQuery, StockBuyForm } from "@/api/stock/buy/types";
import axios from "axios";
import { menuItemEmits } from "element-plus";
import { reduce, result, size } from "lodash";

defineOptions({
  name: "StockBuy",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const StockBuyFormRef = ref(ElForm);
const menuRef = ref(ElTree);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<StockBuyQuery>({
  pageNum: 1,
  pageSize: 10,
});

const StockBuyList = ref<StockBuyPageVO[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<StockBuyForm>({
  sort: 1,
  status: 1,
  code: "",
  name: "",
});

const rules = reactive({
  name: [{ required: true, message: "请输入账单名称", trigger: "blur" }],
});

const menuDialogVisible = ref(false);


interface CheckedStockBuy {
  id?: number;
  name?: string;
}
let checkedStockBuy: CheckedStockBuy = reactive({});

let updateTime = 2
let autoupdate:any;
/** 查询 */
function handleQuery() {
  loading.value = true;
  getStockBuyPage(queryParams)
    .then(({ data }) => {
      StockBuyList.value = data.list;
      total.value = data.total;
      clearTimeout(autoupdate);
      autoupdate =  setInterval(() => {
        updateData();
      }, updateTime*1000);
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

/** 角色保存提交 */
function handleSubmit() {
  StockBuyFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const StockBuyId = formData.id;
      if (StockBuyId) {
        updateStockBuy(StockBuyId, formData)
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
  StockBuyFormRef.value.resetFields();
  StockBuyFormRef.value.clearValidate();

  formData.id = undefined;
  formData.sort = 1;
  formData.status = 1;
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
function updateData(){
  StockBuyList.value?.forEach(element => {
    axios.get("https://sqt.gtimg.cn/q="+element.code).then(res=>{
      let stockData = res.data.split("~")
      element.price = stockData[3];
      element.allEarnings = ((stockData[3] - element.buyPrice!) * element.buyNum!).toFixed(2);
      element.dayGain = stockData[31];
      element.dayReturn = Number((stockData[31] * element.buyNum!).toFixed(2));
    })
  });
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
        数据刷新时间间隔：{{ updateTime }}秒
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
        <el-table-column type="selection" width="65" align="center" />
        <el-table-column label="股票编码" prop="code" min-width="100" />
        <el-table-column label="股票名称" prop="name" width="150" />
        <el-table-column label="市价" prop="price" width="150" >
          <template #default="scope">
            <span :style="{color: (scope.row.price>scope.row.buyPrice?'red':'green')}">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="购买数量" prop="buyNum" width="150" />
        <el-table-column label="购买价格" prop="buyPrice" width="150" />
        <el-table-column label="当日涨跌" prop="dayGain" width="150" > 
          <template #default="scope">
            <span :style="{color: (scope.row.dayGain>0?'red':'green')}">{{ scope.row.dayGain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当日收益" prop="dayReturn" width="100" > 
          <template #default="scope">
            <span :style="{color: (scope.row.dayReturn>0?'red':'green')}">{{ scope.row.dayReturn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总收益" prop="allEarnings" width="100" > 
          <template #default="scope">
            <span :style="{color: (scope.row.allEarnings>0?'red':'green')}">{{ scope.row.allEarnings }}</span>
          </template>
        </el-table-column>
<!-- 
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
            <el-tag v-else type="info">删除</el-tag>
          </template>
        </el-table-column>
        -->
        <el-table-column label="创建时间" prop="createTime" width="160" />
        <el-table-column label="修改时间" prop="updateTime" width="160" />

        <el-table-column fixed="right" label="操作" width="150">
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

    <!-- 角色表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="closeDialog"
    >
      <el-form
        ref="StockBuyFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="账单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入账单名称" />
        </el-form-item>
        <el-form-item label="备注" >
          <el-input v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>
