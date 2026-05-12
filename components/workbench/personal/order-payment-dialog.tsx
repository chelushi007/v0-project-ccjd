"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Calendar,
  CheckCircle2,
  Lock,
  Receipt,
  Shield,
  Smartphone,
  Wallet,
} from "lucide-react"

export type FeeKind = "deposit" | "serviceFee" | "rent"
export type OrderType = "warehouse" | "storage" | "trade"

export interface PaymentOrder {
  id: string
  title: string
  payer: string
  depositPayee: string
  periodLabel: string
  totalAmount: number
  totalMonths: number
  monthlyAmount: number
  depositAmount: number
  serviceFeeAmount: number
  rentStartDate: string // 如 "2026-05"
}

export interface PaymentRecord {
  depositPaid?: boolean
  serviceFeePaid?: boolean
  rentPaidMonths?: number
}

// 不同业务类型对应的术语
const TERMS: Record<
  OrderType,
  { deposit: string; rent: string; assetLabel: string; rentMonthly: string }
> = {
  warehouse: { deposit: "押金", rent: "租金", assetLabel: "标的仓储", rentMonthly: "月租金" },
  storage: { deposit: "保证金", rent: "保管费", assetLabel: "物资名称", rentMonthly: "月保管费" },
  trade: { deposit: "押金", rent: "租金", assetLabel: "标的物资", rentMonthly: "月租金" },
}

const HUANAN_COMPANY = "中铁建物资华南专业运营有限公司"
const ICBC_ACCOUNT = "6212 2602 0006 1234 567"
const ICBC_BRANCH = "工商银行 · 广州珠江支行"
const PHONE_MASKED = "138****8888"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: PaymentOrder | null
  orderType: OrderType
  defaultTab: FeeKind
  record: PaymentRecord
  onPay: (kind: FeeKind) => void
}

const fmt = (n: number) => n.toLocaleString("zh-CN")

