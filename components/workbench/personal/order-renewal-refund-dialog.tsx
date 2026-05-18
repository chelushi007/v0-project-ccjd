"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  CalendarPlus,
  CheckCircle2,
  CircleDollarSign,
  Hash,
  Info,
  Plus,
  Receipt,
  RotateCcw,
  Smartphone,
  Trash2,
  Undo2,
  Wallet,
} from "lucide-react"
import type { OrderType, PaymentOrder } from "./order-payment-dialog"

const HUANAN_COMPANY = "中铁建物资华南专业运营有限公司"
const ICBC_ACCOUNT = "6212 2602 0006 1234 567"
const ICBC_BRANCH = "工商银行 · 广州珠江支行"
const PHONE_MASKED = "138****8888"

const TERMS: Record<
  OrderType,
  { deposit: string; rent: string; rentMonthly: string; assetLabel: string }
> = {
  warehouse: { deposit: "押金", rent: "租金", rentMonthly: "月租金", assetLabel: "标的仓储" },
  storage: { deposit: "保证金", rent: "保管费", rentMonthly: "月保管费", assetLabel: "物资名称" },
  trade: { deposit: "押金", rent: "租金", rentMonthly: "月租金", assetLabel: "标的物资" },
}

const fmt = (n: number) => n.toLocaleString("zh-CN")

// 通用小型信息行
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-right">{value}</span>
    </div>
  )
}

// 收/付款方信息卡
function PartyCard({
  role,
  name,
  account,
  branch,
  tone,
}: {
  role: string
  name: string
  account: string
  branch: string
  tone: "payer" | "payee"
}) {
  const tint =
    tone === "payer"
      ? "border-amber-200 bg-amber-50/50"
      : "border-emerald-200 bg-emerald-50/50"
  const badgeCls =
    tone === "payer"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200"
  return (
    <div className={`rounded-lg border p-3 ${tint}`}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className={`text-[10px] h-5 ${badgeCls}`}>
          {role}
        </Badge>
        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground mb-1.5 leading-snug">{name}</div>
      <div className="text-[11px] text-muted-foreground space-y-0.5">
        <div className="font-mono tracking-tight">{account}</div>
        <div>{branch}</div>
      </div>
    </div>
  )
}

// ============================================================
// 续租弹窗
// ============================================================

export interface RenewalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: PaymentOrder | null
  orderType: OrderType
  /** 原合同到期日（YYYY-MM-DD），用于计算续租起始日 */
  originalEndDate?: string
  onConfirm: (info: {
    months: number
    monthlyAmount: number
    totalAmount: number
    serviceFee: number
    startDate: string
    endDate: string
  }) => void
}

const MONTH_OPTIONS = [3, 6, 12, 24]

