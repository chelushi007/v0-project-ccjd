"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  PauseCircle,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Pencil,
  ShieldCheck,
  AlertCircle,
  Users,
  Phone,
  Mail,
  Globe,
  Calendar,
  Briefcase,
  Award,
  Shield,
  FileText,
  CalendarClock,
  Route,
  Warehouse as WarehouseIcon,
  Network,
  TrendingUp,
  PackageCheck,
  PackageMinus,
  Wallet,
  Boxes,
  Activity,
  Wrench,
  Layers,
} from "lucide-react"

/* -------------------- 类型 & 资源元数据 -------------------- */

type ResourceKey = "unit" | "site" | "transport"
type CommonStatus = "正常运营" | "审核中" | "待申请" | "已驳回" | "已停用"

interface ResourceMeta {
  key: ResourceKey
  label: string
  shortName: string
  description: string
  positioning: string
  qualificationFrom: string
  Icon: typeof Building2
  color: string
  bg: string
  border: string
  accent: string
  upgrade?: { label: string; tip: string }
}

const RESOURCES: ResourceMeta[] = [
  {
    key: "unit",
    label: "仓储单位",
    shortName: "仓储单位",
    description: "中铁建股份内部入驻平台的二级 / 三级 / 项目组单位",
    positioning: "中铁建股份内部二级 / 三级 / 项目组单位",
    qualificationFrom: "经平台基础入驻审核",
    Icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    accent: "bg-primary",
    upgrade: {
      label: "申请下属仓储站点",
      tip: "作为仓储单位，可将自营仓库登记为「仓储站点」，获得精细化仓储运营与下设专运资质入口。",
    },
  },
  {
    key: "site",
    label: "仓储站点",
    shortName: "站点单位",
    description: "由仓储单位申请获得资质的自营仓储基地",
    positioning: "仓储单位旗下登记备案的仓储基地",
    qualificationFrom: "由仓储单位向平台提交申请并获批",
    Icon: MapPinned,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    accent: "bg-emerald-500",
    upgrade: {
      label: "申请下属专运单位",
      tip: "作为仓储站点，可向平台申请下设「专运单位」，承接物资专属承运业务。",
    },
  },
  {
    key: "transport",
    label: "专运单位",
    shortName: "专运单位",
    description: "由仓储站点申请获得资质的物资专属承运单位",
    positioning: "仓储站点旗下登记的专属物资承运团队",
    qualificationFrom: "由仓储站点向平台提交申请并获批",
    Icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    accent: "bg-orange-500",
  },
]

/* -------------------- 各资源类型的「代表实例画像」 -------------------- */

interface RepresentativeInfo {
  shortName: string
  name: string
  code: string
  type: string
  creditScore: number
  certifiedDate: string
  legalPerson: string
  contact: string
  phone: string
  email: string
  address: string
  businessScope: string
  certifications: string[]
  stats: { label: string; value: string; unit: string }[]
  parentChain?: { label: string; Icon: typeof Building2 }[]
}

