"use client"

import { useState, useMemo } from "react"
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
  CreditCard,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  PiggyBank,
  Truck,
  Building2,
  RefreshCw,
  Banknote,
} from "lucide-react"

interface SettlementManagementProps {
  subTab?: string
  roleType?: "property" | "warehouse-unit" | "warehouse-site" | "transport" | "user"
}

// ============ 对账数据（保留原数据） ============
const mockReconciliations = [
  {
    id: "DZ-2026-001",
    partner: "中铁十四局集团广州分公司",
    type: "仓储租赁",
    period: "2026年3月",
    amount: 125000,
    confirmedAmount: 125000,
    status: "已确认",
    createDate: "2026-04-01",
    confirmDate: "2026-04-03",
  },
  {
    id: "DZ-2026-002",
    partner: "中铁十一局广深城际项目部",
    type: "物资存放",
    period: "2026年3月",
    amount: 45000,
    confirmedAmount: 0,
    status: "待确认",
    createDate: "2026-04-01",
    confirmDate: "",
  },
  {
    id: "DZ-2026-003",
    partner: "中铁建东莞虎门港务仓储基地",
    type: "托管分成",
    period: "2026年3月",
    amount: 85000,
    confirmedAmount: 82000,
    status: "有差异",
    createDate: "2026-04-01",
    confirmDate: "",
  },
  {
    id: "DZ-2026-004",
    partner: "中铁十六局集团华南分公司",
    type: "仓储租赁",
    period: "2026年2月",
    amount: 98000,
    confirmedAmount: 98000,
    status: "已结算",
    createDate: "2026-03-01",
    confirmDate: "2026-03-05",
  },
]

// ============ 结算流水（按费用类型，覆盖支出与收入两个方向） ============
type FeeCategory =
  | "押金"
  | "保证金"
  | "服务费"
  | "仓储租金"
  | "保管费"
  | "物资租金"
  | "运输费"
  | "托管分成"
  | "退款"

type SettleStatus = "已支付" | "已收款" | "待支付" | "待收款" | "处理中" | "已退款"

interface SettleRecord {
  id: string // 流水号
  orderId: string // 关联订单号
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
    category: "押金",
    direction: "支出",
    partner: "中铁十二局物资分公司",
    amount: 36000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-05 10:08:45",
    voucherNo: "ICBC202605050100199",
  },
  // 保证金（物资存放）
  {
    id: "JS20260505100198",
    orderId: "WZCF20260505004",
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
    category: "服务费",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
    amount: 13500,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-28 16:11:38",
    voucherNo: "ICBC202604280100185",
  },
  {
    id: "JS20260420100177",
    orderId: "WZCF20260420005",
    category: "服务费",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
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
    category: "仓储租金",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
    amount: 37500,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-05-08 09:33:21",
    voucherNo: "ICBC202605080100190",
  },
  {
    id: "JS20260401100165",
    orderId: "CCJY20260315006",
    category: "仓储租金",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
    amount: 42000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-08 14:18:45",
    voucherNo: "ICBC202604080100165",
  },
  // 保管费（物资存放）
  {
    id: "JS20260415100170",
    orderId: "WZCF20260420005",
    category: "保管费",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
    amount: 16200,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-15 10:52:09",
    voucherNo: "ICBC202604150100170",
  },
  // 物资租金（物资交易）
  {
    id: "JS20260505100195",
    orderId: "WZJY20260428005",
    category: "物资租金",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
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
    category: "运输费",
    direction: "支出",
    partner: "广州顺通运输有限公司",
    amount: 12000,
    channel: "工商银行 对公转账",
    status: "已支付",
    occurDate: "2026-04-20 17:42:09",
    voucherNo: "ICBC202604200100180",
  },
  // 托管分成（站点 → 业主单位）
  {
    id: "JS20260410100168",
    orderId: "TG20260301002",
    category: "托管分成",
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
    category: "仓储租金",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
    amount: 37500,
    channel: "工商银行 对公转账",
    status: "待支付",
    occurDate: "2026-06-08 待支付",
  },
  {
    id: "JS20260605100212",
    orderId: "WZCF20260420005",
    category: "保管费",
    direction: "支出",
    partner: "中铁建物资华南专业运营有限公司",
    amount: 5400,
    channel: "工商银行 对公转账",
    status: "待支付",
    occurDate: "2026-06-15 待支付",
  },
  {
    id: "JS20260520100205",
    orderId: "TG20260301002",
    category: "托管分成",
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
    category: "退款",
    direction: "收入",
    partner: "中铁十四局集团广州分公司",
    amount: 50000,
    channel: "工商银行 原路退回",
    status: "已退款",
    occurDate: "2026-03-01 10:18:22",
    voucherNo: "ICBC202603010100150",
  },
]

