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