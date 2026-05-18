"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Search,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  PiggyBank,
  Sparkles,
  Plus,
  BadgeCheck,
  Megaphone,
  Star,
  FileBarChart,
  ShieldCheck,
  Truck,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  Bar,
  Cell,
} from "recharts"

const overview = [
  {
    label: "本月交易服务费",
    value: "¥ 928,400",
    sub: "+8.3% 环比",
    icon: Wallet,
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    label: "本月增值服务",
    value: "¥ 186,800",
    sub: "占比 16.8% · +21% 环比",
    icon: Sparkles,
    tone: "text-violet-700",
    bg: "bg-violet-50",
  },
  {
    label: "本年累计收入",
    value: "¥ 6,432,500",
    sub: "完成年度目标 71%",
    icon: PiggyBank,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "待确认收款",
    value: 14,
    sub: "金额 ¥358,900",
    icon: Clock,
    tone: "text-blue-700",
    bg: "bg-blue-50",
  },
]

const bizColor: Record<string, string> = {
  仓储租赁: "bg-blue-50 text-blue-700 border-blue-200",
  物资存放: "bg-indigo-50 text-indigo-700 border-indigo-200",
  物资租赁: "bg-emerald-50 text-emerald-700 border-emerald-200",
  物资销售: "bg-amber-50 text-amber-700 border-amber-200",
  增值服务: "bg-violet-50 text-violet-700 border-violet-200",
}

// 趋势：交易服务费 vs 增值服务（千元）
const monthTrend = [
  { m: "1月", trade: 482, vas: 78 },
  { m: "2月", trade: 526, vas: 92 },
  { m: "3月", trade: 612, vas: 110 },
  { m: "4月", trade: 738, vas: 138 },
  { m: "5月", trade: 856, vas: 154 },
  { m: "6月", trade: 928, vas: 187 },
]

// 增值服务套餐分布（本月，元）
const vasMix = [
  { name: "企业认证", value: 38400, color: "#10b981", icon: BadgeCheck },
  { name: "信息推广", value: 52600, color: "#f59e0b", icon: Megaphone },
  { name: "置顶展示", value: 41200, color: "#3b82f6", icon: Star },
  { name: "数据/行情报告", value: 22800, color: "#6366f1", icon: FileBarChart },
  { name: "诚信白名单", value: 18600, color: "#0ea5e9", icon: ShieldCheck },
  { name: "代办/上门巡检", value: 13200, color: "#ef4444", icon: Truck },
]

const fees = [
  {
    id: "FS-2026-0628-001",
    orderId: "WZXS20260628015",
    biz: "物资销售",
    payer: "中铁建工集团第二建设有限公司",
    base: 3780000,
    rate: 3,
    amount: 113400,
    status: "待确认",
    createDate: "2026-06-28",
  },
  {
    id: "FS-2026-0628-002",
    orderId: "CCJY20260628012",
    biz: "仓储租赁",
    payer: "中铁建广州黄埔仓储基地",
    base: 156000,
    rate: 5,
    amount: 7800,
    status: "待确认",
    createDate: "2026-06-28",
  },
  {
    id: "FS-2026-0627-008",
    orderId: "WZJY20260627008",
    biz: "物资租赁",
    payer: "中铁建东莞虎门基地",
    base: 84000,
    rate: 3,
    amount: 2520,
    status: "已收款",
    createDate: "2026-06-27",
    payDate: "2026-06-28",
    voucher: "VC-202606281023",
  },
  {
    id: "FS-2026-0626-005",
    orderId: "WZCF20260626005",
    biz: "物资存放",
    payer: "中铁建东莞虎门基地",
    base: 45000,
    rate: 3,
    amount: 1350,
    status: "已收款",
    createDate: "2026-06-26",
    payDate: "2026-06-27",
    voucher: "VC-202606271588",
  },
  {
    id: "FS-2026-0625-012",
    orderId: "WZXS20260513001",
    biz: "物资销售",
    payer: "中铁十四局集团广州分公司",
    base: 3780000,
    rate: 3,
    amount: 113400,
    status: "已收款",
    createDate: "2026-05-26",
    payDate: "2026-05-27",
    voucher: "VC-202605270902",
  },
  {
    id: "FS-2026-0620-018",
    orderId: "CCJY20260418002",
    biz: "仓储租赁",
    payer: "中铁十六局集团华南分公司",
    base: 124000,
    rate: 5,
    amount: 6200,
    status: "已驳回",
    createDate: "2026-06-20",
    rejectReason: "费率约定为 4%，请按 ¥4,960 重新核算",
  },
]

