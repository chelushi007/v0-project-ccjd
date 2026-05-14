"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Building2,
  MapPinned,
  Truck,
  Search,
  Plus,
  Download,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  PauseCircle,
  ArrowRight,
  Eye,
  Pencil,
  ShieldCheck,
  AlertCircle,
  Users,
  Package,
  Phone,
  CalendarClock,
  Route,
} from "lucide-react"

/* -------------------- 类型 & 数据 -------------------- */

type ResourceKey = "unit" | "site" | "transport"

interface ResourceMeta {
  key: ResourceKey
  label: string
  description: string
  Icon: typeof Building2
  accent: string // bg-* for icon container
  accentText: string // text-* color
  ring: string // ring color for selected tab
}

const RESOURCES: ResourceMeta[] = [
  {
    key: "unit",
    label: "仓储单位",
    description: "中铁建体系内入驻平台的二级 / 三级 / 项目组单位",
    Icon: Building2,
    accent: "bg-primary/10",
    accentText: "text-primary",
    ring: "ring-primary/40",
  },
  {
    key: "site",
    label: "仓储站点",
    description: "由仓储单位申请获得资质的下属仓储基地",
    Icon: MapPinned,
    accent: "bg-emerald-500/10",
    accentText: "text-emerald-600",
    ring: "ring-emerald-500/40",
  },
  {
    key: "transport",
    label: "专运单位",
    description: "由仓储站点申请获得资质的物资专属承运单位",
    Icon: Truck,
    accent: "bg-orange-500/10",
    accentText: "text-orange-600",
    ring: "ring-orange-500/40",
  },
]

type CommonStatus = "正常运营" | "审核中" | "待申请" | "已驳回" | "已停用"

interface UnitRow {
  id: string
  name: string
  level: "二级单位" | "三级单位" | "项目组"
  parentOrg: string
  location: string
  manager: string
  phone: string
  joinDate: string
  siteCount: number
  totalArea: number
  status: CommonStatus
}

interface SiteRow {
  id: string
  name: string
  parentUnit: string
  address: string
  area: number
  usedArea: number
  transportCount: number
  applyDate: string
  approveDate: string
  manager: string
  status: CommonStatus
}

interface TransportRow {
  id: string
  name: string
  parentSite: string
  parentUnit: string
  vehicles: number
  capacity: number // 总吨位
  serviceArea: string
  monthOrders: number
  applyDate: string
  approveDate: string
  status: CommonStatus
}

const unitRows: UnitRow[] = [
  {
    id: "WU-CRCC-001",
    name: "中铁十四局集团广州分公司",
    level: "二级单位",
    parentOrg: "中国铁建股份有限公司",
    location: "广东省广州市天河区",
    manager: "刘建国",
    phone: "138-2890-1188",
    joinDate: "2022-09-18",
    siteCount: 6,
    totalArea: 86000,
    status: "正常运营",
  },
  {
    id: "WU-CRCC-002",
    name: "中铁建工集团第二建设有限公司",
    level: "二级单位",
    parentOrg: "中国铁建股份有限公司",
    location: "广东省深圳市福田区",
    manager: "陈志远",
    phone: "139-8602-3366",
    joinDate: "2022-11-05",
    siteCount: 4,
    totalArea: 52000,
    status: "正常运营",
  },
  {
    id: "WU-CRCC-003",
    name: "中铁十六局集团华南分公司",
    level: "三级单位",
    parentOrg: "中铁十六局集团有限公司",
    location: "广东省东莞市虎门镇",
    manager: "王启明",
    phone: "137-5510-6688",
    joinDate: "2023-03-22",
    siteCount: 3,
    totalArea: 38000,
    status: "正常运营",
  },
  {
    id: "WU-CRCC-004",
    name: "中铁建广州地铁 11 号线项目组",
    level: "项目组",
    parentOrg: "中铁建工集团广州地铁指挥部",
    location: "广东省广州市番禺区",
    manager: "黄伟杰",
    phone: "136-8821-7799",
    joinDate: "2026-01-12",
    siteCount: 2,
    totalArea: 14500,
    status: "审核中",
  },
  {
    id: "WU-CRCC-005",
    name: "中铁二十局集团第六工程有限公司",
    level: "二级单位",
    parentOrg: "中铁二十局集团有限公司",
    location: "广东省佛山市顺德区",
    manager: "赵立新",
    phone: "135-9908-2233",
    joinDate: "2023-07-30",
    siteCount: 3,
    totalArea: 29000,
    status: "正常运营",
  },
  {
    id: "WU-CRCC-006",
    name: "中铁建惠州大亚湾项目组",
    level: "项目组",
    parentOrg: "中铁二十二局集团有限公司",
    location: "广东省惠州市大亚湾区",
    manager: "周明辉",
    phone: "139-7766-5511",
    joinDate: "2026-02-08",
    siteCount: 1,
    totalArea: 8200,
    status: "正常运营",
  },
  {
    id: "WU-CRCC-007",
    name: "中铁建深圳前海桩基项目组",
    level: "项目组",
    parentOrg: "中铁建工集团深圳指挥部",
    location: "广东省深圳市南山区",
    manager: "孙青松",
    phone: "138-3367-9921",
    joinDate: "—",
    siteCount: 0,
    totalArea: 0,
    status: "待申请",
  },
]

