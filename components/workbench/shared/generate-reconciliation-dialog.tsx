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
  | "物资交易"
  | "物资运营分成"

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
  物资交易: [
    {
      id: "WZJY20260428005",
      title: "贝雷片 (321 型) ×420 片 · 短租",
      partner: "中铁十二局物资分公司",
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
  物资运营分成: [
    {
      id: "YYFC20260301002",
      title: "广州黄埔基地物资运营分成（钢构 + 周转材料）",
      partner: "中铁十二局集团有限公司",
      monthlyAmount: 165000, // 月度运营所得（含税）
      startDate: "2026-03",
      totalMonths: 12,
    },
    {
      id: "YYFC20251201001",
      title: "东莞虎门基地物资运营分成（盾构管片 + 贝雷片）",
      partner: "中铁建东莞虎门港务仓储基地",
      monthlyAmount: 220000,
      startDate: "2025-12",
      totalMonths: 24,
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
  物资交易: ShoppingCart,
  物资运营分成: TrendingUp,
}

const businessChipMap: Record<BusinessType, string> = {
  仓储租赁: "bg-blue-50 text-blue-700 border-blue-200",
  物资存放: "bg-indigo-50 text-indigo-700 border-indigo-200",
  物资交易: "bg-sky-50 text-sky-700 border-sky-200",
  物资运营分成: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
  // 物资运营分成默认 60% 给业主单位、40% 平台运营方
  const [sharePct, setSharePct] = useState<number>(60)
  const [remark, setRemark] = useState<string>("")

  // 切换业务类型时重置订单选择
  const orders = ORDER_BANK[businessType]
  const order = useMemo(
    () => orders.find((o) => o.id === orderId) ?? orders[0],
    [orderId, orders],
  )

  // 历史期数：从第 2 期开始展示已完成对账（最多 6 条），本期是 currentPeriodIndex
  const historyRows = useMemo(() => {
    if (!order) return []
    const seed = pseudoHash(order.id)
    // 假设当前已对账到第 N 期（N 至少为 2，便于展示"从 2 期开始"）
    const completed = Math.min(6, Math.max(2, (seed % 5) + 2))
    return Array.from({ length: completed - 1 }, (_, idx) => {
      const periodIdx = idx + 2 // 从第 2 期开始
      const ym = addMonths(order.startDate, periodIdx - 1)
      const billNo = `DZ-${ym.replace("-", "")}-${String(
        (seed + periodIdx * 31) % 1000,
      ).padStart(3, "0")}`
      const confirmDay = (seed + periodIdx) % 10 + 5
      return {
        periodIdx,
        ym,
        billNo,
        amount: order.monthlyAmount,
        confirmDate: `${ym}-${String(confirmDay).padStart(2, "0")}`,
        status: "已结算" as const,
      }
    })
  }, [order])

  // 本期对账（从第 2 期之后的下一期开始）
  const currentPeriodIdx = historyRows.length + 2
  const currentPeriodYM = order ? addMonths(order.startDate, currentPeriodIdx - 1) : ""

  // 计算本期金额
  const baseAmount = order?.monthlyAmount ?? 0
  const currentAmount = useMemo(() => {
    if (!order) return 0
    if (businessType === "物资运营分成") {
      // 分成金额 = 月运营所得 × sharePct%
      const months = cycle === "按月" ? 1 : cycle === "按年" ? 12 : order.totalMonths
      return Math.round(baseAmount * months * (sharePct / 100))
    }
    if (cycle === "按月") return baseAmount
    if (cycle === "按年") return baseAmount * 12
    return baseAmount * order.totalMonths
  }, [baseAmount, cycle, businessType, sharePct, order])

  // 周期标签
  const cycleLabel = useMemo(() => {
    if (!order) return ""
    if (cycle === "按月") return currentPeriodYM
    if (cycle === "按年") {
      const [y] = currentPeriodYM.split("-")
      return `${y} 年度`
    }
    return `${order.startDate} 至 ${addMonths(order.startDate, order.totalMonths - 1)} (一次性)`
  }, [cycle, currentPeriodYM, order])

  const Icon = businessIconMap[businessType]

  const handleSubmit = () => {
    if (!order) return
    onConfirm?.({
      businessType,
      orderId: order.id,
      cycle,
      period: cycleLabel,
      amount: currentAmount,
      sharePct: businessType === "物资运营分成" ? sharePct : undefined,
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
                    <SelectItem value="物资交易">物资交易</SelectItem>
                    <SelectItem value="物资运营分成">物资运营分成</SelectItem>
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
                    label={businessType === "物资运营分成" ? "月运营所得" : "月单价"}
                    value={`¥ ${fmt(order.monthlyAmount)}`}
                    accent
                  />
                  <InfoLine
                    label="租期 / 期数"
                    value={`${order.startDate} 起 · ${order.totalMonths} 期`}
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

          {/* 物资运营分成的比例配置 */}
          {businessType === "物资运营分成" && (
            <div className="rounded-lg border border-emerald-200 p-4 bg-emerald-50/40 space-y-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-medium text-emerald-900">运营分成比例</span>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200 text-[10px] h-5">
                  基于租金运营所得分配
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">业主单位（甲方）分成比例</Label>
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
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {p}/{100 - p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {order && (
                <div className="text-xs text-emerald-900/80 bg-white/60 rounded-md border border-emerald-200 px-3 py-2">
                  本期运营所得 ¥{" "}
                  <span className="font-semibold text-emerald-900">
                    {fmt(
                      order.monthlyAmount *
                        (cycle === "按月" ? 1 : cycle === "按年" ? 12 : order.totalMonths),
                    )}
                  </span>{" "}
                  × {sharePct}% ={" "}
                  <span className="font-semibold text-emerald-900">¥ {fmt(currentAmount)}</span>
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

          {/* 对账历史 */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">对账历史</span>
                <Badge variant="outline" className="text-[10px] h-5">
                  从第 2 期起 · 共 {historyRows.length} 期已结算
                </Badge>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">期数</TableHead>
                    <TableHead className="w-[140px]">对账单号</TableHead>
                    <TableHead>对账期间</TableHead>
                    <TableHead className="text-right">对账金额(元)</TableHead>
                    <TableHead className="w-[120px]">结算日期</TableHead>
                    <TableHead className="w-[90px]">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-6 text-center text-xs text-muted-foreground"
                      >
                        暂无历史对账记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    historyRows.map((r) => (
                      <TableRow key={r.periodIdx} className="text-sm">
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
                            {r.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

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
