"use client"

import { useState, useMemo } from "react"
import { GenerateReconciliationDialog } from "./generate-reconciliation-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  TrendingUp,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  PiggyBank,
  Truck,
  Building2,
  RefreshCw,
  Banknote,
  XCircle,
  Ban,
  User,
  CalendarClock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface SettlementManagementProps {
  subTab?: string
  roleType?: "property" | "warehouse-unit" | "warehouse-site" | "transport" | "user"
}

// ============ 业务类型（四大业务） ============
type BusinessType = "仓储租赁" | "物资存放" | "物资租赁" | "物资销售"

const businessTypeConfig: Record<
  BusinessType,
  { chip: string; dot: string }
> = {
  仓储租赁: {
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  物资存放: {
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  物资租赁: {
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  物资销售: {
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
}

// ============ 对账数据（按四大业务统一归类） ============
interface ReconciliationItem {
  id: string
  orderId: string
  partner: string
  businessType: BusinessType // 四大业务类型
  subType: string // 细分（如：月租金、保管费、销售分成）
  period: string
  amount: number
  confirmedAmount: number
  status: "已确认" | "待确认" | "被驳回" | "已结算"
  createDate: string
  confirmDate: string
  rejectReason?: string
  rejectedBy?: string
  rejectedAt?: string
}

const mockReconciliations: ReconciliationItem[] = [
  {
    id: "DZ-2026-001",
    orderId: "CCJY20260315006",
    partner: "中铁十四局集团广州分公司",
    businessType: "仓储租赁",
    subType: "月度租金对账",
    period: "2026年3月",
    amount: 125000,
    confirmedAmount: 125000,
    status: "已确认",
    createDate: "2026-04-01",
    confirmDate: "2026-04-03",
  },
  {
    id: "DZ-2026-002",
    orderId: "WZCF20260420005",
    partner: "中铁十一局广深城际项目部",
    businessType: "物资存放",
    subType: "保管费对账",
    period: "2026年3月",
    amount: 45000,
    confirmedAmount: 0,
    status: "待确认",
    createDate: "2026-04-01",
    confirmDate: "",
  },
  {
    id: "DZ-2026-003",
    orderId: "YYFC20260301002",
    partner: "中铁建东莞虎门港务仓储基地",
    businessType: "物资租赁",
    subType: "运营分成对账",
    period: "2026年3月",
    amount: 85000,
    confirmedAmount: 0,
    status: "被驳回",
    createDate: "2026-04-01",
    confirmDate: "",
    rejectReason:
      "对账金额中包含 2026年2月已结算的 ¥3,000 服务费，存在重复计算；另：本期物料运营分成比例应按 6:4 而非 7:3 核算，请重新核对后再发起对账。",
    rejectedBy: "李建国（中铁建东莞虎门港务仓储基地 · 财务部）",
    rejectedAt: "2026-04-02 14:25:36",
  },
  {
    id: "DZ-2026-004",
    orderId: "CCJY20260428005",
    partner: "中铁十六局集团华南分公司",
    businessType: "仓储租赁",
    subType: "月度租金对账",
    period: "2026年2月",
    amount: 98000,
    confirmedAmount: 98000,
    status: "已结算",
    createDate: "2026-03-01",
    confirmDate: "2026-03-05",
  },
  {
    id: "DZ-2026-005",
    orderId: "WZJY20260428005",
    partner: "中铁十二局物料分公司",
    businessType: "物资租赁",
    subType: "租金对账",
    period: "2026年4月",
    amount: 28000,
    confirmedAmount: 0,
    status: "待确认",
    createDate: "2026-05-01",
    confirmDate: "",
  },
  {
    id: "DZ-2026-006",
    orderId: "CCJY20260315008",
    partner: "中铁十五局集团第三工程有限公司",
    businessType: "仓储租赁",
    subType: "月度租金对账",
    period: "2026年3月",
    amount: 64000,
    confirmedAmount: 0,
    status: "被驳回",
    createDate: "2026-04-01",
    confirmDate: "",
    rejectReason:
      "3 月 15 日至 22 日期间仓库电力中断，物料入库被迫延迟，按合同第 6.2 条该期间租金应按 70% 计费；请按 ¥44,800 重新出具对账单。",
    rejectedBy: "王志强（中铁十五局集团 · 项目部）",
    rejectedAt: "2026-04-03 09:42:18",
  },
  {
    id: "DZ-2026-007",
    orderId: "WZXS20260513001",
    partner: "中铁十四局集团广州分公司",
    businessType: "物资销售",
    subType: "销售分成对账",
    period: "2026年5月",
    amount: 3780000,
    confirmedAmount: 3780000,
    status: "已确认",
    createDate: "2026-05-26",
    confirmDate: "2026-05-27",
  },
  {
    id: "DZ-2026-008",
    orderId: "WZXS20260510003",
    partner: "中铁建工集团第二建设有限公司",
    businessType: "物资销售",
    subType: "销售分成对账",
    period: "2026年5月",
    amount: 1327200,
    confirmedAmount: 0,
    status: "待确认",
    createDate: "2026-05-16",
    confirmDate: "",
  },
  {
    id: "DZ-2026-009",
    orderId: "WZXS20260508004",
    partner: "中铁十四局集团广州分公司",
    businessType: "物资销售",
    subType: "销售分成对账",
    period: "2026年5月",
    amount: 1104000,
    confirmedAmount: 1104000,
    status: "已结算",
    createDate: "2026-05-13",
    confirmDate: "2026-05-15",
  },
  {
    id: "DZ-2026-010",
    orderId: "WZXS20260420005",
    partner: "中铁二十二局集团第一工程有限公司",
    businessType: "物资销售",
    subType: "销售分成对账",
    period: "2026年4月",
    amount: 202500,
    confirmedAmount: 0,
    status: "被驳回",
    createDate: "2026-04-26",
    confirmDate: "",
    rejectReason:
      "本期销售清单中存在 50 套已计入往期对账的扣件，存在重复结算；另：分成比例应按签订时的 25:75 而非临时调整的 30:70 核算，请重新出具。",
    rejectedBy: "孙广海（中铁二十二局 · 财务部）",
    rejectedAt: "2026-04-27 11:08:42",
  },
  {
    id: "DZ-2026-011",
    orderId: "WZCF20260505004",
    partner: "中铁建东莞虎门港务仓储基地",
    businessType: "物资存放",
    subType: "保管费对账",
    period: "2026年4月",
    amount: 32400,
    confirmedAmount: 32400,
    status: "已确认",
    createDate: "2026-05-01",
    confirmDate: "2026-05-04",
  },
  {
    id: "DZ-2026-012",
    orderId: "WZJY20260505004",
    partner: "中铁十二局物料分公司",
    businessType: "物资租赁",
    subType: "月度租金对账",
    period: "2026年5月",
    amount: 56000,
    confirmedAmount: 0,
    status: "待确认",
    createDate: "2026-06-01",
    confirmDate: "",
  },
]

// ============ 结算流水（按费用类型，覆盖支出与收入两个方向） ============
type FeeCategory =
  | "押金"
  | "保证金"
  | "服务费"
  | "仓储租金"
  | "保管费"
  | "物料租金"
  | "运输费"
  | "物料运营分成"
  | "物资销售款"
  | "销售分成"
  | "退款"

type SettleStatus = "已支付" | "已收款" | "待支付" | "待收款" | "处理中" | "已退款"

interface SettleRecord {
  id: string // 流水号
  orderId: string // 关联订单号
  businessType: BusinessType // 业务类型
  category: FeeCategory
  direction: "支出" | "收入"
  partner: string // 对方单位
  amount: number
  channel: string // 支付通道
  status: SettleStatus
  occurDate: string // 实际发生日期
  voucherNo?: string // 电子回单号
}

const mockSettlements: SettleRecord[] = [
  // 押金（押金支出/退款）
  {
    id: "JS20260506100201",
    orderId: "CCJY20260506004",
    businessType: "仓储租赁",
    category: "押金",
    direction: "支出",
    partner: "中铁建广州黄埔仓储基地",
    amount: 60000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-06 14:23:11",
    voucherNo: "ICBC202605060100201",
  },
  {
    id: "JS20260505100199",
    orderId: "WZJY20260505004",
    businessType: "物资租赁",
    category: "押金",
    direction: "支出",
    partner: "中铁十二局物料分公司",
    amount: 36000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-05 10:08:45",
    voucherNo: "ICBC202605050100199",
  },
  // 保证金（物料存放）
  {
    id: "JS20260505100198",
    orderId: "WZCF20260505004",
    businessType: "物资存放",
    category: "保证金",
    direction: "支出",
    partner: "中铁建东莞虎门港务仓储基地",
    amount: 24000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-05 09:42:22",
    voucherNo: "ICBC202605050100198",
  },
  // 服务费（华南公司）
  {
    id: "JS20260428100185",
    orderId: "CCJY20260428005",
    businessType: "仓储租赁",
    category: "服务费",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 13500,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-28 16:11:38",
    voucherNo: "ICBC202604280100185",
  },
  {
    id: "JS20260420100177",
    orderId: "WZCF20260420005",
    businessType: "物资存放",
    category: "服务费",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 4860,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-20 11:25:14",
    voucherNo: "ICBC202604200100177",
  },
  // 仓储租金（按月支付）
  {
    id: "JS20260501100190",
    orderId: "CCJY20260428005",
    businessType: "仓储租赁",
    category: "仓储租金",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 37500,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-08 09:33:21",
    voucherNo: "ICBC202605080100190",
  },
  {
    id: "JS20260401100165",
    orderId: "CCJY20260315006",
    businessType: "仓储租赁",
    category: "仓储租金",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 42000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-08 14:18:45",
    voucherNo: "ICBC202604080100165",
  },
  // 保管费（物料存放）
  {
    id: "JS20260415100170",
    orderId: "WZCF20260420005",
    businessType: "物资存放",
    category: "保管费",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 16200,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-15 10:52:09",
    voucherNo: "ICBC202604150100170",
  },
  // 物料租金（物料交易）
  {
    id: "JS20260505100195",
    orderId: "WZJY20260428005",
    businessType: "物资租赁",
    category: "物料租金",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 28000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-05 15:30:11",
    voucherNo: "ICBC202605050100195",
  },
  // 运输费（自有运输车队）
  {
    id: "JS20260420100180",
    orderId: "YS20260420003",
    businessType: "物资租赁",
    category: "运输费",
    direction: "支出",
    partner: "广州顺通运输有限公司",
    amount: 12000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-20 17:42:09",
    voucherNo: "ICBC202604200100180",
  },
  // 物料运营分成（站点 → 业主单位）
  {
    id: "JS20260410100168",
    orderId: "YYFC20260301002",
    businessType: "物资租赁",
    category: "物料运营分成",
    direction: "收入",
    partner: "中铁十二局集团有限公司",
    amount: 82000,
    channel: "工商银行 对公收款",
    status: "已收款",
    occurDate: "2026-04-10 09:15:28",
    voucherNo: "ICBC202604100100168",
  },
  // 待支付 / 待收款
  {
    id: "JS20260601100210",
    orderId: "CCJY20260428005",
    businessType: "仓储租赁",
    category: "仓储租金",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 37500,
    channel: "工商银行 对公转账",
    status: "待支付",
    occurDate: "2026-06-08 待支付",
  },
  {
    id: "JS20260605100212",
    orderId: "WZCF20260420005",
    businessType: "物资存放",
    category: "保管费",
    direction: "支出",
    partner: "中铁建物料华南专业运营有限公司",
    amount: 5400,
    channel: "工商银行 对公转账",
    status: "待支付",
    occurDate: "2026-06-15 待支付",
  },
  {
    id: "JS20260520100205",
    orderId: "YYFC20260301002",
    businessType: "物资租赁",
    category: "物料运营分成",
    direction: "收入",
    partner: "中铁十二局集团有限公司",
    amount: 78000,
    channel: "工商银行 对公收款",
    status: "待收款",
    occurDate: "2026-05-20 待收款",
  },
  // 退款
  {
    id: "JS20260301100150",
    orderId: "CCJY20250901001",
    businessType: "仓储租赁",
    category: "退款",
    direction: "收入",
    partner: "中铁十四局集团广州分公司",
    amount: 50000,
    channel: "工商银行 原路退回",
    status: "已退款",
    occurDate: "2026-03-01 10:18:22",
    voucherNo: "ICBC202603010100150",
  },
  // 物资销售款（专运单位代收买方货款）
  {
    id: "JS20260514100250",
    orderId: "WZXS20260513001",
    businessType: "物资销售",
    category: "物资销售款",
    direction: "收入",
    partner: "中铁二十三局深圳分公司",
    amount: 5040000,
    channel: "工商银行 对公收款",
    status: "已收款",
    occurDate: "2026-05-14 10:25:18",
    voucherNo: "ICBC202605140100250",
  },
  {
    id: "JS20260511100242",
    orderId: "WZXS20260510003",
    businessType: "物资销售",
    category: "物资销售款",
    direction: "收入",
    partner: "广州市顺德建材贸易公司",
    amount: 1896000,
    channel: "招商银行 对公收款",
    status: "已收款",
    occurDate: "2026-05-11 14:38:09",
    voucherNo: "CMB202605110100242",
  },
  {
    id: "JS20260520100258",
    orderId: "WZXS20260512002",
    businessType: "物资销售",
    category: "物资销售款",
    direction: "收入",
    partner: "中铁十一局广深城际项目部",
    amount: 72000,
    channel: "工商银行 对公收款",
    status: "已收款",
    occurDate: "2026-05-20 09:14:33",
    voucherNo: "ICBC202605200100258",
  },
  // 销售分成（专运单位 → 物权单位结算物权方份额）
  {
    id: "JS20260526100265",
    orderId: "WZXS20260513001",
    businessType: "物资销售",
    category: "销售分成",
    direction: "支出",
    partner: "中铁十四局集团广州分公司",
    amount: 3780000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-26 11:42:08",
    voucherNo: "ICBC202605260100265",
  },
  {
    id: "JS20260513100247",
    orderId: "WZXS20260508004",
    businessType: "物资销售",
    category: "销售分成",
    direction: "支出",
    partner: "中铁十四局集团广州分公司",
    amount: 1104000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-13 15:08:46",
    voucherNo: "ICBC202605130100247",
  },
  {
    id: "JS20260530100272",
    orderId: "WZXS20260510003",
    businessType: "物资销售",
    category: "销售分成",
    direction: "支出",
    partner: "中铁建工集团第二建设有限公司",
    amount: 1327200,
    channel: "工商银行 对公转账",
    status: "待支付",
    occurDate: "2026-05-30 待支付",
  },
]

// ============ 视觉映射 ============
const reconciliationStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle }
> = {
  已确认: { label: "已确认", variant: "default", icon: CheckCircle },
  待确认: { label: "待确认", variant: "secondary", icon: Clock },
  被驳回: { label: "被驳回", variant: "destructive", icon: XCircle },
  已结算: { label: "已结算", variant: "outline", icon: CheckCircle },
}

const categoryConfig: Record<
  FeeCategory,
  { icon: typeof Shield; chip: string; iconColor: string }
> = {
  押金: {
    icon: Shield,
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
  },
  保证金: {
    icon: Shield,
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
  },
  服务费: {
    icon: Receipt,
    chip: "bg-sky-50 text-sky-700 border-sky-200",
    iconColor: "text-sky-600",
  },
  仓储租金: {
    icon: Building2,
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  保管费: {
    icon: PiggyBank,
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    iconColor: "text-indigo-600",
  },
  物料租金: {
    icon: Banknote,
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  运输费: {
    icon: Truck,
    chip: "bg-slate-50 text-slate-700 border-slate-200",
    iconColor: "text-slate-600",
  },
  物料运营分成: {
    icon: TrendingUp,
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  物资销售款: {
    icon: ArrowDownLeft,
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
  },
  销售分成: {
    icon: ArrowUpRight,
    chip: "bg-rose-50 text-rose-700 border-rose-200",
    iconColor: "text-rose-600",
  },
  退款: {
    icon: RefreshCw,
    chip: "bg-rose-50 text-rose-700 border-rose-200",
    iconColor: "text-rose-600",
  },
}

const settleStatusConfig: Record<
  SettleStatus,
  { label: string; className: string }
> = {
  已支付: {
    label: "已支付",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  已收款: {
    label: "已收款",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  待支付: {
    label: "待支付",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  待收款: {
    label: "待收款",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  处理中: {
    label: "处理中",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  已退款: {
    label: "已退款",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
}

// 千分位
const fmt = (n: number) => n.toLocaleString("zh-CN")

export function SettlementManagement({ subTab }: SettlementManagementProps) {
  // 共用搜索状态
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // 结算管理筛选
  const [categoryFilter, setCategoryFilter] = useState<"all" | FeeCategory>("all")
  const [directionFilter, setDirectionFilter] = useState<"all" | "支出" | "收入">("all")
  const [settleBizFilter, setSettleBizFilter] = useState<"all" | BusinessType>("all")

  // 对账管理筛选：业务类型
  const [reconBizFilter, setReconBizFilter] = useState<"all" | BusinessType>("all")

  // 生成对账单弹窗
  const [genDialogOpen, setGenDialogOpen] = useState(false)

  // 驳回原因查看弹窗
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean
    item: (typeof mockReconciliations)[number] | null
  }>({ open: false, item: null })

  // ====== 统计 ======
  const pendingReconciliation = mockReconciliations.filter((r) => r.status === "待确认").length

  const settleStats = useMemo(() => {
    const totalPaid = mockSettlements
      .filter((s) => s.status === "已支付")
      .reduce((sum, s) => sum + s.amount, 0)
    const totalReceived = mockSettlements
      .filter((s) => s.status === "已收款")
      .reduce((sum, s) => sum + s.amount, 0)
    const totalToPay = mockSettlements
      .filter((s) => s.status === "待支付")
      .reduce((sum, s) => sum + s.amount, 0)
    const totalToReceive = mockSettlements
      .filter((s) => s.status === "待收款")
      .reduce((sum, s) => sum + s.amount, 0)
    return { totalPaid, totalReceived, totalToPay, totalToReceive }
  }, [])

  // ============ 视图一：对账管理（按四大业务统一） ============
  const renderReconciliation = () => {
    const filtered = mockReconciliations.filter((item) => {
      const matchesSearch =
        item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesBiz = reconBizFilter === "all" || item.businessType === reconBizFilter
      return matchesSearch && matchesStatus && matchesBiz
    })

    // 按业务类型分组计数（用于筛选 chip）
    const bizCount: Record<BusinessType | "all", number> = {
      all: mockReconciliations.length,
      仓储租赁: 0,
      物资存放: 0,
      物资租赁: 0,
      物资销售: 0,
    }
    mockReconciliations.forEach((r) => {
      bizCount[r.businessType] = (bizCount[r.businessType] ?? 0) + 1
    })

    return (
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">本月对账单</p>
                  <p className="text-2xl font-bold">{mockReconciliations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">待确认</p>
                  <p className="text-2xl font-bold">{pendingReconciliation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-rose-500/10">
                  <Ban className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">被驳回</p>
                  <p className="text-2xl font-bold">
                    {mockReconciliations.filter((r) => r.status === "被驳回").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已确认</p>
                  <p className="text-2xl font-bold">
                    {mockReconciliations.filter((r) => r.status === "已确认" || r.status === "已结算").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 对账列��� */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">对账单列表</CardTitle>
                <CardDescription>管理与合作伙伴的对账记录</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </Button>
                <Button size="sm" onClick={() => setGenDialogOpen(true)}>
                  <FileText className="h-4 w-4 mr-1" />
                  生成对账单
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 业务类型筛选 chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b">
              <span className="text-xs text-muted-foreground mr-1">业务类型：</span>
              {(["all", "仓储租赁", "物资存放", "物资租赁", "物资销售"] as const).map((b) => {
                const active = reconBizFilter === b
                const cfg = b === "all" ? null : businessTypeConfig[b]
                return (
                  <button
                    key={b}
                    onClick={() => setReconBizFilter(b)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {cfg && (
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    )}
                    {b === "all" ? "全部" : b}
                    <span
                      className={`tabular-nums text-[10px] rounded px-1 ${
                        active ? "bg-white/20" : "bg-background"
                      }`}
                    >
                      {bizCount[b]}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索合作方 / 对账单号 / 订单号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="对账状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="待确认">待确认</SelectItem>
                  <SelectItem value="已确认">已确认</SelectItem>
                  <SelectItem value="被驳回">被驳回</SelectItem>
                  <SelectItem value="已结算">已结算</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table className="table-fixed [&_th]:px-2 [&_td]:px-2">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[56px] text-center">序号</TableHead>
                    <TableHead className="w-[112px]">对账单号</TableHead>
                    <TableHead className="w-[140px]">关联订单号</TableHead>
                    <TableHead>合作方</TableHead>
                    <TableHead className="w-[140px]">业务类型</TableHead>
                    <TableHead className="w-[88px]">账期</TableHead>
                    <TableHead className="w-[128px] text-right">金额（元）</TableHead>
                    <TableHead className="w-[88px]">状态</TableHead>
                    <TableHead className="w-[96px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item, idx) => {
                    const statusInfo = reconciliationStatusConfig[item.status]
                    const StatusIcon = statusInfo?.icon || Clock
                    const hasConfirmed = item.confirmedAmount > 0
                    const isRejected = item.status === "被驳回"
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground truncate">
                          {item.orderId}
                        </TableCell>
                        <TableCell className="font-medium text-sm truncate" title={item.partner}>
                          {item.partner}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col leading-tight gap-0.5">
                            <Badge
                              variant="outline"
                              className={`${businessTypeConfig[item.businessType].chip} h-5 text-[11px] w-fit gap-1`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${businessTypeConfig[item.businessType].dot}`}
                              />
                              {item.businessType}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground truncate">
                              {item.subType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {item.period}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold text-foreground">
                              {fmt(item.amount)}
                            </span>
                            <span
                              className={`text-[11px] ${
                                isRejected
                                  ? "text-rose-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {isRejected
                                ? "已被驳回"
                                : hasConfirmed
                                  ? `确认 ${fmt(item.confirmedAmount)}`
                                  : "未确认"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusInfo?.variant || "default"}
                            className="gap-1 px-1.5 py-0 text-[11px] h-5"
                          >
                            <StatusIcon className="h-3 w-3" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-0">
                            {isRejected ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setRejectDialog({ open: true, item })
                                }
                                className="h-7 px-1.5 text-xs font-medium text-rose-700 hover:text-rose-800 hover:bg-rose-50"
                              >
                                <AlertCircle className="h-3.5 w-3.5 mr-0.5" />
                                驳回原因
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  查看
                                </Button>
                                {item.status === "待确认" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-1.5 text-xs font-medium text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                                  >
                                    确认
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============ 视图二：结算管理（按四大业务统一） ============
  const renderSettlement = () => {
    const filtered = mockSettlements.filter((item) => {
      const matchesSearch =
        item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesDirection = directionFilter === "all" || item.direction === directionFilter
      const matchesBiz = settleBizFilter === "all" || item.businessType === settleBizFilter
      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesDirection &&
        matchesBiz
      )
    })

    // 业务类型计数
    const bizCount: Record<BusinessType | "all", number> = {
      all: mockSettlements.length,
      仓储租赁: 0,
      物资存放: 0,
      物资租赁: 0,
      物资销售: 0,
    }
    mockSettlements.forEach((s) => {
      bizCount[s.businessType] = (bizCount[s.businessType] ?? 0) + 1
    })

    const categoryChips: Array<"all" | FeeCategory> = [
      "all",
      "押金",
      "保证金",
      "服务费",
      "仓储租金",
      "保管费",
      "物料租金",
      "运输费",
      "物料运营分成",
      "物资销售款",
      "销售分成",
      "退款",
    ]

    return (
      <div className="space-y-6">
        {/* 资金概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  本月已收
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">已收款总额</p>
              <p className="text-2xl font-bold tabular-nums text-emerald-700">
                ¥ {fmt(settleStats.totalReceived)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-rose-50">
                  <ArrowUpRight className="h-5 w-5 text-rose-600" />
                </div>
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                  本月已付
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">已支付总额</p>
              <p className="text-2xl font-bold tabular-nums text-rose-700">
                ¥ {fmt(settleStats.totalPaid)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-50">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  待收款
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">待收款总额</p>
              <p className="text-2xl font-bold tabular-nums text-amber-700">
                ¥ {fmt(settleStats.totalToReceive)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-50">
                  <Wallet className="h-5 w-5 text-amber-600" />
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  待支付
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">待支付总额</p>
              <p className="text-2xl font-bold tabular-nums text-amber-700">
                ¥ {fmt(settleStats.totalToPay)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 结算流水 */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">结算流水</CardTitle>
                <CardDescription>各类费用的支付与收款明细记录</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 业务类型筛选 chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground mr-1">业务类型：</span>
              {(["all", "仓储租赁", "物资存放", "物资租赁", "物资销售"] as const).map((b) => {
                const active = settleBizFilter === b
                const cfg = b === "all" ? null : businessTypeConfig[b]
                return (
                  <button
                    key={b}
                    onClick={() => setSettleBizFilter(b)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {cfg && (
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    )}
                    {b === "all" ? "全部" : b}
                    <span
                      className={`tabular-nums text-[10px] rounded px-1 ${
                        active ? "bg-white/20" : "bg-background"
                      }`}
                    >
                      {bizCount[b]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 费用类型筛选 chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b">
              <span className="text-xs text-muted-foreground mr-1">费用类型：</span>
              {categoryChips.map((c) => {
                const active = categoryFilter === c
                return (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {c === "all" ? "全部" : c}
                  </button>
                )
              })}
            </div>

            {/* 搜索 + 方向 + 状态 */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索流水号 / ��单号 / 合作方..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={directionFilter}
                onValueChange={(v) => setDirectionFilter(v as "all" | "支出" | "收入")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="收支方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方向</SelectItem>
                  <SelectItem value="支出">支出</SelectItem>
                  <SelectItem value="收入">收入</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="结算状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="已支付">已支付</SelectItem>
                  <SelectItem value="已收款">已收款</SelectItem>
                  <SelectItem value="待支付">待支付</SelectItem>
                  <SelectItem value="待收款">待收款</SelectItem>
                  <SelectItem value="处理中">处理中</SelectItem>
                  <SelectItem value="已退款">已退款</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 流水表格 */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[56px] text-center">序号</TableHead>
                    <TableHead className="w-[170px]">流水号</TableHead>
                    <TableHead className="w-[160px]">关联订单</TableHead>
                    <TableHead className="w-[110px]">业务类型</TableHead>
                    <TableHead className="w-[110px]">费用类型</TableHead>
                    <TableHead>对方单位</TableHead>
                    <TableHead className="w-[90px]">方向</TableHead>
                    <TableHead className="w-[140px] text-right">金额(元)</TableHead>
                    <TableHead className="w-[180px]">支付通道</TableHead>
                    <TableHead className="w-[180px]">发生时间</TableHead>
                    <TableHead className="w-[100px]">状态</TableHead>
                    <TableHead className="w-[120px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="py-12 text-center text-sm text-muted-foreground">
                        暂无匹配的结算流水
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((item, idx) => {
                      const cat = categoryConfig[item.category]
                      const CatIcon = cat?.icon || Receipt
                      const stat = settleStatusConfig[item.status]
                      const isIncome = item.direction === "收入"
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-mono text-xs whitespace-nowrap">
                            {item.id}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {item.orderId}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${businessTypeConfig[item.businessType].chip} h-5 text-[11px] gap-1`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${businessTypeConfig[item.businessType].dot}`}
                              />
                              {item.businessType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <CatIcon className={`w-4 h-4 ${cat?.iconColor ?? ""}`} />
                              <Badge
                                variant="outline"
                                className={`${cat?.chip ?? ""} text-[11px] h-5`}
                              >
                                {item.category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{item.partner}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium ${
                                isIncome ? "text-emerald-700" : "text-rose-700"
                              }`}
                            >
                              {isIncome ? (
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              )}
                              {item.direction}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`font-mono font-semibold tabular-nums ${
                                isIncome ? "text-emerald-700" : "text-rose-700"
                              }`}
                            >
                              {isIncome ? "+" : "-"} {fmt(item.amount)}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.channel}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.occurDate}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${stat.className} text-[11px] h-5`}>
                              {stat.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-0.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="w-3.5 h-3.5 mr-0.5" />
                                详情
                              </Button>
                              {item.voucherNo && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                >
                                  回单
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 当前条件汇总 */}
            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 mt-4 pt-3 border-t text-xs text-muted-foreground">
              <span>
                共 <span className="text-foreground font-semibold">{filtered.length}</span> 条流水
              </span>
              <span>
                金额合计：
                <span className="text-foreground font-semibold tabular-nums">
                  ¥ {fmt(filtered.reduce((sum, x) => sum + x.amount, 0))}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 公共弹窗：生成对账单 + 驳回原因
  const genDialog = (
    <>
      <GenerateReconciliationDialog
        open={genDialogOpen}
        onOpenChange={setGenDialogOpen}
      />

      <Dialog
        open={rejectDialog.open}
        onOpenChange={(o) =>
          setRejectDialog((d) => ({ ...d, open: o }))
        }
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-rose-100">
                <Ban className="h-4 w-4 text-rose-600" />
              </div>
              <span>对账单被驳回</span>
              <Badge
                variant="destructive"
                className="ml-1 text-[10px] h-5"
              >
                {rejectDialog.item?.id}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {rejectDialog.item && (
            <div className="space-y-4 pt-2">
              {/* 对账单概要 */}
              <div className="rounded-md border bg-muted/30 p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <div className="text-muted-foreground">关联订单</div>
                  <div className="font-mono mt-0.5">
                    {rejectDialog.item.orderId}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">业务类型</div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={`${businessTypeConfig[rejectDialog.item.businessType].chip} h-5 text-[11px] gap-1`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${businessTypeConfig[rejectDialog.item.businessType].dot}`}
                      />
                      {rejectDialog.item.businessType}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {rejectDialog.item.subType}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">合作方</div>
                  <div className="mt-0.5 truncate">
                    {rejectDialog.item.partner}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">对账金额</div>
                  <div className="mt-0.5 font-semibold tabular-nums">
                    ¥ {fmt(rejectDialog.item.amount)}
                  </div>
                </div>
              </div>

              {/* 驳回原因主体 */}
              <div className="rounded-md border border-rose-200 bg-rose-50/60 p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 mb-2">
                  <AlertCircle className="h-3.5 w-3.5" />
                  驳回原因
                </div>
                <p className="text-sm text-rose-900 leading-relaxed whitespace-pre-line">
                  {rejectDialog.item.rejectReason ?? "未填写驳回原因"}
                </p>
              </div>

              {/* 提交人与时间 */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {rejectDialog.item.rejectedBy ?? "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {rejectDialog.item.rejectedAt ?? "—"}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialog((d) => ({ ...d, open: false }))
              }
            >
              关闭
            </Button>
            <Button
              onClick={() => {
                setRejectDialog((d) => ({ ...d, open: false }))
                setGenDialogOpen(true)
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              修订后重新发起
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )

  // 根据 subTab 决定显示哪个视图（兼容旧路由）
  if (subTab) {
    if (subTab.includes("reconciliation")) {
      return (
        <>
          {renderReconciliation()}
          {genDialog}
        </>
      )
    }
    if (subTab.includes("payment") || subTab.includes("settle")) {
      return (
        <>
          {renderSettlement()}
          {genDialog}
        </>
      )
    }
  }

  // 默认通过顶部 Tabs 切换两个下级
  return (
    <div className="space-y-6">
      <Tabs defaultValue="reconciliation" className="w-full">
        <TabsList>
          <TabsTrigger value="reconciliation">对账管理</TabsTrigger>
          <TabsTrigger value="settle">结算管理</TabsTrigger>
        </TabsList>
        <TabsContent value="reconciliation" className="mt-6">
          {renderReconciliation()}
        </TabsContent>
        <TabsContent value="settle" className="mt-6">
          {renderSettlement()}
        </TabsContent>
      </Tabs>
      {genDialog}
    </div>
  )
}
