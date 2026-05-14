"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Download,
  ArrowLeftRight,
  ArrowRight,
  Clock,
  Loader2,
  CheckCircle2,
  CircleDollarSign,
  Building2,
  Warehouse,
  MapPin,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransferCreatePage } from "./transfer-create-page"
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

// 过户类型：4 类接收方
type ReceiverType = "物权单位" | "仓储单位" | "仓储站点" | "专运单位"
type TransferStatus = "待确认" | "审批中" | "已过户" | "已驳回" | "已作废"

interface TransferRow {
  id: string
  receiverType: ReceiverType
  fromOwner: string // 当前物权方
  toReceiver: string // 接收方
  materials: string[]
  itemTypes: number
  totalQty: string
  warehouse: string
  applyDate: string
  transferDate: string // 过户完成日期
  operator: string
  value: string // 估值金额
  status: TransferStatus
}

const transferRows: TransferRow[] = [
  {
    id: "GH20260513001",
    receiverType: "物权单位",
    fromOwner: "中铁建工集团第二建设有限公司",
    toReceiver: "中铁十四局集团广州分公司",
    materials: [
      "Q235B 热轧 H 型钢 HW200",
      "20# 工字钢梁",
      "Φ32 螺纹钢",
    ],
    itemTypes: 3,
    totalQty: "520 吨",
    warehouse: "中铁建广州南沙基地·A区",
    applyDate: "2026-05-13",
    transferDate: "—",
    operator: "李文涛",
    value: "2,184,000",
    status: "待确认",
  },
  {
    id: "GH20260512002",
    receiverType: "仓储单位",
    fromOwner: "中铁二十局集团第六工程有限公司",
    toReceiver: "中铁建仓储华南运营有限公司",
    materials: [
      "碗扣式脚手架立杆",
      "脚手架横杆",
      "脚手板",
      "钢管扣件 Φ48",
    ],
    itemTypes: 4,
    totalQty: "1,860 套",
    warehouse: "中铁建深圳前海基地·B区",
    applyDate: "2026-05-12",
    transferDate: "—",
    operator: "周建华",
    value: "486,400",
    status: "审批中",
  },
  {
    id: "GH20260511003",
    receiverType: "仓储站点",
    fromOwner: "中铁建工集团第二建设有限公司",
    toReceiver: "中铁建东莞虎门基地·C区",
    materials: ["WJ-7 扣件系统", "扣件配件"],
    itemTypes: 2,
    totalQty: "4,200 套",
    warehouse: "中铁建广州南沙基地·E区",
    applyDate: "2026-05-10",
    transferDate: "2026-05-11",
    operator: "陈志强",
    value: "235,200",
    status: "已过户",
  },
  {
    id: "GH20260510004",
    receiverType: "专运单位",
    fromOwner: "中铁十四局集团广州分公司",
    toReceiver: "中铁建华南物流运输有限公司",
    materials: ["60kg/m 钢轨", "III 型轨枕"],
    itemTypes: 2,
    totalQty: "320 件",
    warehouse: "中铁建中山翠亨基地·D区",
    applyDate: "2026-05-09",
    transferDate: "2026-05-10",
    operator: "黄玉婷",
    value: "1,460,000",
    status: "已过户",
  },
  {
    id: "GH20260509005",
    receiverType: "物权单位",
    fromOwner: "广东能建第二建设有限公司",
    toReceiver: "深圳市鸿信钢材贸易有限公司",
    materials: ["VV 型橡套电缆 3×95+1"],
    itemTypes: 1,
    totalQty: "8,600 米",
    warehouse: "中铁建佛山顺德基地·F区",
    applyDate: "2026-05-08",
    transferDate: "—",
    operator: "孙晓东",
    value: "670,800",
    status: "已驳回",
  },
  {
    id: "GH20260507006",
    receiverType: "仓储单位",
    fromOwner: "中铁建工集团第二建设有限公司",
    toReceiver: "中铁建仓储华南运营有限公司",
    materials: ["钢板桩 IV 型", "QTZ63 塔吊标准节"],
    itemTypes: 2,
    totalQty: "180 件",
    warehouse: "中铁建广州南沙基地·A区",
    applyDate: "2026-05-07",
    transferDate: "—",
    operator: "李文涛",
    value: "892,000",
    status: "已作废",
  },
]

