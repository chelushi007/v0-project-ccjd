"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Download,
  PackageMinus,
  Clock,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OutboundCreatePage } from "./outbound-create-page"
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

type OutboundType = "出租出库" | "销售出库" | "调拨出库" | "盘亏出库"
type OutboundStatus = "待出库" | "已出库" | "已签收" | "已作废"

interface OutboundRow {
  id: string
  type: OutboundType
  customer: string
  itemTypes: number
  materials: string[]
  plannedQty: string
  actualQty: string
  warehouse: string
  planDate: string
  shipDate: string
  signDate: string
  operator: string
  amount: string
  status: OutboundStatus
}

const outboundRows: OutboundRow[] = [
  {
    id: "CK20260513011",
    type: "出租出库",
    customer: "中铁十四局集团广州分公司",
    itemTypes: 3,
    materials: [
      "Q235B 热轧 H 型钢 HW200",
      "20# 工字钢梁",
      "钢板桩 IV 型",
    ],
    plannedQty: "320 吨",
    actualQty: "—",
    warehouse: "中铁建广州南沙基地·A区",
    planDate: "2026-05-14",
    shipDate: "—",
    signDate: "—",
    operator: "李文涛",
    amount: "1,344,000",
    status: "待出库",
  },
  {
    id: "CK20260512012",
    type: "出租出库",
    customer: "中铁建工集团第二建设有限公司",
    itemTypes: 5,
    materials: [
      "碗扣式脚手架立杆",
      "脚手架横杆",
      "脚手板",
      "钢管扣件 Φ48",
      "立柱底座",
    ],
    plannedQty: "1,600 套",
    actualQty: "1,600 套",
    warehouse: "中铁建深圳前海基地·B区",
    planDate: "2026-05-12",
    shipDate: "2026-05-12",
    signDate: "—",
    operator: "周建华",
    amount: "604,800",
    status: "已出库",
  },
  {
    id: "CK20260511013",
    type: "销售出库",
    customer: "广东能建第二建设有限公司",
    itemTypes: 2,
    materials: ["Φ32 螺纹钢", "20# 工字钢梁"],
    plannedQty: "540 吨",
    actualQty: "540 吨",
    warehouse: "中铁建中山翠亨基地·D区",
    planDate: "2026-05-10",
    shipDate: "2026-05-11",
    signDate: "2026-05-12",
    operator: "陈志强",
    amount: "3,564,000",
    status: "已签收",
  },
  {
    id: "CK20260510014",
    type: "调拨出库",
    customer: "中铁建东莞虎门基地·C区",
    itemTypes: 1,
    materials: ["WJ-7 扣件系统"],
    plannedQty: "4,200 套",
    actualQty: "4,200 套",
    warehouse: "中铁建广州南沙基地·E区",
    planDate: "2026-05-10",
    shipDate: "2026-05-10",
    signDate: "2026-05-10",
    operator: "孙晓东",
    amount: "235,200",
    status: "已签收",
  },
  {
    id: "CK20260509015",
    type: "出租出库",
    customer: "中铁二十局集团第六工程有限公司",
    itemTypes: 2,
    materials: ["工字钢梁", "组合钢模板"],
    plannedQty: "220 吨",
    actualQty: "—",
    warehouse: "中铁建广州南沙基地·A区",
    planDate: "2026-05-09",
    shipDate: "—",
    signDate: "—",
    operator: "黄玉婷",
    amount: "924,000",
    status: "待出库",
  },
  {
    id: "CK20260508016",
    type: "盘亏出库",
    customer: "2026 年 5 月例行盘点",
    itemTypes: 1,
    materials: ["QTZ63 塔吊标准节"],
    plannedQty: "—",
    actualQty: "8 套",
    warehouse: "中铁建佛山顺德基地·F区",
    planDate: "2026-05-08",
    shipDate: "2026-05-08",
    signDate: "2026-05-08",
    operator: "李文涛",
    amount: "—",
    status: "已签收",
  },
  {
    id: "CK20260507017",
    type: "销售出库",
    customer: "深圳市鸿信钢材贸易有限公司",
    itemTypes: 1,
    materials: ["Q235B 热轧 H 型钢"],
    plannedQty: "180 吨",
    actualQty: "—",
    warehouse: "中铁建深圳前海基地·B区",
    planDate: "2026-05-07",
    shipDate: "—",
    signDate: "—",
    operator: "孙晓东",
    amount: "1,188,000",
    status: "已作废",
  },
]

function statusBadge(status: OutboundStatus) {
  const map: Record<
    OutboundStatus,
    { bg: string; text: string; ring: string; label: string }
  > = {
    待出库: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      label: "待出库",
    },
    已出库: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-200",
      label: "已出库",
    },
    已签收: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      label: "已签收",
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

