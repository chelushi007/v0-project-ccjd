"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Download,
  Boxes,
  PackageCheck,
  PackageOpen,
  AlertTriangle,
  ArrowRightLeft,
  ClipboardCheck,
  QrCode,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MaterialCreatePage } from "./material-create-page"
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

const categories = [
  "全部",
  "模板类",
  "支护类",
  "脚手架类",
  "拼装类",
  "轨道类",
  "型材类",
  "电线电缆",
  "房屋建筑类",
  "其他材料",
]

const statusOptions = ["全部", "在库", "出租中", "低库存", "已锁定"]

interface InventoryRow {
  id: string
  name: string
  category: string
  spec: string
  unit: string
  available: number
  locked: number
  renting: number
  threshold: number
  warehouse: string
  age: string
  unitValue: number
  status: "在库" | "出租中" | "低库存" | "已锁定"
}

const inventoryRows: InventoryRow[] = [
  {
    id: "WL-2026-0001",
    name: "Q235B 热轧 H 型钢",
    category: "型材类",
    spec: "HW200×200×8×12",
    unit: "吨",
    available: 320,
    locked: 40,
    renting: 180,
    threshold: 80,
    warehouse: "中铁建广州南沙基地·A区",
    age: "186 天",
    unitValue: 4200,
    status: "在库",
  },
  {
    id: "WL-2026-0002",
    name: "建筑钢管脚手架套装",
    category: "脚手架类",
    spec: "Φ48×3.0 含扣件",
    unit: "套",
    available: 860,
    locked: 120,
    renting: 1400,
    threshold: 200,
    warehouse: "中铁建深圳前海基地·B区",
    age: "92 天",
    unitValue: 380,
    status: "出租中",
  },
  {
    id: "WL-2026-0003",
    name: "钢轨 60kg/m",
    category: "轨道类",
    spec: "60kg/m × 12.5m",
    unit: "根",
    available: 64,
    locked: 0,
    renting: 460,
    threshold: 80,
    warehouse: "中铁建广州南沙基地·A区",
    age: "215 天",
    unitValue: 2500,
    status: "低库存",
  },
  {
    id: "WL-2026-0004",
    name: "WJ-7 型扣件系统",
    category: "拼装类",
    spec: "标准成套",
    unit: "套",
    available: 4800,
    locked: 1200,
    renting: 3600,
    threshold: 1500,
    warehouse: "中铁建东莞虎门基地·C区",
    age: "138 天",
    unitValue: 56,
    status: "在库",
  },
  {
    id: "WL-2026-0005",
    name: "钢板桩 IV 型",
    category: "支护类",
    spec: "L=12m / IV",
    unit: "吨",
    available: 0,
    locked: 0,
    renting: 220,
    threshold: 30,
    warehouse: "中铁建中山翠亨基地·D区",
    age: "168 天",
    unitValue: 5800,
    status: "出租中",
  },
  {
    id: "WL-2026-0006",
    name: "组合钢模板",
    category: "模板类",
    spec: "1500×300×55",
    unit: "块",
    available: 6800,
    locked: 0,
    renting: 12400,
    threshold: 3000,
    warehouse: "中铁建广州南沙基地·E区",
    age: "108 天",
    unitValue: 88,
    status: "在库",
  },
  {
    id: "WL-2026-0007",
    name: "VV 型橡套电缆 3×95+1",
    category: "电线电缆",
    spec: "0.6/1kV",
    unit: "米",
    available: 12600,
    locked: 1800,
    renting: 9600,
    threshold: 5000,
    warehouse: "中铁建佛山顺德基地·F区",
    age: "76 天",
    unitValue: 78,
    status: "已锁定",
  },
  {
    id: "WL-2026-0008",
    name: "QTZ63 塔吊标准节",
    category: "其他材料",
    spec: "标准节 1.5m",
    unit: "节",
    available: 18,
    locked: 4,
    renting: 22,
    threshold: 10,
    warehouse: "中铁建广州南沙基地·G区",
    age: "265 天",
    unitValue: 18000,
    status: "在库",
  },
]

type InvActionTone = "default" | "primary" | "warning" | "destructive"
interface InvAction {
  label: string
  tone?: InvActionTone
  icon?: typeof ArrowRightLeft
}

function inventoryActions(status: InventoryRow["status"]): InvAction[] {
  switch (status) {
    case "在库":
      return [
        { label: "查看" },
        { label: "出租", tone: "primary", icon: PackageOpen },
        { label: "出售", tone: "warning", icon: Tag },
        { label: "调拨", icon: ArrowRightLeft },
        { label: "盘点", icon: ClipboardCheck },
      ]
    case "出租中":
      return [
        { label: "查看" },
        { label: "续租", tone: "primary" },
        { label: "调拨", icon: ArrowRightLeft },
      ]
    case "低库存":
      return [
        { label: "查看" },
        { label: "采购入库", tone: "primary" },
        { label: "调拨", icon: ArrowRightLeft },
      ]
    case "已锁定":
      return [
        { label: "查看" },
        { label: "解锁", tone: "primary" },
      ]
  }
}

