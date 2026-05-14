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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sparkles,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  ArrowRight,
  Target,
  Layers,
  TrendingUp,
} from "lucide-react"

const overview = [
  {
    label: "本月新增需求",
    value: 138,
    sub: "环比 +18.4%",
    icon: ClipboardList,
    tone: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    label: "待审核",
    value: 12,
    sub: "其中加急 3",
    icon: Target,
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    label: "智能撮合成功",
    value: 86,
    sub: "撮合率 62.3%",
    icon: Sparkles,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "在线需求池",
    value: 246,
    sub: "覆盖四大业务",
    icon: Layers,
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

const demandList = [
  {
    id: "XQ-2026-0628-001",
    title: "佛山顺德 · 6,000㎡ 钢构件存放需求",
    biz: "物资存放",
    publisher: "中铁十一局广深城际项目部",
    amount: "¥ 56,000/月",
    status: "撮合中",
    matches: 4,
    publishDate: "2026-06-28",
  },
  {
    id: "XQ-2026-0628-002",
    title: "广州 · 万能杆件 800 套租赁 · 周期 3 个月",
    biz: "物资租赁",
    publisher: "中铁十四局集团广州分公司",
    amount: "¥ 168,000",
    status: "待审核",
    matches: 0,
    publishDate: "2026-06-28",
  },
  {
    id: "XQ-2026-0627-008",
    title: "深圳 · 盘扣式脚手架配件包 5,000 套销售",
    biz: "物资销售",
    publisher: "中铁建工集团第二建设有限公司",
    amount: "¥ 1,327,200",
    status: "已撮合",
    matches: 1,
    publishDate: "2026-06-27",
  },
  {
    id: "XQ-2026-0627-005",
    title: "东莞虎门 · 2,400㎡ 临时仓储租赁",
    biz: "仓储租赁",
    publisher: "中铁十六局集团华南分公司",
    amount: "¥ 84,000/月",
    status: "撮合中",
    matches: 6,
    publishDate: "2026-06-27",
  },
  {
    id: "XQ-2026-0626-012",
    title: "广州 · 扣件 50,000 个采购",
    biz: "物资销售",
    publisher: "中铁二十二局集团第一工程有限公司",
    amount: "¥ 900,000",
    status: "待审核",
    matches: 0,
    publishDate: "2026-06-26",
  },
  {
    id: "XQ-2026-0625-018",
    title: "中山 · 1,800㎡ 周转材料存放",
    biz: "物资存放",
    publisher: "中铁建中山项目部",
    amount: "¥ 18,000/月",
    status: "已撮合",
    matches: 1,
    publishDate: "2026-06-25",
  },
]

const statusColor: Record<string, string> = {
  撮合中: "bg-blue-50 text-blue-700 border-blue-200",
  待审核: "bg-amber-50 text-amber-700 border-amber-200",
  已撮合: "bg-emerald-50 text-emerald-700 border-emerald-200",
  已下架: "bg-slate-50 text-slate-700 border-slate-200",
}

const matchingExamples = [
  {
    demand: "佛山顺德 · 6,000㎡ 钢构件存放",
    publisher: "中铁十一局",
    candidates: [
      { name: "佛山顺德循环材料基地", area: "可用 2,592㎡", rate: 95 },
      { name: "广州黄埔仓储基地", area: "可用 1,000㎡", rate: 78 },
      { name: "中山火炬开发区基地", area: "可用 3,248㎡", rate: 86 },
    ],
  },
  {
    demand: "广州 · 万能杆件 800 套租赁",
    publisher: "中铁十四局",
    candidates: [
      { name: "广州黄埔仓储基地 · 库存 1,280 套", area: "现货", rate: 98 },
      { name: "东莞虎门基地 · 库存 860 套", area: "现货", rate: 92 },
    ],
  },
]

export function OperatorDemand() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">需求撮合中心</h1>
        <p className="text-sm text-muted-foreground mt-1">
          平台需求池审核 · 智能撮合推送 · 撮合转化监控
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

      <Tabs defaultValue="pool">
        <TabsList>
          <TabsTrigger value="pool">需求池</TabsTrigger>
          <TabsTrigger value="match">智能撮合</TabsTrigger>
        </TabsList>

        <TabsContent value="pool" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">在线需求列表</CardTitle>
              <CardDescription className="text-xs">
                平台累计在线 246 条需求 · 按发布时间倒序
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">需求编号</TableHead>
                    <TableHead>需求</TableHead>
                    <TableHead className="w-[110px]">业务类型</TableHead>
                    <TableHead>发布方</TableHead>
                    <TableHead className="w-[140px] text-right">金额</TableHead>
                    <TableHead className="w-[80px] text-center">候选</TableHead>
                    <TableHead className="w-[90px]">状态</TableHead>
                    <TableHead className="w-[140px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demandList.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {d.id}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {d.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${bizColor[d.biz]}`}
                        >
                          {d.biz}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {d.publisher}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {d.amount}
                      </TableCell>
                      <TableCell className="text-center">
                        {d.matches > 0 ? (
                          <Badge
                            variant="outline"
                            className="text-[11px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            {d.matches}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${statusColor[d.status]}`}
                        >
                          {d.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {d.status === "待审核" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-red-700 hover:text-red-800"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-emerald-700 hover:text-emerald-800"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                          {d.status === "撮合中" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-blue-700 hover:text-blue-800"
                            >
                              <Send className="w-3.5 h-3.5 mr-0.5" />
                              推送
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

        <TabsContent value="match" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                智能撮合引擎
              </CardTitle>
              <CardDescription className="text-xs">
                基于地理位置 / 库存匹配 / 信用评级 / 历史成交价 自动推荐候选方
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {matchingExamples.map((m) => (
                <div key={m.demand} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-[11px] h-5 bg-blue-50 text-blue-700 border-blue-200">
                      需求
                    </Badge>
                    <span className="font-medium">{m.demand}</span>
                    <span className="text-xs text-muted-foreground">
                      · 由 {m.publisher} 发布
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-2 border-l-2 border-amber-200">
                    {m.candidates.map((c) => (
                      <div
                        key={c.name}
                        className="border rounded-md p-3 bg-card hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            匹配度
                          </span>
                          <span
                            className={`text-sm font-semibold tabular-nums ${
                              c.rate >= 90
                                ? "text-emerald-700"
                                : c.rate >= 80
                                  ? "text-blue-700"
                                  : "text-amber-700"
                            }`}
                          >
                            {c.rate}%
                          </span>
                        </div>
                        <div className="text-sm font-medium truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {c.area}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 h-7 text-xs"
                        >
                          推送给业主
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-md border border-dashed bg-muted/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium">
                      本月撮合转化率 62.3%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      较上月 +5.8pp，平均匹配候选数 3.4 家
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  撮合策略配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
