

/**
 * 账单名称查询对象类型
 */
export interface BillDetailQuery extends PageQuery {
  keywords?: string;
  billNameId?: number;
  categoryId?: number;
  type?: number;
}

/**
 * 账单名称分页对象
 */
export interface BillDetailPageVO {
  /** 账单名称ID */
  id?: number;
  /** 账单名称ID */
  billNameId?: number;
  /** 账单名称 */
  billName?: string;

  /** 分类id */
  categoryId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 收支标识(1:收入;0:支出) */
  type?: number;
  /** 金额 */
  money?: number;

  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
  
}

/**
 * 账单名称表单类型
 */
export interface BillDetailForm {
  /** 账单明细ID */
  id?: number;
  /** 账单名称ID */
  billNameId?: number;
  /** 分类id */
  categoryId?: number;
  /** 收支金额 */
  money?: number;
  /** 收支类型(1:收入;0:支出) */
  type?: number;
  
}
