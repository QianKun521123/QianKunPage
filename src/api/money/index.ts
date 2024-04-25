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