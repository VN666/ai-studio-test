
import React from 'react';
import { 
  ClipboardCheck, 
  FileEdit, 
  Monitor, 
  ShieldCheck, 
  LayoutDashboard, 
  Video, 
  Bell, 
  Target, 
  FileText, 
  Database, 
  UserPlus, 
  CheckSquare,
  Droplet,
  Settings,
  Wind
} from 'lucide-react';
import { LedgerCategory, LedgerStatus, LedgerRecord } from './types';

export const MOCK_RECORDS: LedgerRecord[] = [
  {
    id: '1',
    type: LedgerCategory.WASTE_OIL,
    date: '2023-10-28',
    store: '北京朝阳店',
    department: '后厨',
    person: '李四',
    content: '废油回收 15L',
    status: LedgerStatus.PENDING,
  },
  {
    id: '2',
    type: LedgerCategory.WASTE_OIL,
    date: '2023-10-25',
    store: '北京朝阳店',
    department: '后厨',
    person: '张三',
    content: '废油回收 20L',
    status: LedgerStatus.APPROVED,
    remarks: '正常回收'
  }
];

export const HOME_NAV_ITEMS = [
  { id: '1', label: '门店检查', icon: <ClipboardCheck />, color: 'bg-purple-100 text-purple-600' },
  { id: '2', label: '整改单', icon: <FileEdit />, color: 'bg-orange-100 text-orange-600' },
  { id: '3', label: '监控', icon: <Monitor />, color: 'bg-blue-100 text-blue-600' },
  { id: '4', label: '巡查记录', icon: <ShieldCheck />, color: 'bg-green-100 text-green-600' },
  { id: '5', label: '视频巡店', icon: <Video />, color: 'bg-pink-100 text-pink-600' },
  { id: '6', label: 'AI巡检', icon: <Wind />, color: 'bg-indigo-100 text-indigo-600' },
  { id: '7', label: '证照管理', icon: <Bell />, color: 'bg-yellow-100 text-yellow-600' },
  { id: '8', label: '数据报表', icon: <Database />, color: 'bg-cyan-100 text-cyan-600' },
  { id: '9', label: '任务催办', icon: <Target />, color: 'bg-red-100 text-red-600' },
  { id: '10', label: '台账点评', icon: <CheckSquare />, color: 'bg-teal-100 text-teal-600' },
  { id: 'ledger', label: '台账管理', icon: <FileText />, color: 'bg-blue-100 text-blue-600' },
  { id: '12', label: '健康证管理', icon: <UserPlus />, color: 'bg-emerald-100 text-emerald-600' },
];

export const CATEGORY_ICONS = {
  [LedgerCategory.WASTE_OIL]: <Droplet className="text-blue-500" />,
  [LedgerCategory.FILTER]: <Settings className="text-gray-500" />,
  [LedgerCategory.ICE_MACHINE]: <Wind className="text-cyan-500" />,
};
