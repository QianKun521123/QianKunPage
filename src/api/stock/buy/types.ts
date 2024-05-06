/**
 * 登录用户信息
 */
export interface UserInfo {
  userId?: number;
  username?: string;
  nickname?: string;
  avatar?: string;
  roles: string[];
  perms: string[];
}

/**
 * 账单名称查询对象类型
 */
export interface StockBuyQuery extends PageQuery {
  keywords?: string;
  status?: number;
  // startTime?: string;
  // endTime?: string;
}

/**
 * 账单名称分页对象
 */
export interface StockBuyPageVO {
  /** 股票名称ID */
  id?: number;
  /** 股票编码 */
  code?: string;
  /** 股票名称 */
  name?: string;
  /** 市价 */
  price?: number;
  /** 购买数量 */
  buyNum?: number;
  /** 购买价格 */
  buyPrice?: number;
  /** 当日涨跌 */
  dayGain?: number;
  /** 当日收益 */
  dayReturn?: number;
  /** 总收益 */
  allEarnings?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
  /** 删除状态(1:未删除;0:删除) */
  deleted?: number;
}

/**
 * 账单名称表单类型
 */
export interface StockBuyForm {
  /** 股票名称ID */
  id?: number;
  /** 股票编码 */
  code?: string | number;
  /** 股票名称 */
  name?: string;
  /** 购买数量 */
  buyNum?: number;
  /** 购买价格 */
  buyPrice?: number;
}