const siteRows: SiteRow[] = [
  {
    id: "WS-NS-001",
    name: "中铁建广州南沙综合仓储基地",
    parentUnit: "中铁十四局集团广州分公司",
    address: "广东省广州市南沙区进港大道 15 号铁建仓储园",
    area: 15000,
    usedArea: 12500,
    transportCount: 4,
    applyDate: "2023-01-08",
    approveDate: "2023-01-15",
    manager: "张志强",
    status: "正常运营",
  },
  {
    id: "WS-QH-002",
    name: "中铁建深圳前海智慧仓储基地",
    parentUnit: "中铁建工集团第二建设有限公司",
    address: "广东省深圳市南山区前海铁建大厦旁",
    area: 12000,
    usedArea: 9800,
    transportCount: 3,
    applyDate: "2023-03-10",
    approveDate: "2023-03-20",
    manager: "李文涛",
    status: "正常运营",
  },
  {
    id: "WS-HM-003",
    name: "中铁建东莞虎门港务仓储基地",
    parentUnit: "中铁十六局集团华南分公司",
    address: "广东省东莞市虎门镇铁路货运中心",
    area: 8000,
    usedArea: 5200,
    transportCount: 2,
    applyDate: "2023-05-22",
    approveDate: "2023-06-10",
    manager: "王伟杰",
    status: "正常运营",
  },
  {
    id: "WS-SD-004",
    name: "中铁十六局佛山顺德钢构仓储基地",
    parentUnit: "中铁十六局集团华南分公司",
    address: "广东省佛山市南海区狮山镇西站大道",
    area: 10000,
    usedArea: 3500,
    transportCount: 1,
    applyDate: "2026-01-05",
    approveDate: "—",
    manager: "赵建华",
    status: "审核中",
  },
  {
    id: "WS-PY-005",
    name: "中铁建广州番禺地铁专用仓储站点",
    parentUnit: "中铁建广州地铁 11 号线项目组",
    address: "广东省广州市番禺区市广路 88 号",
    area: 6500,
    usedArea: 2800,
    transportCount: 1,
    applyDate: "2026-02-10",
    approveDate: "2026-02-20",
    manager: "钱永康",
    status: "正常运营",
  },
  {
    id: "WS-SD-006",
    name: "中铁二十局顺德临港仓储站点",
    parentUnit: "中铁二十局集团第六工程有限公司",
    address: "广东省佛山市顺德区容桂街道",
    area: 9500,
    usedArea: 6300,
    transportCount: 2,
    applyDate: "2023-09-15",
    approveDate: "2023-09-28",
    manager: "孙利明",
    status: "正常运营",
  },
  {
    id: "WS-DY-007",
    name: "中铁建大亚湾石化仓储站点",
    parentUnit: "中铁建惠州大亚湾项目组",
    address: "广东省惠州市大亚湾区石化大道东",
    area: 8200,
    usedArea: 2100,
    transportCount: 0,
    applyDate: "2026-02-15",
    approveDate: "—",
    manager: "周明辉",
    status: "审核中",
  },
  {
    id: "WS-LG-008",
    name: "中铁建深圳龙岗物流仓储站点",
    parentUnit: "中铁建工集团第二建设有限公司",
    address: "广东省深圳市龙岗区平湖街道",
    area: 7800,
    usedArea: 0,
    transportCount: 0,
    applyDate: "2026-03-01",
    approveDate: "—",
    manager: "李文涛",
    status: "已驳回",
  },
]

