"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building2,
  PackageSearch,
  Send,
  CheckCircle2,
  Recycle,
  Gauge,
  TrendingUp,
  CircleDollarSign,
  Layers,
  ShoppingCart,
  Briefcase,
  Warehouse,
  MapPin,
  Truck,
  Users,
  MonitorPlay,
  Package,
  Tag,
  HandCoins,
  ListChecks,
} from "lucide-react"
import { OperatorVisualScreen } from "./operator-visual-screen"
import { cn } from "@/lib/utils"

// 统计周期
type Period = "today" | "week" | "month" | "year"
const periodLabels: Record<Period, string> = {
  today: "今日",
  week: "本周",
  month: "本月",
  year: "本年",
}
const periodFactors: Record<Period, number> = {
  today: 0.033,
  week: 0.23,
  month: 1,
  year: 12,
}
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

// ─────────────────────────────────────────────────────────────
// 数据
// ─────────────────────────────────────────────────────────────

// 1. 核心指标
type Trend = "up" | "down"
type CoreMetric = {
  key: string
  label: string
  value: string
  unit: string
  delta: string
  trend: Trend
  hint: string
  icon: typeof Wallet
  accent: string // tailwind text class
  bg: string // tailwind bg class
}

const coreMetrics: CoreMetric[] = [
  {
    key: "gmv",
    label: "总交易额(GMV)",
    value: "12,486.32",
    unit: "万元",
    delta: "+18.2%",
    trend: "up",
    hint: "近 12 个月累计",
    icon: Wallet,
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "internal",
    label: "内部交易额",
    value: "7,812.50",
    unit: "万元",
    delta: "+12.4%",
    trend: "up",
    hint: "集团内部企业互通",
    icon: Building2,
    accent: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    key: "external",
    label: "外部交易额",
    value: "4,673.82",
    unit: "万元",
    delta: "+27.6%",
    trend: "up",
    hint: "对外开放业务",
    icon: PackageSearch,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "revitalize",
    label: "物资盘活金额",
    value: "3,128.45",
    unit: "万元",
    delta: "+34.1%",
    trend: "up",
    hint: "闲置 → 流通价值",
    icon: Recycle,
    accent: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "demand",
    label: "平台发单量",
    value: "8,432",
    unit: "单",
    delta: "+9.6%",
    trend: "up",
    hint: "覆盖五类业务需求",
    icon: Send,
    accent: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    key: "rate",
    label: "成交率",
    value: "76.8",
    unit: "%",
    delta: "+3.4pp",
    trend: "up",
    hint: "撮合成功率",
    icon: CheckCircle2,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "second",
    label: "二手物资交易额",
    value: "1,842.16",
    unit: "万元",
    delta: "+22.7%",
    trend: "up",
    hint: "二手类目专项",
    icon: TrendingUp,
    accent: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    key: "utilization",
    label: "仓储利用率",
    value: "82.4",
    unit: "%",
    delta: "-1.2pp",
    trend: "down",
    hint: "在租面积 / 总面积",
    icon: Gauge,
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
]

// 2. 平台收入指标 (万元)
type IncomeItem = {
  key: string
  label: string
  value: number // 万元
  delta: string
  trend: Trend
  desc: string
  icon: typeof CircleDollarSign
  color: string
  ring: string
}

const incomeItems: IncomeItem[] = [
  {
    key: "total",
    label: "平台累计收入",
    value: 1326.48,
    delta: "+19.8%",
    trend: "up",
    desc: "本年度 1~5 月累计",
    icon: CircleDollarSign,
    color: "text-blue-600",
    ring: "ring-blue-100",
  },
  {
    key: "entrust",
    label: "仓储委托收入",
    value: 612.32,
    delta: "+14.2%",
    trend: "up",
    desc: "委托代运营分成",
    icon: Warehouse,
    color: "text-emerald-600",
    ring: "ring-emerald-100",
  },
  {
    key: "value",
    label: "增值服务",
    value: 248.16,
    delta: "+26.5%",
    trend: "up",
    desc: "对账 / 数据 / 风控",
    icon: Layers,
    color: "text-indigo-600",
    ring: "ring-indigo-100",
  },
  {
    key: "trade",
    label: "物资交易收入",
    value: 466.0,
    delta: "+21.3%",
    trend: "up",
    desc: "按 GMV 抽佣 3%",
    icon: ShoppingCart,
    color: "text-amber-600",
    ring: "ring-amber-100",
  },
]

// 收入按月堆叠（用于辅助柱图）
const incomeByMonth = [
  { m: "1月", entrust: 102, value: 36, trade: 78 },
  { m: "2月", entrust: 96, value: 38, trade: 72 },
  { m: "3月", entrust: 124, value: 48, trade: 88 },
  { m: "4月", entrust: 138, value: 56, trade: 102 },
  { m: "5月", entrust: 152, value: 70, trade: 126 },
]

// 3. 用户情况（数量）
type UserItem = {
  key: string
  label: string
  value: number
  delta: string
  trend: Trend
  newThisMonth: number
  icon: typeof Briefcase
  color: string
  bg: string
}

const userItems: UserItem[] = [
  {
    key: "warehouse",
    label: "入驻仓储单位",
    value: 142,
    delta: "+12",
    trend: "up",
    newThisMonth: 4,
    icon: Warehouse,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "site",
    label: "站点单位",
    value: 386,
    delta: "+24",
    trend: "up",
    newThisMonth: 9,
    icon: MapPin,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "transport",
    label: "专业运营单位",
    value: 58,
    delta: "+5",
    trend: "up",
    newThisMonth: 2,
    icon: Truck,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    key: "user",
    label: "物资使用单位",
    value: 712,
    delta: "+48",
    trend: "up",
    newThisMonth: 18,
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
]

// 用户结构 (饼图)
const userPie = [
  { name: "物资使用单位", value: 712, fill: "#f59e0b" },
  { name: "站点单位", value: 386, fill: "#10b981" },
  { name: "入驻仓储单位", value: 142, fill: "#2563eb" },
  { name: "专业运营单位", value: 58, fill: "#6366f1" },
]

// 4. 仓储地理分布
// 中国地图底图（用户上传素材）
const CHINA_MAP_IMG =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E4%B8%8B%E8%BD%BD-PAHeFmw1z2BWjQJMV9jST4xO5vq4PB.png"

// 各省/直辖市/自治区/特别行政区在中国地图图片上的近似中心点（百分比）
const PROVINCE_CENTER_PCT: Record<string, { x: number; y: number }> = {
  北京市: { x: 67.5, y: 31 },
  天津市: { x: 69.5, y: 33 },
  上海市: { x: 78, y: 51 },
  重庆市: { x: 55, y: 55 },
  河北省: { x: 66, y: 35 },
  山西省: { x: 62, y: 39 },
  辽宁省: { x: 76, y: 26 },
  吉林省: { x: 80, y: 21 },
  黑龙江省: { x: 78, y: 13 },
  江苏省: { x: 75, y: 47 },
  浙江省: { x: 76, y: 55 },
  安徽省: { x: 70, y: 49 },
  福建省: { x: 72, y: 63 },
  江西省: { x: 67, y: 60 },
  山东省: { x: 70, y: 39 },
  河南省: { x: 64, y: 45 },
  湖北省: { x: 62, y: 52 },
  湖南省: { x: 60, y: 60 },
  广东省: { x: 64, y: 70 },
  海南省: { x: 60, y: 82 },
  四川省: { x: 49, y: 55 },
  贵州省: { x: 54, y: 64 },
  云南省: { x: 46, y: 68 },
  陕西省: { x: 57, y: 45 },
  甘肃省: { x: 48, y: 41 },
  青海省: { x: 38, y: 43 },
  台湾省: { x: 80, y: 67 },
  内蒙古自治区: { x: 55, y: 24 },
  广西壮族自治区: { x: 56, y: 70 },
  西藏自治区: { x: 25, y: 53 },
  宁夏回族自治区: { x: 53, y: 39 },
  新疆维吾尔自治区: { x: 20, y: 30 },
  香港特别行政区: { x: 67, y: 73 },
  澳门特别行政区: { x: 65, y: 74 },
}

type ProvinceStat = {
  warehouses: number
  rentableArea: number // m²
  rentedArea: number // m²
  gmv: number // 万元
  demands: number // 单
}

const provinceData: Record<string, ProvinceStat> = {
  广东省: { warehouses: 23, rentableArea: 23422, rentedArea: 20110, gmv: 1842.6, demands: 897 },
  福建省: { warehouses: 15, rentableArea: 12000, rentedArea: 8500, gmv: 642.8, demands: 342 },
  江西省: { warehouses: 10, rentableArea: 7800, rentedArea: 5600, gmv: 312.5, demands: 186 },
  湖南省: { warehouses: 14, rentableArea: 10500, rentedArea: 7800, gmv: 488.2, demands: 298 },
  湖北省: { warehouses: 18, rentableArea: 15000, rentedArea: 11200, gmv: 712.4, demands: 412 },
  河南省: { warehouses: 20, rentableArea: 18000, rentedArea: 14000, gmv: 924.6, demands: 523 },
  山东省: { warehouses: 25, rentableArea: 22000, rentedArea: 17500, gmv: 1124.3, demands: 645 },
  江苏省: { warehouses: 28, rentableArea: 25000, rentedArea: 19800, gmv: 1342.8, demands: 712 },
  浙江省: { warehouses: 22, rentableArea: 19500, rentedArea: 15200, gmv: 1024.6, demands: 534 },
  上海市: { warehouses: 30, rentableArea: 28000, rentedArea: 21000, gmv: 1546.2, demands: 823 },
  北京市: { warehouses: 35, rentableArea: 32000, rentedArea: 24500, gmv: 1782.4, demands: 956 },
  四川省: { warehouses: 21, rentableArea: 18500, rentedArea: 14200, gmv: 856.4, demands: 478 },
  辽宁省: { warehouses: 18, rentableArea: 15500, rentedArea: 11800, gmv: 624.8, demands: 367 },
  新疆维吾尔自治区: { warehouses: 6, rentableArea: 4500, rentedArea: 3200, gmv: 142.6, demands: 89 },
  西藏自治区: { warehouses: 2, rentableArea: 1200, rentedArea: 800, gmv: 38.5, demands: 23 },
  内蒙古自治区: { warehouses: 7, rentableArea: 5200, rentedArea: 3800, gmv: 186.4, demands: 112 },
  黑龙江省: { warehouses: 14, rentableArea: 11500, rentedArea: 8500, gmv: 482.6, demands: 278 },
  云南省: { warehouses: 11, rentableArea: 8000, rentedArea: 5800, gmv: 346.2, demands: 198 },
  广西壮族自治区: { warehouses: 12, rentableArea: 8500, rentedArea: 6200, gmv: 412.4, demands: 234 },
  海南省: { warehouses: 6, rentableArea: 4200, rentedArea: 3100, gmv: 148.6, demands: 87 },
  天津市: { warehouses: 16, rentableArea: 13000, rentedArea: 9800, gmv: 542.8, demands: 312 },
  重庆市: { warehouses: 19, rentableArea: 16000, rentedArea: 12000, gmv: 698.4, demands: 398 },
  河北省: { warehouses: 22, rentableArea: 19000, rentedArea: 14500, gmv: 824.6, demands: 487 },
  山西省: { warehouses: 12, rentableArea: 9500, rentedArea: 6800, gmv: 378.4, demands: 212 },
  陕西省: { warehouses: 15, rentableArea: 12500, rentedArea: 9000, gmv: 512.8, demands: 298 },
  甘肃省: { warehouses: 8, rentableArea: 6000, rentedArea: 4200, gmv: 228.4, demands: 134 },
  青海省: { warehouses: 4, rentableArea: 2800, rentedArea: 1800, gmv: 96.2, demands: 56 },
  宁夏回族自治区: { warehouses: 5, rentableArea: 3500, rentedArea: 2400, gmv: 132.6, demands: 78 },
  吉林省: { warehouses: 13, rentableArea: 10000, rentedArea: 7200, gmv: 412.6, demands: 234 },
  安徽省: { warehouses: 17, rentableArea: 14000, rentedArea: 10500, gmv: 624.8, demands: 356 },
  贵州省: { warehouses: 9, rentableArea: 6800, rentedArea: 4800, gmv: 268.4, demands: 156 },
  台湾省: { warehouses: 0, rentableArea: 0, rentedArea: 0, gmv: 0, demands: 0 },
  香港特别行政区: { warehouses: 8, rentableArea: 5500, rentedArea: 4000, gmv: 312.6, demands: 145 },
  澳门特别行政区: { warehouses: 2, rentableArea: 800, rentedArea: 500, gmv: 64.2, demands: 32 },
}

// 热力图配色（按维度切换）
function heatColor(value: number, max: number, mode: "warehouses" | "gmv") {
  if (value <= 0) return "#f1f5f9"
  const ratio = Math.min(1, value / max)
  if (mode === "warehouses") {
    // 蓝色色阶
    if (ratio > 0.8) return "#1d4ed8"
    if (ratio > 0.6) return "#2563eb"
    if (ratio > 0.45) return "#3b82f6"
    if (ratio > 0.3) return "#60a5fa"
    if (ratio > 0.15) return "#93c5fd"
    return "#dbeafe"
  }
  // 橙红色阶
  if (ratio > 0.8) return "#b91c1c"
  if (ratio > 0.6) return "#dc2626"
  if (ratio > 0.45) return "#ef4444"
  if (ratio > 0.3) return "#f97316"
  if (ratio > 0.15) return "#fb923c"
  return "#fed7aa"
}

// ─────────────────────────────────────────────────────────────
// 组件
// ─────────────────────────────────────────────────────────────

export function OperatorAnalytics() {
  const [screenOpen, setScreenOpen] = useState(false)
  const [periodCore, setPeriodCore] = useState<Period>("month")
  const [periodIncome, setPeriodIncome] = useState<Period>("month")
  const [periodUser, setPeriodUser] = useState<Period>("month")
  const [periodMap, setPeriodMap] = useState<Period>("month")
  const [periodMaterial, setPeriodMaterial] = useState<Period>("month")

  if (screenOpen) {
    return <OperatorVisualScreen onClose={() => setScreenOpen(false)} />
  }

  return (
    <div className="space-y-6">
      {/* 顶栏 */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">统计分析</h1>
            <Badge variant="outline" className="h-6 bg-blue-50 text-blue-700 border-blue-200">
              运营驾驶舱
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            实时洞察平台交易、收入、用户与仓储分布
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setScreenOpen(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white shadow-sm"
        >
          <MonitorPlay className="w-4 h-4 mr-2" />
          可视化大屏
        </Button>
      </div>

      {/* 一、GMV 及盘活核心指标 */}
      <SectionHeader
        index="01"
        title="总交易额(GMV)及盘活核心指标"
        desc="8 项关键业务指标 · 衡量平台规模与活跃度"
        accent="from-blue-500 to-indigo-500"
        period={periodCore}
        onPeriodChange={setPeriodCore}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {coreMetrics.map((m) => (
          <CoreCard key={m.key} metric={m} period={periodCore} />
        ))}
      </div>

      {/* 二、平台收入指标 */}
      <SectionHeader
        index="02"
        title="平台收入指标"
        desc="平台抽佣与服务费组成 · 单位：万元"
        accent="from-emerald-500 to-teal-500"
        period={periodIncome}
        onPeriodChange={setPeriodIncome}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
        <div className="grid grid-cols-2 gap-3">
          {incomeItems.map((it) => (
            <IncomeCard key={it.key} item={it} period={periodIncome} />
          ))}
        </div>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                平台收入构成（按月堆叠）
              </CardTitle>
              <CardDescription className="text-xs">
                {periodLabels[periodIncome]} · 万元
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={incomeByMonth.map((d) => ({
                  m: d.m,
                  entrust: +(d.entrust * periodFactors[periodIncome]).toFixed(0),
                  value: +(d.value * periodFactors[periodIncome]).toFixed(0),
                  trade: +(d.trade * periodFactors[periodIncome]).toFixed(0),
                }))}
                margin={{ top: 6, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(v: number) => `${v} 万元`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="entrust" stackId="a" name="仓储委托" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="value" stackId="a" name="增值服务" fill="#6366f1" radius={[0, 0, 0, 0]} />
                <Bar dataKey="trade" stackId="a" name="物资交易" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 三、用户情况 */}
      <SectionHeader
        index="03"
        title="用户情况"
        desc="入驻企业与使用单位规模分布"
        accent="from-indigo-500 to-blue-500"
        period={periodUser}
        onPeriodChange={setPeriodUser}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {userItems.map((u) => (
            <UserCard key={u.key} item={u} period={periodUser} />
          ))}
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              用户结构占比
            </CardTitle>
            <CardDescription className="text-xs">合计 {userItems.reduce((s, u) => s + u.value, 0).toLocaleString()} 家</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={userPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {userPie.map((u, i) => (
                    <Cell key={i} fill={u.fill} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(v: number, n: string) => [`${v} 家`, n]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 四、仓储地理分布 */}
      <SectionHeader
        index="04"
        title="仓储地理分布"
        desc="热力图反映规模 · 鼠标移入查看省份详情"
        accent="from-amber-500 to-orange-500"
        period={periodMap}
        onPeriodChange={setPeriodMap}
      />
      <ChinaHeatmap period={periodMap} />

      {/* 五、物资地图分析 */}
      <SectionHeader
        index="05"
        title="物资地图分析"
        desc="出租 / 出售双维度 · 透视全国物资租售活跃度"
        accent="from-emerald-500 to-amber-500"
        period={periodMaterial}
        onPeriodChange={setPeriodMaterial}
      />
      <MaterialGeoAnalysis period={periodMaterial} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 区块标题（含周期切换）
// ─────────────────────────────────────────────────────────────
function SectionHeader({
  index,
  title,
  desc,
  accent,
  period,
  onPeriodChange,
}: {
  index: string
  title: string
  desc: string
  accent: string
  period: Period
  onPeriodChange: (p: Period) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${accent} text-white text-xs font-bold tracking-wider shadow-sm`}
        >
          {index}
        </div>
        <div>
          <h2 className="text-base font-semibold leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      <Tabs value={period} onValueChange={(v) => onPeriodChange(v as Period)}>
        <TabsList className="h-8">
          <TabsTrigger value="today" className="text-xs h-6 px-3">今日</TabsTrigger>
          <TabsTrigger value="week" className="text-xs h-6 px-3">本周</TabsTrigger>
          <TabsTrigger value="month" className="text-xs h-6 px-3">本月</TabsTrigger>
          <TabsTrigger value="year" className="text-xs h-6 px-3">本年</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

// 数字格���化辅助：保留原值的小数位数
function scaleNumber(originStr: string, factor: number): string {
  // 检测原值的小数位数
  const cleaned = originStr.replace(/,/g, "")
  const num = parseFloat(cleaned)
  if (isNaN(num)) return originStr
  const dotIdx = cleaned.indexOf(".")
  const decimals = dotIdx === -1 ? 0 : cleaned.length - dotIdx - 1
  const scaled = num * factor
  return scaled.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// ─────────────────────────────────────────────────────────────
// 核心指标卡
// ─────────────────────────────────────────────────────────────
function CoreCard({ metric, period }: { metric: CoreMetric; period: Period }) {
  const Icon = metric.icon
  const isUp = metric.trend === "up"
  // 百分比类指标不随周期缩放
  const isPercent = metric.unit === "%"
  const displayValue = isPercent
    ? metric.value
    : scaleNumber(metric.value, periodFactors[period])
  return (
    <Card className="overflow-hidden relative hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 w-24 h-24 ${metric.bg} rounded-bl-full opacity-60`} />
      <CardContent className="relative p-4">
        <div className="flex items-center justify-between">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${metric.bg}`}
          >
            <Icon className={`w-4.5 h-4.5 ${metric.accent}`} />
          </div>
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded ${
              isUp
                ? "text-emerald-700 bg-emerald-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            {isUp ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {metric.delta}
          </span>
        </div>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground">{metric.label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums tracking-tight">
              {displayValue}
            </span>
            <span className="text-xs text-muted-foreground">{metric.unit}</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground/80">
            {metric.hint}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
// 收入卡
// ─────────────────────────────────────────────────────────────
function IncomeCard({ item, period }: { item: IncomeItem; period: Period }) {
  const Icon = item.icon
  const isUp = item.trend === "up"
  const scaledValue = item.value * periodFactors[period]
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{item.label}</span>
          <div
            className={`w-8 h-8 rounded-lg bg-card ring-2 ${item.ring} flex items-center justify-center`}
          >
            <Icon className={`w-4 h-4 ${item.color}`} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums">
            {scaledValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-muted-foreground">万元</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{item.desc}</span>
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
              isUp ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {isUp ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {item.delta}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
// 用户卡
// ─────────────────────────────────────────────────────────────
function UserCard({ item, period }: { item: UserItem; period: Period }) {
  const Icon = item.icon
  // 累计总数不变；新增数随周期缩放
  const newCount = Math.max(
    1,
    Math.round(item.newThisMonth * periodFactors[period]),
  )
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg}`}
        >
          <Icon className={`w-5 h-5 ${item.color}`} />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">{item.label}</div>
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums">
            {item.value.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">家</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            {item.delta}
          </span>
          <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-normal">
            {periodLabels[period]} +{newCount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
// 中国地图热力图
// ─────────────────────────────────────────────────────────────
function ChinaHeatmap({ period }: { period: Period }) {
  const [mode, setMode] = useState<"warehouses" | "gmv">("warehouses")
  const [hovered, setHovered] = useState<string | null>(null)
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  const factor = periodFactors[period]

  const max = useMemo(() => {
    const values = Object.values(provinceData).map((p) =>
      mode === "warehouses" ? p.warehouses : p.gmv * factor,
    )
    return Math.max(...values, 1)
  }, [mode, factor])

  const totals = useMemo(() => {
    const v = Object.values(provinceData)
    return {
      provinces: v.filter((p) => p.warehouses > 0).length,
      warehouses: v.reduce((s, p) => s + p.warehouses, 0),
      rentable: v.reduce((s, p) => s + p.rentableArea, 0),
      rented: v.reduce((s, p) => s + p.rentedArea, 0),
      gmv: v.reduce((s, p) => s + p.gmv, 0) * factor,
      demands: Math.round(v.reduce((s, p) => s + p.demands, 0) * factor),
    }
  }, [factor])

  // Top 5
  const topProvinces = useMemo(() => {
    return Object.entries(provinceData)
      .map(([name, s]) => ({
        name,
        ...s,
        gmv: s.gmv * factor,
        demands: Math.round(s.demands * factor),
      }))
      .sort((a, b) =>
        mode === "warehouses" ? b.warehouses - a.warehouses : b.gmv - a.gmv,
      )
      .slice(0, 5)
  }, [mode, factor])

  const hoveredStat = hovered ? provinceData[hovered] : null

  // 图例阶梯（GMV 桶随周期缩放）
  const fmt = (n: number) =>
    n >= 10000
      ? `${(n / 10000).toFixed(1)}万`
      : n >= 1000
        ? n.toFixed(0)
        : n.toFixed(n < 10 ? 1 : 0)
  const legendStops =
    mode === "warehouses"
      ? [
          { color: "#dbeafe", label: "≤ 5" },
          { color: "#93c5fd", label: "5-10" },
          { color: "#60a5fa", label: "10-15" },
          { color: "#3b82f6", label: "15-20" },
          { color: "#2563eb", label: "20-25" },
          { color: "#1d4ed8", label: "≥ 25" },
        ]
      : [
          { color: "#fed7aa", label: `≤ ${fmt(200 * factor)}` },
          { color: "#fb923c", label: `${fmt(200 * factor)}-${fmt(500 * factor)}` },
          { color: "#f97316", label: `${fmt(500 * factor)}-${fmt(800 * factor)}` },
          { color: "#ef4444", label: `${fmt(800 * factor)}-${fmt(1200 * factor)}` },
          { color: "#dc2626", label: `${fmt(1200 * factor)}-${fmt(1500 * factor)}` },
          { color: "#b91c1c", label: `≥ ${fmt(1500 * factor)}` },
        ]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            全国仓储热力图
          </CardTitle>
          <Tabs value={mode} onValueChange={(v) => setMode(v as "warehouses" | "gmv")}>
            <TabsList className="h-8">
              <TabsTrigger value="warehouses" className="text-xs h-6">按仓储数量</TabsTrigger>
              <TabsTrigger value="gmv" className="text-xs h-6">按交易额</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* 地图 */}
          <div
            className="relative bg-slate-50 rounded-lg border border-slate-100 overflow-hidden"
            onMouseLeave={() => {
              setHovered(null)
              setTip(null)
            }}
          >
            <div className="relative w-full" style={{ height: 460 }}>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative w-full h-full aspect-[785/645] mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CHINA_MAP_IMG || "/placeholder.svg"}
                    alt="中国地图"
                    className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                  {Object.entries(PROVINCE_CENTER_PCT).map(([name, pos]) => {
                    const stat = provinceData[name]
                    if (!stat) return null
                    const value =
                      mode === "warehouses" ? stat.warehouses : stat.gmv * factor
                    const fill = heatColor(value, max, mode)
                    const ratio = max > 0 ? Math.min(1, value / max) : 0
                    const size = 14 + ratio * 28
                    const isHover = hovered === name
                    return (
                      <button
                        key={name}
                        type="button"
                        aria-label={`${name} ${isHover ? "hovered" : ""}`}
                        onMouseEnter={(e) => {
                          setHovered(name)
                          const rect = (
                            e.currentTarget.closest(
                              ".relative.bg-slate-50",
                            ) as HTMLElement | null
                          )?.getBoundingClientRect()
                          if (rect) {
                            setTip({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            })
                          }
                        }}
                        onMouseMove={(e) => {
                          const rect = (
                            e.currentTarget.closest(
                              ".relative.bg-slate-50",
                            ) as HTMLElement | null
                          )?.getBoundingClientRect()
                          if (rect) {
                            setTip({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            })
                          }
                        }}
                        className={cn(
                          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer",
                          isHover && "ring-2 ring-offset-1 z-10",
                          isHover &&
                            (mode === "warehouses"
                              ? "ring-blue-800"
                              : "ring-red-800"),
                        )}
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          width: size,
                          height: size,
                          backgroundColor: fill,
                        }}
                      >
                        {value > 0 && size >= 24 && (
                          <span className="text-[10px] font-semibold text-white leading-none drop-shadow tabular-nums">
                            {mode === "warehouses"
                              ? stat.warehouses
                              : stat.gmv >= 1000
                                ? (stat.gmv / 1000).toFixed(1) + "k"
                                : Math.round(stat.gmv)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 浮动详情 */}
            {hovered && hoveredStat && tip && (
              <div
                className="pointer-events-none absolute z-20 min-w-[200px] rounded-lg border border-slate-200 bg-white/95 shadow-lg p-3 backdrop-blur"
                style={{
                  left: Math.min(tip.x + 14, 600),
                  top: Math.min(tip.y + 14, 400),
                }}
              >
                <div className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {hovered}
                </div>
                {hoveredStat.warehouses === 0 ? (
                  <div className="text-xs text-muted-foreground">暂无仓储分布</div>
                ) : (
                  <dl className="space-y-1 text-xs">
                    <Row label="仓储数量" value={`${hoveredStat.warehouses} 座`} accent="text-blue-600" />
                    <Row label="可租面积" value={`${hoveredStat.rentableArea.toLocaleString()} m²`} />
                    <Row label="在租面积" value={`${hoveredStat.rentedArea.toLocaleString()} m²`} accent="text-emerald-600" />
                    <Row
                      label={`交易额 · ${periodLabels[period]}`}
                      value={`${(hoveredStat.gmv * factor).toLocaleString(undefined, { maximumFractionDigits: 1 })} 万元`}
                      accent="text-amber-600"
                    />
                    <Row
                      label={`需求单 · ${periodLabels[period]}`}
                      value={`${Math.round(hoveredStat.demands * factor).toLocaleString()} 单`}
                    />
                  </dl>
                )}
              </div>
            )}

            {/* 图例 */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-sm px-3 py-2">
              <div className="text-[11px] text-muted-foreground mb-1.5">
                热力图例 · {mode === "warehouses" ? "仓储数量（座）" : "交易额（万元）"}
              </div>
              <div className="flex items-center gap-1">
                {legendStops.map((s) => (
                  <div key={s.color} className="flex flex-col items-center">
                    <div
                      className="w-7 h-3 rounded-sm border border-white/80"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧汇总 + Top5 */}
          <div className="flex flex-col gap-3">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-0 text-white">
              <CardContent className="p-4">
                <div className="text-[11px] text-slate-300 mb-2 flex items-center justify-between">
                  <span>全国仓储概览</span>
                  <span className="text-[10px] text-slate-400">{periodLabels[period]}</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <Mini label="覆盖省份" value={`${totals.provinces}`} unit="个" tone="text-blue-300" />
                  <Mini label="仓储数量" value={`${totals.warehouses}`} unit="座" tone="text-emerald-300" />
                  <Mini
                    label="可租面积"
                    value={(totals.rentable / 10000).toFixed(2)}
                    unit="万㎡"
                    tone="text-sky-300"
                  />
                  <Mini
                    label="在租面积"
                    value={(totals.rented / 10000).toFixed(2)}
                    unit="万㎡"
                    tone="text-amber-300"
                  />
                  <Mini
                    label="交易额"
                    value={totals.gmv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    unit="万元"
                    tone="text-orange-300"
                  />
                  <Mini
                    label="需求单数量"
                    value={totals.demands.toLocaleString()}
                    unit="单"
                    tone="text-indigo-300"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    Top 5 · {mode === "warehouses" ? "仓储数量" : "交易额"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {topProvinces.map((p, idx) => {
                    const v = mode === "warehouses" ? p.warehouses : p.gmv
                    const ratio = v / max
                    return (
                      <div key={p.name} className="">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold ${
                                idx === 0
                                  ? "bg-amber-100 text-amber-700"
                                  : idx === 1
                                    ? "bg-slate-200 text-slate-700"
                                    : idx === 2
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="font-medium text-slate-700">{p.name}</span>
                          </span>
                          <span className="font-semibold tabular-nums text-slate-700">
                            {mode === "warehouses"
                              ? `${p.warehouses}`
                              : `${p.gmv.toLocaleString()}`}
                            <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                              {mode === "warehouses" ? "座" : "万元"}
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              mode === "warehouses"
                                ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                : "bg-gradient-to-r from-orange-400 to-red-600"
                            }`}
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`font-medium ${accent ?? "text-slate-700"} tabular-nums`}>
        {value}
      </dd>
    </div>
  )
}

function Mini({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: string
  unit: string
  tone: string
}) {
  return (
    <div>
      <div className="text-[10px] text-slate-400">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-0.5">
        <span className={`text-xl font-bold tabular-nums ${tone}`}>{value}</span>
        <span className="text-[10px] text-slate-400">{unit}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 物资地图分析 · 出租/出售双维度
// ─────────────────────────────────────────────────────────────

type MaterialMode = "rent" | "sale"

type MaterialProvinceStat = {
  rent: { listings: number; deals: number; gmv: number; avgDays: number } // gmv 万元
  sale: { listings: number; deals: number; gmv: number; avgPrice: number } // gmv 万元 / avgPrice 元每吨
}

// 各省物资租售（基础数据，按周期 factor 缩放）
const materialProvinceData: Record<string, MaterialProvinceStat> = {
  广东省: { rent: { listings: 612, deals: 478, gmv: 1342.6, avgDays: 86 }, sale: { listings: 318, deals: 246, gmv: 982.4, avgPrice: 4250 } },
  江苏省: { rent: { listings: 524, deals: 402, gmv: 1124.8, avgDays: 92 }, sale: { listings: 268, deals: 198, gmv: 812.6, avgPrice: 4180 } },
  浙江省: { rent: { listings: 472, deals: 356, gmv: 968.4, avgDays: 88 }, sale: { listings: 232, deals: 174, gmv: 712.8, avgPrice: 4320 } },
  山东省: { rent: { listings: 432, deals: 318, gmv: 842.6, avgDays: 96 }, sale: { listings: 218, deals: 156, gmv: 632.4, avgPrice: 3980 } },
  河南省: { rent: { listings: 386, deals: 282, gmv: 712.8, avgDays: 102 }, sale: { listings: 192, deals: 138, gmv: 542.6, avgPrice: 3860 } },
  上海市: { rent: { listings: 368, deals: 296, gmv: 924.6, avgDays: 78 }, sale: { listings: 186, deals: 148, gmv: 642.8, avgPrice: 4480 } },
  北京市: { rent: { listings: 412, deals: 332, gmv: 1086.4, avgDays: 76 }, sale: { listings: 218, deals: 172, gmv: 768.4, avgPrice: 4520 } },
  四川省: { rent: { listings: 342, deals: 246, gmv: 612.8, avgDays: 104 }, sale: { listings: 168, deals: 118, gmv: 442.6, avgPrice: 3820 } },
  湖北省: { rent: { listings: 318, deals: 232, gmv: 568.4, avgDays: 98 }, sale: { listings: 156, deals: 112, gmv: 412.4, avgPrice: 3780 } },
  福建省: { rent: { listings: 286, deals: 212, gmv: 524.6, avgDays: 94 }, sale: { listings: 142, deals: 102, gmv: 384.6, avgPrice: 4120 } },
  湖南省: { rent: { listings: 268, deals: 192, gmv: 482.4, avgDays: 100 }, sale: { listings: 138, deals: 96, gmv: 348.2, avgPrice: 3890 } },
  河北省: { rent: { listings: 312, deals: 224, gmv: 548.6, avgDays: 102 }, sale: { listings: 162, deals: 116, gmv: 402.6, avgPrice: 3760 } },
  安徽省: { rent: { listings: 258, deals: 184, gmv: 452.8, avgDays: 98 }, sale: { listings: 124, deals: 88, gmv: 312.4, avgPrice: 3820 } },
  辽宁省: { rent: { listings: 232, deals: 168, gmv: 406.4, avgDays: 104 }, sale: { listings: 118, deals: 84, gmv: 286.4, avgPrice: 3680 } },
  江西省: { rent: { listings: 184, deals: 132, gmv: 312.6, avgDays: 102 }, sale: { listings: 92, deals: 64, gmv: 218.4, avgPrice: 3720 } },
  陕西省: { rent: { listings: 196, deals: 142, gmv: 348.4, avgDays: 100 }, sale: { listings: 102, deals: 72, gmv: 248.6, avgPrice: 3840 } },
  重庆市: { rent: { listings: 218, deals: 158, gmv: 412.8, avgDays: 96 }, sale: { listings: 108, deals: 78, gmv: 282.4, avgPrice: 3920 } },
  天津市: { rent: { listings: 164, deals: 124, gmv: 322.6, avgDays: 88 }, sale: { listings: 84, deals: 62, gmv: 216.8, avgPrice: 4080 } },
  广西壮族自治区: { rent: { listings: 142, deals: 98, gmv: 232.4, avgDays: 108 }, sale: { listings: 72, deals: 48, gmv: 162.4, avgPrice: 3680 } },
  云南省: { rent: { listings: 124, deals: 82, gmv: 196.4, avgDays: 112 }, sale: { listings: 62, deals: 42, gmv: 138.6, avgPrice: 3640 } },
  山西省: { rent: { listings: 142, deals: 102, gmv: 248.4, avgDays: 104 }, sale: { listings: 76, deals: 52, gmv: 168.4, avgPrice: 3720 } },
  贵州省: { rent: { listings: 102, deals: 72, gmv: 168.4, avgDays: 110 }, sale: { listings: 52, deals: 36, gmv: 116.8, avgPrice: 3640 } },
  黑龙江省: { rent: { listings: 152, deals: 108, gmv: 262.4, avgDays: 108 }, sale: { listings: 78, deals: 54, gmv: 178.6, avgPrice: 3580 } },
  吉林省: { rent: { listings: 132, deals: 92, gmv: 224.6, avgDays: 106 }, sale: { listings: 68, deals: 46, gmv: 152.4, avgPrice: 3620 } },
  内蒙古自治区: { rent: { listings: 86, deals: 58, gmv: 142.6, avgDays: 116 }, sale: { listings: 42, deals: 28, gmv: 96.4, avgPrice: 3520 } },
  甘肃省: { rent: { listings: 78, deals: 52, gmv: 124.6, avgDays: 118 }, sale: { listings: 38, deals: 24, gmv: 82.4, avgPrice: 3480 } },
  新疆维吾尔自治区: { rent: { listings: 62, deals: 42, gmv: 102.4, avgDays: 124 }, sale: { listings: 32, deals: 18, gmv: 64.6, avgPrice: 3380 } },
  海南省: { rent: { listings: 58, deals: 38, gmv: 92.6, avgDays: 110 }, sale: { listings: 28, deals: 18, gmv: 62.4, avgPrice: 3920 } },
  宁夏回族自治区: { rent: { listings: 48, deals: 32, gmv: 78.4, avgDays: 116 }, sale: { listings: 24, deals: 16, gmv: 52.6, avgPrice: 3520 } },
  青海省: { rent: { listings: 32, deals: 20, gmv: 48.6, avgDays: 122 }, sale: { listings: 16, deals: 10, gmv: 32.4, avgPrice: 3460 } },
  西藏自治区: { rent: { listings: 18, deals: 10, gmv: 24.6, avgDays: 132 }, sale: { listings: 8, deals: 4, gmv: 14.6, avgPrice: 3320 } },
  香港特别行政区: { rent: { listings: 64, deals: 52, gmv: 168.4, avgDays: 72 }, sale: { listings: 38, deals: 28, gmv: 142.4, avgPrice: 4880 } },
  澳门特别行政区: { rent: { listings: 22, deals: 16, gmv: 52.6, avgDays: 78 }, sale: { listings: 12, deals: 8, gmv: 38.4, avgPrice: 4920 } },
  台湾省: { rent: { listings: 0, deals: 0, gmv: 0, avgDays: 0 }, sale: { listings: 0, deals: 0, gmv: 0, avgPrice: 0 } },
}

// 物资类别分布（出租 / 出售 各类别需求单数）
const materialCategoryData = [
  { name: "模板类", rent: 1842, sale: 624 },
  { name: "支护类", rent: 1264, sale: 432 },
  { name: "型材类", rent: 1086, sale: 768 },
  { name: "脚手架", rent: 1542, sale: 312 },
  { name: "轨道类", rent: 432, sale: 286 },
  { name: "房屋建筑", rent: 386, sale: 524 },
  { name: "拼装类", rent: 568, sale: 196 },
  { name: "电线电缆", rent: 312, sale: 462 },
  { name: "其他材料", rent: 218, sale: 348 },
]

// 12 月趋势（出租挂单 vs 出售挂单 · 月度）
const materialMonthlyTrend = [
  { m: "1月", rent: 642, sale: 286 },
  { m: "2月", rent: 568, sale: 248 },
  { m: "3月", rent: 824, sale: 362 },
  { m: "4月", rent: 968, sale: 412 },
  { m: "5月", rent: 1086, sale: 478 },
  { m: "6月", rent: 1124, sale: 502 },
  { m: "7月", rent: 1186, sale: 524 },
  { m: "8月", rent: 1248, sale: 568 },
  { m: "9月", rent: 1342, sale: 624 },
  { m: "10月", rent: 1486, sale: 698 },
  { m: "11月", rent: 1568, sale: 742 },
  { m: "12月", rent: 1624, sale: 786 },
]

function materialHeatColor(value: number, max: number, mode: MaterialMode) {
  if (value <= 0) return "#f1f5f9"
  const ratio = Math.min(1, value / max)
  if (mode === "rent") {
    if (ratio > 0.8) return "#047857"
    if (ratio > 0.6) return "#059669"
    if (ratio > 0.45) return "#10b981"
    if (ratio > 0.3) return "#34d399"
    if (ratio > 0.15) return "#6ee7b7"
    return "#d1fae5"
  }
  if (ratio > 0.8) return "#b45309"
  if (ratio > 0.6) return "#d97706"
  if (ratio > 0.45) return "#f59e0b"
  if (ratio > 0.3) return "#fbbf24"
  if (ratio > 0.15) return "#fcd34d"
  return "#fef3c7"
}

function MaterialGeoAnalysis({ period }: { period: Period }) {
  const [mode, setMode] = useState<MaterialMode>("rent")
  const [hovered, setHovered] = useState<string | null>(null)
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  const factor = periodFactors[period]

  // 全国汇总
  const totals = useMemo(() => {
    const v = Object.values(materialProvinceData)
    const r = v.reduce(
      (s, p) => ({
        listings: s.listings + p.rent.listings,
        deals: s.deals + p.rent.deals,
        gmv: s.gmv + p.rent.gmv,
      }),
      { listings: 0, deals: 0, gmv: 0 },
    )
    const s = v.reduce(
      (s, p) => ({
        listings: s.listings + p.sale.listings,
        deals: s.deals + p.sale.deals,
        gmv: s.gmv + p.sale.gmv,
      }),
      { listings: 0, deals: 0, gmv: 0 },
    )
    return { rent: r, sale: s }
  }, [])

  const max = useMemo(() => {
    const values = Object.values(materialProvinceData).map((p) =>
      mode === "rent" ? p.rent.listings : p.sale.listings,
    )
    return Math.max(...values, 1)
  }, [mode])

  const topProvinces = useMemo(() => {
    return Object.entries(materialProvinceData)
      .map(([name, s]) => ({
        name,
        rent: s.rent.listings,
        sale: s.sale.listings,
        rentGmv: s.rent.gmv * factor,
        saleGmv: s.sale.gmv * factor,
      }))
      .sort((a, b) => (mode === "rent" ? b.rent - a.rent : b.sale - a.sale))
      .slice(0, 6)
  }, [mode, factor])

  const hoveredStat = hovered ? materialProvinceData[hovered] : null
  const monthlyScaled = materialMonthlyTrend.map((d) => ({
    m: d.m,
    rent: Math.round(d.rent * factor),
    sale: Math.round(d.sale * factor),
  }))

  const isRent = mode === "rent"
  const accentText = isRent ? "text-emerald-600" : "text-amber-600"
  const accentBg = isRent ? "bg-emerald-50" : "bg-amber-50"

  return (
    <div className="space-y-4">
      {/* 出租 / 出售 双维度概览卡 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RentSaleSummary
          tone="rent"
          period={period}
          factor={factor}
          totals={totals.rent}
          extra={{
            avgDays: Math.round(
              Object.values(materialProvinceData)
                .filter((p) => p.rent.avgDays > 0)
                .reduce((s, p) => s + p.rent.avgDays, 0) /
                Object.values(materialProvinceData).filter((p) => p.rent.avgDays > 0).length,
            ),
          }}
        />
        <RentSaleSummary
          tone="sale"
          period={period}
          factor={factor}
          totals={totals.sale}
          extra={{
            avgPrice: Math.round(
              Object.values(materialProvinceData)
                .filter((p) => p.sale.avgPrice > 0)
                .reduce((s, p) => s + p.sale.avgPrice, 0) /
                Object.values(materialProvinceData).filter((p) => p.sale.avgPrice > 0).length,
            ),
          }}
        />
      </div>

      {/* 主体：地图（左） + 类别分布（右） */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className={cn("w-4 h-4", accentText)} />
              全国物资租售分布
              <Badge
                variant="outline"
                className={cn(
                  "ml-1 text-[10px] h-5 px-1.5 border-0",
                  accentBg,
                  accentText,
                )}
              >
                {isRent ? "按出租活跃度" : "按出售活跃度"}
              </Badge>
            </CardTitle>
            <Tabs value={mode} onValueChange={(v) => setMode(v as MaterialMode)}>
              <TabsList className="h-8">
                <TabsTrigger value="rent" className="text-xs h-6">出租维度</TabsTrigger>
                <TabsTrigger value="sale" className="text-xs h-6">出售维度</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
            {/* 地图 */}
            <div
              className="relative bg-slate-50 rounded-lg border border-slate-100 overflow-hidden"
              onMouseLeave={() => {
                setHovered(null)
                setTip(null)
              }}
            >
              <div className="relative w-full" style={{ height: 460 }}>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full h-full aspect-[785/645] mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CHINA_MAP_IMG || "/placeholder.svg"}
                      alt="中国地图"
                      className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                    {Object.entries(PROVINCE_CENTER_PCT).map(([name, pos]) => {
                      const stat = materialProvinceData[name]
                      if (!stat) return null
                      const value = isRent ? stat.rent.listings : stat.sale.listings
                      const fill = materialHeatColor(value, max, mode)
                      const ratio = max > 0 ? Math.min(1, value / max) : 0
                      const size = 14 + ratio * 28
                      const isHover = hovered === name
                      return (
                        <button
                          key={name}
                          type="button"
                          aria-label={name}
                          onMouseEnter={(e) => {
                            setHovered(name)
                            const rect = (
                              e.currentTarget.closest(
                                ".relative.bg-slate-50",
                              ) as HTMLElement | null
                            )?.getBoundingClientRect()
                            if (rect) {
                              setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                            }
                          }}
                          onMouseMove={(e) => {
                            const rect = (
                              e.currentTarget.closest(
                                ".relative.bg-slate-50",
                              ) as HTMLElement | null
                            )?.getBoundingClientRect()
                            if (rect) {
                              setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                            }
                          }}
                          className={cn(
                            "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer",
                            isHover && "ring-2 ring-offset-1 z-10",
                            isHover && (isRent ? "ring-emerald-700" : "ring-amber-700"),
                          )}
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            width: size,
                            height: size,
                            backgroundColor: fill,
                          }}
                        >
                          {value > 0 && size >= 24 && (
                            <span className="text-[10px] font-semibold text-white leading-none drop-shadow tabular-nums">
                              {value >= 1000 ? (value / 1000).toFixed(1) + "k" : value}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 浮动详情 */}
              {hovered && hoveredStat && tip && (
                <div
                  className="pointer-events-none absolute z-20 min-w-[220px] rounded-lg border border-slate-200 bg-white/95 shadow-lg p-3 backdrop-blur"
                  style={{
                    left: Math.min(tip.x + 14, 600),
                    top: Math.min(tip.y + 14, 400),
                  }}
                >
                  <div className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <MapPin
                      className={cn("w-3.5 h-3.5", isRent ? "text-emerald-600" : "text-amber-600")}
                    />
                    {hovered}
                  </div>
                  {hoveredStat.rent.listings === 0 && hoveredStat.sale.listings === 0 ? (
                    <div className="text-xs text-muted-foreground">暂无物资租售数据</div>
                  ) : (
                    <div className="space-y-2">
                      <div className="rounded-md bg-emerald-50/70 p-2">
                        <div className="text-[11px] text-emerald-700 mb-1 flex items-center gap-1 font-medium">
                          <Tag className="w-3 h-3" />
                          出租
                        </div>
                        <dl className="space-y-0.5 text-xs">
                          <Row label="挂单" value={`${Math.round(hoveredStat.rent.listings * factor).toLocaleString()} 单`} />
                          <Row label="成交" value={`${Math.round(hoveredStat.rent.deals * factor).toLocaleString()} 单`} accent="text-emerald-700" />
                          <Row label="GMV" value={`${(hoveredStat.rent.gmv * factor).toLocaleString(undefined, { maximumFractionDigits: 1 })} 万`} />
                          <Row label="平均租期" value={`${hoveredStat.rent.avgDays} 天`} />
                        </dl>
                      </div>
                      <div className="rounded-md bg-amber-50/70 p-2">
                        <div className="text-[11px] text-amber-700 mb-1 flex items-center gap-1 font-medium">
                          <HandCoins className="w-3 h-3" />
                          出售
                        </div>
                        <dl className="space-y-0.5 text-xs">
                          <Row label="挂单" value={`${Math.round(hoveredStat.sale.listings * factor).toLocaleString()} 单`} />
                          <Row label="成交" value={`${Math.round(hoveredStat.sale.deals * factor).toLocaleString()} 单`} accent="text-amber-700" />
                          <Row label="GMV" value={`${(hoveredStat.sale.gmv * factor).toLocaleString(undefined, { maximumFractionDigits: 1 })} 万`} />
                          <Row label="均价" value={`${hoveredStat.sale.avgPrice.toLocaleString()} 元/吨`} />
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 图例 */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-sm px-3 py-2">
                <div className="text-[11px] text-muted-foreground mb-1.5">
                  {isRent ? "出租挂单密度（单）" : "出售挂单密度（单）"}
                </div>
                <div className="flex items-center gap-1">
                  {(isRent
                    ? [
                        { color: "#d1fae5", label: "≤100" },
                        { color: "#6ee7b7", label: "100-200" },
                        { color: "#34d399", label: "200-300" },
                        { color: "#10b981", label: "300-450" },
                        { color: "#059669", label: "450-600" },
                        { color: "#047857", label: "≥600" },
                      ]
                    : [
                        { color: "#fef3c7", label: "≤50" },
                        { color: "#fcd34d", label: "50-100" },
                        { color: "#fbbf24", label: "100-150" },
                        { color: "#f59e0b", label: "150-200" },
                        { color: "#d97706", label: "200-280" },
                        { color: "#b45309", label: "≥280" },
                      ]
                  ).map((s) => (
                    <div key={s.color} className="flex flex-col items-center">
                      <div
                        className="w-7 h-3 rounded-sm border border-white/80"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-[10px] text-muted-foreground mt-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：物资类别分布 */}
            <div className="flex flex-col gap-3">
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5 text-slate-600" />
                    物资类别 · 出租 vs 出售
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    全国累计挂单（单）
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={materialCategoryData.map((d) => ({
                        ...d,
                        rent: Math.round(d.rent * factor),
                        sale: Math.round(d.sale * factor),
                      }))}
                      layout="vertical"
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
                      <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                        width={64}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                        }}
                        formatter={(v: number) => `${v.toLocaleString()} 单`}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                      <Bar dataKey="rent" name="出租" fill="#10b981" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="sale" name="出售" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 底部：12 月趋势 + Top 省份 */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              出租 vs 出售挂单趋势
            </CardTitle>
            <CardDescription className="text-xs">
              {periodLabels[period]}视角下的近 12 月挂单（单）
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyScaled} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-rent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="grad-sale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(v: number) => `${v.toLocaleString()} 单`}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="rent"
                  name="出租挂单"
                  stroke="#10b981"
                  fill="url(#grad-rent)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sale"
                  name="出售挂单"
                  stroke="#f59e0b"
                  fill="url(#grad-sale)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className={cn("w-3.5 h-3.5", accentText)} />
                Top 6 · {isRent ? "出租挂单省份" : "出售挂单省份"}
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {periodLabels[period]}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2.5">
              {topProvinces.map((p, idx) => {
                const v = isRent ? p.rent : p.sale
                const ratio = v / max
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold",
                            idx === 0
                              ? "bg-amber-100 text-amber-700"
                              : idx === 1
                                ? "bg-slate-200 text-slate-700"
                                : idx === 2
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-700">{p.name}</span>
                      </span>
                      <span className="font-semibold tabular-nums text-slate-700">
                        {v.toLocaleString()}
                        <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                          单
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          isRent
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            : "bg-gradient-to-r from-amber-400 to-amber-600",
                        )}
                        style={{ width: `${ratio * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                      <span>GMV</span>
                      <span className="tabular-nums">
                        {(isRent ? p.rentGmv : p.saleGmv).toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })}{" "}
                        万元
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RentSaleSummary({
  tone,
  period,
  factor,
  totals,
  extra,
}: {
  tone: "rent" | "sale"
  period: Period
  factor: number
  totals: { listings: number; deals: number; gmv: number }
  extra: { avgDays?: number; avgPrice?: number }
}) {
  const isRent = tone === "rent"
  const conv = totals.listings > 0 ? (totals.deals / totals.listings) * 100 : 0
  const gradient = isRent
    ? "from-emerald-500 to-teal-500"
    : "from-amber-500 to-orange-500"
  const Icon = isRent ? Tag : HandCoins
  return (
    <Card className="overflow-hidden relative">
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          gradient,
        )}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon
                className={cn("w-3.5 h-3.5", isRent ? "text-emerald-600" : "text-amber-600")}
              />
              <span>物资{isRent ? "出租" : "出售"} · {periodLabels[period]}</span>
            </div>
            <div
              className={cn(
                "mt-2 text-2xl font-bold tabular-nums",
                isRent ? "text-emerald-700" : "text-amber-700",
              )}
            >
              {(totals.gmv * factor).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              <span className="ml-1 text-xs font-medium text-muted-foreground">万元 GMV</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[11px] border-0",
              isRent ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
            )}
          >
            转化率 {conv.toFixed(1)}%
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <SummaryStat
            label="挂单"
            value={Math.round(totals.listings * factor).toLocaleString()}
            unit="单"
          />
          <SummaryStat
            label="成交"
            value={Math.round(totals.deals * factor).toLocaleString()}
            unit="单"
            tone={isRent ? "text-emerald-700" : "text-amber-700"}
          />
          <SummaryStat
            label="客单价"
            value={(((totals.gmv * factor) / Math.max(1, totals.deals * factor)) || 0).toLocaleString(
              undefined,
              { maximumFractionDigits: 1 },
            )}
            unit="万/单"
          />
          {isRent ? (
            <SummaryStat label="平均租期" value={`${extra.avgDays ?? 0}`} unit="天" />
          ) : (
            <SummaryStat
              label="均价"
              value={(extra.avgPrice ?? 0).toLocaleString()}
              unit="元/吨"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryStat({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: string
  unit: string
  tone?: string
}) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-0.5">
        <span className={cn("text-sm font-semibold tabular-nums", tone ?? "text-slate-700")}>
          {value}
        </span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}