function statusBadge(status: TransferStatus) {
  const map: Record<
    TransferStatus,
    { bg: string; text: string; ring: string; label: string }
  > = {
    待确认: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      label: "待确认",
    },
    审批中: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-200",
      label: "审批中",
    },
    已过户: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      label: "已过户",
    },
    已驳回: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      label: "已驳回",
    },
    已作废: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      ring: "ring-border",
      label: "已作废",
    },
  }
  const c = map[status]
  return (
    <Badge
      variant="outline"
      className={`${c.bg} ${c.text} ${c.ring} ring-1 border-0 font-medium`}
    >
      {c.label}
    </Badge>
  )
}

const receiverMeta: Record<
  ReceiverType,
  { icon: typeof Building2; color: string; bg: string }
> = {
  物权单位: { icon: Building2, color: "text-primary", bg: "bg-primary/10" },
  仓储单位: { icon: Warehouse, color: "text-indigo-700", bg: "bg-indigo-100" },
  仓储站点: { icon: MapPin, color: "text-purple-700", bg: "bg-purple-100" },
  专运单位: { icon: Truck, color: "text-orange-700", bg: "bg-orange-100" },
}

function receiverTypeBadge(type: ReceiverType) {
  const m = receiverMeta[type]
  const Icon = m.icon
  return (
    <Badge
      variant="outline"
      className={`${m.bg} ${m.color} border-0 font-normal gap-1`}
    >
      <Icon className="w-3 h-3" />
      {type}
    </Badge>
  )
}

function actionsByStatus(status: TransferStatus) {
  switch (status) {
    case "待确认":
      return [
        { label: "查看" },
        { label: "确认提交", tone: "primary" as const },
        { label: "编辑" },
        { label: "作废", tone: "destructive" as const },
      ]
    case "审批中":
      return [
        { label: "查看" },
        { label: "审批进度", tone: "primary" as const },
        { label: "撤回" },
      ]
    case "已过户":
      return [
        { label: "查看" },
        { label: "下载凭证", tone: "primary" as const },
        { label: "打印" },
      ]
    case "已驳回":
      return [
        { label: "查看" },
        { label: "查看驳回原因", tone: "primary" as const },
        { label: "复制重建" },
      ]
    case "已作废":
      return [{ label: "查看" }, { label: "复制重建" }]
  }
}

