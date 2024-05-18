import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BillNamePageVO,BillNameQuery,BillNameForm } from "./types";

/**
 * 获取角色分页数据
 * @param queryParams
 */
export function getBillNamePage(queryParams: BillNameQuery): AxiosPromise<PageResult<BillNamePageVO[]>> {
  return request({
    url: "/bill/name/page",
    method: "get",
    params: queryParams,
  });
}
/**
 * 获取角色详情
 *
 * @param id
 */
export function getBillNameForm(id: number): AxiosPromise<BillNameForm> {
  return request({
    url: "/bill/name/" + id ,
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

/**
 * 查询选项
 * @param queryParams
 */
export function getBillNameOptions(): AxiosPromise<OptionType[]> {
  return request({
    url: "/bill/name/options",
    method: "get",
  });
}