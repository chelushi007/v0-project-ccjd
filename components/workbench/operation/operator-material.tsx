"use client"

import { useState } from "react"
import {
  Search,
  Download,
  Boxes,
  PackageOpen,
  Tag,
  Building2,
  Warehouse,
  Eye,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const categories = [
  "全部",
  "模板类",
  "支护类",
  "脚手架类",
  "拼装类",
  "轨道类",
  "型材类",
  "电线电缆",
  "其他材料",
]

type OperationStatus =
  | "全部租售"
  | "在库未挂牌"
  | "出租中"
  | "出售中"
  | "租售并行"
  | "低库存"

const opStatusOptions: OperationStatus[] = [
  "全部租售",
  "在库未挂牌",
  "出租中",
  "出售中",
  "租售并行",
  "低库存",
]

interface WarehouseDist {
  name: string // 仓储基地
  qty: number // 库存量
}

interface OperatorMaterialRow {
  id: string // 物资编号
  name: string // 物资名称
  category: string
  spec: string
  unit: string
  owner: string // 物权方（物资归属单位）
  ownerType: "施工单位" | "供应商" | "物资公司"
  total: number // 总台账数量
  available: number // 在库可用
  renting: number // 在租
  selling: number // 在售
  locked: number // 已锁定
  threshold: number
  unitValue: number // 单价（元）
  warehouses: WarehouseDist[] // 存储分布
  // 出租情况
  rentOrders: number // 在租订单数
  rentProgressDays: { used: number; total: number } | null // 平均合约进度
  rentRevenueMTD: number // 本月在租收入
  // 出售情况
  sellListedQty: number // 挂牌量
  sellSoldQty: number // 已成交量
  sellRevenueMTD: number // 本月销售额
}

const dataRows: OperatorMaterialRow[] = [
  {
    id: "WL-2026-0001",
    name: "Q235B 热轧 H 型钢",
    category: "型材类",
    spec: "HW200×200×8×12",
    unit: "吨",
    owner: "中铁建广州工程有限公司",
    ownerType: "施工单位",
    total: 540,
    available: 320,
    renting: 180,
    selling: 0,
    locked: 40,
    threshold: 80,
    unitValue: 4200,
    warehouses: [
      { name: "广州南沙基地 · A区", qty: 380 },
      { name: "东莞虎门基地 · C区", qty: 160 },
    ],
    rentOrders: 4,
    rentProgressDays: { used: 96, total: 180 },
    rentRevenueMTD: 86400,
    sellListedQty: 0,
    sellSoldQty: 0,
    sellRevenueMTD: 0,
  },
  {
    id: "WL-2026-0002",
    name: "建筑钢管脚手架套装",
    category: "脚手架类",
    spec: "Φ48×3.0 含扣件",
    unit: "套",
    owner: "中铁十四局集团广州分公司",
    ownerType: "施工单位",
    total: 2380,
    available: 860,
    renting: 1400,
    selling: 0,
    locked: 120,
    threshold: 200,
    unitValue: 380,
    warehouses: [
      { name: "深圳前海基地 · B区", qty: 1500 },
      { name: "广州南沙基地 · A区", qty: 880 },
    ],
    rentOrders: 8,
    rentProgressDays: { used: 65, total: 120 },
    rentRevenueMTD: 168000,
    sellListedQty: 0,
    sellSoldQty: 0,
    sellRevenueMTD: 0,
  },
  {
    id: "WL-2026-0003",
    name: "钢轨 60kg/m",
    category: "轨道类",
    spec: "60kg/m × 12.5m",
    unit: "根",
    owner: "中铁建铁路物资华南公司",
    ownerType: "物资公司",
    total: 524,
    available: 64,
    renting: 460,
    selling: 0,
    locked: 0,
    threshold: 80,
    unitValue: 2500,
    warehouses: [{ name: "广州南沙基地 · A区", qty: 524 }],
    rentOrders: 3,
    rentProgressDays: { used: 142, total: 240 },
    rentRevenueMTD: 92000,
    sellListedQty: 0,
    sellSoldQty: 0,
    sellRevenueMTD: 0,
  },
  {
    id: "WL-2026-0004",
    name: "WJ-7 型扣件系统",
    category: "拼装类",
    spec: "标准成套",
    unit: "套",
    owner: "中铁建铁路物资华南公司",
    ownerType: "物资公司",
    total: 10800,
    available: 4800,
    renting: 3600,
    selling: 1200,
    locked: 1200,
    threshold: 1500,
    unitValue: 56,
    warehouses: [
      { name: "东莞虎门基地 · C区", qty: 6800 },
      { name: "佛山顺德基地 · F区", qty: 4000 },
    ],
    rentOrders: 5,
    rentProgressDays: { used: 78, total: 150 },
    rentRevenueMTD: 64800,
    sellListedQty: 1200,
    sellSoldQty: 380,
    sellRevenueMTD: 21280,
  },
  {
    id: "WL-2026-0005",
    name: "钢板桩 IV 型",
    category: "支护类",
    spec: "L=12m / IV",
    unit: "吨",
    owner: "中铁十二局集团有限公司",
    ownerType: "施工单位",
    total: 220,
    available: 0,
    renting: 220,
    selling: 0,
    locked: 0,
    threshold: 30,
    unitValue: 5800,
    warehouses: [{ name: "中山翠亨基地 · D区", qty: 220 }],
    rentOrders: 2,
    rentProgressDays: { used: 188, total: 200 },
    rentRevenueMTD: 124000,
    sellListedQty: 0,
    sellSoldQty: 0,
    sellRevenueMTD: 0,
  },
  {
    id: "WL-2026-0006",
    name: "组合钢模板",
    category: "模板类",
    spec: "1500×300×55",
    unit: "块",
    owner: "广东建科物资租赁有限公司",
    ownerType: "供应商",
    total: 19200,
    available: 6800,
    renting: 12400,
    selling: 0,
    locked: 0,
    threshold: 3000,
    unitValue: 88,
    warehouses: [
      { name: "广州南沙基地 · E区", qty: 12000 },
      { name: "深圳前海基地 · B区", qty: 7200 },
    ],
    rentOrders: 11,
    rentProgressDays: { used: 32, total: 90 },
    rentRevenueMTD: 218400,
    sellListedQty: 0,
    sellSoldQty: 0,
    sellRevenueMTD: 0,
  },
  {
    id: "WL-2026-0007",
    name: "VV 型橡套电缆 3×95+1",
    category: "电线电缆",
    spec: "0.6/1kV",
    unit: "米",
    owner: "中铁建机电物资华南分公司",
    ownerType: "物资公司",
    total: 24000,
    available: 12600,
    renting: 9600,
    selling: 0,
    locked: 1800,
    threshold: 5000,
    unitValue: 78,
    warehouses: [{ name: "佛山顺德基地 · F区", qty: 24000 }],
    rentOrders: 6,
    rentProgressDays: { used: 45, total: 180 },
    rentRevenueMTD: 86400,
    sellListedQty: 0,
    sellSoldQty: 0,
    sellRevenueMTD: 0,
  },
  {
    id: "WL-2026-0008",
    name: "QTZ63 塔吊标准节",
    category: "其他材料",
    spec: "标准节 1.5m",
    unit: "节",
    owner: "中铁建塔机租赁有限公司",
    ownerType: "供应商",
    total: 44,
    available: 18,
    renting: 22,
    selling: 4,
    locked: 0,
    threshold: 10,
    unitValue: 18000,
    warehouses: [{ name: "广州南沙基地 · G区", qty: 44 }],
    rentOrders: 2,
    rentProgressDays: { used: 60, total: 365 },
    rentRevenueMTD: 198000,
    sellListedQty: 4,
    sellSoldQty: 1,
    sellRevenueMTD: 18000,
  },
  {
    id: "WL-2026-0009",
    name: "贝雷片 3m 标准节",
    category: "拼装类",
    spec: "3000×1500×150",
    unit: "片",
    owner: "中铁十四局集团广州分公司",
    ownerType: "施工单位",
    total: 320,
    available: 200,
    renting: 0,
    selling: 120,
    locked: 0,
    threshold: 50,
    unitValue: 4200,
    warehouses: [{ name: "广州南沙基地 · A区", qty: 320 }],
    rentOrders: 0,
    rentProgressDays: null,
    rentRevenueMTD: 0,
    sellListedQty: 120,
    sellSoldQty: 64,
    sellRevenueMTD: 268800,
  },
]

// 根据数据派生业务状态
function deriveStatus(r: OperatorMaterialRow): OperationStatus {
  const hasRent = r.renting > 0 || r.rentOrders > 0
  const hasSell = r.sellListedQty > 0
  if (r.available < r.threshold && r.renting + r.selling === 0) return "低库存"
  if (hasRent && hasSell) return "租售并行"
  if (hasRent) return "出租中"
  if (hasSell) return "出售中"
  return "在库未挂牌"
}

const opStatusStyle: Record<
  OperationStatus,
  { chip: string; dot: string }
> = {
  全部租售: { chip: "", dot: "" },
  在库未挂牌: {
    chip: "bg-slate-50 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
  },
  出租中: {
    chip: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  出售中: {
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  租售并行: {
    chip: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
  },
  低库存: {
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
}

function fmt(n: number) {
  return n.toLocaleString("zh-CN")
}

export function OperatorMaterial() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("全部")
  const [opStatus, setOpStatus] = useState<OperationStatus>("全部租售")
  const [ownerFilter, setOwnerFilter] = useState("全部")

  // 物权方下拉项（自动收敛）
  const ownerOptions = [
    "全部",
    ...Array.from(new Set(dataRows.map((r) => r.owner))),
  ]

  const filtered = dataRows.filter((r) => {
    const matchSearch =
      !searchTerm ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = category === "全部" || r.category === category
    const matchOwner = ownerFilter === "全部" || r.owner === ownerFilter
    const matchStatus =
      opStatus === "全部租售" || deriveStatus(r) === opStatus
    return matchSearch && matchCat && matchOwner && matchStatus
  })

  // 统计
  const totalSKU = dataRows.length
  const totalOwners = new Set(dataRows.map((r) => r.owner)).size
  const rentingSku = dataRows.filter(
    (r) => r.renting > 0 || r.rentOrders > 0,
  ).length
  const sellingSku = dataRows.filter((r) => r.sellListedQty > 0).length
  const lowStockSku = dataRows.filter(
    (r) => r.available < r.threshold && r.renting + r.selling === 0,
  ).length
  const totalAssetValue = dataRows.reduce(
    (s, r) => s + r.total * r.unitValue,
    0,
  )
  const totalRentRevenueMTD = dataRows.reduce(
    (s, r) => s + r.rentRevenueMTD,
    0,
  )
  const totalSellRevenueMTD = dataRows.reduce(
    (s, r) => s + r.sellRevenueMTD,
    0,
  )

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* 页头 */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-foreground truncate">
                物资监管
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                按物权方维度查看物资台账、存储分布、出租与出售进度
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出明细
            </Button>
          </div>
        </div>

        {/* 统计卡 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            label="登记物资 SKU"
            value={totalSKU.toString()}
            icon={Boxes}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            sub={`资产总值 ${fmt(Math.round(totalAssetValue / 10000))} 万元`}
          />
          <StatCard
            label="物权方"
            value={totalOwners.toString()}
            icon={Building2}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-700"
            sub="入驻业主单位"
          />
          <StatCard
            label="出租中 SKU"
            value={rentingSku.toString()}
            icon={PackageOpen}
            iconBg="bg-blue-100"
            iconColor="text-blue-700"
            sub={`本月在租收入 ${fmt(Math.round(totalRentRevenueMTD / 10000))} 万`}
          />
          <StatCard
            label="出售中 SKU"
            value={sellingSku.toString()}
            icon={Tag}
            iconBg="bg-amber-100"
            iconColor="text-amber-700"
            sub={`本月成交额 ${fmt(Math.round(totalSellRevenueMTD / 10000))} 万`}
          />
          <StatCard
            label="活跃营收 SKU"
            value={(rentingSku + sellingSku).toString()}
            icon={TrendingUp}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-700"
            sub="有租或售在途"
          />
          <StatCard
            label="低库存预警"
            value={lowStockSku.toString()}
            icon={AlertTriangle}
            iconBg="bg-rose-100"
            iconColor="text-rose-700"
            sub="低于阈值且无租售"
          />
        </div>

        {/* 筛选与表格 */}
        <Card className="w-full min-w-0 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[240px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索物资编号、名称、规格、物权方"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="物权方" />
                </SelectTrigger>
                <SelectContent>
                  {ownerOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o === "全部" ? "全部物权方" : o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="物资分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={opStatus}
                onValueChange={(v) => setOpStatus(v as OperationStatus)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="租售状态" />
                </SelectTrigger>
                <SelectContent>
                  {opStatusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground ml-auto">
                共 {filtered.length} 条记录
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1640px]">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[56px] text-center">序号</TableHead>
                    <TableHead className="w-[130px]">物资编号</TableHead>
                    <TableHead className="min-w-[180px]">物资 / 规格</TableHead>
                    <TableHead className="w-[100px]">分类</TableHead>
                    <TableHead className="min-w-[180px]">物权方</TableHead>
                    <TableHead className="w-[150px] text-right">
                      数量（可用 / 在租 / 在售）
                    </TableHead>
                    <TableHead className="min-w-[200px]">存储分布</TableHead>
                    <TableHead className="min-w-[200px]">出租进度</TableHead>
                    <TableHead className="min-w-[200px]">出售进度</TableHead>
                    <TableHead className="w-[110px]">租售状态</TableHead>
                    <TableHead className="w-[160px] text-center">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, idx) => {
                    const status = deriveStatus(r)
                    const style = opStatusStyle[status]
                    const rentPct = r.rentProgressDays
                      ? Math.min(
                          100,
                          Math.round(
                            (r.rentProgressDays.used /
                              r.rentProgressDays.total) *
                              100,
                          ),
                        )
                      : 0
                    const sellPct =
                      r.sellListedQty > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (r.sellSoldQty / r.sellListedQty) * 100,
                            ),
                          )
                        : 0
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {r.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium leading-tight">
                            {r.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {r.spec}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {r.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate">{r.owner}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 ml-5">
                            {r.ownerType}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm font-semibold tabular-nums">
                            {fmt(r.total)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {r.unit}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground tabular-nums mt-0.5">
                            <span className="text-emerald-700">
                              {fmt(r.available)}
                            </span>
                            <span className="mx-1">/</span>
                            <span className="text-blue-700">
                              {fmt(r.renting)}
                            </span>
                            <span className="mx-1">/</span>
                            <span className="text-amber-700">
                              {fmt(r.selling)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {r.warehouses.map((w) => (
                              <div
                                key={w.name}
                                className="flex items-center gap-1.5 text-xs min-w-0"
                              >
                                <Warehouse className="w-3 h-3 text-muted-foreground shrink-0" />
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="truncate text-foreground">
                                      {w.name}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>{w.name}</TooltipContent>
                                </Tooltip>
                                <span className="ml-auto tabular-nums text-muted-foreground shrink-0">
                                  {fmt(w.qty)}
                                  {r.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {r.rentOrders > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {r.rentOrders} 个在租订单
                                </span>
                                <span className="tabular-nums font-medium text-blue-700">
                                  {rentPct}%
                                </span>
                              </div>
                              <Progress
                                value={rentPct}
                                className="h-1.5 [&>div]:bg-blue-500"
                              />
                              <div className="text-[11px] text-muted-foreground tabular-nums">
                                {r.rentProgressDays?.used}/
                                {r.rentProgressDays?.total} 天 · 本月收入 ¥
                                {fmt(r.rentRevenueMTD)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              暂未出租
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {r.sellListedQty > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  挂牌 {fmt(r.sellListedQty)} · 成交{" "}
                                  {fmt(r.sellSoldQty)} {r.unit}
                                </span>
                                <span className="tabular-nums font-medium text-amber-700">
                                  {sellPct}%
                                </span>
                              </div>
                              <Progress
                                value={sellPct}
                                className="h-1.5 [&>div]:bg-amber-500"
                              />
                              <div className="text-[11px] text-muted-foreground">
                                本月销售额 ¥{fmt(r.sellRevenueMTD)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              暂未挂牌
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${style.chip} ring-1 border-0 font-medium gap-1.5`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                            />
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              详情
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-primary"
                            >
                              台账
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  sub,
}: {
  label: string
  value: string
  icon: typeof Boxes
  iconBg: string
  iconColor: string
  sub?: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
            <div className="text-xl font-bold text-foreground tabular-nums">
              {value}
            </div>
            {sub && (
              <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {sub}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