export function MaterialTransfer() {
  const [mode, setMode] = useState<"list" | "create">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部")
  const [receiverFilter, setReceiverFilter] = useState("全部")
  const [timeFilter, setTimeFilter] = useState("近30天")

  if (mode === "create") {
    return <TransferCreatePage onBack={() => setMode("list")} />
  }

  const total = transferRows.length
  const pending = transferRows.filter((r) => r.status === "待确认").length
  const approving = transferRows.filter((r) => r.status === "审批中").length
  const totalValue = transferRows
    .filter((r) => r.status === "已过户")
    .reduce((s, r) => s + Number(r.value.replace(/,/g, "")), 0)
    .toLocaleString("zh-CN")

  const filtered = transferRows.filter((r) => {
    const matchSearch =
      !searchTerm ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fromOwner.includes(searchTerm) ||
      r.toReceiver.includes(searchTerm)
    const matchStatus = statusFilter === "全部" || r.status === statusFilter
    const matchReceiver =
      receiverFilter === "全部" || r.receiverType === receiverFilter
    return matchSearch && matchStatus && matchReceiver
  })

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5 text-indigo-700" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">
              过户管理
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              将存储于仓储的物料过户给其他物权单位、仓储单位、仓储站点或专运单位，跟踪审批与凭证签发
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button size="sm" onClick={() => setMode("create")}>
            <Plus className="w-4 h-4 mr-2" />
            新建过户单
          </Button>
        </div>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="过户单总数"
          value={total.toString()}
          icon={ArrowLeftRight}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-700"
        />
        <StatCard
          label="待确认"
          value={pending.toString()}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />
        <StatCard
          label="审批中"
          value={approving.toString()}
          icon={Loader2}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="累计过户估值(元)"
          value={totalValue}
          icon={CircleDollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          valueSize="xl"
        />
      </div>

      {/* 接收方类型快速分布 */}
      <Card className="w-full min-w-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">
              按接收方分布：
            </span>
            {(
              ["物权单位", "仓储单位", "仓储站点", "专运单位"] as ReceiverType[]
            ).map((t) => {
              const cnt = transferRows.filter((r) => r.receiverType === t).length
              const m = receiverMeta[t]
              const Icon = m.icon
              return (
                <button
                  key={t}
                  onClick={() =>
                    setReceiverFilter(receiverFilter === t ? "全部" : t)
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    receiverFilter === t
                      ? `${m.bg} ${m.color} ring-1 ring-current/30`
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t}
                  <span className="tabular-nums opacity-80">· {cnt}</span>
                </button>
              )
            })}
            {receiverFilter !== "全部" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setReceiverFilter("全部")}
              >
                清除筛选
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 筛选 + 表格 */}
      <Card className="w-full min-w-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[260px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索过户单号 / 物权方 / 接收方"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="单据状态" />
              </SelectTrigger>
              <SelectContent>
                {["全部", "待确认", "审批中", "已过户", "已驳回", "已作废"].map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Select value={receiverFilter} onValueChange={setReceiverFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="接收方类型" />
              </SelectTrigger>
              <SelectContent>
                {["全部", "物权单位", "仓储单位", "仓储站点", "专运单位"].map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                {["近7天", "近30天", "近90天", "全年"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-auto">
              共 {filtered.length} 条
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1640px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[150px]">过户单号</TableHead>
                  <TableHead>接收方类型</TableHead>
                  <TableHead className="w-[380px]">物权流转</TableHead>
                  <TableHead className="w-[260px]">物料明细</TableHead>
                  <TableHead className="text-right">品种</TableHead>
                  <TableHead className="text-right">数量</TableHead>
                  <TableHead>存放仓储</TableHead>
                  <TableHead>申请日期</TableHead>
                  <TableHead>过户日期</TableHead>
                  <TableHead>经办人</TableHead>
                  <TableHead className="text-right">估值(元)</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-[230px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>{receiverTypeBadge(r.receiverType)}</TableCell>
                    <TableCell>
                      <OwnerFlow
                        from={r.fromOwner}
                        to={r.toReceiver}
                        receiverType={r.receiverType}
                      />
                    </TableCell>
                    <TableCell>
                      <MaterialNamesCell names={r.materials} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.itemTypes}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {r.totalQty}
                    </TableCell>
                    <TableCell className="text-sm">{r.warehouse}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.applyDate}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.transferDate}
                    </TableCell>
                    <TableCell className="text-sm">{r.operator}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {r.value}
                    </TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1">
                        {actionsByStatus(r.status).map((a) => (
                          <Button
                            key={a.label}
                            variant="ghost"
                            size="sm"
                            className={
                              a.tone === "primary"
                                ? "h-7 px-2 text-xs text-primary"
                                : a.tone === "destructive"
                                  ? "h-7 px-2 text-xs text-destructive"
                                  : "h-7 px-2 text-xs"
                            }
                          >
                            {a.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OwnerFlow({
  from,
  to,
  receiverType,
}: {
  from: string
  to: string
  receiverType: ReceiverType
}) {
  const m = receiverMeta[receiverType]
  const ToIcon = m.icon
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex items-center gap-1.5 min-w-0 max-w-[170px]">
        <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Building2 className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs truncate" title={from}>
          {from}
        </span>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div className="flex items-center gap-1.5 min-w-0 max-w-[170px]">
        <span
          className={`w-6 h-6 rounded ${m.bg} ${m.color} flex items-center justify-center shrink-0`}
        >
          <ToIcon className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-medium truncate" title={to}>
          {to}
        </span>
      </div>
    </div>
  )
}

function MaterialNamesCell({ names }: { names: string[] }) {
  if (!names || names.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  const visible = names.slice(0, 2)
  const rest = names.length - visible.length
  return (
    <div className="flex flex-wrap items-center gap-1 max-w-[260px]">
      {visible.map((n, i) => (
        <Badge
          key={`${n}-${i}`}
          variant="secondary"
          className="font-normal text-[11px] max-w-[220px] truncate"
          title={n}
        >
          {n}
        </Badge>
      ))}
      {rest > 0 && (
        <Badge
          variant="outline"
          className="font-normal text-[11px] text-muted-foreground"
          title={names.join(" / ")}
        >
          +{rest}
        </Badge>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueSize = "2xl",
}: {
  label: string
  value: string
  icon: typeof ArrowLeftRight
  iconBg: string
  iconColor: string
  valueSize?: "xl" | "2xl"
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div
              className={`${
                valueSize === "xl" ? "text-xl" : "text-2xl"
              } font-bold text-foreground tabular-nums truncate`}
            >
              {value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
