"use client"

import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileText,
  Info,
  Paperclip,
  ScrollText,
  ShieldCheck,
} from "lucide-react"
import type { OrderType, PaymentOrder } from "./order-payment-dialog"

type ConfirmMode = "online" | "offline"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: PaymentOrder | null
  orderType: OrderType
  onConfirm: (mode: ConfirmMode) => void
}

function termOf(orderType: OrderType) {
  return {
    rent: orderType === "storage" ? "保管费" : "租金",
    deposit: orderType === "storage" ? "保证金" : "押金",
    tenant: orderType === "storage" ? "存放方" : "承租方",
    contractName:
      orderType === "warehouse"
        ? "仓储租赁合同"
        : orderType === "storage"
          ? "物资存放保管合同"
          : "物资交易租赁合同",
  }
}

function fmt(n: number) {
  return n.toLocaleString("zh-CN")
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// 模拟由出租方/平台上传的纸质合同附件（用于线下合同的确认查看）
function genOfflineAttachments(orderId: string, contractName: string) {
  return [
    {
      name: `${contractName}（已盖章）.pdf`,
      size: 2_456_120,
      uploadedAt: "2026-05-08 10:32",
    },
    {
      name: `合同附件-标的清单.pdf`,
      size: 587_300,
      uploadedAt: "2026-05-08 10:32",
    },
    {
      name: `营业执照-出租方.jpg`,
      size: 312_500,
      uploadedAt: "2026-05-08 10:33",
    },
  ]
}

export function OrderContractConfirmDialog({
  open,
  onOpenChange,
  order,
  orderType,
  onConfirm,
}: Props) {
  const [mode, setMode] = useState<ConfirmMode>("online")
  const [agreedOnline, setAgreedOnline] = useState(false)
  const [agreedOffline, setAgreedOffline] = useState(false)
  const [confirmedRead, setConfirmedRead] = useState(false)
  const [remark, setRemark] = useState("")

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setMode("online")
        setAgreedOnline(false)
        setAgreedOffline(false)
        setConfirmedRead(false)
        setRemark("")
      }, 200)
    }
  }, [open])

  if (!order) return null

  const term = termOf(orderType)
  const offlineFiles = genOfflineAttachments(order.id, term.contractName)

  const canSubmit =
    mode === "online"
      ? agreedOnline && confirmedRead
      : agreedOffline && confirmedRead

  const handleSubmit = () => {
    if (!canSubmit) return
    onConfirm(mode)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-orange-600" />
            确认合同
          </DialogTitle>
          <DialogDescription>
            请仔细核对合同条款后选择确认方式，确认后将进入合同签署环节
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 订单 & 合同信息 */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                {term.contractName}
              </div>
              <Badge variant="outline" className="font-mono text-[11px]">
                {order.id}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1">
              <InfoRow label="标的物" value={order.title} />
              <InfoRow label={term.tenant} value={order.payer} />
              <InfoRow label="出租方" value={order.depositPayee} />
              <InfoRow label="租期" value={order.periodLabel} />
              <InfoRow label="合同总额" value={`¥ ${fmt(order.totalAmount)}`} highlight />
              <InfoRow label={`${term.deposit}金额`} value={`¥ ${fmt(order.depositAmount)}`} />
            </div>
          </div>

          {/* 合同核心条款摘要 */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-primary" />
                合同核心条款
              </div>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] h-5"
              >
                请逐条核对
              </Badge>
            </div>
            <ul className="space-y-1.5 text-xs text-foreground/90 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">1.</span>
                <span>
                  合同有效期为 <strong>{order.periodLabel}</strong>，共{" "}
                  <strong>{order.totalMonths}</strong> 个月，{term.rent}按月支付，月{term.rent}
                  为 <strong>¥ {fmt(order.monthlyAmount)}</strong>。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">2.</span>
                <span>
                  {term.tenant}应于合同生效后 3 个工作日内缴纳{term.deposit}
                  <strong> ¥ {fmt(order.depositAmount)}</strong>
                  ，合同正常履约期满后无息退还（如有损失从中扣除）。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">3.</span>
                <span>
                  服务费一次性支付
                  <strong> ¥ {fmt(order.serviceFeeAmount)}</strong>
                  （约合同总额 3%），用于平台撮合及全周期服务保障。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">4.</span>
                <span>
                  {term.tenant}如逾期支付{term.rent}超 15 日，出租方有权单方解除合同并不予退还
                  {term.deposit}。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">5.</span>
                <span>合同到期前 30 日可申请续租，续租条款经双方协商后另行签订补充协议。</span>
              </li>
            </ul>
          </div>

          {/* 确认方式选择 */}
          <div>
            <Label className="text-sm font-medium flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              确认方式
            </Label>

            <Tabs value={mode} onValueChange={(v) => setMode(v as ConfirmMode)}>
              <TabsList className="grid grid-cols-2 w-full mb-3">
                <TabsTrigger value="online" className="gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  线上电子合同
                </TabsTrigger>
                <TabsTrigger value="offline" className="gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  线下纸质合同
                </TabsTrigger>
              </TabsList>

              {/* 线上确认 */}
              <TabsContent value="online" className="mt-0 space-y-3">
                <div className="rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-orange-100 p-2 shrink-0">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        电子合同已由出租方生成
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        请点击下方按钮跳转至电子合同详情页，逐条核对完整条款后返回确认
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 h-8 border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800 bg-transparent"
                        onClick={() => {
                          // 预留：跳转电子合同详情页
                          console.log("[v0] 跳转至电子合同详情页:", order.id)
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        查看电子合同详情
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border bg-muted/30 px-3 py-2.5 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      checked={confirmedRead}
                      onCheckedChange={(v) => setConfirmedRead(!!v)}
                      className="mt-0.5"
                    />
                    <span className="text-xs leading-relaxed text-foreground/90">
                      本人已完整阅读电子合同全部条款，对合同内容已知悉并无异议
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      checked={agreedOnline}
                      onCheckedChange={(v) => setAgreedOnline(!!v)}
                      className="mt-0.5"
                    />
                    <span className="text-xs leading-relaxed text-foreground/90">
                      同意按合同约定履行义务，并知悉合同自双方电子签署后生效
                    </span>
                  </label>
                </div>
              </TabsContent>

              {/* 线下确认 */}
              <TabsContent value="offline" className="mt-0 space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-primary" />
                      出租方已上传纸质合同扫描件
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5">
                      共 {offlineFiles.length} 份
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {offlineFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2 border"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium truncate text-foreground">
                              {f.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {formatSize(f.size)} · 上传于 {f.uploadedAt}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => console.log("[v0] 预览附件:", f.name)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-0.5" />
                            预览
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => console.log("[v0] 下载附件:", f.name)}
                          >
                            <Download className="w-3.5 h-3.5 mr-0.5" />
                            下载
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="offline-remark" className="text-xs text-muted-foreground mb-1.5">
                    备注（选填）
                  </Label>
                  <Textarea
                    id="offline-remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="如需补充说明（如合同寄出原件批次、邮寄追踪号等），可在此填写"
                    rows={2}
                    className="resize-none text-xs"
                  />
                </div>

                <div className="rounded-md border bg-muted/30 px-3 py-2.5 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      checked={confirmedRead}
                      onCheckedChange={(v) => setConfirmedRead(!!v)}
                      className="mt-0.5"
                    />
                    <span className="text-xs leading-relaxed text-foreground/90">
                      本人已下载并完整阅读纸质合同扫描件，对合同内容无异议
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      checked={agreedOffline}
                      onCheckedChange={(v) => setAgreedOffline(!!v)}
                      className="mt-0.5"
                    />
                    <span className="text-xs leading-relaxed text-foreground/90">
                      同意按合同约定履行义务，并承诺在 7 个工作日内寄回已盖章原件
                    </span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* 风险提示 */}
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <strong>风险提示：</strong>
              确认合同后将不可单方面撤销，进入签署环节。如发现条款异议请先驳回合同，由出租方修订后重新发起确认。
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => {
              console.log("[v0] 驳回合同:", order.id)
              onOpenChange(false)
            }}
            className="text-rose-700 hover:text-rose-800 hover:bg-rose-50 border-rose-200"
          >
            驳回合同
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {mode === "online" ? (
              <>
                <ArrowUpRight className="w-4 h-4 mr-1" />
                确认并前往签署
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                确认接受合同
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-muted-foreground shrink-0">{label}：</span>
      <span
        className={`truncate ${highlight ? "text-primary font-semibold tabular-nums" : "text-foreground"}`}
        title={value}
      >
        {value}
      </span>
    </div>
  )
}