const representatives: Record<ResourceKey, RepresentativeInfo> = {
  unit: {
    shortName: "十四局",
    name: "中铁十四局集团广州分公司",
    code: "WU-CRCC-001",
    type: "二级单位 · 国有企业（中央驻穗）",
    creditScore: 98,
    certifiedDate: "2022-09-18",
    legalPerson: "刘建国",
    contact: "李建国",
    phone: "020-8888 8888",
    email: "warehouse@crcc14-gz.com",
    address: "广东省广州市天河区珠江新城华夏路 30 号",
    businessScope:
      "受集团调配在华南区域承担轨道交通、市政、桥梁工程的物料仓储与中转，统筹下设 6 个站点并联动 4 家专运分队完成体系内物料调度。",
    certifications: ["AAA 信用企业", "中央驻穗单位", "ISO9001 质量体系", "仓储入驻资质"],
    stats: [
      { label: "下设仓储站点", value: "6", unit: "个" },
      { label: "在管托管面积", value: "8.6", unit: "万 ㎡" },
      { label: "本月入出库总单量", value: "1,286", unit: "单" },
    ],
  },
  site: {
    shortName: "南沙基地",
    name: "中铁建广州南沙综合仓储基地",
    code: "WS-NS-001",
    type: "仓储站点（中铁十四局广州分公司直属）",
    creditScore: 92,
    certifiedDate: "2023-01-15",
    legalPerson: "张志强",
    contact: "赵丽华",
    phone: "020-3456 7890",
    email: "nansha.site@crcc14-gz.com",
    address: "广东省广州市南沙区进港大道 15 号铁建仓储园",
    businessScope:
      "服务南沙临港片区与南沙港铁路专用线，承接体系内型材类 / 模板类 / 拼装类物料的仓储、装卸与中转，配备双轨吊与定制堆场，可一站联通铁路与公路运输。",
    certifications: ["危化品仓储许可证", "消防安全合格证", "海关监管资质", "AA 级信用企业"],
    stats: [
      { label: "可用仓储面积", value: "1.5", unit: "万 ㎡" },
      { label: "在库物料价值", value: "2.86", unit: "亿元" },
      { label: "本月吞吐量", value: "1,840", unit: "吨" },
    ],
    parentChain: [
      { label: "中铁十四局集团广州分公司", Icon: Building2 },
    ],
  },
  transport: {
    shortName: "南沙专运",
    name: "南沙铁建专运车队",
    code: "TR-NS-001",
    type: "专运单位（南沙综合仓储基地直属）",
    creditScore: 94,
    certifiedDate: "2023-03-01",
    legalPerson: "周明辉",
    contact: "孙倩",
    phone: "0755-8866 1234",
    email: "operation.ns@crcc14-gz.com",
    address: "广东省广州市南沙区进港大道 15 号铁建仓储园 B 区车队办公区",
    businessScope:
      "承接南沙基地存储物料的省内点对点专属运输，覆盖广州 / 佛山 / 东莞 / 中山，配备 28 辆专用车辆，可提供 24 小时调度与超长件转运服务。",
    certifications: ["道路货运经营许可证", "AA 级信用企业", "供应链运输资质", "应急保供资质"],
    stats: [
      { label: "在册运力车辆", value: "28", unit: "辆" },
      { label: "本月承运订单", value: "142", unit: "单" },
      { label: "月度运营结算", value: "386", unit: "万元" },
    ],
    parentChain: [
      { label: "中铁建广州南沙综合仓储基地", Icon: MapPinned },
      { label: "中铁十四局集团广州分公司", Icon: Building2 },
    ],
  },
}

/* -------------------- 列表数据 -------------------- */

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
  utilization: number
  monthIn: number
  monthOut: number
  status: CommonStatus
}

interface SiteRow {
  id: string
  name: string
  parentUnit: string
  address: string
  area: number
  usedArea: number
  inventoryValue: number
  monthThroughput: number
  equipment: number
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
  capacity: number
  serviceArea: string
  monthOrders: number
  dispatchRate: number
  monthRevenue: number
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
    utilization: 78,
    monthIn: 640,
    monthOut: 580,
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
    utilization: 82,
    monthIn: 462,
    monthOut: 418,
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
    utilization: 64,
    monthIn: 312,
    monthOut: 286,
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
    utilization: 38,
    monthIn: 168,
    monthOut: 142,
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
    utilization: 71,
    monthIn: 248,
    monthOut: 226,
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
    utilization: 26,
    monthIn: 86,
    monthOut: 64,
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
    utilization: 0,
    monthIn: 0,
    monthOut: 0,
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
    inventoryValue: 28600,
    monthThroughput: 1840,
    equipment: 18,
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
    inventoryValue: 21300,
    monthThroughput: 1420,
    equipment: 14,
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
    inventoryValue: 12800,
    monthThroughput: 860,
    equipment: 9,
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
    inventoryValue: 6400,
    monthThroughput: 420,
    equipment: 6,
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
    inventoryValue: 4900,
    monthThroughput: 360,
    equipment: 5,
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
    inventoryValue: 11600,
    monthThroughput: 920,
    equipment: 10,
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
    inventoryValue: 3800,
    monthThroughput: 260,
    equipment: 4,
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
    inventoryValue: 0,
    monthThroughput: 0,
    equipment: 0,
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
    dispatchRate: 88,
    monthRevenue: 386,
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
    dispatchRate: 82,
    monthRevenue: 246,
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
    dispatchRate: 85,
    monthRevenue: 312,
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
    dispatchRate: 76,
    monthRevenue: 168,
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
    dispatchRate: 56,
    monthRevenue: 48,
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
    dispatchRate: 72,
    monthRevenue: 98,
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
    dispatchRate: 84,
    monthRevenue: 256,
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
    dispatchRate: 62,
    monthRevenue: 64,
    applyDate: "2026-03-12",
    approveDate: "—",
    status: "待申请",
  },
]

