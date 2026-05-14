"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Download,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  FileText,
  Receipt,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// ============ 业务类型 ============
type BusinessType = "仓储租赁" | "物资存放" | "物资租赁" | "物资销售"
type FeeStatus = "待确认" | "已确认" | "已驳回"

const businessTypeConfig: Record<BusinessType, { chip: string; dot: string }> = {
  仓储租赁: { chip: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  物资存放: { chip: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  物资租赁: { chip: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  物资销售: { chip: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
}

const statusConfig: Record<FeeStatus, { chip: string; icon: typeof Clock }> = {
  待确认: { chip: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  已确认: { chip: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  已驳回: { chip: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
}

// ============ 服务费数据 ============
interface ServiceFeeItem {
  id: string
  orderId: string
  businessType: BusinessType
  partner: string
  baseAmount: number // 订单基础金额
  feeRate: number // 服务费率（%）
  amount: number // 应收服务费
  payChannel: string
  status: FeeStatus
  billDate: string // 出账时间
  confirmDate?: string // 确认时间
  voucherNo?: string // 电子回单号
  remark?: string
}

const mockData: ServiceFeeItem[] = [
  {
    id: "FW20260526100265",
    orderId: "WZXS20260513001",
    businessType: "物资销售",
    partner: "中铁十四局集团广州分公司",
    baseAmount: 3780000,
    feeRate: 0.5,
    amount: 18900,
    payChannel: "工商银行 对公转账",
    status: "待确认",
    billDate: "2026-05-26 09:12:00",
    voucherNo: "ICBC202605261893",
  },
  {
    id: "FW20260520100258",
    orderId: "CCJY20260315006",
    businessType: "仓储租赁",
    partner: "中铁十四局集团广州分公司",
    baseAmount: 125000,
    feeRate: 3.0,
    amount: 3750,
    payChannel: "建设银行 对公转账",
    status: "已确认",
    billDate: "2026-05-20 14:20:00",
    confirmDate: "2026-05-21 10:08:00",
    voucherNo: "CCB202605200421",
  },
  {
    id: "FW20260518100250",
    orderId: "WZCF20260420005",
    businessType: "物资存放",
    partner: "中铁十一局广深城际项目部",
    baseAmount: 45000,
    feeRate: 4.0,
    amount: 1800,
    payChannel: "工商银行 对公转账",
    status: "待确认",
    billDate: "2026-05-18 11:32:00",
    voucherNo: "ICBC202605180917",
  },
  {
    id: "FW20260515100242",
    orderId: "WZXS20260508004",
    businessType: "物资销售",
    partner: "中铁十四局集团广州分公司",
    baseAmount: 1104000,
    feeRate: 0.5,
    amount: 5520,
    payChannel: "招商银行 对公转账",
    status: "已确认",
    billDate: "2026-05-15 16:08:00",
    confirmDate: "2026-05-16 09:24:00",
    voucherNo: "CMB202605151204",
  },
  {
    id: "FW20260512100235",
    orderId: "WZJY20260428005",
    businessType: "物资租赁",
    partner: "中铁十二局物料分公司",
    baseAmount: 28000,
    feeRate: 5.0,
    amount: 1400,
    payChannel: "工商银行 对公转账",
    status: "已确认",
    billDate: "2026-05-12 10:00:00",
    confirmDate: "2026-05-13 11:15:00",
    voucherNo: "ICBC202605120516",
  },
  {
    id: "FW20260510100228",
    orderId: "WZXS20260510003",
    businessType: "物资销售",
    partner: "中铁建工集团第二建设有限公司",
    baseAmount: 1327200,
    feeRate: 0.5,
    amount: 6636,
    payChannel: "建设银行 对公转账",
    status: "待确认",
    billDate: "2026-05-10 13:48:00",
    voucherNo: "CCB202605101842",
  },
  {
    id: "FW20260508100220",
    orderId: "CCJY20260428005",
    businessType: "仓储租赁",
    partner: "中铁十六局集团华南分公司",
    baseAmount: 98000,
    feeRate: 3.0,
    amount: 2940,
    payChannel: "工商银行 对公转账",
    status: "已驳回",
    billDate: "2026-05-08 09:00:00",
    confirmDate: "2026-05-09 14:38:00",
    remark: "对账单与电子回单金额不符，差额 ¥120，已退回重新出具。",
  },
  {
    id: "FW20260505100212",
    orderId: "YYFC20260301002",
    businessType: "物资租赁",
    partner: "中铁建东莞虎门港务仓储基地",
    baseAmount: 85000,
    feeRate: 4.0,
    amount: 3400,
    payChannel: "招商银行 对公转账",
    status: "已确认",
    billDate: "2026-05-05 11:20:00",
    confirmDate: "2026-05-06 09:45:00",
    voucherNo: "CMB202605051108",
  },
  {
    id: "FW20260420100177",
    orderId: "WZCF20260420005",
    businessType: "物资存放",
    partner: "中铁建东莞虎门港务仓储基地",
    baseAmount: 32400,
    feeRate: 4.0,
    amount: 1296,
    payChannel: "工商银行 对公转账",
    status: "已确认",
    billDate: "2026-04-20 15:30:00",
    confirmDate: "2026-04-21 10:20:00",
    voucherNo: "ICBC202604200318",
  },
  {
    id: "FW20260420100170",
    orderId: "WZXS20260420005",
    businessType: "物资销售",
    partner: "中铁二十二局集团第一工程有限公司",
    baseAmount: 202500,
    feeRate: 0.5,
    amount: 1012.5,
    payChannel: "工商银行 对公转账",
    status: "已驳回",
    billDate: "2026-04-20 16:18:00",
    confirmDate: "2026-04-22 11:05:00",
    remark: "客户方对销售清单存在异议，需先完成对账驳回原因复核后再行确认。",
  },
]

const fmt = (n: number) =>
  n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function OperatorServiceFee() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | FeeStatus>("all")
  const [bizFilter, setBizFilter] = useState<"all" | BusinessType>("all")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    item: ServiceFeeItem | null
    mode: "confirm" | "reject"
  }>({ open: false, item: null, mode: "confirm" })
  const [rejectReason, setRejectReason] = useState("")

  // 统计卡数据
  const stats = useMemo(() => {
    const pending = mockData.filter((d) => d.status === "待确认")
    const confirmed = mockData.filter((d) => d.status === "已确认")
    const rejected = mockData.filter((d) => d.status === "已驳回")
    const monthIncoming = confirmed
      .filter((d) => d.billDate.startsWith("2026-05"))
      .reduce((s, d) => s + d.amount, 0)
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, d) => s + d.amount, 0),
      confirmedCount: confirmed.length,
      monthIncoming,
      rejectedCount: rejected.length,
    }
  }, [])

  // 业务类型计数
  const bizCount: Record<BusinessType | "all", number> = useMemo(() => {
    const c = { all: mockData.length, 仓储租赁: 0, 物资存放: 0, 物资租赁: 0, 物资销售: 0 }
    mockData.forEach((d) => {
      c[d.businessType] = (c[d.businessType] ?? 0) + 1
    })
    return c
  }, [])

  const filtered = mockData.filter((item) => {
    const matchesSearch =
      item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesBiz = bizFilter === "all" || item.businessType === bizFilter
    return matchesSearch && matchesStatus && matchesBiz
  })

  const openConfirm = (item: ServiceFeeItem, mode: "confirm" | "reject") => {
    setConfirmDialog({ open: true, item, mode })
    setRejectReason("")
  }

  return (
    <div className="space-y-4">
      {/* 顶部说明 */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">服务费收款管理</h2>
        <p className="text-sm text-muted-foreground mt-1">
          统一管理运营方应收的平台服务费 · 涉及四大业务的服务费收款确认与对账闭环
        </p>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <Badge variant="outline" className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200">
                需处理
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">待确认收款</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-semibold tabular-nums">{stats.pendingCount}</span>
              <span className="text-xs text-muted-foreground">笔</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              合计 ¥ <span className="tabular-nums">{fmt(stats.pendingAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200">
                本月
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">已确认入账</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-semibold tabular-nums">¥ {fmt(stats.monthIncoming)}</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              共 <span className="tabular-nums">{stats.confirmedCount}</span> 笔已确认
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <Badge variant="outline" className="text-[10px] h-5 bg-rose-50 text-rose-700 border-rose-200">
                需复核
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">已驳回</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-semibold tabular-nums">{stats.rejectedCount}</span>
              <span className="text-xs text-muted-foreground">笔</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">需财务/业务复核后重新出账</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-200">
                同比
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">本月服务费总额</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-semibold tabular-nums">¥ 86.4</span>
              <span className="text-xs text-muted-foreground">万</span>
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">
              较上月 +12.6% ↑
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主表 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              服务费收款清单
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 业务类型 chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground mr-1">业务类型：</span>
            {(["all", "仓储租赁", "物资存放", "物资租赁", "物资销售"] as const).map((b) => {
              const active = bizFilter === b
              const cfg = b === "all" ? null : businessTypeConfig[b]
              return (
                <button
                  key={b}
                  onClick={() => setBizFilter(b)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5 ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
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

          {/* 搜索 + 状态 */}
          <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索付款方 / 流水号 / 订单号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | FeeStatus)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="收款状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待确认">待确认</SelectItem>
                <SelectItem value="已确认">已确认</SelectItem>
                <SelectItem value="已驳回">已驳回</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground ml-auto">
              共 <span className="font-medium text-foreground tabular-nums">{filtered.length}</span> 条
            </div>
          </div>

          {/* 表格 */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px] text-center">序号</TableHead>
                  <TableHead className="w-[170px]">服务费流水号</TableHead>
                  <TableHead className="w-[160px]">关联订单</TableHead>
                  <TableHead className="w-[110px]">业务类型</TableHead>
                  <TableHead>付款方</TableHead>
                  <TableHead className="w-[140px] text-right">订单金额</TableHead>
                  <TableHead className="w-[80px] text-center">费率</TableHead>
                  <TableHead className="w-[140px] text-right">服务费(元)</TableHead>
                  <TableHead className="w-[160px]">支付通道</TableHead>
                  <TableHead className="w-[160px]">出账时间</TableHead>
                  <TableHead className="w-[100px]">状态</TableHead>
                  <TableHead className="w-[160px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="py-12 text-center text-sm text-muted-foreground">
                      暂无符合条件的服务费记录
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item, idx) => {
                    const sc = statusConfig[item.status]
                    const SIcon = sc.icon
                    const bc = businessTypeConfig[item.businessType]
                    return (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{item.id}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {item.orderId}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${bc.chip} h-5 text-[11px] gap-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${bc.dot}`} />
                            {item.businessType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{item.partner}</TableCell>
                        <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                          ¥ {fmt(item.baseAmount)}
                        </TableCell>
                        <TableCell className="text-center text-xs tabular-nums">{item.feeRate}%</TableCell>
                        <TableCell className="text-right tabular-nums font-semibold text-emerald-700">
                          ¥ {fmt(item.amount)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.payChannel}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                          {item.billDate}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${sc.chip} h-5 text-[11px] gap-1`}>
                            <SIcon className="w-3 h-3" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-0.5">
                            {item.status === "待确认" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-medium"
                                  onClick={() => openConfirm(item, "confirm")}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                                  确认
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2 text-rose-700 hover:text-rose-800 hover:bg-rose-50"
                                  onClick={() => openConfirm(item, "reject")}
                                >
                                  驳回
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="w-3.5 h-3.5 mr-0.5" />
                              详情
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 确认 / 驳回 弹窗 */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(o) => setConfirmDialog({ ...confirmDialog, open: o })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmDialog.mode === "confirm" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  确认服务费收款
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  驳回服务费收款
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.mode === "confirm"
                ? "确认服务费已实际到账后，记录将进入财务入账流程。"
                : "请填写驳回原因，付款方将收到通知重新出具对账。"}
            </DialogDescription>
          </DialogHeader>
          {confirmDialog.item && (
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">流水号</span>
                  <span className="font-mono text-xs">{confirmDialog.item.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">付款方</span>
                  <span className="text-xs">{confirmDialog.item.partner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">业务类型</span>
                  <Badge
                    variant="outline"
                    className={`${businessTypeConfig[confirmDialog.item.businessType].chip} h-5 text-[10px] gap-1`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${businessTypeConfig[confirmDialog.item.businessType].dot}`}
                    />
                    {confirmDialog.item.businessType}
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t">
                  <span className="text-muted-foreground text-xs">应收服务费</span>
                  <span className="text-base font-semibold tabular-nums text-emerald-700">
                    ¥ {fmt(confirmDialog.item.amount)}
                  </span>
                </div>
              </div>

              {confirmDialog.mode === "reject" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">驳回原因</Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请说明驳回原因，例如：金额不符、回单缺失、对账单未签章 等"
                    rows={4}
                    className="text-sm"
                  />
                </div>
              )}

              {confirmDialog.mode === "confirm" && confirmDialog.item.voucherNo && (
                <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-900">
                  <Receipt className="w-3.5 h-3.5" />
                  电子回单号：
                  <span className="font-mono">{confirmDialog.item.voucherNo}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            >
              取消
            </Button>
            {confirmDialog.mode === "confirm" ? (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                确认收款
              </Button>
            ) : (
              <Button
                variant="destructive"
                disabled={!rejectReason.trim()}
                onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              >
                <FileText className="w-4 h-4 mr-1" />
                提交驳回
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
