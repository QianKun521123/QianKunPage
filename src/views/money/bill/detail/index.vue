<script setup lang="ts">
import { getBillDetailPage,getBillCategoryForm, addBillCategory, updateBillCategory, deleteBillCategory } from "@/api/money/bill/detail";
import { getBillCategoryOptions } from "@/api/money/bill/category";
import { BillDetailPageVO, BillDetailQuery, BillDetailForm } from "@/api/money/bill/detail/types";


const queryFormRef = ref(ElForm);
const roleFormRef = ref(ElForm);

const categoryOptions = ref<OptionType[]>(); // 分类列表
const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);
const queryParams = reactive<BillDetailQuery>({
  pageNum: 1,
  pageSize: 10,
});

const roleList = ref<BillDetailPageVO[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<BillDetailForm>({
  money: 0,
  type: 1,
});

const rules = reactive({
  name: [{ required: true, message: "请输入账单名称", trigger: "blur" }],
  remark: [{ required: true, message: "请输入账单备注", trigger: "blur" }],
});


/** 查询 */
function handleQuery() {
  loading.value = true;
  getBillDetailPage(queryParams)
    .then(({ data }) => {
      roleList.value = data.list;
      total.value = data.total;
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

/** 打开分类表单弹窗 */
function openDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    dialog.title = "修改账单明细";
    getBillCategoryForm(roleId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增账单明细";
  }
}

/** 分类保存提交 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.id;
      if (roleId) {
        updateBillCategory( formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addBillCategory(formData)
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
  formData.type = 1;
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
    deleteBillCategory(roleIds)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}
function getBillCategoryOptionsAction(){
  getBillCategoryOptions().then((response) => {
    categoryOptions.value = response.data;
  });
}
onMounted(() => {
  handleQuery();
  getBillCategoryOptionsAction();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.keywords"
            placeholder="分类名称"
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
        :show-overflow-tooltip="true"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="收支类型" prop="type" min-width="85" >
          <template #default="scope">
            <el-tag v-if="scope.row.type === 1" type="success">收入</el-tag>
            <el-tag v-else type="info">支出</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="收支金额" prop="money" min-width="100" />
        <el-table-column label="账单" prop="billName" min-width="100" />
        <el-table-column label="分类" prop="categoryName" min-width="100" />
        <el-table-column label="备注" prop="remark" />

        <el-table-column label="创建时间" prop="createTime" width="160" />
        <el-table-column label="修改时间" prop="updateTime" width="160" />

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
        <el-form-item label="收支金额" prop="name">
          <el-input v-model="formData.money" placeholder="请输入收支金额" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.type">
            <el-radio :label=1>收入</el-radio>
            <el-radio :label=0>支出</el-radio>
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
