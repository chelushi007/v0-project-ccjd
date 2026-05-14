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
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

const overview = [
  {
    label: "本月服务费收入",
    value: "¥ 928,400",
    sub: "+8.3% 环比",
    icon: Wallet,
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    label: "本年累计收入",
    value: "¥ 5,124,300",
    sub: "完成年度目标 64%",
    icon: PiggyBank,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "待确认收款",
    value: 12,
    sub: "金额 ¥312,500",
    icon: Clock,
    tone: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    label: "本月平均费率",
    value: "5.03%",
    sub: "目标 5.0%",
    icon: TrendingUp,
    tone: "text-indigo-700",
    bg: "bg-indigo-50",
  },
]

const bizColor: Record<string, string> = {
  仓储租赁: "bg-blue-50 text-blue-700 border-blue-200",
  物资存放: "bg-indigo-50 text-indigo-700 border-indigo-200",
  物资租赁: "bg-emerald-50 text-emerald-700 border-emerald-200",
  物资销售: "bg-amber-50 text-amber-700 border-amber-200",
}

const monthTrend = [
  { m: "1月", v: 482 },
  { m: "2月", v: 526 },
  { m: "3月", v: 612 },
  { m: "4月", v: 738 },
  { m: "5月", v: 856 },
  { m: "6月", v: 928 },
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

  const pendingCount = fees.filter((f) => f.status === "待确认").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            服务费收款管理
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            平台服务费 = 各业务交易金额 × 综合费率（仓储 5% / 存放 3% / 租赁 3% / 销售 3%）
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            导出收款明细
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">服务费收入趋势</CardTitle>
          <CardDescription className="text-xs">
            近 6 个月 · 单位：千元
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthTrend}>
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
              <Area
                type="monotone"
                dataKey="v"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#feeArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">全部收款</TabsTrigger>
          <TabsTrigger value="pending">
            待确认
            <Badge
              variant="outline"
              className="ml-2 h-4 text-[10px] bg-amber-50 text-amber-700 border-amber-200"
            >
              {pendingCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">服务费明细</CardTitle>
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
              {/* 业务类型 chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-muted-foreground mr-1">
                  业务类型：
                </span>
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
                  {filtered.map((f) => (
                    <TableRow key={f.id}>
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
                              <Button
                                size="sm"
                                className="h-7 px-2"
                              >
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