function addDays(yyyymmdd: string, days: number): string {
  const [y, m, d] = yyyymmdd.split("-").map(Number)
  if (!y || !m || !d) return yyyymmdd
  const date = new Date(y, m - 1, d + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`
}

function addMonthsToDate(yyyymmdd: string, months: number): string {
  const [y, m, d] = yyyymmdd.split("-").map(Number)
  if (!y || !m || !d) return yyyymmdd
  const date = new Date(y, m - 1 + months, d - 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`
}

export function OrderRenewalDialog({
  open,
  onOpenChange,
  order,
  orderType,
  originalEndDate,
  onConfirm,
}: RenewalDialogProps) {
  const term = TERMS[orderType]
  const [months, setMonths] = useState<number>(12)
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!open) {
      setMonths(12)
      setCode("")
      setCountdown(0)
    }
  }, [open])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // 计算续租日期范围
  const { startDate, endDate, totalAmount, serviceFee } = useMemo(() => {
    if (!order) {
      return { startDate: "", endDate: "", totalAmount: 0, serviceFee: 0 }
    }
    // 若没传 originalEndDate，从 periodLabel 解析末段
    let end = originalEndDate
    if (!end) {
      const parts = order.periodLabel.split(" 至 ")
      end = parts[1]?.trim() || ""
    }
    const start = end ? addDays(end, 1) : ""
    const finish = start ? addMonthsToDate(start, months) : ""
    const total = order.monthlyAmount * months
    const fee = Math.round(total * 0.03)
    return { startDate: start, endDate: finish, totalAmount: total, serviceFee: fee }
  }, [order, originalEndDate, months])

  if (!order) return null

  const canConfirm = code.length === 6 && months > 0
  const handleConfirm = () => {
    if (!canConfirm) return
    onConfirm({
      months,
      monthlyAmount: order.monthlyAmount,
      totalAmount,
      serviceFee,
      startDate,
      endDate,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-sky-600" />
            续租申请
          </DialogTitle>
          <DialogDescription>
            原合同即将到期，请选择续租期限并完成签约确认，押金/保证金沿用原合同无需重复缴纳。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 订单信息 */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-sm font-medium flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-primary" />
              订单信息
            </div>
            <InfoRow
              label="订单号"
              value={<span className="font-mono text-xs">{order.id}</span>}
            />
            <Separator className="my-1" />
            <InfoRow label={term.assetLabel} value={order.title} />
            <Separator className="my-1" />
            <InfoRow label="原承租方" value={order.payer} />
            <Separator className="my-1" />
            <InfoRow label="原合同租期" value={order.periodLabel} />
            <Separator className="my-1" />
            <InfoRow
              label={term.rentMonthly}
              value={
                <span className="font-mono tabular-nums">¥ {fmt(order.monthlyAmount)}</span>
              }
            />
          </div>

          {/* 续租期限选择 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="text-sm font-medium flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-sky-600" />
              选择续租期限
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`h-10 rounded-md border text-sm font-medium transition-colors ${
                    months === m
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-border bg-card text-foreground hover:border-sky-300 hover:bg-muted/50"
                  }`}
                >
                  {m === 24 ? "24 个月" : `${m} 个月`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              续租{term.rent}与原合同保持一致；如需协商调整请联系客户经理。
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-md bg-muted/40 border px-3 py-2">
                <div className="text-[11px] text-muted-foreground mb-0.5">续租起始日</div>
                <div className="text-sm font-medium text-foreground font-mono">
                  {startDate || "—"}
                </div>
              </div>
              <div className="rounded-md bg-muted/40 border px-3 py-2">
                <div className="text-[11px] text-muted-foreground mb-0.5">续租到期日</div>
                <div className="text-sm font-medium text-foreground font-mono">
                  {endDate || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* 费用明细 */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="text-sm font-medium flex items-center gap-2 mb-1">
              <CircleDollarSign className="w-4 h-4 text-primary" />
              续租费用明细
            </div>
            <InfoRow
              label={`${term.rentMonthly} × ${months} 个月`}
              value={
                <span className="font-mono tabular-nums">
                  ¥ {fmt(order.monthlyAmount)} × {months}
                </span>
              }
            />
            <Separator />
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">续租总{term.rent}</span>
              <span className="font-mono text-base font-semibold text-primary tabular-nums">
                ¥ {fmt(totalAmount)}
              </span>
            </div>
            <Separator />
            <InfoRow
              label="续租服务费（3%）"
              value={
                <span className="font-mono tabular-nums text-amber-700">
                  ¥ {fmt(serviceFee)}
                </span>
              }
            />
            <Separator />
            <InfoRow
              label={`原合同${term.deposit}`}
              value={
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  沿用原合同，无需重复缴纳
                </Badge>
              }
            />
          </div>

          {/* 收款方 */}
          <PartyCard
            role="收款方"
            name={HUANAN_COMPANY}
            account={ICBC_ACCOUNT}
            branch={ICBC_BRANCH}
            tone="payee"
          />

          {/* 手机验证码 */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              手机验证码
            </div>
            <div className="text-[11px] text-muted-foreground">
              验证码将发送至预留手机号 {PHONE_MASKED}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="请输入 6 位验证码"
                maxLength={6}
                className="font-mono tracking-widest"
              />
              <Button
                variant="outline"
                disabled={countdown > 0}
                onClick={() => setCountdown(60)}
                className="shrink-0 w-28"
              >
                {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            确认续租
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// 退还押金/保证金弹窗
// ============================================================

export interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: PaymentOrder | null
  orderType: OrderType
  onConfirm: (info: {
    originalAmount: number
    deductions: Array<{ name: string; amount: number }>
    netRefund: number
  }) => void
}

interface DeductionRow {
  id: number
  name: string
  amount: string
}

export function OrderRefundDialog({
  open,
  onOpenChange,
  order,
  orderType,
  onConfirm,
}: RefundDialogProps) {
  const term = TERMS[orderType]
  const [deductions, setDeductions] = useState<DeductionRow[]>([])
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [nextId, setNextId] = useState(1)

  useEffect(() => {
    if (!open) {
      setDeductions([])
      setCode("")
      setCountdown(0)
      setNextId(1)
    }
  }, [open])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const totalDeduction = deductions.reduce(
    (sum, d) => sum + (Number(d.amount) || 0),
    0,
  )
  const original = order?.depositAmount ?? 0
  const netRefund = Math.max(0, original - totalDeduction)

  if (!order) return null

  const canConfirm =
    code.length === 6 &&
    netRefund >= 0 &&
    totalDeduction <= original &&
    deductions.every((d) => !d.name || (d.name && Number(d.amount) > 0))

  const addRow = () => {
    setDeductions((arr) => [...arr, { id: nextId, name: "", amount: "" }])
    setNextId((n) => n + 1)
  }
  const removeRow = (id: number) => {
    setDeductions((arr) => arr.filter((d) => d.id !== id))
  }
  const updateRow = (id: number, key: "name" | "amount", value: string) => {
    setDeductions((arr) =>
      arr.map((d) => (d.id === id ? { ...d, [key]: value } : d)),
    )
  }

  const handleConfirm = () => {
    if (!canConfirm) return
    onConfirm({
      originalAmount: original,
      deductions: deductions
        .filter((d) => d.name && Number(d.amount) > 0)
        .map((d) => ({ name: d.name, amount: Number(d.amount) })),
      netRefund,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Undo2 className="w-5 h-5 text-rose-600" />
            退还{term.deposit}
          </DialogTitle>
          <DialogDescription>
            合同已到期/已终止，请核对扣款项并确认退还{term.deposit}金额，款项将原路退还至承租方对公账户。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 订单信息 */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-sm font-medium flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-primary" />
              订单信息
            </div>
            <InfoRow
              label="订单号"
              value={<span className="font-mono text-xs">{order.id}</span>}
            />
            <Separator className="my-1" />
            <InfoRow label={term.assetLabel} value={order.title} />
            <Separator className="my-1" />
            <InfoRow label="承租方" value={order.payer} />
            <Separator className="my-1" />
            <InfoRow label="合同租期" value={order.periodLabel} />
            <Separator className="my-1" />
            <InfoRow
              label={`原${term.deposit}金额`}
              value={
                <span className="font-mono tabular-nums text-base font-semibold text-primary">
                  ¥ {fmt(original)}
                </span>
              }
            />
          </div>

          {/* 扣款项 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-rose-600" />
                扣款项明细
                {deductions.length > 0 && (
                  <Badge variant="outline" className="text-[10px] h-5">
                    {deductions.length} 项
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={addRow}
                className="h-8"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                添加扣款项
              </Button>
            </div>

            {deductions.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4 rounded-md bg-muted/40 border border-dashed">
                暂无扣款项，将全额退还{term.deposit}
              </div>
            ) : (
              <div className="space-y-2">
                {deductions.map((d) => (
                  <div key={d.id} className="flex items-center gap-2">
                    <Input
                      value={d.name}
                      onChange={(e) => updateRow(d.id, "name", e.target.value)}
                      placeholder="扣款项名称（如：违约金、设施损耗）"
                      className="flex-1"
                    />
                    <div className="relative w-36 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ¥
                      </span>
                      <Input
                        value={d.amount}
                        onChange={(e) =>
                          updateRow(
                            d.id,
                            "amount",
                            e.target.value.replace(/[^\d.]/g, ""),
                          )
                        }
                        placeholder="0.00"
                        className="pl-7 font-mono tabular-nums text-right"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 shrink-0"
                      onClick={() => removeRow(d.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {totalDeduction > original && (
                  <div className="text-xs text-rose-600 flex items-center gap-1 pt-1">
                    <Info className="w-3.5 h-3.5" />
                    扣款总额已超过原{term.deposit}，请调整。
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 退款金额概览 */}
          <div className="rounded-lg border-2 border-rose-200 bg-rose-50/50 p-4">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div className="text-[11px] text-muted-foreground mb-0.5">
                  原{term.deposit}
                </div>
                <div className="text-sm font-semibold font-mono tabular-nums">
                  ¥ {fmt(original)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground mb-0.5">扣款合计</div>
                <div className="text-sm font-semibold font-mono tabular-nums text-amber-700">
                  − ¥ {fmt(totalDeduction)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground mb-0.5">实退金额</div>
                <div className="text-base font-bold font-mono tabular-nums text-rose-700">
                  ¥ {fmt(netRefund)}
                </div>
              </div>
            </div>
            <Separator className="bg-rose-200" />
            <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              退款将于审核通过后 1-3 个工作日内原路退至承租方对公账户。
            </div>
          </div>

          {/* 收款方（承租方）账户信息 */}
          <div className="rounded-lg border p-3 bg-emerald-50/50 border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="text-[10px] h-5 bg-emerald-100 text-emerald-700 border-emerald-200"
              >
                退款收款方
              </Badge>
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1.5 leading-snug">
              {order.payer}
            </div>
            <div className="text-[11px] text-muted-foreground space-y-0.5">
              <div className="flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                <span className="font-mono tracking-tight">{ICBC_ACCOUNT}</span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{ICBC_BRANCH}</span>
              </div>
            </div>
          </div>

          {/* 手机验证码 */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              手机验证码
            </div>
            <div className="text-[11px] text-muted-foreground">
              验证码将发送至预留手机号 {PHONE_MASKED}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="请输入 6 位验证码"
                maxLength={6}
                className="font-mono tracking-widest"
              />
              <Button
                variant="outline"
                disabled={countdown > 0}
                onClick={() => setCountdown(60)}
                className="shrink-0 w-28"
              >
                {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            确认退还
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

