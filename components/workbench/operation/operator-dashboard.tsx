"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight,
  ArrowDownRight,
  Warehouse,
  Users,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Building2,
  Package,
  FileWarning,
  ShieldAlert,
  ChevronRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts"

const kpiCards = [
  {
    label: "本月平台 GMV",
    value: "¥ 18,460,000",
    delta: "+12.6%",
    deltaType: "up" as const,
    icon: TrendingUp,
    accent: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    desc: "较上月环比上升",
  },
  {
    label: "本月服务费收入",
    value: "¥ 928,400",
    delta: "+8.3%",
    deltaType: "up" as const,
    icon: Wallet,
    accent: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    desc: "平台综合提成",
  },
  {
    label: "活跃用户单位",
    value: "186",
    delta: "+9",
    deltaType: "up" as const,
    icon: Users,
    accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    desc: "近 30 天有订单交易",
  },
  {
    label: "本月新增订单",
    value: "342",
    delta: "-3.1%",
    deltaType: "down" as const,
    icon: ShoppingCart,
    accent: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    desc: "包含四类业务订单",
  },
]

const secondaryKpi = [
  {
    label: "在管基地",
    value: "28",
    sub: "正常 26 / 暂停 2",
    icon: Warehouse,
    tone: "text-blue-700",
  },
  {
    label: "在管物料 SKU",
    value: "1,284",
    sub: "本月新增 36",
    icon: Package,
    tone: "text-indigo-700",
  },
  {
    label: "进行中订单",
    value: "417",
    sub: "其中争议单 3",
    icon: Activity,
    tone: "text-emerald-700",
  },
  {
    label: "服务费应收",
    value: "¥ 312,500",
    sub: "待确认 12 笔",
    icon: Wallet,
    tone: "text-amber-700",
  },
]

// 服务费收入趋势（近 6 月，按四大业务拆分）
const revenueTrend = [
  { month: "1月", 仓储租赁: 142, 物资存放: 56, 物资租赁: 88, 物资销售: 124 },
  { month: "2月", 仓储租赁: 156, 物资存放: 62, 物资租赁: 96, 物资销售: 140 },
  { month: "3月", 仓储租赁: 168, 物资存放: 70, 物资租赁: 105, 物资销售: 162 },
  { month: "4月", 仓储租赁: 182, 物资存放: 76, 物资租赁: 112, 物资销售: 188 },
  { month: "5月", 仓储租赁: 196, 物资存放: 82, 物资租赁: 124, 物资销售: 218 },
  { month: "6月", 仓储租赁: 212, 物资存放: 88, 物资租赁: 138, 物资销售: 246 },
]

// GMV 趋势
const gmvTrend = [
  { day: "06-01", gmv: 542 },
  { day: "06-04", gmv: 612 },
  { day: "06-07", gmv: 588 },
  { day: "06-10", gmv: 670 },
  { day: "06-13", gmv: 724 },
  { day: "06-16", gmv: 698 },
  { day: "06-19", gmv: 786 },
  { day: "06-22", gmv: 812 },
  { day: "06-25", gmv: 894 },
  { day: "06-28", gmv: 942 },
]

// 基地容量利用率 TOP
const siteUtilization = [
  { name: "广州黄埔基地", rate: 92, status: "warning" },
  { name: "东莞虎门基地", rate: 86, status: "normal" },
  { name: "深圳前海基地", rate: 78, status: "normal" },
  { name: "佛山顺德基地", rate: 64, status: "normal" },
  { name: "中山火炬基地", rate: 42, status: "low" },
]

// 待办运营事项
const todos = [
  {
    id: 1,
    title: "新基地入驻审核",
    desc: "中铁十六局 · 番禺南沙临港基地（5,200㎡）",
    type: "审核",
    level: "high",
    time: "刚刚",
  },
  {
    id: 2,
    title: "服务费收款确认",
    desc: "中铁十四局 · ¥58,200（仓储租赁分成 6 月）",
    type: "收款",
    level: "high",
    time: "10 分钟前",
  },
  {
    id: 3,
    title: "订单争议处理",
    desc: "订单 CCJY20260428005 · 用户单位申请仲裁",
    type: "争议",
    level: "urgent",
    time: "32 分钟前",
  },
  {
    id: 4,
    title: "合同合规审核",
    desc: "WZXS20260513001 销售合同 · 涉及金额 ¥3.78M",
    type: "合同",
    level: "mid",
    time: "1 小时前",
  },
  {
    id: 5,
    title: "物料目录上架",
    desc: "盘扣式脚手架配件包（新 SKU）· 待平台审核",
    type: "上架",
    level: "mid",
    time: "2 小时前",
  },
]

