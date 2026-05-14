"use client"

import * as React from "react"
import { useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  FileSignature,
  FileText,
  HelpCircle,
  Info,
  Paperclip,
  Save,
  Search,
  Send,
  Trash2,
  Upload,
  Warehouse,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Props = {
  onBack: () => void
}

type ContractType =
  | "租赁合同"
  | "托管合同"
  | "服务合同"
  | "存放合同"
  | "委托合同"
  | "销售合同"
  | "销售代理协议"
  | "分成协议"
type PaymentMethod = "一次性付清" | "月付" | "季付" | "半年付" | "年付"

type UploadedFile = {
  name: string
  size: number
  uploadedAt: string
}

const CONTRACT_TYPES: { value: ContractType; desc: string; color: string }[] = [
  { value: "租赁合同", desc: "仓储 / 物料 租赁场景", color: "bg-primary/10 text-primary border-primary/20" },
  { value: "托管合同", desc: "委托第三方运营管理", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { value: "服务合同", desc: "包装、配送、装卸等服务", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "存放合同", desc: "纯仓储存放业务", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  { value: "委托合同", desc: "对外委托业务", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { value: "销售合同", desc: "托管物资对外销售", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  { value: "销售代理协议", desc: "代物权方销售授权", color: "bg-rose-500/10 text-rose-700 border-rose-500/20" },
  { value: "分成协议", desc: "销售所得分成比例", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
]

const PARTY_B_LIBRARY = [
  "中铁十一局集团广州分公司",
  "中铁十四局集团广州分公司",
  "中铁二十二局集团有限公司莞惠城际项目部",
  "中铁电气化局集团广州分公司",
  "中铁大桥局集团广州分公司",
  "中铁城建集团华南分公司",
  "中铁建工集团华南有限公司",
]

const WAREHOUSE_LIBRARY = [
  "中铁建广州南沙综合仓储基地",
  "中铁建深圳前海智慧仓储基地",
  "中铁建佛山南海冷链仓储基地",
  "中铁建东莞塘厦仓储站点",
  "中铁二十二局惠州大亚湾仓储基地",
]

function nowDate() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function nowLabel() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function generateContractId() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const rand = Math.floor(Math.random() * 900 + 100)
  return `CON${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${rand}`
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function fmtAmount(v: string) {
  const n = Number(v)
  if (!v || Number.isNaN(n)) return "—"
  return `¥ ${n.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`
}

export function ContractCreatePage({ onBack }: Props) {
  // 基础信息
  const [contractId] = useState(generateContractId)
  const [contractType, setContractType] = useState<ContractType>("租赁合同")
  const [contractName, setContractName] = useState("")
  const [signDate, setSignDate] = useState(nowDate())

  // 合同双方
  const partyA = "中铁建物料华南仓储有限公司" // 本企业
  const [partyB, setPartyB] = useState("")
  const [partyAContact, setPartyAContact] = useState("张工")
  const [partyAPhone, setPartyAPhone] = useState("020-8888 1234")
  const [partyBContact, setPartyBContact] = useState("")
  const [partyBPhone, setPartyBPhone] = useState("")

  // 标的物与费用
  const [warehouse, setWarehouse] = useState("")
  const [orderRef, setOrderRef] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [amount, setAmount] = useState("")
  const [deposit, setDeposit] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("月付")

  // 附件与备注
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [remark, setRemark] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (list: FileList | null) => {
    if (!list) return
    const next: UploadedFile[] = Array.from(list)
      .filter((f) => f.size <= 20 * 1024 * 1024)
      .map((f) => ({ name: f.name, size: f.size, uploadedAt: nowLabel() }))
    setFiles((prev) => [...prev, ...next])
  }
  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx))

  // 必填项校验（用于摘要进度）
  const checklist = useMemo(
    () => [
      { label: "合同类型", done: !!contractType },
      { label: "合同名称", done: contractName.trim().length > 0 },
      { label: "乙方信息", done: partyB.trim().length > 0 },
      { label: "乙方联系人", done: partyBContact.trim().length > 0 && partyBPhone.trim().length > 0 },
      { label: "关联仓储/标的", done: warehouse.trim().length > 0 },
      { label: "合同期限", done: !!startDate && !!endDate && startDate <= endDate },
      { label: "合同金额", done: Number(amount) > 0 },
    ],
    [
      contractType,
      contractName,
      partyB,
      partyBContact,
      partyBPhone,
      warehouse,
      startDate,
      endDate,
      amount,
    ],
  )
  const completedCount = checklist.filter((c) => c.done).length
  const completion = Math.round((completedCount / checklist.length) * 100)
  const canSubmit = completion === 100

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0
    const a = new Date(startDate).getTime()
    const b = new Date(endDate).getTime()
    if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0
    return Math.ceil((b - a) / (1000 * 60 * 60 * 24)) + 1
  }, [startDate, endDate])

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-4">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回合同列表
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-primary" />
                新建合同
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                合同编号 <span className="font-mono">{contractId}</span> · 创建时间 {nowLabel()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1.5" />
              保存草稿
            </Button>
            <Button
              size="sm"
              disabled={!canSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-1.5" />
              提交并发起签署
            </Button>
          </div>
        </div>

        {/* 主体：左主表单 + 右侧粘性摘要 */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 items-start">
          {/* —— 左 主表单 —— */}
          <div className="space-y-4 min-w-0">
            {/* ① 基础信息 */}
            <SectionCard
              index={1}
              icon={FileText}
              title="基础信息"
              desc="选择合同类型并填写基本要素"
            >
              <div className="space-y-4">
                {/* 合同类型卡片 */}
                <FieldBlock label="合同类型" required>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {CONTRACT_TYPES.map((t) => {
                      const active = contractType === t.value
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setContractType(t.value)}
                          className={cn(
                            "relative rounded-md border p-3 text-left transition-all",
                            active
                              ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                              : "border-border hover:border-primary/40 hover:bg-muted/30",
                          )}
                        >
                          <Badge variant="outline" className={cn("font-normal text-[11px] mb-1.5", t.color)}>
                            {t.value}
                          </Badge>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{t.desc}</p>
                          {active && (
                            <CheckCircle2 className="absolute top-2 right-2 w-3.5 h-3.5 text-primary" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </FieldBlock>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FieldBlock label="合同名称" required className="md:col-span-2">
                    <Input
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      placeholder="例如：广州南沙基地仓储租赁合同"
                      className="h-9"
                    />
                  </FieldBlock>
                  <FieldBlock label="签订日期" required>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="date"
                        value={signDate}
                        onChange={(e) => setSignDate(e.target.value)}
                        className="h-9 pl-8"
                      />
                    </div>
                  </FieldBlock>
                </div>

                <FieldBlock
                  label="合同编号"
                  hint="系统自动生成，提交后不可修改"
                >
                  <Input
                    value={contractId}
                    readOnly
                    className="h-9 font-mono bg-muted/30 text-muted-foreground"
                  />
                </FieldBlock>
              </div>
            </SectionCard>

            {/* ② 合同双方 */}
            <SectionCard
              index={2}
              icon={Building2}
              title="合同双方"
              desc="甲方为本企业，乙方支持从签约方库中检索选择"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 甲方 */}
                <div className="rounded-md border border-dashed bg-primary/5 p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-medium">
                      甲方
                    </span>
                    <span className="text-xs text-muted-foreground">本企业</span>
                  </div>
                  <Input
                    value={partyA}
                    readOnly
                    className="h-9 bg-card text-sm font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={partyAContact}
                      onChange={(e) => setPartyAContact(e.target.value)}
                      placeholder="联系人"
                      className="h-8 text-xs"
                    />
                    <Input
                      value={partyAPhone}
                      onChange={(e) => setPartyAPhone(e.target.value)}
                      placeholder="联系电话"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                {/* 乙方 */}
                <div className="rounded-md border bg-card p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-orange-500 text-white font-medium">
                      乙方
                    </span>
                    <span className="text-xs text-rose-500">*</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <Select value={partyB} onValueChange={setPartyB}>
                      <SelectTrigger className="h-9 pl-8 text-sm">
                        <SelectValue placeholder="搜索并选择乙方单位" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTY_B_LIBRARY.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={partyBContact}
                      onChange={(e) => setPartyBContact(e.target.value)}
                      placeholder="联系人"
                      className="h-8 text-xs"
                    />
                    <Input
                      value={partyBPhone}
                      onChange={(e) => setPartyBPhone(e.target.value)}
                      placeholder="联系电话"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ③ 标的物与费用 */}
            <SectionCard
              index={3}
              icon={CircleDollarSign}
              title="标的物与费用"
              desc="选择关联仓储站点、约定期限与付款方式"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FieldBlock label="关联仓储/标的" required>
                    <div className="relative">
                      <Warehouse className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <Select value={warehouse} onValueChange={setWarehouse}>
                        <SelectTrigger className="h-9 pl-8">
                          <SelectValue placeholder="选择仓储站点" />
                        </SelectTrigger>
                        <SelectContent>
                          {WAREHOUSE_LIBRARY.map((w) => (
                            <SelectItem key={w} value={w}>
                              {w}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FieldBlock>
                  <FieldBlock label="关联订单号" hint="可选，绑定后联动履约">
                    <Input
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
                      placeholder="例如：DD20260120001"
                      className="h-9 font-mono"
                    />
                  </FieldBlock>
                </div>

                <FieldBlock label="合同期限" required>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-9 pl-8"
                      />
                    </div>
                    <span className="text-muted-foreground text-sm text-center">至</span>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-9 pl-8"
                      />
                    </div>
                    <Badge variant="outline" className="font-normal whitespace-nowrap">
                      {totalDays > 0 ? `共 ${totalDays} 天` : "未设置"}
                    </Badge>
                  </div>
                </FieldBlock>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FieldBlock label="合同总额（元）" required>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="h-9 tabular-nums"
                    />
                  </FieldBlock>
                  <FieldBlock label="保证金（元）">
                    <Input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      placeholder="0.00"
                      className="h-9 tabular-nums"
                    />
                  </FieldBlock>
                  <FieldBlock label="付款方式" required>
                    <Select
                      value={paymentMethod}
                      onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="一次性付清">一次性付清</SelectItem>
                        <SelectItem value="月付">月付</SelectItem>
                        <SelectItem value="季付">季付</SelectItem>
                        <SelectItem value="半年付">半年付</SelectItem>
                        <SelectItem value="年付">年付</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldBlock>
                </div>
              </div>
            </SectionCard>

            {/* ④ 附件与备注 */}
            <SectionCard
              index={4}
              icon={Paperclip}
              title="附件与备注"
              desc="上传合同模板、补充协议或其他参考材料"
            >
              <div className="space-y-3">
                <div
                  className="rounded-md border-2 border-dashed border-border bg-muted/20 px-4 py-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-7 h-7 text-muted-foreground mb-2" />
                  <div className="text-sm font-medium text-foreground">点击上传合同附件</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    支持 PDF / DOC / DOCX / JPG / PNG，单文件 ≤ 20MB
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleFiles(e.target.files)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-muted-foreground">已上传附件</div>
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

                <FieldBlock label="备注说明" hint="选填">
                  <Textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="可填写合同特别约定、补充条款或其他备注..."
                    rows={3}
                    className="resize-none text-sm"
                  />
                </FieldBlock>
              </div>
            </SectionCard>
          </div>

          {/* —— 右 摘要 —— */}
          <aside className="xl:sticky xl:top-4 space-y-4">
            {/* 校验进度 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  必填项进度
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {completedCount}/{checklist.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Progress value={completion} className="h-1.5" />
                <ul className="space-y-1.5">
                  {checklist.map((c) => (
                    <li
                      key={c.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={cn(
                          "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0",
                          c.done
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30 text-transparent",
                        )}
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </span>
                      <span className={c.done ? "text-foreground" : "text-muted-foreground"}>
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 合同摘要 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  合同摘要预览
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2.5 text-xs">
                <SummaryRow label="合同类型">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      CONTRACT_TYPES.find((t) => t.value === contractType)?.color,
                    )}
                  >
                    {contractType}
                  </Badge>
                </SummaryRow>
                <SummaryRow label="合同名称" value={contractName || "—"} />
                <Separator />
                <SummaryRow label="甲方" value={partyA} truncate />
                <SummaryRow label="乙方" value={partyB || "—"} truncate />
                <Separator />
                <SummaryRow label="期限">
                  {startDate && endDate ? (
                    <span className="tabular-nums">
                      {startDate} ~ {endDate}
                    </span>
                  ) : (
                    "—"
                  )}
                </SummaryRow>
                <SummaryRow label="付款方式" value={paymentMethod} />
                <Separator />
                <SummaryRow label="合同总额">
                  <span className="font-semibold text-primary tabular-nums">
                    {fmtAmount(amount)}
                  </span>
                </SummaryRow>
                <SummaryRow label="保证金">
                  <span className="tabular-nums">{fmtAmount(deposit)}</span>
                </SummaryRow>
                <SummaryRow label="附件">
                  <span className="tabular-nums">{files.length} 份</span>
                </SummaryRow>
              </CardContent>
            </Card>

            {/* 帮助提示 */}
            <div className="rounded-md border bg-amber-50/50 border-amber-200 p-3">
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 mt-0.5 text-amber-600 shrink-0" />
                <div className="text-[11px] leading-relaxed text-amber-800">
                  提交后将进入合同审核流程，审核通过后可发起线上 CA 电子签署或上传纸质盖章件。草稿可随时保存继续编辑。
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  )
}

/* ========== 子组件 ========== */

function SectionCard({
  index,
  icon: Icon,
  title,
  desc,
  children,
}: {
  index: number
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center tabular-nums">
              {index}
            </span>
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            {desc && (
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

function FieldBlock({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-muted-foreground flex items-center gap-1">
        <span>{label}</span>
        {required && <span className="text-rose-500">*</span>}
        {hint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3 h-3 text-muted-foreground/70 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {hint}
            </TooltipContent>
          </Tooltip>
        )}
      </Label>
      {children}
    </div>
  )
}

function SummaryRow({
  label,
  value,
  children,
  truncate,
}: {
  label: string
  value?: string
  children?: React.ReactNode
  truncate?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span
        className={cn(
          "text-foreground text-right",
          truncate && "truncate max-w-[180px]",
        )}
      >
        {children ?? value}
      </span>
    </div>
  )
}
