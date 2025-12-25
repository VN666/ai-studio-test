
export enum LedgerStatus {
  PENDING = '待审核',
  APPROVED = '已审核通过',
  REJECTED = '已驳回'
}

export enum LedgerCategory {
  WASTE_OIL = '废油台账',
  FILTER = '滤芯更换记录',
  ICE_MACHINE = '制冰机清洗记录'
}

export interface LedgerRecord {
  id: string;
  type: LedgerCategory;
  date: string;
  store: string;
  department: string;
  person: string;
  content: string;
  remarks?: string;
  status: LedgerStatus;
  amount?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  color: string;
}
