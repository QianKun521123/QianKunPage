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
export interface BillNameQuery extends PageQuery {
  // keywords?: string;
  // status?: number;
  // startTime?: string;
  // endTime?: string;
}

/**
 * 账单名称分页对象
 */
export interface BillNamePageVO {
  /** 账单名称ID */
  id?: number;
  /** 账单名称 */
  name?: string;
  /** 账单名称备注 */
  remark?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
  /** 删除状态(1:未删除;0:删除) */
  deleted?: number;
  /** 停用状态(1:停用;0:启用) */
  status?: number;
  
}

/**
 * 账单名称表单类型
 */
export interface BillNameForm {
  /** 账单名称ID */
  id?: number;
  /** 账单名称 */
  name?: string;
  /** 账单名称备注 */
  remark?: string;
  /** 删除状态(1:未删除;0:删除) */
  deleted?: number;
  /** 停用状态(1:停用;0:启用) */
  status?: number;
  
}
