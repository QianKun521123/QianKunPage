import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BillChartAllMoneyData } from "./types";

/**
 * 获取总数据
 */
export function getBillChartAllData(): AxiosPromise<BillChartAllMoneyData> {
  return request({
    url: "/bill/chart/allData",
    method: "get",
  });
}