function typeBadge(type: OutboundType) {
  const map: Record<OutboundType, string> = {
    出租出库: "bg-primary/10 text-primary",
    销售出库: "bg-orange-100 text-orange-700",
    调拨出库: "bg-indigo-100 text-indigo-700",
    盘亏出库: "bg-rose-100 text-rose-700",
  }
  return (
    <Badge variant="outline" className={`${map[type]} border-0 font-normal`}>
      {type}
    </Badge>
  )
}

function actionsByStatus(status: OutboundStatus) {
  switch (status) {
    case "待出库":
      return [
        { label: "查看" },
        { label: "执行出库", tone: "primary" as const },
        { label: "打印单据" },
        { label: "作废", tone: "destructive" as const },
      ]
    case "已出库":
      return [
        { label: "查看" },
        { label: "确认签收", tone: "primary" as const },
        { label: "物流跟踪" },
      ]
    case "已签收":
      return [
        { label: "查看" },
        { label: "打印单据", tone: "primary" as const },
        { label: "对账" },
      ]
    case "已作废":
      return [{ label: "查看" }, { label: "复制重建" }]
  }
}

export function MaterialOutbound() {
  const [mode, setMode] = useState<"list" | "create">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部")
  const [typeFilter, setTypeFilter] = useState("全部")
  const [timeFilter, setTimeFilter] = useState("近30天")

  if (mode === "create") {
    return <OutboundCreatePage onBack={() => setMode("list")} />
  }

  const total = outboundRows.length
  const pending = outboundRows.filter((r) => r.status === "待出库").length
  const shipped = outboundRows.filter((r) => r.status === "已出库").length
  const signed = outboundRows.filter((r) => r.status === "已签收").length
  const monthAmount = outboundRows
    .filter((r) => r.status !== "已作废" && r.amount !== "—")
    .reduce((s, r) => s + Number(r.amount.replace(/,/g, "")), 0)
    .toLocaleString("zh-CN")

  const filtered = outboundRows.filter((r) => {
    const matchSearch =
      !searchTerm ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "全部" || r.status === statusFilter
    const matchType = typeFilter === "全部" || r.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  void shipped
  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
            <PackageMinus className="w-5 h-5 text-orange-700" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">出库管理</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              管理出租、销售、调拨、盘亏等出库单据，跟踪发运执行与签收回单
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
            新建出库单
          </Button>
        </div>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="出库单总数"
          value={total.toString()}
          icon={PackageMinus}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
        <StatCard
          label="待出库"
          value={pending.toString()}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />
        <StatCard
          label="已签收"
          value={signed.toString()}
          icon={CheckCircle2}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
        />
        <StatCard
          label="累计出库金额(元)"
          value={monthAmount}
          icon={CircleDollarSign}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          valueSize="xl"
        />
      </div>

      {/* 筛选 + 表格 */}
      <Card className="w-full min-w-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索出库单号 / 收货单位"
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
                {["全部", "待出库", "已出库", "已签收", "已作废"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="出库类型" />
              </SelectTrigger>
              <SelectContent>
                {["全部", "出租出库", "销售出库", "调拨出库", "盘亏出库"].map(
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
            <Table className="min-w-[1680px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[60px] text-center">序号</TableHead>
                  <TableHead className="w-[150px]">出库单号</TableHead>
                  <TableHead>出库类型</TableHead>
                  <TableHead>收货单位/承租方</TableHead>
                  <TableHead className="w-[260px]">物资名称</TableHead>
                  <TableHead className="text-right">品种</TableHead>
                  <TableHead className="text-right">计划数量</TableHead>
                  <TableHead className="text-right">实际出库</TableHead>
                  <TableHead>出库仓库</TableHead>
                  <TableHead>计划日期</TableHead>
                  <TableHead>发运日期</TableHead>
                  <TableHead>签收日期</TableHead>
                  <TableHead>经办人</TableHead>
                  <TableHead className="text-right">金额(元)</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-[230px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, idx) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>{typeBadge(r.type)}</TableCell>
                    <TableCell className="text-sm">{r.customer}</TableCell>
                    <TableCell>
                      <MaterialNamesCell names={r.materials} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.itemTypes}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {r.plannedQty}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {r.actualQty}
                    </TableCell>
                    <TableCell className="text-sm">{r.warehouse}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.planDate}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.shipDate}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.signDate}
                    </TableCell>
                    <TableCell className="text-sm">{r.operator}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {r.amount}
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
  icon: typeof PackageMinus
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