const transportRows: TransportRow[] = [
  {
    id: "TR-NS-001",
    name: "南沙铁建专运车队",
    parentSite: "中铁建广州南沙综合仓储基地",
    parentUnit: "中铁十四局集团广州分公司",
    vehicles: 28,
    capacity: 680,
    serviceArea: "广州 / 佛山 / 东莞 / 中山",
    monthOrders: 142,
    applyDate: "2023-02-18",
    approveDate: "2023-03-01",
    status: "正常运营",
  },
  {
    id: "TR-NS-002",
    name: "南沙重型物流专运分队",
    parentSite: "中铁建广州南沙综合仓储基地",
    parentUnit: "中铁十四局集团广州分公司",
    vehicles: 16,
    capacity: 520,
    serviceArea: "广州 / 珠海 / 江门",
    monthOrders: 86,
    applyDate: "2023-06-08",
    approveDate: "2023-06-20",
    status: "正常运营",
  },
  {
    id: "TR-QH-003",
    name: "前海智运车队",
    parentSite: "中铁建深圳前海智慧仓储基地",
    parentUnit: "中铁建工集团第二建设有限公司",
    vehicles: 22,
    capacity: 540,
    serviceArea: "深圳 / 东莞 / 惠州",
    monthOrders: 118,
    applyDate: "2023-04-05",
    approveDate: "2023-04-22",
    status: "正常运营",
  },
  {
    id: "TR-HM-004",
    name: "虎门港务专运分队",
    parentSite: "中铁建东莞虎门港务仓储基地",
    parentUnit: "中铁十六局集团华南分公司",
    vehicles: 14,
    capacity: 360,
    serviceArea: "东莞 / 广州 / 深圳",
    monthOrders: 64,
    applyDate: "2023-07-12",
    approveDate: "2023-07-30",
    status: "正常运营",
  },
  {
    id: "TR-SD-005",
    name: "顺德钢构专运队",
    parentSite: "中铁十六局佛山顺德钢构仓储基地",
    parentUnit: "中铁十六局集团华南分公司",
    vehicles: 8,
    capacity: 240,
    serviceArea: "佛山 / 广州",
    monthOrders: 18,
    applyDate: "2026-02-25",
    approveDate: "—",
    status: "审核中",
  },
  {
    id: "TR-PY-006",
    name: "番禺地铁建材专运组",
    parentSite: "中铁建广州番禺地铁专用仓储站点",
    parentUnit: "中铁建广州地铁 11 号线项目组",
    vehicles: 10,
    capacity: 280,
    serviceArea: "广州 / 番禺 / 南沙",
    monthOrders: 36,
    applyDate: "2026-02-28",
    approveDate: "2026-03-08",
    status: "正常运营",
  },
  {
    id: "TR-RG-007",
    name: "顺德临港重型车队",
    parentSite: "中铁二十局顺德临港仓储站点",
    parentUnit: "中铁二十局集团第六工程有限公司",
    vehicles: 18,
    capacity: 450,
    serviceArea: "佛山 / 中山 / 江门",
    monthOrders: 92,
    applyDate: "2023-10-05",
    approveDate: "2023-10-22",
    status: "正常运营",
  },
  {
    id: "TR-RG-008",
    name: "顺德临港夜运分队",
    parentSite: "中铁二十局顺德临港仓储站点",
    parentUnit: "中铁二十局集团第六工程有限公司",
    vehicles: 6,
    capacity: 150,
    serviceArea: "佛山 / 顺德",
    monthOrders: 24,
    applyDate: "2026-03-12",
    approveDate: "—",
    status: "待申请",
  },
]