// 增值服务订单
type VasMethod = "一次性" | "按月" | "按季" | "按年"
type VasOrder = {
  id: string
  payer: string
  service: keyof typeof vasIconMap
  plan: string
  method: VasMethod
  period: string
  amount: number
  status: "待确认" | "已收款" | "已驳回"
  createDate: string
  payDate?: string
  voucher?: string
  rejectReason?: string
}

const vasIconMap = {
  企业认证: BadgeCheck,
  信息推广: Megaphone,
  置顶展示: Star,
  "数据/行情报告": FileBarChart,
  诚信白名单: ShieldCheck,
  "代办/上门巡检": Truck,
}

const vasColor: Record<keyof typeof vasIconMap, string> = {
  企业认证: "bg-emerald-50 text-emerald-700 border-emerald-200",
  信息推广: "bg-amber-50 text-amber-700 border-amber-200",
  置顶展示: "bg-blue-50 text-blue-700 border-blue-200",
  "数据/行情报告": "bg-indigo-50 text-indigo-700 border-indigo-200",
  诚信白名单: "bg-sky-50 text-sky-700 border-sky-200",
  "代办/上门巡检": "bg-red-50 text-red-700 border-red-200",
}

const vasOrders: VasOrder[] = [
  {
    id: "VAS-2026-0628-001",
    payer: "中铁建工集团第二建设有限公司",
    service: "信息推广",
    plan: "尊享广告位 · 首页右栏",
    method: "按月",
    period: "2026-07-01 ~ 2026-07-31",
    amount: 28000,
    status: "待确认",
    createDate: "2026-06-28",
  },
  {
    id: "VAS-2026-0628-002",
    payer: "中铁十四局集团广州分公司",
    service: "置顶展示",
    plan: "标准置顶套餐 · 7 天",
    method: "一次性",
    period: "2026-06-29 ~ 2026-07-05",
    amount: 4800,
    status: "待确认",
    createDate: "2026-06-28",
  },
  {
    id: "VAS-2026-0627-009",
    payer: "中铁建广州黄埔仓储基地",
    service: "企业认证",
    plan: "金钻认证 · 年度续费",
    method: "按年",
    period: "2026-07 ~ 2027-06",
    amount: 36000,
    status: "已收款",
    createDate: "2026-06-27",
    payDate: "2026-06-28",
    voucher: "VC-VAS-202606281137",
  },
  {
    id: "VAS-2026-0626-014",
    payer: "中铁建华南投资有限公司",
    service: "数据/行情报告",
    plan: "全国仓储行情周报 · 季度订阅",
    method: "按季",
    period: "2026Q3",
    amount: 8800,
    status: "已收款",
    createDate: "2026-06-26",
    payDate: "2026-06-26",
    voucher: "VC-VAS-202606261822",
  },
  {
    id: "VAS-2026-0625-021",
    payer: "中铁十六局集团华南分公司",
    service: "诚信白名单",
    plan: "金牌诚信会员 · 年度",
    method: "按年",
    period: "2026-07 ~ 2027-06",
    amount: 18800,
    status: "已收款",
    createDate: "2026-06-25",
    payDate: "2026-06-26",
    voucher: "VC-VAS-202606260944",
  },
  {
    id: "VAS-2026-0620-008",
    payer: "中铁建东莞虎门基地",
    service: "代办/上门巡检",
    plan: "仓储巡检套餐 · 6 次/季",
    method: "按季",
    period: "2026Q3",
    amount: 6600,
    status: "已驳回",
    createDate: "2026-06-20",
    rejectReason: "套餐已升级为 8 次/季 ¥7,800，请重新下单",
  },
]

const statusColor: Record<string, string> = {
  待确认: "bg-amber-50 text-amber-700 border-amber-200",
  已收款: "bg-emerald-50 text-emerald-700 border-emerald-200",
  已驳回: "bg-red-50 text-red-700 border-red-200",
}