// ============ 视觉映射 ============
const reconciliationStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle }
> = {
  已确认: { label: "已确认", variant: "default", icon: CheckCircle },
  待确认: { label: "待确认", variant: "secondary", icon: Clock },
  有差异: { label: "有差异", variant: "destructive", icon: AlertCircle },
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
  物资租金: {
    icon: Banknote,
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  运输费: {
    icon: Truck,
    chip: "bg-slate-50 text-slate-700 border-slate-200",
    iconColor: "text-slate-600",
  },
  托管分成: {
    icon: TrendingUp,
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconColor: "text-emerald-600",
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

  // ============ 视图一：对账管理（保留原内容） ============
  const renderReconciliation = () => {
    const filtered = mockReconciliations.filter((item) => {
      const matchesSearch =
        item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesSearch && matchesStatus
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
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">有差异</p>
                  <p className="text-2xl font-bold">
                    {mockReconciliations.filter((r) => r.status === "有差异").length}
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

        {/* 对账列表 */}
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
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  生成对账单
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索合作方或对账单号..."
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
                  <SelectItem value="有差异">有差异</SelectItem>
                  <SelectItem value="已结算">已结算</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">对账单号</TableHead>
                    <TableHead>合作方</TableHead>
                    <TableHead>业务类型</TableHead>
                    <TableHead>账期</TableHead>
                    <TableHead className="text-right">对账金额</TableHead>
                    <TableHead className="text-right">确认金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="w-[140px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => {
                    const statusInfo = reconciliationStatusConfig[item.status]
                    const StatusIcon = statusInfo?.icon || Clock
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.id}</TableCell>
                        <TableCell className="font-medium">{item.partner}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.period}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {fmt(item.amount)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {item.confirmedAmount > 0 ? fmt(item.confirmedAmount) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo?.variant || "default"} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-0.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                              查看
                            </Button>
                            {item.status === "待确认" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 font-medium text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                              >
                                确认
                              </Button>
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

  // ============ 视图二：结算管理（重新设计） ============
  const renderSettlement = () => {
    const filtered = mockSettlements.filter((item) => {
      const matchesSearch =
        item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesDirection = directionFilter === "all" || item.direction === directionFilter
      return matchesSearch && matchesStatus && matchesCategory && matchesDirection
    })

    const categoryChips: Array<"all" | FeeCategory> = [
      "all",
      "押金",
      "保证金",
      "服务费",
      "仓储租金",
      "保管费",
      "物资租金",
      "运输费",
      "托管分成",
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
                <Button size="sm">
                  <CreditCard className="h-4 w-4 mr-1" />
                  发起支付
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                  placeholder="搜索流水号 / 订单号 / 合作方..."
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
                    <TableHead className="w-[170px]">流水号</TableHead>
                    <TableHead className="w-[160px]">关联订单</TableHead>
                    <TableHead className="w-[110px]">费用类型</TableHead>
                    <TableHead>对方单位</TableHead>
                    <TableHead className="w-[90px]">方向</TableHead>
                    <TableHead className="w-[140px] text-right">金额(元)</TableHead>
                    <TableHead className="w-[180px]">支付通道</TableHead>
                    <TableHead className="w-[180px]">发生时间</TableHead>
                    <TableHead className="w-[100px]">状态</TableHead>
                    <TableHead className="w-[140px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                        暂无匹配的结算流水
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((item) => {
                      const cat = categoryConfig[item.category]
                      const CatIcon = cat?.icon || Receipt
                      const stat = settleStatusConfig[item.status]
                      const isIncome = item.direction === "收入"
                      const isPending = item.status === "待支付" || item.status === "待收款"
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs whitespace-nowrap">
                            {item.id}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {item.orderId}
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
                              {isPending && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 font-medium text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                                >
                                  {item.status === "待支付" ? "去支付" : "去催收"}
                                </Button>
                              )}
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

  // 根据 subTab 决定显示哪个视图（兼容旧路由）
  if (subTab) {
    if (subTab.includes("reconciliation")) return renderReconciliation()
    if (subTab.includes("payment") || subTab.includes("settle")) return renderSettlement()
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
    </div>
  )
}
