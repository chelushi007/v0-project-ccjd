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
import {
  Warehouse,
  ShoppingCart,
  Wallet,
  Clock,
  Package,
  ChevronRight,
  ClipboardList,
  FileText,
  Inbox,
  Bell,
  Mail,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Tags,
  PackageOpen,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  HandCoins,
} from "lucide-react"
import {
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

// ─────────────────────────── 申请审批快捷入口 ───────────────────────────
const approvalShortcuts = [
  {
    key: "warehouse",
    label: "仓储入驻审核",
    pending: 6,
    desc: "新基地入驻 · 资质核验",
    icon: Warehouse,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    key: "material",
    label: "物料目录审核",
    pending: 12,
    desc: "新 SKU 上架 / 信息变更",
    icon: Package,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  {
    key: "demand",
    label: "需求发布审核",
    pending: 18,
    desc: "覆盖五类需求挂牌申请",
    icon: ClipboardList,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    key: "contract",
    label: "合同合规审核",
    pending: 4,
    desc: "金额 ≥ 500 万元须复核",
    icon: FileText,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
]

// ─────────────────────────── 业务处理快捷入口 ───────────────────────────
const businessShortcuts = [
  {
    key: "service-fee",
    label: "服务费收款确认",
    badge: "12 笔",
    desc: "本月待确认 ¥312,500",
    icon: Wallet,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    key: "order-dispute",
    label: "订单争议处理",
    badge: "3 单",
    desc: "用户单位申请仲裁",
    icon: HandCoins,
    color: "text-red-700",
    bg: "bg-red-50",
  },
  {
    key: "force-down",
    label: "信息强制下架",
    badge: "2 项",
    desc: "违规需求 / 异常报价",
    icon: XCircle,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  {
    key: "match",
    label: "需求撮合调度",
    badge: "8 单",
    desc: "智能推荐 · 等待派发",
    icon: TrendingUp,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    key: "template",
    label: "模板版本维护",
    badge: "1 草稿",
    desc: "物资销售模板待发布",
    icon: FileText,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  {
    key: "reconcile",
    label: "对账复核",
    badge: "9 张",
    desc: "超 48 小时待回执",
    icon: CircleDollarSign,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
]

// ─────────────────────────── 待办列表 ───────────────────────────
const todos = [
  {
    id: 1,
    title: "新基地入驻审核",
    desc: "中铁十六局 · 番禺南沙临港基地（5,200 ㎡）",
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

const levelChip: Record<string, string> = {
  urgent: "bg-red-50 text-red-700 border-red-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  mid: "bg-blue-50 text-blue-700 border-blue-200",
}

// ─────────────────────────── 站内信 ───────────────────────────
const messages = [
  {
    id: "M-2026-0628-018",
    type: "系统通知",
    title: "平台 V2.6 版本上线说明",
    desc: "本次版本新增服务费分账可视化、合同 OCR 自动识别等 6 项功能",
    time: "08:00",
    unread: true,
    tone: "system",
  },
  {
    id: "M-2026-0628-014",
    type: "审核提醒",
    title: "中铁十四局-销售订单审核完成",
    desc: "WZXS20260513001 已通过审核，合同流程已自动发起",
    time: "昨天 18:24",
    unread: true,
    tone: "approval",
  },
  {
    id: "M-2026-0628-011",
    type: "用户反馈",
    title: "用户单位 中铁建二十五局 提交工单",
    desc: "申请补发 5 月对账差额，附件 1 份，已转结算组",
    time: "昨天 15:02",
    unread: false,
    tone: "feedback",
  },
  {
    id: "M-2026-0628-008",
    type: "风险预警",
    title: "广州黄埔基地容量持续超 90%",
    desc: "已连续 7 天处于高位，建议尽快调度分流",
    time: "06-27 11:18",
    unread: false,
    tone: "alert",
  },
]

const msgToneMap: Record<
  string,
  { icon: typeof Bell; iconColor: string; bg: string; badge: string }
> = {
  system: {
    icon: Bell,
    iconColor: "text-blue-700",
    bg: "bg-blue-50",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  approval: {
    icon: CheckCircle2,
    iconColor: "text-emerald-700",
    bg: "bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  feedback: {
    icon: Mail,
    iconColor: "text-indigo-700",
    bg: "bg-indigo-50",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  alert: {
    icon: Bell,
    iconColor: "text-amber-700",
    bg: "bg-amber-50",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
}

// ─────────────────────────── 交易统计 ───────────────────────────
const txKpi = [
  {
    label: "本月平台 GMV",
    value: "¥ 1,846.0 万",
    delta: "+12.6%",
    up: true,
    icon: TrendingUp,
    accent: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    label: "本月服务费收入",
    value: "¥ 92.84 万",
    delta: "+8.3%",
    up: true,
    icon: Wallet,
    accent: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    label: "本月新增订单",
    value: "342",
    delta: "-3.1%",
    up: false,
    icon: ShoppingCart,
    accent: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    label: "争议 / 退款单",
    value: "3 / 1",
    delta: "持平",
    up: true,
    icon: XCircle,
    accent: "bg-red-50 text-red-700 border-red-200",
  },
]

const revenueTrend = [
  { month: "1月", 仓储租赁: 142, 物资存放: 56, 物资租赁: 88, 物资销售: 124 },
  { month: "2月", 仓储租赁: 156, 物资存放: 62, 物资租赁: 96, 物资销售: 140 },
  { month: "3月", 仓储租赁: 168, 物资存放: 70, 物资租赁: 105, 物资销售: 162 },
  { month: "4月", 仓储租赁: 182, 物资存放: 76, 物资租赁: 112, 物资销售: 188 },
  { month: "5月", 仓储租赁: 196, 物资存放: 82, 物资租赁: 124, 物资销售: 218 },
  { month: "6月", 仓储租赁: 212, 物资存放: 88, 物资租赁: 138, 物资销售: 246 },
]

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

const txBreakdown = [
  { label: "仓储租赁", orders: 86, gmv: "¥ 482.4 万", icon: Warehouse, tone: "text-blue-700", bg: "bg-blue-50" },
  { label: "物资存放", orders: 42, gmv: "¥ 88.6 万", icon: PackageOpen, tone: "text-indigo-700", bg: "bg-indigo-50" },
  { label: "物资租赁", orders: 124, gmv: "¥ 528.2 万", icon: Package, tone: "text-emerald-700", bg: "bg-emerald-50" },
  { label: "物资销售", orders: 90, gmv: "¥ 746.8 万", icon: Tags, tone: "text-amber-700", bg: "bg-amber-50" },
]

export function OperatorDashboard() {
  const totalApprovals = approvalShortcuts.reduce((s, a) => s + a.pending, 0)
  const unreadMsg = messages.filter((m) => m.unread).length

  return (
    <div className="space-y-6">
      {/* 顶部欢迎 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">我的工作台</h1>
          <p className="text-sm text-muted-foreground mt-1">
            运营全景视图 · 数据更新时间 2026-06-28 09:32
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Inbox className="w-4 h-4 mr-1" />
            消息中心
            {unreadMsg > 0 && (
              <Badge className="ml-1.5 h-4 px-1.5 bg-red-500 text-white border-0 text-[10px]">
                {unreadMsg}
              </Badge>
            )}
          </Button>
          <Button size="sm">
            可视化大屏
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* 1. 申请审批快捷入口 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              申请审批快捷入口
              {totalApprovals > 0 && (
                <Badge className="bg-red-500 hover:bg-red-500 text-white border-0 h-5 px-1.5 text-[11px]">
                  {totalApprovals}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              按业务模块聚合 · 点击进入审核列表
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            全部待审 <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {approvalShortcuts.map((a) => {
              const Icon = a.icon
              return (
                <button
                  key={a.key}
                  className="group relative text-left p-4 rounded-lg border bg-card hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${a.color}`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    {a.pending > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-medium tabular-nums">
                        {a.pending}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className={`w-1 h-1 rounded-full ${a.dot}`} />
                      {a.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 absolute bottom-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. 业务处理快捷入口 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <HandCoins className="w-4 h-4 text-amber-600" />
              业务处理快捷入口
            </CardTitle>
            <CardDescription className="text-xs">
              覆盖运营高频操作 · 一键跳转处理
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {businessShortcuts.map((b) => {
              const Icon = b.icon
              return (
                <button
                  key={b.key}
                  className="group p-3 rounded-lg border bg-card hover:border-amber-300 hover:shadow-sm transition-all text-left"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${b.bg}`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${b.color}`} />
                  </div>
                  <div className="mt-2.5 text-sm font-medium leading-tight">
                    {b.label}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-muted-foreground truncate">
                      {b.desc}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1.5 shrink-0 ml-1"
                    >
                      {b.badge}
                    </Badge>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3 & 4. 待办列表 + 站内信 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* 待办列表 */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                待办列表
                <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                  {todos.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                按时效与优先级排序
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              查看全部
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {todos.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-3 p-2.5 rounded-md border bg-card hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {t.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] h-4 px-1.5 ${levelChip[t.level]}`}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs shrink-0 self-center"
                >
                  处理
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 站内信 */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                站内信
                {unreadMsg > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-500 text-white border-0 h-4 px-1.5 text-[10px]">
                    {unreadMsg} 未读
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                系统通知 / 审核提醒 / 用户反馈
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              全部已读
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {messages.map((m) => {
              const tone = msgToneMap[m.tone]
              const Icon = tone.icon
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 p-2.5 rounded-md border transition-colors cursor-pointer ${
                    m.unread
                      ? "bg-card hover:bg-muted/40"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${tone.bg}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${tone.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4 px-1.5 ${tone.badge}`}
                      >
                        {m.type}
                      </Badge>
                      <span
                        className={`text-sm truncate ${
                          m.unread ? "font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {m.title}
                      </span>
                      {m.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {m.desc}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                      {m.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* 5. 交易统计 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              交易统计
            </CardTitle>
            <CardDescription className="text-xs">
              本月平台流水概览 · 含 GMV、服务费、订单与争议
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px]">
              2026 年 6 月
            </Badge>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              统计分析 <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* KPI 行 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {txKpi.map((k) => {
              const Icon = k.icon
              return (
                <div
                  key={k.label}
                  className="p-4 rounded-lg border bg-card flex items-start gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border ${k.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-semibold tabular-nums">
                        {k.value}
                      </span>
                      <Badge
                        variant="outline"
                        className={`gap-0.5 text-[10px] h-4 px-1 ${
                          k.up
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {k.up ? (
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        ) : (
                          <ArrowDownRight className="w-2.5 h-2.5" />
                        )}
                        {k.delta}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {k.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 图表区 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* 服务费收入趋势 */}
            <div className="xl:col-span-2 p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium">服务费收入趋势</div>
                  <div className="text-[11px] text-muted-foreground">
                    按四大业务线拆分 · 单位：千元
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  近 6 个月
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueTrend} barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="仓储租赁" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="物资存放" stackId="a" fill="#6366f1" />
                  <Bar dataKey="物资租赁" stackId="a" fill="#10b981" />
                  <Bar
                    dataKey="物资销售"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* GMV 日趋势 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium">GMV 日趋势</div>
                  <div className="text-[11px] text-muted-foreground">
                    近 30 天 · 单位：万元
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={gmvTrend}>
                  <defs>
                    <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                  />
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
            </div>
          </div>

          {/* 业务线拆分 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {txBreakdown.map((b) => {
              const Icon = b.icon
              return (
                <div
                  key={b.label}
                  className="p-3 rounded-lg border bg-card flex items-center gap-3"
                >
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center ${b.bg}`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${b.tone}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">
                      {b.label}
                    </div>
                    <div className="text-base font-semibold tabular-nums leading-tight">
                      {b.gmv}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      订单 {b.orders} 单
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 底部留白占位 */}
      <div className="h-2" />
    </div>
  )
}
