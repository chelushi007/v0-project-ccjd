"use client"

import { useState } from "react"
import {
  Package,
  Search,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Ruler,
  Briefcase,
  Handshake,
  Star,
  ShieldCheck,
  Download,
  AlertTriangle,
  Clock,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

type PublishStatus = "草稿" | "待审核" | "已上架" | "审核驳回" | "已下架"
type WarehouseType = "平面" | "楼层"
type Operation = "自主" | "委托" | "自主/委托"
type OperationStatus = "可出租" | "不可出租" | "—"
type UnitNature = "仓储单位" | "仓储站点" | "物资专运单位"

interface WarehouseRow {
  seq: number
  name: string
  code: string
  publishStatus: PublishStatus
  buildArea: number
  rentableArea: number
  type: WarehouseType
  region: string
  address: string
  unitNature: UnitNature
  belongUnit: string
  creator: string
  publishTime: string
  operation: Operation
  operationStatus: OperationStatus
  rating: number
}

const warehouseData: WarehouseRow[] = [
  {
    seq: 1,
    name: "中铁十九局集团第一工程有限公司南沙仓储基地",
    code: "",
    publishStatus: "草稿",
    buildArea: 1100,
    rentableArea: 1000,
    type: "平面",
    region: "广东省-广州市-南沙区",
    address: "进港大道23号",
    unitNature: "仓储单位",
    belongUnit: "中铁建工集团",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "自主",
    operationStatus: "—",
    rating: 0,
  },
  {
    seq: 2,
    name: "中铁十九局集团第一工程有限公司番禺综合仓库",
    code: "CK202511190002",
    publishStatus: "待审核",
    buildArea: 1100,
    rentableArea: 1000,
    type: "平面",
    region: "广东省-广州市-番禺区",
    address: "市新路168号",
    unitNature: "仓储站点",
    belongUnit: "南沙综合仓储基地",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "委托",
    operationStatus: "可出租",
    rating: 4,
  },
  {
    seq: 3,
    name: "中铁十九局集团第一工程有限公司黄埔物流园",
    code: "CK202511190003",
    publishStatus: "已上架",
    buildArea: 1100,
    rentableArea: 1000,
    type: "楼层",
    region: "广东省-广州市-黄埔区",
    address: "开发大道518号",
    unitNature: "仓储单位",
    belongUnit: "中铁建工集团",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "自主/委托",
    operationStatus: "不可出租",
    rating: 5,
  },
  {
    seq: 4,
    name: "中铁十九局集团第一工程有限公司花都钢材库",
    code: "CK202511190004",
    publishStatus: "审核驳回",
    buildArea: 1100,
    rentableArea: 1000,
    type: "平面",
    region: "广东省-广州市-花都区",
    address: "云山大道9号",
    unitNature: "物资专运单位",
    belongUnit: "南沙铁建专运车队",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "自主/委托",
    operationStatus: "可出租",
    rating: 3,
  },
  {
    seq: 5,
    name: "中铁十九局集团第一工程有限公司白云冷链基地",
    code: "CK202511190005",
    publishStatus: "已上架",
    buildArea: 1100,
    rentableArea: 1000,
    type: "平面",
    region: "广东省-广州市-白云区",
    address: "云城东路66号",
    unitNature: "仓储单位",
    belongUnit: "中铁建工集团",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "委托",
    operationStatus: "不可出租",
    rating: 4,
  },
  {
    seq: 6,
    name: "中铁十九局集团第一工程有限公司增城综合仓",
    code: "CK20251119006",
    publishStatus: "已上架",
    buildArea: 1100,
    rentableArea: 1000,
    type: "楼层",
    region: "广东省-广州市-增城区",
    address: "新塘大道188号",
    unitNature: "仓储站点",
    belongUnit: "增城综合站点",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "委托",
    operationStatus: "可出租",
    rating: 5,
  },
  {
    seq: 7,
    name: "中铁十九局集团第一工程有限公司从化项目仓库",
    code: "CK20251119007",
    publishStatus: "已下架",
    buildArea: 1100,
    rentableArea: 1000,
    type: "平面",
    region: "广东省-广州市-从化区",
    address: "城西路9号",
    unitNature: "物资专运单位",
    belongUnit: "从化专运车队",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "自主",
    operationStatus: "—",
    rating: 3,
  },
  {
    seq: 8,
    name: "中铁十九局集团第一工程有限公司海珠钢构基地",
    code: "CK20251119008",
    publishStatus: "待审核",
    buildArea: 1100,
    rentableArea: 1000,
    type: "平面",
    region: "广东省-广州市-海珠区",
    address: "新港东路66号",
    unitNature: "仓储单位",
    belongUnit: "中铁建工集团",
    creator: "王女士",
    publishTime: "2025-11-01",
    operation: "委托",
    operationStatus: "可出租",
    rating: 4,
  },
  {
    seq: 9,
    name: "中铁十九局集团第一工程有限公司天河中转仓",
    code: "CK20251119009",
    publishStatus: "已下架",
    buildArea: 1100,
    rentableArea: 1000,
    type: "楼层",
    region: "广东省-广州市-天河区",
    address: "黄埔大道东128号",
    unitNature: "物资专运单位",
    belongUnit: "天河转运中心",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "自主/委托",
    operationStatus: "可出租",
    rating: 2,
  },
  {
    seq: 10,
    name: "中铁十九局集团第一工程有限公司荔湾设备仓库",
    code: "CK20251119010",
    publishStatus: "已下架",
    buildArea: 1100,
    rentableArea: 1000,
    type: "楼层",
    region: "广东省-广州市-荔湾区",
    address: "黄沙大道12号",
    unitNature: "仓储站点",
    belongUnit: "荔湾设备站点",
    creator: "李先生",
    publishTime: "2025-10-01",
    operation: "自主/委托",
    operationStatus: "—",
    rating: 1,
  },
  {
    seq: 11,
    name: "中铁十九局集团第一工程有限公司琶洲临港仓库",
    code: "CK20251119011",
    publishStatus: "已上架",
    buildArea: 1200,
    rentableArea: 1100,
    type: "平面",
    region: "广东省-广州市-海珠区",
    address: "新港东路168号",
    unitNature: "仓储单位",
    belongUnit: "中铁建工集团",
    creator: "李先生",
    publishTime: "2025-10-02",
    operation: "自主",
    operationStatus: "可出租",
    rating: 5,
  },
  {
    seq: 12,
    name: "中铁建工集团广州黄埔仓储基地",
    code: "CK20251119012",
    publishStatus: "待审核",
    buildArea: 2400,
    rentableArea: 2100,
    type: "平面",
    region: "广东省-广州市-黄埔区",
    address: "开发大道999号",
    unitNature: "仓储单位",
    belongUnit: "中铁建工集团",
    creator: "陈工",
    publishTime: "2025-11-10",
    operation: "自主/委托",
    operationStatus: "可出租",
    rating: 0,
  },
]

function getPublishBadge(status: PublishStatus) {
  const map: Record<PublishStatus, string> = {
    草稿: "bg-muted text-muted-foreground border-border",
    待审核: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    已上架: "bg-green-500/10 text-green-600 border-green-500/20",
    审核驳回: "bg-red-500/10 text-red-600 border-red-500/20",
    已下架: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  }
  return <Badge className={`${map[status]} font-normal`}>{status}</Badge>
}

function getOperationBadge(op: Operation) {
  if (op === "自主") {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-blue-600">
        <Briefcase className="w-3.5 h-3.5" />
        自主
      </span>
    )
  }
  if (op === "委托") {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-purple-600">
        <Handshake className="w-3.5 h-3.5" />
        委托
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm text-foreground">
      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
      <span className="text-muted-foreground">/</span>
      <Handshake className="w-3.5 h-3.5 text-purple-600" />
      <span className="ml-0.5">自主/委托</span>
    </span>
  )
}

