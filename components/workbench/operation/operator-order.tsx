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
  ShoppingCart,
  AlertOctagon,
  Eye,
  Activity,
  Wallet,
  ChevronRight,
} from "lucide-react"

const overview = [
  {
    label: "本月新增订单",
    value: 342,
    sub: "GMV ¥18.46M",
    icon: ShoppingCart,
    tone: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    label: "进行中",
    value: 417,
    sub: "覆盖四大业务",
    icon: Activity,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "争议订单",
    value: 3,
    sub: "需运营介入",
    icon: AlertOctagon,
    tone: "text-red-700",
    bg: "bg-red-50",
  },
  {
    label: "本月平台交易额",
    value: "¥18.46M",
    sub: "服务费 ¥928K",
    icon: Wallet,
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
]

const bizColor: Record<string, string> = {
  仓储租赁: "bg-blue-50 text-blue-700 border-blue-200",
  物资存放: "bg-indigo-50 text-indigo-700 border-indigo-200",
  物资租赁: "bg-emerald-50 text-emerald-700 border-emerald-200",
  物资销售: "bg-amber-50 text-amber-700 border-amber-200",
}

const orders = [
  {
    id: "CCJY20260628012",
    biz: "仓储租赁",
    buyer: "中铁十六局集团华南分公司",
    seller: "中铁建广州黄埔仓储基地",
    amount: 156000,
    fee: 7800,
    status: "履约中",
    createDate: "2026-06-28",
  },
  {
    id: "WZXS20260628015",
    biz: "物资销售",
    buyer: "中铁十四局集团广州分公司",
    seller: "中铁建工集团第二建设有限公司",
    amount: 3780000,
    fee: 113400,
    status: "待付款",
    createDate: "2026-06-28",
  },
  {
    id: "WZJY20260627008",
    biz: "物资租赁",
    buyer: "中铁十二局物料分公司",
    seller: "中铁建东莞虎门基地",
    amount: 84000,
    fee: 2520,
    status: "履约中",
    createDate: "2026-06-27",
  },
  {
    id: "CCJY20260428005",
    biz: "仓储租赁",
    buyer: "中铁十一局广深城际项目部",
    seller: "中铁建东莞虎门基地",
    amount: 98000,
    fee: 4900,
    status: "争议",
    createDate: "2026-04-28",
  },
  {
    id: "WZCF20260420005",
    biz: "物资存放",
    buyer: "中铁十一局广深城际项目部",
    seller: "中铁建东莞虎门基地",
    amount: 45000,
    fee: 1350,
    status: "履约中",
    createDate: "2026-04-20",
  },
  {
    id: "WZXS20260513001",
    biz: "物资销售",
    buyer: "中铁十四局集团广州分公司",
    seller: "中铁建工集团第二建设有限公司",
    amount: 3780000,
    fee: 113400,
    status: "已完成",
    createDate: "2026-05-13",
  },
]

const statusColor: Record<string, string> = {
  履约中: "bg-blue-50 text-blue-700 border-blue-200",
  待付款: "bg-amber-50 text-amber-700 border-amber-200",
  已完成: "bg-emerald-50 text-emerald-700 border-emerald-200",
  争议: "bg-red-50 text-red-700 border-red-200",
}

const disputes = [
  {
    id: "CCJY20260428005",
    title: "仓库电力中断导致物料入库延迟",
    plaintiff: "中铁十五局集团 · 项目部",
    defendant: "中铁建广州黄埔仓储基地",
    amount: 64000,
    raisedDate: "2026-06-25",
    raisedTime: "1 天前",
    severity: "high",
    summary:
      "买方主张 3 月 15-22 日电力中断期间应按 70% 计费，要求调减 ¥19,200。",
  },
  {
    id: "WZXS20260420005",
    title: "销售分成比例争议",
    plaintiff: "中铁二十二局 · 财务部",
    defendant: "平台销售运营组",
    amount: 202500,
    raisedDate: "2026-06-26",
    raisedTime: "2 天前",
    severity: "mid",
    summary:
      "合同签订时约定 25:75，对账采用 30:70，买方申请按原约定核算。",
  },
  {
    id: "YYFC20260301002",
    title: "物料运营分成核算重复计算",
    plaintiff: "中铁建东莞虎门基地",
    defendant: "中铁十二局物料分公司",
    amount: 85000,
    raisedDate: "2026-06-22",
    raisedTime: "6 天前",
    severity: "mid",
    summary: "对账包含 2 月已结算 ¥3,000，存在重复，需重新对账。",
  },
]

export function OperatorOrder() {
  const [search, setSearch] = useState("")
  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.seller.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">订单监管中心</h1>
        <p className="text-sm text-muted-foreground mt-1">
          全平台订单流转监控 · 争议处理 · 服务费跟踪
        </p>
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

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">全平台订单</TabsTrigger>
          <TabsTrigger value="dispute">
            争议处理
            <Badge
              variant="outline"
              className="ml-2 h-4 text-[10px] bg-red-50 text-red-700 border-red-200"
            >
              {disputes.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">订单流水</CardTitle>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索订单号 / 买方 / 卖方"
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[170px]">订单号</TableHead>
                    <TableHead className="w-[110px]">业务类型</TableHead>
                    <TableHead>买方</TableHead>
                    <TableHead>卖方/承租方</TableHead>
                    <TableHead className="w-[140px] text-right">订单金额</TableHead>
                    <TableHead className="w-[120px] text-right">平台服务费</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[110px]">建单日期</TableHead>
                    <TableHead className="w-[80px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${bizColor[o.biz]}`}
                        >
                          {o.biz}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{o.buyer}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {o.seller}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm font-medium">
                        ¥ {o.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm text-amber-700">
                        ¥ {o.fee.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${statusColor[o.status]}`}
                        >
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {o.createDate}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispute" className="space-y-3 mt-4">
          {disputes.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      d.severity === "high"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{d.title}</span>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] h-4"
                      >
                        {d.id}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4 ${
                          d.severity === "high"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {d.severity === "high" ? "高优先级" : "中优先级"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {d.summary}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span>申诉方：{d.plaintiff}</span>
                      <span>被申诉方：{d.defendant}</span>
                      <span>涉及金额 ¥{d.amount.toLocaleString()}</span>
                      <span>{d.raisedTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      查看证据
                    </Button>
                    <Button size="sm">
                      处理仲裁
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
