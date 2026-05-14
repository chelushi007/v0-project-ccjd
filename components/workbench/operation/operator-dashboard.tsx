"use client"

import {
  Warehouse,
  Package,
  Wallet,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  Monitor,
  BarChart3,
  Boxes,
  FileText,
  Building2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

// ============ KPI 数据 ============
const kpiCards = [
  {
    key: "stations",
    label: "在管仓储站点",
    value: "18",
    unit: "个",
    delta: "+2",
    deltaType: "up" as const,
    deltaLabel: "本月新增",
    icon: Building2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "skus",
    label: "托管物料 SKU",
    value: "2,684",
    unit: "项",
    delta: "+186",
    deltaType: "up" as const,
    deltaLabel: "30 天",
    icon: Boxes,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    key: "service-fee",
    label: "本月服务费收入",
    value: "¥ 86.4",
    unit: "万",
    delta: "+12.6%",
    deltaType: "up" as const,
    deltaLabel: "环比",
    icon: Wallet,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    key: "orders",
    label: "本月新增订单",
    value: "143",
    unit: "单",
    delta: "+8.3%",
    deltaType: "up" as const,
    deltaLabel: "环比",
    icon: ShoppingCart,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    key: "contracts",
    label: "活跃合同",
    value: "97",
    unit: "份",
    delta: "-3",
    deltaType: "down" as const,
    deltaLabel: "本周到期",
    icon: FileText,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    key: "fulfill",
    label: "订单履约率",
    value: "98.7",
    unit: "%",
    delta: "+0.4pt",
    deltaType: "up" as const,
    deltaLabel: "环比",
    icon: Activity,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
]

// ============ 收入趋势（近12个月，服务费 / 万元） ============
const revenueTrend = [
  { month: "6月", warehouse: 18.2, storage: 6.4, rent: 11.5, sale: 9.1 },
  { month: "7月", warehouse: 19.4, storage: 7.0, rent: 12.1, sale: 10.4 },
  { month: "8月", warehouse: 20.1, storage: 7.6, rent: 12.6, sale: 12.0 },
  { month: "9月", warehouse: 21.5, storage: 8.0, rent: 13.4, sale: 14.2 },
  { month: "10月", warehouse: 22.0, storage: 8.4, rent: 14.0, sale: 16.5 },
  { month: "11月", warehouse: 22.8, storage: 8.8, rent: 14.6, sale: 18.2 },
  { month: "12月", warehouse: 23.4, storage: 9.2, rent: 15.0, sale: 20.5 },
  { month: "1月", warehouse: 24.1, storage: 9.6, rent: 15.6, sale: 22.0 },
  { month: "2月", warehouse: 24.6, storage: 10.0, rent: 16.4, sale: 23.6 },
  { month: "3月", warehouse: 25.4, storage: 10.6, rent: 17.2, sale: 25.4 },
  { month: "4月", warehouse: 26.1, storage: 11.0, rent: 18.0, sale: 27.6 },
  { month: "5月", warehouse: 27.0, storage: 11.6, rent: 18.8, sale: 29.0 },
]

const revenueConfig: ChartConfig = {
  warehouse: { label: "仓储租赁", color: "hsl(214 84% 56%)" },
  storage: { label: "物资存放", color: "hsl(238 78% 60%)" },
  rent: { label: "物资租赁", color: "hsl(160 70% 45%)" },
  sale: { label: "物资销售", color: "hsl(38 92% 50%)" },
}

// ============ 业务结构（订单占比） ============
const bizMix = [
  { name: "仓储租赁", value: 48, color: "hsl(214 84% 56%)" },
  { name: "物资存放", value: 22, color: "hsl(238 78% 60%)" },
  { name: "物资租赁", value: 18, color: "hsl(160 70% 45%)" },
  { name: "物资销售", value: 12, color: "hsl(38 92% 50%)" },
]

// ============ 站点容量利用率 ============
const siteCapacity = [
  { site: "广州南沙基地", used: 92, total: 100 },
  { site: "东莞虎门基地", used: 86, total: 100 },
  { site: "深圳龙岗基地", used: 78, total: 100 },
  { site: "佛山顺德基地", used: 71, total: 100 },
  { site: "广州黄埔基地", used: 64, total: 100 },
  { site: "中山小榄基地", used: 52, total: 100 },
]

const capacityConfig: ChartConfig = {
  used: { label: "已用容量", color: "hsl(214 84% 56%)" },
}

// ============ 待办事项 ============
const pendingTasks = [
  {
    id: "P1",
    type: "服务费收款确认",
    title: "WZXS20260513001 · 万能杆件销售分成服务费",
    partner: "中铁十四局集团广州分公司",
    amount: "¥ 18,900",
    deadline: "今日 18:00",
    urgent: true,
  },
  {
    id: "P2",
    type: "对账驳回处理",
    title: "DZ-2026-003 · 物资租赁运营分成对账",
    partner: "中铁建东莞虎门港务仓储基地",
    amount: "¥ 85,000",
    deadline: "明日 12:00",
    urgent: true,
  },
  {
    id: "P3",
    type: "新增站点审核",
    title: "东莞塘厦新站点准入材料复核",
    partner: "本企业 · 资源拓展部",
    amount: "—",
    deadline: "5 月 18 日",
    urgent: false,
  },
  {
    id: "P4",
    type: "合同到期续签",
    title: "CCJY20260315006 · 月度仓储租赁合同",
    partner: "中铁十四局集团广州分公司",
    amount: "¥ 125,000 / 月",
    deadline: "5 月 20 日",
    urgent: false,
  },
  {
    id: "P5",
    type: "物料调拨复核",
    title: "WT-20260512-002 · 跨基地盘扣调拨",
    partner: "广州南沙 → 东莞虎门",
    amount: "320 件",
    deadline: "5 月 15 日",
    urgent: false,
  },
]

// ============ 通用工具 ============
const fmt = (n: number) => n.toLocaleString("zh-CN", { maximumFractionDigits: 1 })

const bizColor = (k: string) =>
  k === "仓储租赁"
    ? { dot: "bg-blue-500", chip: "bg-blue-50 text-blue-700 border-blue-200" }
    : k === "物资存放"
      ? { dot: "bg-indigo-500", chip: "bg-indigo-50 text-indigo-700 border-indigo-200" }
      : k === "物资租赁"
        ? { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" }
        : { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" }

export function OperatorDashboard() {
  const totalRevenue =
    revenueTrend[revenueTrend.length - 1].warehouse +
    revenueTrend[revenueTrend.length - 1].storage +
    revenueTrend[revenueTrend.length - 1].rent +
    revenueTrend[revenueTrend.length - 1].sale

  return (
    <div className="space-y-6">
      {/* 顶部欢迎条 + 大屏入口 */}
      <Card className="border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute -bottom-10 right-10 w-72 h-72 rounded-full bg-amber-400 blur-3xl" />
        </div>
        <CardContent className="relative p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-1.5">
              <Activity className="w-3.5 h-3.5" />
              运营方工作台 · 经营驾驶舱
            </div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              中铁建物料华南专业运营有限公司
            </h2>
            <p className="text-sm text-white/70 mt-1.5">
              本月服务费累计{" "}
              <span className="text-amber-300 font-semibold tabular-nums">
                ¥ {fmt(totalRevenue)} 万
              </span>{" "}
              · 在管站点 <span className="text-white font-medium">18</span> 个 · 活跃合同{" "}
              <span className="text-white font-medium">97</span> 份
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0">
              <BarChart3 className="w-4 h-4 mr-1.5" />
              统计报表
            </Button>
            <Button size="sm" className="bg-amber-500 text-slate-900 hover:bg-amber-400">
              <Monitor className="w-4 h-4 mr-1.5" />
              进入可视化大屏
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI 卡 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((k) => {
          const Icon = k.icon
          const isUp = k.deltaType === "up"
          return (
            <Card key={k.key} className="border border-border/60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${k.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${k.iconColor}`} />
                  </div>
                  <Badge
                    variant="outline"
                    className={`h-5 text-[10px] gap-0.5 ${
                      isUp
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {k.delta}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-semibold tracking-tight tabular-nums">
                    {k.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{k.unit}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1.5">{k.deltaLabel}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 收入趋势 + 业务结构 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">服务费收入趋势</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  近 12 个月各业务线服务费收入（单位：万元）
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {Object.entries(revenueConfig).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: v.color as string }}
                    />
                    {v.label}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-[280px] w-full">
              <AreaChart data={revenueTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  {Object.entries(revenueConfig).map(([k, v]) => (
                    <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={v.color as string} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={v.color as string} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={6} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} width={28} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                {(["warehouse", "storage", "rent", "sale"] as const).map((k) => (
                  <Area
                    key={k}
                    type="monotone"
                    dataKey={k}
                    stroke={revenueConfig[k].color as string}
                    fill={`url(#g-${k})`}
                    strokeWidth={2}
                    stackId="1"
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">业务结构</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              四大业务订单数占比 · 本月
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative h-[180px]">
              <ChartContainer config={{}} className="h-full w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={bizMix}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    strokeWidth={2}
                  >
                    {bizMix.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-semibold tabular-nums">143</div>
                <div className="text-[11px] text-muted-foreground">本月订单总数</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {bizMix.map((d) => {
                const c = bizColor(d.name)
                return (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      <span className="text-foreground">{d.name}</span>
                    </div>
                    <span className="tabular-nums text-muted-foreground">
                      {d.value}%
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 站点容量 + 待办 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">站点容量利用率</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  各仓储基地实际占用比例
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">
                共 6 个核心基地
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={capacityConfig} className="h-[280px] w-full">
              <BarChart data={siteCapacity} margin={{ left: 0, right: 16, top: 8, bottom: 0 }} layout="vertical">
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="site"
                  tickLine={false}
                  axisLine={false}
                  width={92}
                  fontSize={11}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="used" radius={[0, 4, 4, 0]} fill="hsl(214 84% 56%)">
                  {siteCapacity.map((d) => (
                    <Cell
                      key={d.site}
                      fill={
                        d.used >= 90
                          ? "hsl(0 72% 56%)"
                          : d.used >= 75
                            ? "hsl(38 92% 50%)"
                            : "hsl(214 84% 56%)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-blue-500" />
                正常（&lt; 75%）
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-amber-500" />
                偏紧（75 ~ 90%）
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-red-500" />
                告警（≥ 90%）
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">待办事项</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                查看全部
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              需运营方处理 · 共 {pendingTasks.length} 项
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingTasks.map((t) => (
              <div
                key={t.id}
                className="rounded-md border border-border bg-card p-3 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <Badge
                    variant="outline"
                    className={`h-5 text-[10px] gap-1 ${
                      t.urgent
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t.urgent ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {t.type}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {t.deadline}
                  </span>
                </div>
                <div className="text-sm font-medium leading-snug line-clamp-1">{t.title}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-muted-foreground truncate">{t.partner}</span>
                  <span className="text-[11px] font-medium tabular-nums text-foreground shrink-0 ml-2">
                    {t.amount}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 服务质量指标 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">运营服务质量</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                关键服务指标 · 本月
              </p>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] h-5 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              整体达标
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "订单履约率", value: 98.7, target: 95, unit: "%", icon: ShoppingCart },
              { label: "入库及时率", value: 96.2, target: 95, unit: "%", icon: Package },
              { label: "物料完好率", value: 99.4, target: 99, unit: "%", icon: Warehouse },
              { label: "客户满意度", value: 94.8, target: 90, unit: "分", icon: Activity },
            ].map((m) => {
              const Icon = m.icon
              const ok = m.value >= m.target
              return (
                <div key={m.label} className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="w-3.5 h-3.5" />
                      {m.label}
                    </div>
                    <span
                      className={`text-[10px] px-1.5 rounded ${
                        ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      目标 {m.target}
                      {m.unit}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xl font-semibold tabular-nums">{m.value}</span>
                    <span className="text-xs text-muted-foreground">{m.unit}</span>
                  </div>
                  <Progress
                    value={Math.min(100, (m.value / 100) * 100)}
                    className={ok ? "[&>div]:bg-emerald-500" : "[&>div]:bg-rose-500"}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
