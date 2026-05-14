"use client"

import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  History,
  Info,
  PackageOpen,
  Percent,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"

export type BusinessType =
  | "仓储租赁"
  | "物资存放"
  | "物资租赁"
  | "物资销售"

export type ReconCycle = "按月" | "按年" | "一次性"

interface OrderOption {
  id: string
  title: string
  partner: string
  monthlyAmount: number
  startDate: string // YYYY-MM
  totalMonths: number
}

// 候选订单（与订单管理保持一致的命名规则）
const ORDER_BANK: Record<BusinessType, OrderOption[]> = {
  仓储租赁: [
    {
      id: "CCJY20260428005",
      title: "中铁建广州黄埔仓储基地 B 区 1200m²",
      partner: "中铁十四局集团广州分公司",
      monthlyAmount: 37500,
      startDate: "2026-04",
      totalMonths: 12,
    },
    {
      id: "CCJY20260315006",
      title: "中铁十六局佛山顺德钢构仓储基地 A 区 800m²",
      partner: "中铁十一局广深城际项目部",
      monthlyAmount: 42000,
      startDate: "2026-03",
      totalMonths: 12,
    },
    {
      id: "CCJY20251015007",
      title: "中铁建东莞虎门港务仓储基地 C 区 1500m²",
      partner: "中铁十二局集团有限公司",
      monthlyAmount: 51000,
      startDate: "2025-10",
      totalMonths: 24,
    },
  ],
  物资存放: [
    {
      id: "WZCF20260420005",
      title: "盾构机管片 ×320 套",
      partner: "中铁十一局广深城际项目部",
      monthlyAmount: 5400,
      startDate: "2026-04",
      totalMonths: 12,
    },
    {
      id: "WZCF20260301006",
      title: "钢板桩 Ⅲ 型 ×1800 根",
      partner: "中铁十六局集团华南分公司",
      monthlyAmount: 7200,
      startDate: "2026-03",
      totalMonths: 6,
    },
  ],
  物资租赁: [
    {
      id: "WZJY20260428005",
      title: "贝雷片 (321 型) ×420 片 · 短租",
      partner: "中铁十二局物料分公司",
      monthlyAmount: 28000,
      startDate: "2026-04",
      totalMonths: 6,
    },
    {
      id: "WZJY20260315006",
      title: "盘扣式脚手架 ×2000m³ · 长租",
      partner: "中铁十四局集团广州分公司",
      monthlyAmount: 35000,
      startDate: "2026-03",
      totalMonths: 12,
    },
  ],
  物资销售: [
    {
      id: "WZXS20260513001",
      title: "万能杆件 ×800 套 · 销售分成",
      partner: "中铁十四局集团广州分公司",
      monthlyAmount: 315000, // 月度销售额（销售分成基数）
      startDate: "2026-05",
      totalMonths: 12,
    },
    {
      id: "WZXS20260510003",
      title: "盘扣式脚手架配件包 · 销售分成",
      partner: "中铁建工集团第二建设有限公司",
      monthlyAmount: 165600,
      startDate: "2026-05",
      totalMonths: 12,
    },
  ],
}

interface GenerateReconciliationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (payload: {
    businessType: BusinessType
    orderId: string
    cycle: ReconCycle
    period: string
    amount: number
    sharePct?: number
  }) => void
}

