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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowUpRight,
  CheckCircle2,
  FileSignature,
  FileText,
  Info,
  Paperclip,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import type { OrderType, PaymentOrder } from "./order-payment-dialog"

type SignMode = "online" | "offline"

type UploadedFile = {
  name: string
  size: number
  uploadedAt: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: PaymentOrder | null
  orderType: OrderType
  onConfirm: (mode: SignMode) => void
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
          ? "物料存放保管合同"
          : "物料交易租赁合同",
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

function nowLabel() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function OrderContractDialog({
  open,
  onOpenChange,
  order,
  orderType,
  onConfirm,
}: Props) {
  const [mode, setMode] = useState<SignMode>("online")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [signerName, setSignerName] = useState("")
  const [signerIdNo, setSignerIdNo] = useState("")
  const [remark, setRemark] = useState("")
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  // 弹窗关闭时重置状态
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setMode("online")
        setFiles([])
        setSignerName("")
        setSignerIdNo("")
        setRemark("")
      }, 200)
    }
  }, [open])

  if (!order) return null

  const t = termOf(orderType)

  const handleFiles = (list: FileList | null) => {
    if (!list) return
    const next: UploadedFile[] = Array.from(list)
      .filter((f) => f.size <= 20 * 1024 * 1024) // 20MB 限制
      .map((f) => ({
        name: f.name,
        size: f.size,
        uploadedAt: nowLabel(),
      }))
    setFiles((prev) => [...prev, ...next])
  }

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const canSubmit =
    mode === "online" ? signerName.trim().length > 0 && signerIdNo.trim().length > 0 : files.length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onConfirm(mode)
    onOpenChange(false)
  }

  const handleOpenOnlineSign = () => {
    // 预留入口：跳转到电子合同签署页面
    console.log("[v0] 跳转至电子合同签署页", { orderId: order.id, signerName, signerIdNo })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-orange-600" />
            合同签署
          </DialogTitle>
          <DialogDescription>
            请选择线上电子签署或线下纸质合同上传两种方式之一完成{t.contractName}签署
          </DialogDescription>
        </DialogHeader>

        {/* 订单信息 */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <InfoRow label="订单号" value={order.id} mono />
            <InfoRow label="合同名称" value={t.contractName} />
            <InfoRow label="标的物" value={order.title} colSpan />
            <InfoRow label={t.tenant} value={order.payer} />
            <InfoRow
              label="出租方/物权方"
              value={order.depositPayee}
            />
            <InfoRow label="租赁期限" value={order.periodLabel} colSpan />
            <InfoRow label={`合同${t.rent === "租金" ? "总租金" : "总额"}`} value={`¥ ${fmt(order.totalAmount)}`} valueClass="text-primary font-semibold" />
            <InfoRow label={`${t.deposit}金额`} value={`¥ ${fmt(order.depositAmount)}`} />
          </div>
        </div>

        {/* 签署方式选择 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">签署方式</Label>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as SignMode)}
            className="grid grid-cols-2 gap-3"
          >
            <SignModeCard
              mode="online"
              selected={mode === "online"}
              icon={ShieldCheck}
              title="线上电子签署"
              desc="平台电子合同 · CA 数字签名 · 实时生效"
              tag="推荐"
            />
            <SignModeCard
              mode="offline"
              selected={mode === "offline"}
              icon={Paperclip}
              title="线下纸质合同"
              desc="上传已盖章 PDF/图片 · 平台审核留档"
            />
          </RadioGroup>
        </div>

        {/* 表单内容（按方式切换） */}
        {mode === "online" ? (
          <div className="rounded-lg border p-4 space-y-4 bg-orange-50/30">
            <div className="flex items-start gap-2 text-xs text-orange-700">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                请填写签署人信息后，点击「前往电子签署」进入第三方 CA
                平台完成实名验证与签字，签署完成后将自动同步合同状态。
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="signer-name" className="text-xs text-muted-foreground">
                  签署人姓名 <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="signer-name"
                  placeholder="请输入签署人姓名"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signer-id" className="text-xs text-muted-foreground">
                  身份证号 <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="signer-id"
                  placeholder="请输入签署人身份证号"
                  value={signerIdNo}
                  onChange={(e) => setSignerIdNo(e.target.value)}
                  className="h-9 font-mono"
                  maxLength={18}
                />
              </div>
            </div>

            <div className="rounded-md border border-dashed border-orange-300 bg-card p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-md bg-orange-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-700" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t.contractName}（电子版）</div>
                  <div className="text-[11px] text-muted-foreground">
                    系统自动生成 · 含全部条款与附件
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800 bg-transparent"
                onClick={handleOpenOnlineSign}
                disabled={!canSubmit}
              >
                前往电子签署
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border p-4 space-y-3 bg-slate-50/40">
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                请上传双方已签字盖章的合同扫描件（PDF / JPG / PNG，单文件不超过
                20MB，可上传多份）。提交后由平台审核归档。
              </span>
            </div>

            {/* 上传区 */}
            <div
              className="rounded-md border-2 border-dashed border-slate-300 bg-card px-4 py-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-7 h-7 text-muted-foreground mb-2" />
              <div className="text-sm font-medium text-foreground">
                点击上传合同附件
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                支持 PDF / JPG / PNG，单文件 ≤ 20MB
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
              />
            </div>

            {/* 已上传列表 */}
            {files.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">
                    已上传附件
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5">
                    共 {files.length} 份
                  </Badge>
                </div>
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border bg-card px-3 py-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm truncate">{f.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatSize(f.size)} · {f.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(i)
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="contract-remark" className="text-xs text-muted-foreground">
                备注说明（选填）
              </Label>
              <Textarea
                id="contract-remark"
                placeholder="可填写合同纸质件邮寄方式、寄件单号或其他备注"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-1" />
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            {mode === "online" ? "确认并发起签署" : "提交合同附件"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ========== 子组件 ========== */

function InfoRow({
  label,
  value,
  mono,
  colSpan,
  valueClass,
}: {
  label: string
  value: string
  mono?: boolean
  colSpan?: boolean
  valueClass?: string
}) {
  return (
    <div className={`flex items-center gap-2 ${colSpan ? "col-span-2" : ""}`}>
      <span className="text-muted-foreground text-xs shrink-0">{label}</span>
      <span
        className={`text-foreground ${mono ? "font-mono text-xs" : "text-sm"} ${valueClass ?? ""}`}
      >
        {value}
      </span>
    </div>
  )
}

function SignModeCard({
  mode,
  selected,
  icon: Icon,
  title,
  desc,
  tag,
}: {
  mode: SignMode
  selected: boolean
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  tag?: string
}) {
  return (
    <Label
      htmlFor={`sign-mode-${mode}`}
      className={`relative flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
        selected
          ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
          : "border-border hover:border-orange-300 hover:bg-muted/30"
      }`}
    >
      <RadioGroupItem value={mode} id={`sign-mode-${mode}`} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon
            className={`w-4 h-4 ${selected ? "text-orange-600" : "text-muted-foreground"}`}
          />
          <span className="text-sm font-medium">{title}</span>
          {tag && (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-[10px] h-4 px-1.5 border-orange-200">
              {tag}
            </Badge>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground leading-relaxed">{desc}</div>
      </div>
    </Label>
  )
}
