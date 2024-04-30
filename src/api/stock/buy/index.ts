import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { StockBuyPageVO,StockBuyQuery,StockBuyForm,StockOption } from "./types";

/**
 * 获取角色分页数据
 * @param queryParams
 */
export function getStockBuyPage(queryParams: StockBuyQuery): AxiosPromise<PageResult<StockBuyPageVO[]>> {
  return request({
    url: "/stock/buy/page",
    method: "get",
    params: queryParams,
  });
}
/**
 * 获取角色详情
 *
 * @param id
 */
export function getStockBuyForm(id: number): AxiosPromise<StockBuyForm> {
  return request({
    url: "/stock/buy/" + id ,
    method: "get",
  });
}
/**
 * 获取选择列表
 */

export function getStockOption(query:string ): AxiosPromise<StockOption> {
  return request({
    url: "/stock/option?query="+query ,
    method: "get",
  });
}