// 按起始月份累加 i 个月，返回 "YYYY-MM" 格式
function addMonths(start: string, i: number): string {
  const [y, m] = start.split("-").map(Number)
  if (!y || !m) return start
  const date = new Date(y, m - 1 + i, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function OrderPaymentDialog({
  open,
  onOpenChange,
  order,
  orderType,
  defaultTab,
  record,
  onPay,
}: Props) {
  const [tab, setTab] = useState<FeeKind>(defaultTab)
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(0)

  // 切换订单或默认 tab 时，重置内部输入
  useEffect(() => {
    setTab(defaultTab)
    setCode("")
    setCountdown(0)
  }, [defaultTab, order?.id, open])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  if (!order) return null

  const term = TERMS[orderType]
  const depositPaid = !!record.depositPaid
  const serviceFeePaid = !!record.serviceFeePaid
  const rentPaidMonths = record.rentPaidMonths ?? 0
  const rentAllPaid = rentPaidMonths >= order.totalMonths

  const tabConfig: Record<
    FeeKind,
    {
      label: string
      icon: typeof Shield
      payee: string
      amount: number
      paid: boolean
      desc: string
    }
  > = {
    deposit: {
      label: term.deposit,
      icon: Shield,
      payee: order.depositPayee,
      amount: order.depositAmount,
      paid: depositPaid,
      desc: `${term.deposit}为合同保证金，签约后一次性支付，合同终止后无息退还`,
    },
    serviceFee: {
      label: "服务费",
      icon: Receipt,
      payee: HUANAN_COMPANY,
      amount: order.serviceFeeAmount,
      paid: serviceFeePaid,
      desc: "服务费用于平台撮合、订单管理与履约监管，一次性支付不予退还",
    },
    rent: {
      label: term.rent,
      icon: Calendar,
      payee: HUANAN_COMPANY,
      amount: order.monthlyAmount,
      paid: rentAllPaid,
      desc: `按月支付，共 ${order.totalMonths} 期，每期 ¥ ${fmt(order.monthlyAmount)}`,
    },
  }

  const cfg = tabConfig[tab]
  const canPay = !cfg.paid && code.length === 6

  const handlePay = () => {
    onPay(tab)
    setCode("")
    setCountdown(0)
  }

  const renderFeeContent = (kind: FeeKind) => {
    const c = tabConfig[kind]
    const Icon = c.icon
    return (
      <div className="space-y-4">
        {/* 订单信息 */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {order.id}
            </Badge>
            <span className="text-xs text-muted-foreground">订单信息</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <InfoRow label={term.assetLabel} value={order.title} colSpan={2} />
            <InfoRow label="租期/期限" value={order.periodLabel} />
            <InfoRow label="合同总额" value={`¥ ${fmt(order.totalAmount)}`} />
            <InfoRow label={term.rentMonthly} value={`¥ ${fmt(order.monthlyAmount)}`} />
            <InfoRow label="租赁期数" value={`${order.totalMonths} 个月`} />
          </div>
        </div>

        {/* 应付金额高亮 */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">本次应付 {c.label}</span>
              {c.paid && (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  已完成
                </Badge>
              )}
            </div>
            <div className="text-2xl font-bold text-primary tabular-nums">¥ {fmt(c.amount)}</div>
          </div>
          <div className="text-xs text-muted-foreground mt-1.5">{c.desc}</div>
        </div>

        {/* 租金支付进度与历史 */}
        {kind === "rent" && (
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {term.rent}支付进度
              </div>
              <div className="text-xs text-muted-foreground">
                已付{" "}
                <span className="text-primary font-semibold">{rentPaidMonths}</span> /{" "}
                {order.totalMonths} 期
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.min(100, (rentPaidMonths / order.totalMonths) * 100)}%`,
                }}
              />
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {rentPaidMonths === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-3">
                  暂无{term.rent}支付记录
                </div>
              ) : (
                Array.from({ length: rentPaidMonths }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-foreground">第 {i + 1} 期</span>
                      <span className="text-muted-foreground">
                        {addMonths(order.rentStartDate, i)}
                      </span>
                    </div>
                    <span className="font-mono text-foreground">¥ {fmt(order.monthlyAmount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 付款方 + 收款方 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PartyCard role="付款方" name={order.payer} accent="muted" />
          <PartyCard role="收款方" name={c.payee} accent="primary" />
        </div>

        {/* 支付方式与验证 */}
        {!c.paid && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                支付方式
              </div>
              <div className="rounded-lg border border-primary bg-primary/5 p-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-md bg-rose-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  ICBC
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{ICBC_BRANCH}</div>
                  <div className="font-mono text-xs text-muted-foreground mt-0.5">
                    {ICBC_ACCOUNT}
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary">已选</Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  手机验证码
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="请输入6位验证码"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="flex-1"
                    maxLength={6}
                  />
                  <Button
                    variant="outline"
                    disabled={countdown > 0}
                    onClick={() => setCountdown(60)}
                    className="shrink-0 w-32"
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  验证码将发送至预留手机号 {PHONE_MASKED}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            订单支付
          </DialogTitle>
          <DialogDescription>
            请核对支付信息后完成支付，工商银行对公账户扣款，扣款成功后立即生成电子凭证
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as FeeKind)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="deposit" className="gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              {term.deposit}
              {depositPaid && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </TabsTrigger>
            <TabsTrigger value="serviceFee" className="gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              服务费
              {serviceFeePaid && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </TabsTrigger>
            <TabsTrigger value="rent" className="gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {term.rent}
              {rentAllPaid && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="mt-4">
            {renderFeeContent("deposit")}
          </TabsContent>
          <TabsContent value="serviceFee" className="mt-4">
            {renderFeeContent("serviceFee")}
          </TabsContent>
          <TabsContent value="rent" className="mt-4">
            {renderFeeContent("rent")}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button disabled={!canPay} onClick={handlePay} className="min-w-40">
            {cfg.paid ? "已完成支付" : `确认支付 ¥ ${fmt(cfg.amount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({
  label,
  value,
  colSpan = 1,
}: {
  label: string
  value: string
  colSpan?: 1 | 2
}) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  )
}

function PartyCard({
  role,
  name,
  accent,
}: {
  role: string
  name: string
  accent: "primary" | "muted"
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        accent === "primary" ? "bg-primary/5 border-primary/30" : "bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Building2
          className={`w-3.5 h-3.5 ${
            accent === "primary" ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <span className="text-xs text-muted-foreground">{role}</span>
      </div>
      <div className="text-sm font-medium leading-snug">{name}</div>
    </div>
  )
}
