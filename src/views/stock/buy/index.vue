<script setup lang="ts">
import { getStockBuyPage,getStockBuyForm } from "@/api/stock/buy";

import { StockBuyPageVO, StockBuyQuery, StockBuyForm } from "@/api/stock/buy/types";

defineOptions({
  name: "Role",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const roleFormRef = ref(ElForm);
const menuRef = ref(ElTree);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<RoleQuery>({
  pageNum: 1,
  pageSize: 10,
});

const roleList = ref<RolePageVO[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  code: "",
  name: "",
});

const rules = reactive({
  name: [{ required: true, message: "请输入账单名称", trigger: "blur" }],
});

const menuDialogVisible = ref(false);

const menuList = ref<OptionType[]>([]);

interface CheckedRole {
  id?: number;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});

/** 查询 */
function handleQuery() {
  loading.value = true;
  getStockBuyPage(queryParams)
    .then(({ data }) => {
      roleList.value = data.list;
      total.value = data.total;
      autoUpdateData();
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
function openDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    dialog.title = "修改角色";
    getStockBuyForm(roleId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增角色";
  }
}

/** 角色保存提交 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.id;
      if (roleId) {
        updateRole(roleId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addRole(formData)
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
  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  formData.sort = 1;
  formData.status = 1;
}

/** 删除角色 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(",");
  if (!roleIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    deleteRoles(roleIds)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}
// 设置一个1000毫秒后执行的定时任务
function autoUpdateData(){
  const updateUrl="https://sqt.gtimg.cn/q=";
  setTimeout(function() {
  roleList.value.forEach(e->{
    console.log(e)
  });
}, 3000)}
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
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="股票编码" prop="code" min-width="100" />
        <el-table-column label="股票名称" prop="name" width="150" />
        <el-table-column label="市价" prop="price" width="150" />
        <el-table-column label="购买数量" prop="buyNum" width="150" />
        <el-table-column label="购买价格" prop="buyPrice" width="150" />
        <el-table-column label="当日涨跌" prop="changePrice" width="150" />
        <el-table-column label="当日收益" prop="earnings" width="150" />
        <el-table-column label="总收益" prop="EarningsAll" width="150" />
<!-- 
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
            <el-tag v-else type="info">删除</el-tag>
          </template>
        </el-table-column>
        -->
        <el-table-column label="创建时间" prop="createTime" width="200" />
        <el-table-column label="修改时间" prop="updateTime" width="200" />

        <el-table-column fixed="right" label="操作" width="220">
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
        ref="roleFormRef"
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