/* -------------------- 状态与层级徽标 -------------------- */

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
  const [activeIndex, setActiveIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部")
  const [levelFilter, setLevelFilter] = useState("全部")

  const active = RESOURCES[activeIndex]
  const Icon = active.Icon
  const rep = representatives[active.key]

  const handlePrev = () =>
    setActiveIndex((prev) => (prev === 0 ? RESOURCES.length - 1 : prev - 1))
  const handleNext = () =>
    setActiveIndex((prev) => (prev === RESOURCES.length - 1 ? 0 : prev + 1))

  /* ------- 各页签的概览统计 ------- */

  const unitStats = useMemo(
    () => ({
      total: unitRows.length,
      running: unitRows.filter((r) => r.status === "正常运营").length,
      reviewing: unitRows.filter((r) => r.status === "审核中").length,
      sites: unitRows.reduce((s, r) => s + r.siteCount, 0),
      area: unitRows.reduce((s, r) => s + r.totalArea, 0),
      monthIn: unitRows.reduce((s, r) => s + r.monthIn, 0),
      monthOut: unitRows.reduce((s, r) => s + r.monthOut, 0),
    }),
    [],
  )

  const siteStats = useMemo(
    () => ({
      total: siteRows.length,
      running: siteRows.filter((r) => r.status === "正常运营").length,
      reviewing: siteRows.filter((r) => r.status === "审核中").length,
      area: siteRows.reduce((s, r) => s + r.area, 0),
      used: siteRows.reduce((s, r) => s + r.usedArea, 0),
      transport: siteRows.reduce((s, r) => s + r.transportCount, 0),
      inventoryValue: siteRows.reduce((s, r) => s + r.inventoryValue, 0),
      throughput: siteRows.reduce((s, r) => s + r.monthThroughput, 0),
    }),
    [],
  )

  const transportStats = useMemo(
    () => ({
      total: transportRows.length,
      running: transportRows.filter((r) => r.status === "正常运营").length,
      reviewing: transportRows.filter((r) => r.status === "审核中").length,
      vehicles: transportRows.reduce((s, r) => s + r.vehicles, 0),
      capacity: transportRows.reduce((s, r) => s + r.capacity, 0),
      monthOrders: transportRows.reduce((s, r) => s + r.monthOrders, 0),
      monthRevenue: transportRows.reduce((s, r) => s + r.monthRevenue, 0),
    }),
    [],
  )

  /* ------- 概览四联（按当前资源） ------- */

  const overviewStats = useMemo(() => {
    if (active.key === "unit") {
      return [
        {
          label: "入驻仓储单位",
          value: unitStats.total,
          unit: "家",
          Icon: Building2,
          tone: "primary" as const,
        },
        {
          label: "下设仓储站点",
          value: unitStats.sites,
          unit: "个",
          Icon: MapPinned,
          tone: "emerald" as const,
        },
        {
          label: "托管仓储面积",
          value: (unitStats.area / 10000).toFixed(1),
          unit: "万 ㎡",
          Icon: Boxes,
          tone: "blue" as const,
        },
        {
          label: "本月入出库单量",
          value: (unitStats.monthIn + unitStats.monthOut).toLocaleString(),
          unit: "单",
          Icon: Activity,
          tone: "amber" as const,
        },
      ]
    }
    if (active.key === "site") {
      const rate = siteStats.area
        ? Math.round((siteStats.used / siteStats.area) * 100)
        : 0
      return [
        {
          label: "仓储站点总数",
          value: siteStats.total,
          unit: "个",
          Icon: MapPinned,
          tone: "emerald" as const,
        },
        {
          label: "可调度总面积",
          value: (siteStats.area / 10000).toFixed(1),
          unit: "万 ㎡",
          Icon: Boxes,
          tone: "primary" as const,
        },
        {
          label: "在库物料价值",
          value: (siteStats.inventoryValue / 10000).toFixed(2),
          unit: "亿元",
          Icon: Wallet,
          tone: "blue" as const,
        },
        {
          label: "平均使用率",
          value: rate,
          unit: "%",
          Icon: TrendingUp,
          tone: "amber" as const,
        },
      ]
    }
    return [
      {
        label: "专运单位总数",
        value: transportStats.total,
        unit: "家",
        Icon: Truck,
        tone: "orange" as const,
      },
      {
        label: "在册运力车辆",
        value: transportStats.vehicles,
        unit: "辆",
        Icon: Route,
        tone: "primary" as const,
      },
      {
        label: "本月承运订单",
        value: transportStats.monthOrders.toLocaleString(),
        unit: "单",
        Icon: PackageCheck,
        tone: "emerald" as const,
      },
      {
        label: "本月结算金额",
        value: transportStats.monthRevenue.toLocaleString(),
        unit: "万元",
        Icon: Wallet,
        tone: "blue" as const,
      },
    ]
  }, [active.key, unitStats, siteStats, transportStats])

  /* ------- 过滤 ------- */

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
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">仓储管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            参照企业中心的内容切换模式与关联模式，在同一窗口管理仓储单位、仓储站点与专运单位
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出当前列表
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {active.key === "unit"
              ? "新增仓储单位"
              : active.key === "site"
                ? "新增仓储站点"
                : "新增专运单位"}
          </Button>
        </div>
      </div>

      {/* 资源信息卡（仿企业中心：代表实例画像） */}
      <Card className="overflow-hidden">
        <div className={cn("h-1", active.accent)} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <WarehouseIcon className="w-5 h-5 text-primary" />
                资源信息
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(active.color, active.border)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {active.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="h-8 w-8"
                aria-label="切换上一类仓储资源"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {RESOURCES.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                aria-label="切换下一类仓储资源"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左：代表实例画像 */}
            <div className="flex items-start gap-4 lg:w-1/3">
              <Avatar className={cn("w-16 h-16 rounded-lg", active.bg)}>
                <AvatarFallback
                  className={cn(
                    "rounded-lg",
                    active.bg,
                    active.color,
                    "text-base font-bold",
                  )}
                >
                  {rep.shortName}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-balance">
                    {rep.name}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  资源编码：{rep.code}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span>{rep.type}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    信用评分 {rep.creditScore}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    资质已激活
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    <Calendar className="w-3 h-3 mr-1" />
                    {rep.certifiedDate}
                  </Badge>
                </div>
                {rep.parentChain && rep.parentChain.length > 0 && (
                  <div className="mt-3 rounded-md border border-dashed border-border bg-muted/30 p-2">
                    <p className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      上游隶属链
                    </p>
                    <ParentChain parents={rep.parentChain} />
                  </div>
                )}
              </div>
            </div>

            {/* 右：联系与地址 */}
            <div className="flex-1 lg:border-l border-border lg:pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem icon={Phone} label="联系电话" value={rep.phone} />
                <InfoItem icon={Mail} label="联系邮箱" value={rep.email} />
                <InfoItem
                  icon={Users}
                  label="负责人"
                  value={rep.legalPerson}
                />
                <InfoItem
                  icon={Briefcase}
                  label="对接联系人"
                  value={rep.contact}
                />
                <InfoItem
                  icon={Layers}
                  label="资源定位"
                  value={active.positioning}
                />
                <InfoItem
                  icon={ShieldCheck}
                  label="资质来源"
                  value={active.qualificationFrom}
                />
              </div>
              <div className="mt-3 flex items-start gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">注册 / 经营地址</p>
                  <p className="text-foreground">{rep.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 三联关键统计（实例硬指标） */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
            {rep.stats.map((stat) => (
              <div
                key={stat.label}
                className={cn("p-3 rounded-lg", active.bg)}
              >
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className={cn("text-xl font-bold", active.color)}>
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 资源详情卡（仿企业中心：业务范围 + 资质 + 资质流转 + 角色升级） */}
      <Card className="overflow-hidden">
        <div className={cn("h-1", active.accent)} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                资源详情与资质流转
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(active.color, active.border)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {rep.shortName}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="h-8 w-8"
                aria-label="切换上一类仓储资源"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {RESOURCES.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                aria-label="切换下一类仓储资源"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 资质流转链路 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">资质流转链路</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                点击卡片切换不同资源类型
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
              {RESOURCES.map((r, i) => {
                const RI = r.Icon
                const isActive = activeIndex === i
                return (
                  <div key={r.key} className="flex flex-1 items-center">
                    <button
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                        isActive
                          ? cn(r.bg, r.border, "shadow-sm")
                          : "border-border hover:border-foreground/20 hover:bg-muted/40",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          r.bg,
                        )}
                      >
                        <RI className={cn("h-5 w-5", r.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{r.label}</span>
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

          {/* 业务范围 + 资质 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">业务范围</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rep.businessScope}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">已获资质</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {rep.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="font-normal">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 角色升级 / 关联申请入口 */}
          {active.upgrade && (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{active.upgrade.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {active.upgrade.tip}
                  </p>
                </div>
                <Button size="sm" className="whitespace-nowrap">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {active.upgrade.label}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 当前类型整体概览四联 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {overviewStats.map((it) => {
          const StatIcon = it.Icon
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
                    <StatIcon className={cn("h-6 w-6", tone.icon)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{it.label}</p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">
                        {it.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {it.unit}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 资源列表 */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  active.key === "unit"
                    ? "搜索单位名称 / 编号 / 上级机构"
                    : active.key === "site"
                      ? "搜索站点名称 / 编号 / 所属单位 / 地址"
                      : "搜索专运单位 / 所属站点 / 所属单位"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {active.key === "unit" && (
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
                {active.key === "unit"
                  ? filteredUnits.length
                  : active.key === "site"
                    ? filteredSites.length
                    : filteredTransports.length}
              </span>{" "}
              条 / {active.label}
            </div>
          </div>

          <div className="overflow-auto rounded-md border">
            {active.key === "unit" && <UnitTable rows={filteredUnits} />}
            {active.key === "site" && <SiteTable rows={filteredSites} />}
            {active.key === "transport" && (
              <TransportTable rows={filteredTransports} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* -------------------- 通用辅助组件 -------------------- */

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}

const toneMap: Record<string, { wrap: string; icon: string; bar: string }> = {
  primary: { wrap: "bg-primary/10", icon: "text-primary", bar: "bg-primary" },
  emerald: {
    wrap: "bg-emerald-500/10",
    icon: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  amber: {
    wrap: "bg-amber-500/10",
    icon: "text-amber-600",
    bar: "bg-amber-500",
  },
  blue: { wrap: "bg-blue-500/10", icon: "text-blue-600", bar: "bg-blue-500" },
  orange: {
    wrap: "bg-orange-500/10",
    icon: "text-orange-600",
    bar: "bg-orange-500",
  },
}

function ParentChain({
  parents,
}: {
  parents: { label: string; Icon: typeof Building2 }[]
}) {
  return (
    <div className="flex flex-col gap-0.5 text-xs">
      {parents.map((p, i) => {
        const PIcon = p.Icon
        return (
          <div
            key={i}
            className="flex items-center gap-1 text-muted-foreground"
          >
            {i > 0 && (
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            )}
            <PIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">{p.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function Progress({
  value,
  tone = "emerald",
}: {
  value: number
  tone?: keyof typeof toneMap
}) {
  return (
    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full", toneMap[tone].bar)}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}

/* -------------------- 三类列表（差异化运营 KPI） -------------------- */

function UnitTable({ rows }: { rows: UnitRow[] }) {
  return (
    <Table className="min-w-[1480px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[130px]">单位编号</TableHead>
          <TableHead className="min-w-[240px]">单位名称 / 上级机构</TableHead>
          <TableHead className="w-[100px]">层级</TableHead>
          <TableHead className="min-w-[140px]">注册地 / 负责人</TableHead>
          <TableHead className="w-[110px] text-right">下属站点</TableHead>
          <TableHead className="w-[150px] text-right">托管面积 (㎡)</TableHead>
          <TableHead className="w-[140px]">面积利用率</TableHead>
          <TableHead className="w-[160px] text-right">本月入 / 出库</TableHead>
          <TableHead className="w-[110px]">入驻日期</TableHead>
          <TableHead className="w-[110px]">状态</TableHead>
          <TableHead className="w-[170px]">操作</TableHead>
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
            <TableCell>
              <div className="text-sm">{r.location}</div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {r.manager}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {r.phone}
              </div>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.siteCount > 0 ? (
                <Badge variant="outline" className="font-normal">
                  <MapPinned className="mr-1 h-3 w-3" />
                  {r.siteCount} 个
                </Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.totalArea > 0 ? r.totalArea.toLocaleString() : "—"}
            </TableCell>
            <TableCell>
              {r.totalArea > 0 ? (
                <div className="flex items-center gap-2">
                  <Progress value={r.utilization} tone="primary" />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {r.utilization}%
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {r.monthIn + r.monthOut > 0 ? (
                <div className="flex items-center justify-end gap-2 text-xs">
                  <span className="flex items-center gap-0.5 text-emerald-600 tabular-nums">
                    <PackageCheck className="h-3 w-3" />
                    {r.monthIn}
                  </span>
                  <span className="text-muted-foreground/60">/</span>
                  <span className="flex items-center gap-0.5 text-orange-600 tabular-nums">
                    <PackageMinus className="h-3 w-3" />
                    {r.monthOut}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
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
    <Table className="min-w-[1620px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[130px]">站点编号</TableHead>
          <TableHead className="min-w-[240px]">站点名称 / 所属单位</TableHead>
          <TableHead className="min-w-[200px]">地址</TableHead>
          <TableHead className="w-[160px] text-right">面积 / 利用率</TableHead>
          <TableHead className="w-[140px] text-right">在库价值 (万元)</TableHead>
          <TableHead className="w-[140px] text-right">本月吞吐 (吨)</TableHead>
          <TableHead className="w-[110px] text-center">关键设备</TableHead>
          <TableHead className="w-[110px] text-center">专运单位</TableHead>
          <TableHead className="w-[140px]">申请 / 获批</TableHead>
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
                  <Progress value={rate} tone="emerald" />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {rate}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {r.inventoryValue > 0 ? (
                  <span className="font-medium text-foreground">
                    {r.inventoryValue.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {r.monthThroughput > 0 ? (
                  r.monthThroughput.toLocaleString()
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {r.equipment > 0 ? (
                  <Badge variant="outline" className="font-normal">
                    <Wrench className="mr-1 h-3 w-3" />
                    {r.equipment}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {r.transportCount > 0 ? (
                  <Badge
                    variant="outline"
                    className="font-normal bg-orange-500/10 text-orange-600 border-orange-500/30"
                  >
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
    <Table className="min-w-[1580px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[130px]">编号</TableHead>
          <TableHead className="min-w-[280px]">
            专运单位 / 所属站点 / 所属单位
          </TableHead>
          <TableHead className="w-[140px] text-right">车辆 / 总吨位</TableHead>
          <TableHead className="min-w-[160px]">服务范围</TableHead>
          <TableHead className="w-[140px] text-right">本月承运 (单)</TableHead>
          <TableHead className="w-[150px]">出车率</TableHead>
          <TableHead className="w-[140px] text-right">月度结算 (万元)</TableHead>
          <TableHead className="w-[140px]">申请 / 获批</TableHead>
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
              {r.monthOrders > 0 ? (
                <span className="font-medium text-foreground">
                  {r.monthOrders.toLocaleString()}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              {r.dispatchRate > 0 ? (
                <div className="flex items-center gap-2">
                  <Progress value={r.dispatchRate} tone="orange" />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {r.dispatchRate}%
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {r.monthRevenue > 0 ? (
                <span className="font-medium text-foreground">
                  {r.monthRevenue.toLocaleString()}
                </span>
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
        const ActionIcon = a.icon
        return (
          <Button
            key={a.label}
            variant="ghost"
            size="sm"
            className={cn("h-7 px-2 text-xs", a.tone)}
          >
            <ActionIcon className="mr-1 h-3 w-3" />
            {a.label}
          </Button>
        )
      })}
    </div>
  )
}