/* -------------------- 状态徽标 -------------------- */

function StatusBadge({ status }: { status: CommonStatus }) {
  const map: Record<
    CommonStatus,
    { className: string; Icon: typeof CheckCircle2; label: string }
  > = {
    正常运营: {
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      Icon: CheckCircle2,
      label: "正常运营",
    },
    审核中: {
      className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      Icon: Clock,
      label: "审核中",
    },
    待申请: {
      className: "bg-slate-500/10 text-slate-600 border-slate-500/30",
      Icon: AlertCircle,
      label: "待申请",
    },
    已驳回: {
      className: "bg-destructive/10 text-destructive border-destructive/30",
      Icon: XCircle,
      label: "已驳回",
    },
    已停用: {
      className: "bg-muted text-muted-foreground border-border",
      Icon: PauseCircle,
      label: "已停用",
    },
  }
  const cfg = map[status]
  const Icon = cfg.Icon
  return (
    <Badge variant="outline" className={cn("font-normal gap-1", cfg.className)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </Badge>
  )
}

function LevelBadge({ level }: { level: UnitRow["level"] }) {
  const map: Record<UnitRow["level"], string> = {
    二级单位: "bg-primary/10 text-primary border-primary/30",
    三级单位: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    项目组: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  }
  return (
    <Badge variant="outline" className={cn("font-normal", map[level])}>
      {level}
    </Badge>
  )
}

/* -------------------- 主组件 -------------------- */

export function WarehouseManagement() {
  const [active, setActive] = useState<ResourceKey>("unit")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部")
  const [levelFilter, setLevelFilter] = useState("全部")

  // 关闭页签切换时保留各自筛选条件以提升用户体验
  const activeMeta = RESOURCES.find((r) => r.key === active)!

  /* ------- 各页签的统计 / 列表过滤 ------- */

  const unitStats = useMemo(() => {
    return {
      total: unitRows.length,
      running: unitRows.filter((r) => r.status === "正常运营").length,
      reviewing: unitRows.filter((r) => r.status === "审核中").length,
      sites: unitRows.reduce((s, r) => s + r.siteCount, 0),
    }
  }, [])

  const siteStats = useMemo(() => {
    return {
      total: siteRows.length,
      running: siteRows.filter((r) => r.status === "正常运营").length,
      reviewing: siteRows.filter((r) => r.status === "审核中").length,
      area: siteRows.reduce((s, r) => s + r.area, 0),
    }
  }, [])

  const transportStats = useMemo(() => {
    return {
      total: transportRows.length,
      running: transportRows.filter((r) => r.status === "正常运营").length,
      reviewing: transportRows.filter((r) => r.status === "审核中").length,
      vehicles: transportRows.reduce((s, r) => s + r.vehicles, 0),
    }
  }, [])

  const filteredUnits = unitRows.filter((r) => {
    const ok =
      r.name.includes(searchTerm) ||
      r.id.includes(searchTerm) ||
      r.parentOrg.includes(searchTerm)
    const okStatus = statusFilter === "全部" || r.status === statusFilter
    const okLevel = levelFilter === "全部" || r.level === levelFilter
    return ok && okStatus && okLevel
  })
  const filteredSites = siteRows.filter((r) => {
    const ok =
      r.name.includes(searchTerm) ||
      r.id.includes(searchTerm) ||
      r.parentUnit.includes(searchTerm) ||
      r.address.includes(searchTerm)
    const okStatus = statusFilter === "全部" || r.status === statusFilter
    return ok && okStatus
  })
  const filteredTransports = transportRows.filter((r) => {
    const ok =
      r.name.includes(searchTerm) ||
      r.id.includes(searchTerm) ||
      r.parentSite.includes(searchTerm) ||
      r.parentUnit.includes(searchTerm)
    const okStatus = statusFilter === "全部" || r.status === statusFilter
    return ok && okStatus
  })

  return (
    <div className="space-y-5">
      {/* 页头 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">仓储管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            在同一窗口管理仓储单位、仓储站点与专运单位，并维护其层级隶属关系
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出当前列表
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {active === "unit"
              ? "新增仓储单位"
              : active === "site"
                ? "新增仓储站点"
                : "新增专运单位"}
          </Button>
        </div>
      </div>

      {/* 层级关系条 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
            <div className="text-xs text-muted-foreground md:w-24 md:self-center">
              资质流转
            </div>
            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
              {RESOURCES.map((r, i) => {
                const Icon = r.Icon
                const isActive = active === r.key
                return (
                  <div
                    key={r.key}
                    className="flex flex-1 items-center"
                  >
                    <button
                      onClick={() => setActive(r.key)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                        isActive
                          ? cn(
                              "border-transparent shadow-sm ring-2",
                              r.ring,
                            )
                          : "border-border hover:border-foreground/20 hover:bg-muted/40",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          r.accent,
                        )}
                      >
                        <Icon className={cn("h-5 w-5", r.accentText)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {r.label}
                          </span>
                          {isActive && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-1.5 text-[10px] font-normal"
                            >
                              当前
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {r.description}
                        </p>
                      </div>
                    </button>
                    {i < RESOURCES.length - 1 && (
                      <ArrowRight className="mx-1 hidden h-4 w-4 shrink-0 text-muted-foreground/60 md:block" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            仓储单位为中铁建体系内入驻平台的二级 / 三级 / 项目组单位；站点由仓储单位申请获得资质；专运单位由仓储站点申请获得资质
          </p>
        </CardContent>
      </Card>

      {/* 统计 */}
      {active === "unit" && (
        <StatRow
          items={[
            {
              label: "入驻仓储单位",
              value: unitStats.total,
              Icon: Building2,
              tone: "primary",
            },
            {
              label: "正常运营",
              value: unitStats.running,
              Icon: CheckCircle2,
              tone: "emerald",
            },
            {
              label: "审核中",
              value: unitStats.reviewing,
              Icon: Clock,
              tone: "amber",
            },
            {
              label: "下属站点合计",
              value: unitStats.sites,
              Icon: MapPinned,
              tone: "blue",
            },
          ]}
        />
      )}
      {active === "site" && (
        <StatRow
          items={[
            {
              label: "仓储站点总数",
              value: siteStats.total,
              Icon: MapPinned,
              tone: "emerald",
            },
            {
              label: "正常运营",
              value: siteStats.running,
              Icon: CheckCircle2,
              tone: "emerald",
            },
            {
              label: "审核中",
              value: siteStats.reviewing,
              Icon: Clock,
              tone: "amber",
            },
            {
              label: "可调度总面积",
              value: `${(siteStats.area / 10000).toFixed(1)} 万㎡`,
              Icon: Package,
              tone: "blue",
            },
          ]}
        />
      )}
      {active === "transport" && (
        <StatRow
          items={[
            {
              label: "专运单位总数",
              value: transportStats.total,
              Icon: Truck,
              tone: "orange",
            },
            {
              label: "正常运营",
              value: transportStats.running,
              Icon: CheckCircle2,
              tone: "emerald",
            },
            {
              label: "审核中",
              value: transportStats.reviewing,
              Icon: Clock,
              tone: "amber",
            },
            {
              label: "在册运力车辆",
              value: `${transportStats.vehicles} 辆`,
              Icon: Route,
              tone: "blue",
            },
          ]}
        />
      )}

      {/* 列表卡 */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  active === "unit"
                    ? "搜索单位名称 / 编号 / 上级机构"
                    : active === "site"
                      ? "搜索站点名称 / 编号 / 所属单位 / 地址"
                      : "搜索专运单位 / 所属站点 / 所属单位"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {active === "unit" && (
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="单位层级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部层级</SelectItem>
                  <SelectItem value="二级单位">二级单位</SelectItem>
                  <SelectItem value="三级单位">三级单位</SelectItem>
                  <SelectItem value="项目组">项目组</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部状态</SelectItem>
                <SelectItem value="正常运营">正常运营</SelectItem>
                <SelectItem value="审核中">审核中</SelectItem>
                <SelectItem value="待申请">待申请</SelectItem>
                <SelectItem value="已驳回">已驳回</SelectItem>
                <SelectItem value="已停用">已停用</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-xs text-muted-foreground">
              共{" "}
              <span className="font-medium text-foreground">
                {active === "unit"
                  ? filteredUnits.length
                  : active === "site"
                    ? filteredSites.length
                    : filteredTransports.length}
              </span>{" "}
              条 / {activeMeta.label}
            </div>
          </div>

          <div className="overflow-auto rounded-md border">
            {active === "unit" && <UnitTable rows={filteredUnits} />}
            {active === "site" && <SiteTable rows={filteredSites} />}
            {active === "transport" && (
              <TransportTable rows={filteredTransports} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* -------------------- 统计卡 -------------------- */

const toneMap: Record<
  string,
  { wrap: string; icon: string }
> = {
  primary: { wrap: "bg-primary/10", icon: "text-primary" },
  emerald: { wrap: "bg-emerald-500/10", icon: "text-emerald-600" },
  amber: { wrap: "bg-amber-500/10", icon: "text-amber-600" },
  blue: { wrap: "bg-blue-500/10", icon: "text-blue-600" },
  orange: { wrap: "bg-orange-500/10", icon: "text-orange-600" },
}

function StatRow({
  items,
}: {
  items: {
    label: string
    value: number | string
    Icon: typeof Building2
    tone: keyof typeof toneMap
  }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((it) => {
        const Icon = it.Icon
        const tone = toneMap[it.tone]
        return (
          <Card key={it.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                    tone.wrap,
                  )}
                >
                  <Icon className={cn("h-6 w-6", tone.icon)} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{it.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">
                    {it.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/* -------------------- 上级隶属链 -------------------- */

function ParentChain({
  parents,
}: {
  parents: { label: string; Icon: typeof Building2 }[]
}) {
  return (
    <div className="flex flex-col gap-0.5 text-xs">
      {parents.map((p, i) => {
        const Icon = p.Icon
        return (
          <div
            key={i}
            className="flex items-center gap-1 text-muted-foreground"
          >
            {i > 0 && (
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            )}
            <Icon className="h-3 w-3 shrink-0" />
            <span className="truncate">{p.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------- 三类列表 -------------------- */

function UnitTable({ rows }: { rows: UnitRow[] }) {
  return (
    <Table className="min-w-[1320px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">单位编号</TableHead>
          <TableHead className="min-w-[240px]">单位名称 / 上级机构</TableHead>
          <TableHead className="w-[110px]">层级</TableHead>
          <TableHead className="min-w-[150px]">注册地</TableHead>
          <TableHead className="min-w-[160px]">负责人</TableHead>
          <TableHead className="w-[110px] text-right">下属站点</TableHead>
          <TableHead className="w-[140px] text-right">托管面积 (㎡)</TableHead>
          <TableHead className="w-[120px]">入驻日期</TableHead>
          <TableHead className="w-[110px]">状态</TableHead>
          <TableHead className="w-[160px]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs">{r.id}</TableCell>
            <TableCell>
              <div className="font-medium text-foreground">{r.name}</div>
              <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                所属：{r.parentOrg}
              </div>
            </TableCell>
            <TableCell>
              <LevelBadge level={r.level} />
            </TableCell>
            <TableCell className="text-sm">{r.location}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {r.manager}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {r.phone}
              </div>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.siteCount > 0 ? (
                <span className="font-medium">{r.siteCount}</span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.totalArea > 0 ? r.totalArea.toLocaleString() : "—"}
            </TableCell>
            <TableCell className="text-sm">{r.joinDate}</TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>
              <RowActions status={r.status} kind="unit" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function SiteTable({ rows }: { rows: SiteRow[] }) {
  return (
    <Table className="min-w-[1440px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">站点编号</TableHead>
          <TableHead className="min-w-[260px]">
            站点名称 / 所属仓储单位
          </TableHead>
          <TableHead className="min-w-[200px]">地址</TableHead>
          <TableHead className="w-[150px] text-right">总面积 / 使用率</TableHead>
          <TableHead className="w-[110px] text-center">专运单位</TableHead>
          <TableHead className="w-[150px]">申请 / 获批</TableHead>
          <TableHead className="w-[140px]">负责人</TableHead>
          <TableHead className="w-[110px]">状态</TableHead>
          <TableHead className="w-[180px]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          const rate = r.area > 0 ? Math.round((r.usedArea / r.area) * 100) : 0
          return (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs">{r.id}</TableCell>
              <TableCell>
                <div className="font-medium text-foreground">{r.name}</div>
                <div className="mt-1">
                  <ParentChain
                    parents={[{ label: r.parentUnit, Icon: Building2 }]}
                  />
                </div>
              </TableCell>
              <TableCell className="max-w-[220px] text-sm text-muted-foreground">
                <span className="line-clamp-2">{r.address}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="tabular-nums font-medium">
                  {r.area.toLocaleString()} ㎡
                </div>
                <div className="mt-1 flex items-center justify-end gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {rate}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {r.transportCount > 0 ? (
                  <Badge variant="outline" className="font-normal">
                    <Truck className="mr-1 h-3 w-3" />
                    {r.transportCount}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3" />
                  申请 {r.applyDate}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  获批 {r.approveDate}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {r.manager}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
              <TableCell>
                <RowActions status={r.status} kind="site" />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function TransportTable({ rows }: { rows: TransportRow[] }) {
  return (
    <Table className="min-w-[1440px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">编号</TableHead>
          <TableHead className="min-w-[300px]">
            专运单位 / 所属站点 / 所属单位
          </TableHead>
          <TableHead className="w-[120px] text-right">车辆 / 总吨位</TableHead>
          <TableHead className="min-w-[180px]">服务范围</TableHead>
          <TableHead className="w-[120px] text-right">本月承运</TableHead>
          <TableHead className="w-[150px]">申请 / 获批</TableHead>
          <TableHead className="w-[110px]">状态</TableHead>
          <TableHead className="w-[180px]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs">{r.id}</TableCell>
            <TableCell>
              <div className="font-medium text-foreground">{r.name}</div>
              <div className="mt-1">
                <ParentChain
                  parents={[
                    { label: r.parentSite, Icon: MapPinned },
                    { label: r.parentUnit, Icon: Building2 },
                  ]}
                />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="tabular-nums font-medium">{r.vehicles} 辆</div>
              <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                {r.capacity} 吨
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {r.serviceArea}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.monthOrders}{" "}
              <span className="text-xs text-muted-foreground">单</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="h-3 w-3" />
                申请 {r.applyDate}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                获批 {r.approveDate}
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>
              <RowActions status={r.status} kind="transport" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/* -------------------- 行内操作 -------------------- */

function RowActions({
  status,
  kind,
}: {
  status: CommonStatus
  kind: ResourceKey
}) {
  const actions: { label: string; icon: typeof Eye; tone?: string }[] = [
    { label: "查看", icon: Eye },
  ]
  if (status === "审核中") {
    actions.push({ label: "审核", icon: ShieldCheck, tone: "text-primary" })
  }
  if (status === "正常运营") {
    actions.push({ label: "编辑", icon: Pencil })
    if (kind === "unit") {
      actions.push({ label: "添加站点", icon: Plus, tone: "text-emerald-600" })
    } else if (kind === "site") {
      actions.push({
        label: "添加专运",
        icon: Plus,
        tone: "text-orange-600",
      })
    }
  }
  if (status === "待申请") {
    actions.push({
      label: "提交申请",
      icon: ShieldCheck,
      tone: "text-primary",
    })
  }
  if (status === "已驳回") {
    actions.push({
      label: "查看原因",
      icon: AlertCircle,
      tone: "text-destructive",
    })
    actions.push({ label: "重新申请", icon: ShieldCheck, tone: "text-primary" })
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {actions.map((a) => {
        const Icon = a.icon
        return (
          <Button
            key={a.label}
            variant="ghost"
            size="sm"
            className={cn("h-7 px-2 text-xs", a.tone)}
          >
            <Icon className="mr-1 h-3 w-3" />
            {a.label}
          </Button>
        )
      })}
    </div>
  )
}