function getOperationStatusCell(status: OperationStatus) {
  if (status === "可出租") {
    return <span className="text-sm text-green-600">可出租</span>
  }
  if (status === "不可出租") {
    return <span className="text-sm text-muted-foreground">不可出租</span>
  }
  return <span className="text-muted-foreground">—</span>
}

function getRatingStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)))
  if (safe === 0) {
    return <span className="text-xs text-muted-foreground">暂无评价</span>
  }
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${safe}星评价`}
      title={`${safe} / 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < safe
              ? "fill-yellow-400 text-yellow-400"
              : "fill-transparent text-muted-foreground/40"
          }`}
        />
      ))}
      <span className="ml-1 text-xs tabular-nums text-muted-foreground">
        {safe}.0
      </span>
    </span>
  )
}

function getUnitNatureBadge(nature: UnitNature) {
  const map: Record<UnitNature, string> = {
    仓储单位: "bg-primary/10 text-primary border-primary/20",
    仓储站点: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    物资专运单位: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  }
  return (
    <Badge className={`${map[nature]} font-normal whitespace-nowrap`}>
      {nature}
    </Badge>
  )
}

// 运营方专属操作：审核监管视角
function getOperatorActions(
  row: WarehouseRow,
): { label: string; tone?: "primary" | "warning" | "destructive" | "success" }[] {
  switch (row.publishStatus) {
    case "草稿":
      return [{ label: "查看", tone: "primary" }]
    case "待审核":
      return [
        { label: "审核通过", tone: "success" },
        { label: "驳回", tone: "destructive" },
        { label: "查看", tone: "primary" },
      ]
    case "已上架":
      return [
        { label: "查看", tone: "primary" },
        { label: "约谈", tone: "warning" },
        { label: "强制下架", tone: "destructive" },
      ]
    case "审核驳回":
      return [
        { label: "查看", tone: "primary" },
        { label: "复核", tone: "warning" },
      ]
    case "已下架":
      return [
        { label: "查看", tone: "primary" },
        { label: "重新启用", tone: "success" },
      ]
  }
}

const toneClass: Record<string, string> = {
  primary: "text-primary hover:text-primary",
  warning: "text-orange-600 hover:text-orange-600",
  destructive: "text-destructive hover:text-destructive",
  success: "text-green-600 hover:text-green-700",
  default: "text-foreground",
}

export function OperatorWarehouse() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [natureFilter, setNatureFilter] = useState<string>("all")
  const [operationFilter, setOperationFilter] = useState<string>("all")

  const stats = {
    total: warehouseData.length,
    pending: warehouseData.filter((i) => i.publishStatus === "待审核").length,
    published: warehouseData.filter((i) => i.publishStatus === "已上架").length,
    buildArea: warehouseData.reduce((s, i) => s + i.buildArea, 0),
    rentableArea: warehouseData.reduce((s, i) => s + i.rentableArea, 0),
  }

  const filtered = warehouseData.filter((item) => {
    if (searchKeyword) {
      const k = searchKeyword.toLowerCase()
      const hit =
        item.name.toLowerCase().includes(k) ||
        item.code.toLowerCase().includes(k) ||
        item.address.toLowerCase().includes(k) ||
        item.belongUnit.toLowerCase().includes(k)
      if (!hit) return false
    }
    if (statusFilter !== "all" && item.publishStatus !== statusFilter)
      return false
    if (natureFilter !== "all" && item.unitNature !== natureFilter) return false
    if (operationFilter !== "all" && item.operation !== operationFilter)
      return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">仓储站点监管</h1>
          <p className="text-muted-foreground mt-1">
            全平台仓储站点审核、运营监管与合规追踪
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      {/* 统计卡片 — 运营视角：突出待审核 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">站点总数</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/30 bg-yellow-500/[0.03]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待审核</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已上架运营</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {stats.published}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">建筑面积</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.buildArea.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ㎡
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Ruler className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">可租面积</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.rentableArea.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ㎡
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 仓储列表 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">仓储站点监管列表</CardTitle>
              <CardDescription>
                平台全量仓储站点 — 审核、监管、运营干预
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索名称/编号/地址/归属单位..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-[260px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="发布状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="草稿">草稿</SelectItem>
                  <SelectItem value="待审核">待审核</SelectItem>
                  <SelectItem value="已上架">已上架</SelectItem>
                  <SelectItem value="审核驳回">审核驳回</SelectItem>
                  <SelectItem value="已下架">已下架</SelectItem>
                </SelectContent>
              </Select>
              <Select value={natureFilter} onValueChange={setNatureFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="单位性质" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部性质</SelectItem>
                  <SelectItem value="仓储单位">仓储单位</SelectItem>
                  <SelectItem value="仓储站点">仓储站点</SelectItem>
                  <SelectItem value="物资专运单位">物资专运单位</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={operationFilter}
                onValueChange={setOperationFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="运营方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方式</SelectItem>
                  <SelectItem value="自主">自主</SelectItem>
                  <SelectItem value="委托">委托</SelectItem>
                  <SelectItem value="自主/委托">自主/委托</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 待审核醒目提示 */}
          {stats.pending > 0 && statusFilter === "all" && (
            <button
              type="button"
              onClick={() => setStatusFilter("待审核")}
              className="w-full mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-md border border-yellow-500/30 bg-yellow-500/[0.06] hover:bg-yellow-500/[0.1] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    当前有 {stats.pending} 个站点等待运营方审核
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    点击此处快速筛选「待审核」站点
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[2140px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">序号</TableHead>
                  <TableHead className="w-[200px]">仓储名称</TableHead>
                  <TableHead className="w-[150px]">仓储编号</TableHead>
                  <TableHead className="w-[100px]">发布状态</TableHead>
                  <TableHead className="w-[100px] text-right">建筑面积</TableHead>
                  <TableHead className="w-[100px] text-right">可租面积</TableHead>
                  <TableHead className="w-[90px]">仓储类型</TableHead>
                  <TableHead className="w-[170px]">所在区域</TableHead>
                  <TableHead className="w-[140px]">详细地址</TableHead>
                  <TableHead className="w-[130px]">单位性质</TableHead>
                  <TableHead className="w-[150px]">所属单位</TableHead>
                  <TableHead className="w-[80px]">创建人</TableHead>
                  <TableHead className="w-[110px]">发布时间</TableHead>
                  <TableHead className="w-[120px]">运营方式</TableHead>
                  <TableHead className="w-[100px]">运营状态</TableHead>
                  <TableHead className="w-[150px]">评价</TableHead>
                  <TableHead className="w-[260px]">运营操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={`${row.seq}-${row.code || "draft"}`}>
                    <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                      {row.seq}
                    </TableCell>
                    <TableCell>
                      <p
                        className="text-sm text-primary truncate max-w-[200px]"
                        title={row.name}
                      >
                        {row.name}
                      </p>
                    </TableCell>
                    <TableCell>
                      {row.code ? (
                        <span className="font-mono text-xs text-foreground">
                          {row.code}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getPublishBadge(row.publishStatus)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.buildArea}
                      <span className="text-xs text-muted-foreground ml-0.5">
                        ㎡
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-green-600">
                      {row.rentableArea}
                      <span className="text-xs text-muted-foreground ml-0.5">
                        ㎡
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {row.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{row.region}</TableCell>
                    <TableCell className="text-sm">{row.address}</TableCell>
                    <TableCell>{getUnitNatureBadge(row.unitNature)}</TableCell>
                    <TableCell className="text-sm">{row.belongUnit}</TableCell>
                    <TableCell className="text-sm">{row.creator}</TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {row.publishTime}
                    </TableCell>
                    <TableCell>{getOperationBadge(row.operation)}</TableCell>
                    <TableCell>
                      {getOperationStatusCell(row.operationStatus)}
                    </TableCell>
                    <TableCell>{getRatingStars(row.rating)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {getOperatorActions(row).map((a) => (
                          <button
                            key={a.label}
                            type="button"
                            className={`text-xs hover:underline ${
                              toneClass[a.tone ?? "primary"]
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <FileText className="w-4 h-4" />共 {filtered.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-primary-foreground"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
