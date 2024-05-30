import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BillCategoryPageVO,BillCategoryQuery,BillCategoryForm } from "./types";

/**
 * 获取角色分页数据
 * @param queryParams
 */
export function getBillCategoryPage(queryParams: BillCategoryQuery): AxiosPromise<PageResult<BillCategoryPageVO[]>> {
  return request({
    url: "/bill/category/page",
    method: "get",
    params: queryParams,
  });
}
/**
 * 获取角色详情
 *
 * @param id
 */
export function getBillCategoryForm(id: number): AxiosPromise<BillCategoryForm> {
  return request({
    url: "/bill/category/" + id ,
    method: "get",
  });
}
/**
 * 添加账单名称
 *
 * @param data
 */
export function addBillCategory(data: BillCategoryForm){
  return request({
    url: "/bill/category",
    method: "post",
    data: data,
  });
}


/**
 * 更新账单名称
 *
 * @param id
 * @param data
 */
export function updateBillCategory( data: BillCategoryForm) {
  return request({
    url: "/bill/category",
    method: "put",
    data: data,
  });
}


/**
 * 批量删除账单名称，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deleteBillCategory(ids: string) {
  return request({
    url: "/bill/category/" + ids,
    method: "delete",
  });
}
/**
 * 查询选项
 * @param queryParams
 */
export function getBillCategoryOptions(): AxiosPromise<OptionType[]> {
  return request({
    url: "/bill/category/options",
    method: "get",
  });
}