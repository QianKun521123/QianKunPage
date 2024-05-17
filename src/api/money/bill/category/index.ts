import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BillGategoryPageVO,BillGategoryQuery,BillCategoryForm } from "./types";

/**
 * 获取角色分页数据
 * @param queryParams
 */
export function getBillCategoryPage(queryParams: BillGategoryQuery): AxiosPromise<PageResult<BillGategoryPageVO[]>> {
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
export function addBillName(data: BillNameForm){
  return request({
    url: "/bill/name",
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
export function updateBillName( data: BillNameForm) {
  return request({
    url: "/bill/name",
    method: "put",
    data: data,
  });
}


/**
 * 批量删除账单名称，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deleteBillName(ids: string) {
  return request({
    url: "/bill/name/" + ids,
    method: "delete",
  });
}