// 月份累加 "YYYY-MM" + i 个月 -> "YYYY-MM"
function addMonths(start: string, i: number): string {
  const [y, m] = start.split("-").map(Number)
  if (!y || !m) return start
  const d = new Date(y, m - 1 + i, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

// 稳定伪随机：用于生成历史对账单号
function pseudoHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

const fmt = (n: number) => Math.round(n).toLocaleString("zh-CN")

const businessIconMap: Record<BusinessType, typeof Building2> = {
  仓储租赁: Building2,
  物资存放: PackageOpen,
  物资租赁: TrendingUp,
  物资销售: ShoppingCart,
}

const businessChipMap: Record<BusinessType, string> = {
  仓储租赁: "bg-blue-50 text-blue-700 border-blue-200",
  物资存放: "bg-indigo-50 text-indigo-700 border-indigo-200",
  物资租赁: "bg-emerald-50 text-emerald-700 border-emerald-200",
  物资销售: "bg-amber-50 text-amber-700 border-amber-200",
}

export function GenerateReconciliationDialog({
  open,
  onOpenChange,
  onConfirm,
}: GenerateReconciliationDialogProps) {
  const [businessType, setBusinessType] = useState<BusinessType>("仓储租赁")
  const [orderId, setOrderId] = useState<string>(ORDER_BANK["仓储租赁"][0].id)
  const [cycle, setCycle] = useState<ReconCycle>("按月")
  const [period, setPeriod] = useState<string>("2026-05")
  // 物资销售默认 60% 给业主单位、40% 平台运营方
  const [sharePct, setSharePct] = useState<number>(60)
  const [remark, setRemark] = useState<string>("")

  // 切换业务类型时重置订单选择
  const orders = ORDER_BANK[businessType]
  const order = useMemo(
    () => orders.find((o) => o.id === orderId) ?? orders[0],
    [orderId, orders],
  )

  // 周期换算：1 期相当于多少个月
  const monthsPerPeriod = useMemo(() => {
    if (!order) return 1
    if (cycle === "按月") return 1
    if (cycle === "按年") return 12
    return order.totalMonths // 一次性 = 整个合同期
  }, [cycle, order])

  // 合同共有多少期（按当前 cycle 计算）
  const totalPeriods = useMemo(() => {
    if (!order) return 0
    if (cycle === "按月") return order.totalMonths
    if (cycle === "按年") return Math.max(1, Math.ceil(order.totalMonths / 12))
    return 1
  }, [cycle, order])

  // 单期金额（含分成换算）：1 期对应 monthsPerPeriod 个月的金额
  const perPeriodAmount = useMemo(() => {
    if (!order) return 0
    const base = order.monthlyAmount * monthsPerPeriod
    return businessType === "物资销售"
      ? Math.round(base * (sharePct / 100))
      : base
  }, [order, monthsPerPeriod, businessType, sharePct])

  // 第 periodIdx 期的"对账期间"显示文本
  const periodLabelOf = (periodIdx: number): string => {
    if (!order) return ""
    if (cycle === "按月") return addMonths(order.startDate, periodIdx - 1)
    if (cycle === "按年") {
      const startMonths = (periodIdx - 1) * 12
      const startYM = addMonths(order.startDate, startMonths)
      const startY = startYM.split("-")[0]
      return `${startY} 年度`
    }
    return `${order.startDate} 至 ${addMonths(order.startDate, order.totalMonths - 1)}`
  }

  // 第 periodIdx 期的预计结算日：取期间末月的中旬
  const expectedSettleDate = (periodIdx: number): string => {
    if (!order) return ""
    const endMonthIdx = periodIdx * monthsPerPeriod - 1
    const endYM = addMonths(order.startDate, Math.min(endMonthIdx, order.totalMonths - 1))
    return `${endYM}-15`
  }

  // 历史期数：从第 2 期开始（即合同已开始至少 2 个周期才有历史），最多 6 条
  const historyRows = useMemo(() => {
    if (!order || totalPeriods < 2) return []
    const seed = pseudoHash(`${order.id}-${cycle}`)
    // 已完成期数：上限 6 条、不超过总期数-1（至少留 1 期未对账）
    const maxHist = Math.min(6, totalPeriods - 1)
    if (maxHist < 1) return []
    const completed = Math.max(1, (seed % maxHist) + 1)
    return Array.from({ length: completed }, (_, idx) => {
      const periodIdx = idx + 2 // 从第 2 期开始
      const label = periodLabelOf(periodIdx)
      const endYM = addMonths(
        order.startDate,
        Math.min(periodIdx * monthsPerPeriod - 1, order.totalMonths - 1),
      )
      const billNo = `DZ-${endYM.replace("-", "")}-${String(
        (seed + periodIdx * 31) % 1000,
      ).padStart(3, "0")}`
      const confirmDay = ((seed + periodIdx) % 10) + 5
      return {
        periodIdx,
        ym: label,
        billNo,
        amount: perPeriodAmount,
        confirmDate: `${endYM}-${String(confirmDay).padStart(2, "0")}`,
        status: "已结算" as const,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, cycle, totalPeriods, perPeriodAmount, monthsPerPeriod])

  // 本期：紧接历史末尾的下一期
  const currentPeriodIdx = historyRows.length + 2 > totalPeriods ? totalPeriods : historyRows.length + 2
  const currentPeriodYM = periodLabelOf(currentPeriodIdx)

  // 本期金额 = 单期金额（与对账全景中"单期金额"完全一致）
  const currentAmount = perPeriodAmount

  // 周期标签：直接复用周期感知的 periodLabelOf
  const cycleLabel = currentPeriodYM

  const Icon = businessIconMap[businessType]

  const handleSubmit = () => {
    if (!order) return
    onConfirm?.({
      businessType,
      orderId: order.id,
      cycle,
      period: cycleLabel,
      amount: currentAmount,
      sharePct: businessType === "物资销售" ? sharePct : undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto sm:!max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            生成对账单
          </DialogTitle>
          <DialogDescription>
            选择业务类型与订单，确认本期对账金额后自动生成对账单并发送给合作方确认
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* 业务类型 + 订单选择 */}
          <div className="rounded-lg border p-4 space-y-4 bg-muted/20">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">业务类型与订单</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">业务类型 *</Label>
                <Select
                  value={businessType}
                  onValueChange={(v) => {
                    const t = v as BusinessType
                    setBusinessType(t)
                    setOrderId(ORDER_BANK[t][0].id)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="仓储租赁">仓储租赁</SelectItem>
                    <SelectItem value="物资存放">物资存放</SelectItem>
                    <SelectItem value="物资租赁">物资租赁</SelectItem>
                    <SelectItem value="物资销售">物资销售</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">关联订单 *</Label>
                <Select value={orderId} onValueChange={setOrderId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.id} · {o.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 订单详细信息 */}
            {order && (
              <div className="rounded-md border bg-card p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">{order.title}</span>
                  </div>
                  <Badge variant="outline" className={businessChipMap[businessType]}>
                    {businessType}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                  <InfoLine label="订单号" value={order.id} mono />
                  <InfoLine label="合作方" value={order.partner} />
                  <InfoLine
                    label={businessType === "物资销售" ? "累计销售总额" : "合同总金额"}
                    value={`¥ ${fmt(order.monthlyAmount * order.totalMonths)}`}
                    accent
                  />
                  <InfoLine
                    label={businessType === "物资销售" ? "销售周期" : "租期"}
                    value={`${order.startDate} 起 · 共 ${order.totalMonths} 个月`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 对账周期 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">对账周期</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["按月", "按年", "一次性"] as ReconCycle[]).map((c) => {
                const active = cycle === c
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCycle(c)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    {c}对账
                  </button>
                )
              })}
            </div>
            <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              本期对账周期：
              <span className="text-foreground font-medium">{cycleLabel || "-"}</span>
            </div>
          </div>

          {/* 物资销售的分成比例配置 */}
          {businessType === "物资销售" && (
            <div className="rounded-lg border border-amber-200 p-4 bg-amber-50/40 space-y-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-medium text-amber-900">销售分成比例</span>
                <Badge variant="outline" className="bg-white text-amber-700 border-amber-200 text-[10px] h-5">
                  基于销售总额分配
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">供货方（甲方）分成比例</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={sharePct}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (Number.isFinite(v)) setSharePct(Math.min(100, Math.max(0, v)))
                      }}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">平台运营方（乙方）</Label>
                  <div className="rounded-md border bg-card px-3 h-9 flex items-center text-sm text-muted-foreground">
                    自动计算 ：
                    <span className="ml-1 text-foreground font-semibold">{100 - sharePct}%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">常用比例</Label>
                  <div className="flex gap-1">
                    {[50, 55, 60, 70].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSharePct(p)}
                        className={`flex-1 h-9 rounded-md border text-xs transition-colors ${
                          sharePct === p
                            ? "border-amber-600 bg-amber-600 text-white"
                            : "border-amber-200 bg-white text-amber-700 hover:bg-amber-50"
                        }`}
                      >
                        {p}/{100 - p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {order && (
                <div className="text-xs text-amber-900/80 bg-white/60 rounded-md border border-amber-200 px-3 py-2">
                  本期销售总额 ¥{" "}
                  <span className="font-semibold text-amber-900">
                    {fmt(
                      order.monthlyAmount *
                        (cycle === "按月" ? 1 : cycle === "按年" ? 12 : order.totalMonths),
                    )}
                  </span>{" "}
                  × {sharePct}% ={" "}
                  <span className="font-semibold text-amber-900">¥ {fmt(currentAmount)}</span>
                  （甲方应得分成金额）
                </div>
              )}
            </div>
          )}

          {/* 本期对账金额（汇总） */}
          <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">本期对账金额</span>
                <Badge variant="outline" className="bg-white text-primary border-primary/30 text-[10px] h-5">
                  第 {currentPeriodIdx} 期
                </Badge>
              </div>
              <div className="text-2xl font-bold tabular-nums text-primary">
                ¥ {fmt(currentAmount)}
              </div>
            </div>
          </div>

          {/* 对账全景 */}
          {order && (() => {
            const settledCount = historyRows.length // 已对账期数（第 2 期起的历史）
            const settledAmount = historyRows.reduce((s, r) => s + r.amount, 0)
            const unsettledCount = Math.max(0, totalPeriods - settledCount)
            // 未对账金额：剩余期数 × 单期金额
            const unsettledAmount = unsettledCount * perPeriodAmount
            // 累计对账金额（合同周期总额，按当前对账周期换算）
            const totalAmountAll = totalPeriods * perPeriodAmount
            const settledPct = Math.min(
              100,
              Math.round((settledAmount / Math.max(1, totalAmountAll)) * 100),
            )

            // 待对账明细：从"本期"开始，最多展示 6 行
            const pendingRows = Array.from(
              { length: Math.min(6, unsettledCount) },
              (_, idx) => {
                const periodIdx = settledCount + 2 + idx // 紧接历史末尾的下一期
                return {
                  periodIdx,
                  ym: periodLabelOf(periodIdx),
                  expectedDate: expectedSettleDate(periodIdx),
                  amount: perPeriodAmount,
                  isCurrent: idx === 0,
                }
              },
            )

            // 周期单位名称
            const cycleUnit = cycle === "按月" ? "月" : cycle === "按年" ? "年" : "次"
            const perPeriodLabel =
              cycle === "按月" ? "月对账金额" : cycle === "按年" ? "年对账金额" : "一次性对账金额"
            const perPeriodSub =
              businessType === "物资销售"
                ? `按 ${sharePct}% 分成`
                : cycle === "按月"
                  ? "每月 1 次"
                  : cycle === "按年"
                    ? "每年 1 次"
                    : "全周期 1 次"

            return (
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">对账全景</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 bg-primary/5 text-primary border-primary/30"
                    >
                      {cycle}对账
                    </Badge>
                    <Badge variant="outline" className="text-[10px] h-5">
                      共 {totalPeriods} {cycleUnit} · 已结算 {settledCount} {cycleUnit} ·
                      待对账 {unsettledCount} {cycleUnit}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    累计进度{" "}
                    <span className="text-foreground font-semibold">{settledPct}%</span>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${settledPct}%` }}
                  />
                </div>

                {/* 4 张统计卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <StatBox
                    label="已对账金额"
                    value={`¥ ${fmt(settledAmount)}`}
                    sub={`${settledCount} ${cycleUnit} / ${totalPeriods} ${cycleUnit}`}
                    tone="success"
                  />
                  <StatBox
                    label="未对账金额"
                    value={`¥ ${fmt(unsettledAmount)}`}
                    sub={`${unsettledCount} ${cycleUnit}待对账`}
                    tone="warning"
                  />
                  <StatBox
                    label="累计对账金额"
                    value={`¥ ${fmt(totalAmountAll)}`}
                    sub="合同周期总额"
                    tone="primary"
                  />
                  <StatBox
                    label={perPeriodLabel}
                    value={`¥ ${fmt(perPeriodAmount)}`}
                    sub={perPeriodSub}
                    tone="default"
                  />
                </div>

                {/* 历史 + 未对账 合并表 */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">期数</TableHead>
                        <TableHead className="w-[150px]">对账单号</TableHead>
                        <TableHead>对账期间</TableHead>
                        <TableHead className="text-right">对账金额(元)</TableHead>
                        <TableHead className="w-[130px]">结算/计划日期</TableHead>
                        <TableHead className="w-[100px]">状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* 已结算的历史记录 */}
                      {historyRows.map((r) => (
                        <TableRow key={`h-${r.periodIdx}`} className="text-sm">
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] h-5">
                              第 {r.periodIdx} 期
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{r.billNo}</TableCell>
                          <TableCell className="text-muted-foreground">{r.ym}</TableCell>
                          <TableCell className="text-right font-mono tabular-nums">
                            {fmt(r.amount)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {r.confirmDate}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              已结算
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* 待对账期数（含本期） */}
                      {pendingRows.map((r) => (
                        <TableRow
                          key={`p-${r.periodIdx}`}
                          className={`text-sm ${
                            r.isCurrent ? "bg-primary/5" : ""
                          }`}
                        >
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] h-5 ${
                                r.isCurrent
                                  ? "bg-primary/10 text-primary border-primary/30"
                                  : ""
                              }`}
                            >
                              第 {r.periodIdx} 期
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {r.isCurrent ? "本期待生成" : "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {r.ym}
                            {r.isCurrent && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-[10px] h-5 bg-primary text-primary-foreground border-primary"
                              >
                                本期
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                            {fmt(r.amount)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {r.expectedDate}（预计）
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 text-xs ${
                                r.isCurrent ? "text-primary" : "text-amber-700"
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              {r.isCurrent ? "本期待对账" : "待对账"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}

                      {historyRows.length === 0 && pendingRows.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-6 text-center text-xs text-muted-foreground"
                          >
                            暂无对账记录
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {unsettledCount > 6 && (
                  <div className="text-[11px] text-muted-foreground text-center">
                    后续还有 {unsettledCount - 6} {cycleUnit}未列出 · 将按{cycle}周期自动生成
                  </div>
                )}
              </div>
            )
          })()}

          {/* 其他信息 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="text-sm font-medium">其他信息</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">对账确认截止时间</Label>
                <Input type="date" defaultValue="2026-06-15" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">合作方对接人</Label>
                <Input placeholder="财务负责人姓名 / 工号" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">备注（可选）</Label>
              <Textarea
                placeholder="如有调整项、违约扣减、补差额等情况请在此说明…"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            生成对账单并发送
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoLine({
  label,
  value,
  mono,
  accent,
}: {
  label: string
  value: string
  mono?: boolean
  accent?: boolean
}) {
  return (
    <div className="space-y-0.5">
      <div className="text-muted-foreground">{label}</div>
      <div
        className={[
          "leading-tight",
          mono ? "font-mono text-[11px]" : "",
          accent ? "text-primary font-semibold tabular-nums" : "text-foreground font-medium",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub?: string
  tone: "success" | "warning" | "primary" | "default"
}) {
  const toneCls =
    tone === "success"
      ? "bg-emerald-50 border-emerald-200"
      : tone === "warning"
        ? "bg-amber-50 border-amber-200"
        : tone === "primary"
          ? "bg-primary/5 border-primary/30"
          : "bg-muted/40 border-border"
  const valueToneCls =
    tone === "success"
      ? "text-emerald-700"
      : tone === "warning"
        ? "text-amber-700"
        : tone === "primary"
          ? "text-primary"
          : "text-foreground"
  return (
    <div className={`rounded-md border px-3 py-2 ${toneCls}`}>
      <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
      <div
        className={`text-base font-semibold tabular-nums leading-tight ${valueToneCls}`}
      >
        {value}
      </div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  )
}