// 风险预警
const alerts = [
  {
    icon: ShieldAlert,
    title: "广州黄埔基地容量预警",
    desc: "当前利用率 92%，连续 7 天超过 90%，建议调度分流",
    level: "high",
  },
  {
    icon: FileWarning,
    title: "对账逾期未确认",
    desc: "8 笔对账单累计 ¥186,400 超过 48 小时未确认",
    level: "mid",
  },
  {
    icon: AlertTriangle,
    title: "物料价格异常",
    desc: "万能杆件租金报价较平台均价高 35%（订单 WZJY20260605004）",
    level: "mid",
  },
]

// 平台动态流水
const activityFeed = [
  {
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    text: "中铁建广州黄埔基地 完成 ¥125,000 月度租金对账",
    time: "5 分钟前",
  },
  {
    icon: ShoppingCart,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    text: "中铁十四局 新建物资销售订单 WZXS20260628012",
    time: "12 分钟前",
  },
  {
    icon: Wallet,
    color: "text-amber-600",
    bg: "bg-amber-50",
    text: "平台服务费 ¥28,400 已到账 · 工商银行对公",
    time: "28 分钟前",
  },
  {
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    text: "新用户单位 中铁二十二局南方分公司 完成入驻",
    time: "1 小时前",
  },
  {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    text: "合同 HT-2026-0428 平台合规审核通过",
    time: "2 小时前",
  },
]

const levelChip: Record<string, string> = {
  urgent: "bg-red-50 text-red-700 border-red-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  mid: "bg-blue-50 text-blue-700 border-blue-200",
}

export function OperatorDashboard() {
  return (
    <div className="space-y-6">
      {/* 顶部欢迎 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">运营管理驾驶舱</h1>
          <p className="text-sm text-muted-foreground mt-1">
            实时监控平台运营全景 · 数据更新时间 2026-06-28 09:32
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            导出日报
          </Button>
          <Button size="sm">
            可视化大屏
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* 一级 KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((k) => {
          const Icon = k.icon
          const isUp = k.deltaType === "up"
          return (
            <Card key={k.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border ${k.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`gap-0.5 text-[11px] h-6 ${
                      isUp
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {k.delta}
                  </Badge>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="text-2xl font-semibold tabular-nums">
                    {k.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{k.label}</div>
                  <div className="text-xs text-muted-foreground/80 flex items-center gap-1">
                    <span className={`w-1 h-1 rounded-full ${k.dot}`} />
                    {k.desc}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 二级 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryKpi.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`w-8 h-8 ${k.tone}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="text-xl font-semibold tabular-nums leading-tight">
                    {k.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {k.sub}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 主图表区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* 服务费收入趋势（占 2 列） */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">服务费收入趋势</CardTitle>
              <CardDescription className="text-xs">
                按四大业务线拆分 · 单位：千元
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[11px]">
              近 6 个月
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueTrend} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="仓储租赁" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="物资存放" stackId="a" fill="#6366f1" />
                <Bar dataKey="物资租赁" stackId="a" fill="#10b981" />
                <Bar dataKey="物资销售" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GMV 日趋势 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">GMV 日趋势</CardTitle>
            <CardDescription className="text-xs">
              近 30 天 · 单位：万元
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={gmvTrend}>
                <defs>
                  <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="gmv"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#gmv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 三栏：基地利用率 + 待办 + 预警 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* 基地利用率 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">基地容量利用率 TOP</CardTitle>
            <CardDescription className="text-xs">
              实时容量监控 · 高于 90% 需调度
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {siteUtilization.map((s) => {
              const tone =
                s.rate >= 90
                  ? "bg-amber-500"
                  : s.rate >= 60
                    ? "bg-emerald-500"
                    : "bg-slate-400"
              return (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <Warehouse className="w-3.5 h-3.5 text-muted-foreground" />
                      {s.name}
                    </span>
                    <span className="tabular-nums font-medium">{s.rate}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tone}`}
                      style={{ width: `${s.rate}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* 待办 */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">运营待办</CardTitle>
              <CardDescription className="text-xs">
                {todos.length} 项 · 按时效排序
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              查看全部
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todos.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {t.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] h-4 ${levelChip[t.level]}`}
                    >
                      {t.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {t.desc}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {t.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 预警 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              风险预警
            </CardTitle>
            <CardDescription className="text-xs">
              系统自动识别 · 需运营介入
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => {
              const Icon = a.icon
              const toneBg =
                a.level === "high"
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              const toneText =
                a.level === "high" ? "text-red-700" : "text-amber-700"
              return (
                <div
                  key={a.title}
                  className={`p-3 rounded-md border ${toneBg}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 ${toneText}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${toneText}`}>
                        {a.title}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.desc}
                      </p>
                      <button
                        className={`text-xs mt-1.5 font-medium ${toneText} hover:underline inline-flex items-center gap-0.5`}
                      >
                        立即处理
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* 平台动态 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">平台实时动态</CardTitle>
            <CardDescription className="text-xs">
              全平台业务流水 · 实时刷新
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            查看更多
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityFeed.map((a, idx) => {
              const Icon = a.icon
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${a.bg}`}
                  >
                    <Icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{a.text}</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground shrink-0">
                    {a.time}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