const invToneClass: Record<InvActionTone, string> = {
  default: "h-7 px-2 text-xs",
  primary: "h-7 px-2 text-xs text-primary",
  warning: "h-7 px-2 text-xs text-orange-600",
  destructive: "h-7 px-2 text-xs text-destructive",
}

function statusBadge(status: InventoryRow["status"]) {
  const map: Record<
    InventoryRow["status"],
    { bg: string; text: string; ring: string; label: string }
  > = {
    在库: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      label: "在库",
    },
    出租中: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-200",
      label: "出租中",
    },
    低库存: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      label: "低库存",
    },
    已锁定: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      label: "已锁定",
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

export function MaterialInventory() {
  const [mode, setMode] = useState<"list" | "create">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("全部")
  const [status, setStatus] = useState("全部")
  const [warehouse, setWarehouse] = useState("全部")

  if (mode === "create") {
    return <MaterialCreatePage onBack={() => setMode("list")} />
  }

  const total = inventoryRows.length
  const inStock = inventoryRows.filter((r) => r.status === "在库").length
  const renting = inventoryRows.filter((r) => r.status === "出租中").length
  const lowStock = inventoryRows.filter((r) => r.status === "低库存").length

  const totalValue = inventoryRows
    .reduce((s, r) => s + (r.available + r.renting + r.locked) * r.unitValue, 0)
    .toLocaleString("zh-CN")

  const filtered = inventoryRows.filter((r) => {
    const matchSearch =
      !searchTerm ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.spec.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = category === "全部" || r.category === category
    const matchStatus = status === "全部" || r.status === status
    const matchWarehouse = warehouse === "全部" || r.warehouse.includes(warehouse)
    return matchSearch && matchCategory && matchStatus && matchWarehouse
  })

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">库存管理</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              查看循环物料的实时库存、占用与价值分布，支持调拨与盘点
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出库存
          </Button>
          <Button size="sm" onClick={() => setMode("create")}>
            <Plus className="w-4 h-4 mr-2" />
            新增物料
          </Button>
        </div>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="物料品类总数"
          value={total.toString()}
          icon={Boxes}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          sub={`库存总值 ${totalValue} 元`}
        />
        <StatCard
          label="在库可用"
          value={inStock.toString()}
          icon={PackageCheck}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          sub="可立即调拨/出租"
        />
        <StatCard
          label="出租中"
          value={renting.toString()}
          icon={PackageOpen}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          sub="已签约履约中"
        />
        <StatCard
          label="低库存预警"
          value={lowStock.toString()}
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          sub="可用量低于阈值"
        />
      </div>

      {/* 筛选与表格 */}
      <Card className="w-full min-w-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索物料编号、名称、规格"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="物料分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="库存状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="存放仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部仓库</SelectItem>
                <SelectItem value="广州南沙">广州南沙基地</SelectItem>
                <SelectItem value="深圳前海">深圳前海基地</SelectItem>
                <SelectItem value="东莞虎门">东莞虎门基地</SelectItem>
                <SelectItem value="中山翠亨">中山翠亨基地</SelectItem>
                <SelectItem value="佛山顺德">佛山顺德基地</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-auto">
              共 {filtered.length} 条记录
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1520px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[60px] text-center">序号</TableHead>
                  <TableHead className="w-[130px]">物料编号</TableHead>
                  <TableHead>物料名称</TableHead>
                  <TableHead>规格型号</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">可用</TableHead>
                  <TableHead className="text-right">已锁定</TableHead>
                  <TableHead className="text-right">在租</TableHead>
                  <TableHead>存放仓库</TableHead>
                  <TableHead>库龄</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-[300px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, idx) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.spec}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {r.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span
                        className={
                          r.status === "低库存"
                            ? "text-amber-700 font-semibold"
                            : "font-medium"
                        }
                      >
                        {r.available.toLocaleString("zh-CN")}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {r.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {r.locked.toLocaleString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {r.renting.toLocaleString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-sm">{r.warehouse}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.age}
                    </TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1">
                        {inventoryActions(r.status).map((a) => {
                          const Icon = a.icon
                          return (
                            <Button
                              key={a.label}
                              variant="ghost"
                              size="sm"
                              className={invToneClass[a.tone ?? "default"]}
                            >
                              {Icon && <Icon className="w-3 h-3 mr-1" />}
                              {a.label}
                            </Button>
                          )
                        })}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="生成二维码"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Button>
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
            className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {value}
            </div>
            {sub && (
              <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                {sub}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
