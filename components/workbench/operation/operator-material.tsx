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
  Package,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Edit3,
  Eye,
  Boxes,
} from "lucide-react"

const overview = [
  {
    label: "在管 SKU",
    value: "1,284",
    sub: "覆盖 18 个品类",
    icon: Package,
    tone: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    label: "全平台库存",
    value: "528,460",
    sub: "件/套（实物）",
    icon: Boxes,
    tone: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  {
    label: "本月新增 SKU",
    value: 36,
    sub: "待平台审核 8",
    icon: TrendingUp,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "价格异常",
    value: 4,
    sub: "偏离均价 ≥ 30%",
    icon: TrendingDown,
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
]

const categoryColor: Record<string, string> = {
  钢构件: "bg-blue-50 text-blue-700 border-blue-200",
  扣件: "bg-indigo-50 text-indigo-700 border-indigo-200",
  脚手架: "bg-emerald-50 text-emerald-700 border-emerald-200",
  盾构配件: "bg-amber-50 text-amber-700 border-amber-200",
  周转材料: "bg-sky-50 text-sky-700 border-sky-200",
}

const skus = [
  {
    id: "SKU-001",
    name: "万能杆件 3m",
    category: "钢构件",
    spec: "3000×100×80mm",
    stock: 12480,
    sites: 6,
    avgRent: 28,
    avgSale: 1280,
    trend: "+5.2%",
    trendUp: true,
    status: "正常",
  },
  {
    id: "SKU-002",
    name: "盘扣式立杆",
    category: "脚手架",
    spec: "Q235 · 6m",
    stock: 86420,
    sites: 12,
    avgRent: 0.42,
    avgSale: 86,
    trend: "+2.8%",
    trendUp: true,
    status: "正常",
  },
  {
    id: "SKU-003",
    name: "钢管扣件",
    category: "扣件",
    spec: "可锻铸铁 · 48",
    stock: 248600,
    sites: 18,
    avgRent: 0.08,
    avgSale: 18,
    trend: "-1.5%",
    trendUp: false,
    status: "正常",
  },
  {
    id: "SKU-004",
    name: "盾构管片",
    category: "盾构配件",
    spec: "6m 直径 · 标准段",
    stock: 1280,
    sites: 4,
    avgRent: 580,
    avgSale: 28000,
    trend: "+8.6%",
    trendUp: true,
    status: "价格异常",
  },
  {
    id: "SKU-005",
    name: "贝雷片",
    category: "周转材料",
    spec: "标准 3m",
    stock: 3680,
    sites: 8,
    avgRent: 18,
    avgSale: 860,
    trend: "+1.2%",
    trendUp: true,
    status: "正常",
  },
]

const pendingSkus = [
  {
    id: "SKUA-2026-018",
    name: "盘扣式脚手架配件包",
    category: "脚手架",
    operator: "中铁建工集团第二建设有限公司",
    proposedRent: 1.2,
    submitDate: "2026-06-27",
  },
  {
    id: "SKUA-2026-019",
    name: "高强度螺栓套装 M30",
    category: "扣件",
    operator: "中铁十四局集团广州分公司",
    proposedRent: 0.15,
    submitDate: "2026-06-26",
  },
  {
    id: "SKUA-2026-020",
    name: "矩形管 200×100",
    category: "钢构件",
    operator: "中铁十二局物料分公司",
    proposedRent: 12,
    submitDate: "2026-06-25",
  },
]

export function OperatorMaterial() {
  const [search, setSearch] = useState("")
  const filtered = skus.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">物料目录管理</h1>
        <p className="text-sm text-muted-foreground mt-1">
          全平台物料 SKU 标准化 · 价格指导 · 品类审核
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

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">SKU 目录</TabsTrigger>
          <TabsTrigger value="pending">
            待审核
            <Badge
              variant="outline"
              className="ml-2 h-4 text-[10px] bg-amber-50 text-amber-700 border-amber-200"
            >
              {pendingSkus.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="price">价格指导</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">在管 SKU 列表</CardTitle>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索物料名称 / 编号 / 品类"
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
                    <TableHead className="w-[80px]">编号</TableHead>
                    <TableHead>物料名称</TableHead>
                    <TableHead className="w-[100px]">品类</TableHead>
                    <TableHead className="w-[140px]">规格</TableHead>
                    <TableHead className="w-[110px] text-right">平台库存</TableHead>
                    <TableHead className="w-[70px] text-center">基地数</TableHead>
                    <TableHead className="w-[110px] text-right">参考租金/日</TableHead>
                    <TableHead className="w-[110px] text-right">参考售价</TableHead>
                    <TableHead className="w-[90px]">价格趋势</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${categoryColor[s.category] ?? ""}`}
                        >
                          {s.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {s.spec}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {s.stock.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">
                        {s.sites}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        ¥{s.avgRent}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        ¥{s.avgSale}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs tabular-nums ${
                            s.trendUp ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {s.trendUp ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {s.trend}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${
                            s.status === "正常"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {pendingSkus.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{p.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4 ${categoryColor[p.category] ?? ""}`}
                      >
                        {p.category}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {p.id}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      申请方：{p.operator}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>建议日租金 ¥{p.proposedRent}</span>
                      <span>提交于 {p.submitDate}</span>
                    </div>
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
                    通过
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="price" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">价格异常监控</CardTitle>
              <CardDescription className="text-xs">
                系统对偏离平台均价 ≥ 30% 的报价自动标记，运营方可介入指导
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    sku: "万能杆件 3m",
                    operator: "中铁十二局物料分公司",
                    price: "¥38/日",
                    avg: "¥28/日",
                    deviation: "+35.7%",
                  },
                  {
                    sku: "盾构管片",
                    operator: "中铁建广州黄埔基地",
                    price: "¥420/日",
                    avg: "¥580/日",
                    deviation: "-27.6%",
                  },
                ].map((row) => (
                  <div
                    key={row.sku + row.operator}
                    className="flex items-center justify-between p-3 rounded-md border bg-amber-50/30"
                  >
                    <div>
                      <div className="font-medium text-sm">{row.sku}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.operator}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-xs">
                      <div>
                        <div className="text-muted-foreground">报价</div>
                        <div className="font-medium">{row.price}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">均价</div>
                        <div className="font-medium">{row.avg}</div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        偏离 {row.deviation}
                      </Badge>
                      <Button size="sm" variant="outline">
                        干预
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