export function OperatorFee() {
  const [search, setSearch] = useState("")
  const [bizFilter, setBizFilter] = useState<string>("all")

  const filtered = fees.filter((f) => {
    const matchesSearch =
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.orderId.toLowerCase().includes(search.toLowerCase()) ||
      f.payer.toLowerCase().includes(search.toLowerCase())
    const matchesBiz = bizFilter === "all" || f.biz === bizFilter
    return matchesSearch && matchesBiz
  })

  const pendingTrade = fees.filter((f) => f.status === "待确认").length
  const pendingVas = vasOrders.filter((v) => v.status === "待确认").length
  const totalVasMonth = vasMix.reduce((s, x) => s + x.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">费用管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            包含两类收入：① 交易服务费（仓储 5% / 存放 3% / 租赁 3% / 销售 3%）；② 增值服务（认证、推广、置顶、行情报告、白名单、上门巡检等）
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            导出收款明细
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            创建增值服务订单
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overview.map((o) => {
          const Icon = o.icon
          return (
            <Card key={o.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${o.bg}`}
                >
                  <Icon className={`w-5 h-5 ${o.tone}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{o.label}</div>
                  <div className="text-xl font-semibold tabular-nums leading-tight">
                    {o.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {o.sub}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              收入趋势：交易服务费 vs 增值服务
            </CardTitle>
            <CardDescription className="text-xs">
              近 6 个月 · 单位：千元
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={monthTrend}>
                <defs>
                  <linearGradient id="feeArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="trade"
                  name="交易服务费"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#feeArea)"
                />
                <Line
                  type="monotone"
                  dataKey="vas"
                  name="增值服务"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#7c3aed" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              本月增值服务套餐分布
            </CardTitle>
            <CardDescription className="text-xs">
              合计 ¥ {totalVasMonth.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart
                data={vasMix}
                layout="vertical"
                margin={{ top: 4, right: 12, bottom: 4, left: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={96}
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => `¥ ${v.toLocaleString()}`}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {vasMix.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trade">
        <TabsList>
          <TabsTrigger value="trade">
            交易服务费
            <Badge
              variant="outline"
              className="ml-2 h-4 text-[10px] bg-amber-50 text-amber-700 border-amber-200"
            >
              {pendingTrade}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="vas">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            增值服务
            <Badge
              variant="outline"
              className="ml-2 h-4 text-[10px] bg-violet-50 text-violet-700 border-violet-200"
            >
              {pendingVas}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">待确认</TabsTrigger>
        </TabsList>

        {/* 交易服务费 */}
        <TabsContent value="trade" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">交易服务费明细</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索单号 / 订单号 / 付款方"
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-muted-foreground mr-1">业务类型：</span>
                {(["all", "仓储租赁", "物资存放", "物资租赁", "物资销售"] as const).map(
                  (b) => {
                    const active = bizFilter === b
                    return (
                      <button
                        key={b}
                        onClick={() => setBizFilter(b)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 text-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {b === "all" ? "全部" : b}
                      </button>
                    )
                  },
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">序号</TableHead>
                    <TableHead className="w-[170px]">服务费单号</TableHead>
                    <TableHead className="w-[160px]">关联订单</TableHead>
                    <TableHead className="w-[110px]">业务类型</TableHead>
                    <TableHead>付款方</TableHead>
                    <TableHead className="w-[140px] text-right">基数</TableHead>
                    <TableHead className="w-[70px] text-center">费率</TableHead>
                    <TableHead className="w-[130px] text-right">服务费</TableHead>
                    <TableHead className="w-[90px]">状态</TableHead>
                    <TableHead className="w-[110px]">建单日期</TableHead>
                    <TableHead className="w-[180px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((f, idx) => (
                    <TableRow key={f.id}>
                      <TableCell className="text-center text-xs tabular-nums text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{f.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {f.orderId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${bizColor[f.biz]}`}
                        >
                          {f.biz}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{f.payer}</TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        ¥ {f.base.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">
                        {f.rate}%
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm font-medium text-amber-700">
                        ¥ {f.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${statusColor[f.status]}`}
                        >
                          {f.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {f.createDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {f.status === "待确认" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-red-700 hover:text-red-800"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-0.5" />
                                驳回
                              </Button>
                              <Button size="sm" className="h-7 px-2">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                                确认收款
                              </Button>
                            </>
                          )}
                          {f.status === "已收款" && f.voucher && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-muted-foreground"
                            >
                              回单
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 增值服务 */}
        <TabsContent value="vas" className="mt-4 space-y-4">
          {/* 套餐导览 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                增值服务套餐
              </CardTitle>
              <CardDescription className="text-xs">
                平台标准化的非交易型服务，按"一次性 / 月 / 季 / 年"灵活计费
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {vasMix.map((p) => {
                  const Icon = p.icon
                  return (
                    <button
                      key={p.name}
                      className="rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all p-3 text-left flex flex-col gap-1.5 group"
                    >
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: p.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-medium leading-snug group-hover:text-primary">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground tabular-nums">
                        本月 ¥ {p.value.toLocaleString()}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 订单列表 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">增值服务订单</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="搜索单号 / 客户 / 套餐" className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">序号</TableHead>
                    <TableHead className="w-[180px]">服务订单号</TableHead>
                    <TableHead className="w-[140px]">服务类型</TableHead>
                    <TableHead>套餐 / 客户</TableHead>
                    <TableHead className="w-[90px]">计费方式</TableHead>
                    <TableHead className="w-[180px]">服务周期</TableHead>
                    <TableHead className="w-[130px] text-right">金额</TableHead>
                    <TableHead className="w-[90px]">状态</TableHead>
                    <TableHead className="w-[110px]">建单日期</TableHead>
                    <TableHead className="w-[180px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vasOrders.map((v, idx) => {
                    const Icon = vasIconMap[v.service]
                    return (
                      <TableRow key={v.id}>
                        <TableCell className="text-center text-xs tabular-nums text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{v.id}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] h-5 gap-1 ${vasColor[v.service]}`}
                          >
                            <Icon className="w-3 h-3" />
                            {v.service}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm leading-tight">{v.plan}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {v.payer}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{v.method}</TableCell>
                        <TableCell className="text-xs tabular-nums">
                          {v.period}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm font-medium text-violet-700">
                          ¥ {v.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] h-5 ${statusColor[v.status]}`}
                          >
                            {v.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs tabular-nums">
                          {v.createDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {v.status === "待确认" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-red-700 hover:text-red-800"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-0.5" />
                                  驳回
                                </Button>
                                <Button size="sm" className="h-7 px-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                                  确认收款
                                </Button>
                              </>
                            )}
                            {v.status === "已收款" && v.voucher && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-muted-foreground"
                              >
                                回单
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 待确认（合并交易+增值） */}
        <TabsContent value="pending" className="mt-4 space-y-3">
          {fees
            .filter((f) => f.status === "待确认")
            .map((f) => (
              <Card key={f.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${bizColor[f.biz]}`}
                        >
                          {f.biz}
                        </Badge>
                        <span className="font-medium">{f.payer}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {f.id}
                        </span>
                      </div>
                      <div className="text-sm mt-1.5 flex items-center gap-3 flex-wrap">
                        <span>
                          基数 ¥{f.base.toLocaleString()} × {f.rate}% ={" "}
                          <span className="font-semibold text-amber-700 tabular-nums">
                            ¥ {f.amount.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        关联订单 {f.orderId} · 建单 {f.createDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      详情
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-700 hover:text-red-800 border-red-200 bg-red-50/40"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      驳回
                    </Button>
                    <Button size="sm">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      确认收款
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {vasOrders
            .filter((v) => v.status === "待确认")
            .map((v) => {
              const Icon = vasIconMap[v.service]
              return (
                <Card key={v.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-violet-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[11px] h-5 gap-1 ${vasColor[v.service]}`}
                          >
                            <Icon className="w-3 h-3" />
                            {v.service}
                          </Badge>
                          <span className="font-medium">{v.payer}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {v.id}
                          </span>
                        </div>
                        <div className="text-sm mt-1.5">
                          {v.plan} ·{" "}
                          <span className="text-muted-foreground">{v.method}</span> ·{" "}
                          <span className="font-semibold text-violet-700 tabular-nums">
                            ¥ {v.amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          服务周期 {v.period} · 建单 {v.createDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        详情
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-700 hover:text-red-800 border-red-200 bg-red-50/40"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        驳回
                      </Button>
                      <Button size="sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        确认收款
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
