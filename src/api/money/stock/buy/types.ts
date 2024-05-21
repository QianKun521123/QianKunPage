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
  /** 最近查询时间 */
  searchTime?: string;
  /** 删除状态(1:未删除;0:删除) */
  deleted?: number;
  costAmount?: string;
  netAmount?: number;
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

/**
 * 账单名称表单类型
 */
export interface StockBuyMoreInfoBase {
  /** 股票编码 */
  code?: string,
  /** 股票名称 */
  name?: string,
  /** 市价 */
  price?: string,
  /** 今开 */
  todayOpen?: string,
  /** 最高 */
  theTallest?: string,
  /** 最低 */
  minimum?: string,
  /** 涨停 */
  limitUp?: string,
  /** 跌停 */
  limitDown?: string,
  /** 涨跌额 */
  range?: string,
  /** 涨跌幅 */
  priceLimit?: string,
  /** 昨收 */
  yesterdayClosing?: string,
  /** 换手 */
  changeHands?: string,
  /** 量比 */
  volumeRatio?: string,
  /** 成交量 */
  tradingVolume?: string,
  /** 成交额 */
  volumeBusiness?: string,
  /** 市盈(动) */
  marketSurplus?: string,
  /** 市净 */
  marketNet?: string,
  /** 总市值 */
  totalMarketValue?: string,
  /** 流通市值 */
  circulatingMarketValue?: string,
  /** 静态市盈 */
  staticSurplus?: string,
  /** 滚动市盈 */
  rollingSurplus?: string,
}
