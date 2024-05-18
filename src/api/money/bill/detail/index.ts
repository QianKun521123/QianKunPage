import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BillDetailPageVO,BillDetailQuery,BillDetailForm } from "./types";

/**
 * 获取角色分页数据
 * @param queryParams
 */
export function getBillDetailPage(queryParams: BillDetailPageVO): AxiosPromise<PageResult<BillDetailPageVO[]>> {
  return request({
    url: "/bill/detail/page",
    method: "get",
    params: queryParams,
  });
}
/**
 * 获取角色详情
 *
 * @param id
 */
export function getBillCategoryForm(id: number): AxiosPromise<BillDetailForm> {
  return request({
    url: "/bill/detail/" + id ,
    method: "get",
  });
}
/**
 * 添加账单名称
 *
 * @param data
 */
export function addBillCategory(data: BillDetailForm){
  return request({
    url: "/bill/detail",
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
export function updateBillCategory( data: BillDetailForm) {
  return request({
    url: "/bill/detail",
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
    url: "/bill/detail/" + ids,
    method: "delete",
  });
}