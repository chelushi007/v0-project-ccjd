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
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  Pause,
  Play,
  Warehouse,
  Activity,
  AlertTriangle,
} from "lucide-react"

const overview = [
  {
    label: "在管基地",
    value: 28,
    sub: "正常营业 26",
    icon: Warehouse,
    tone: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    label: "总建筑面积",
    value: "186,400㎡",
    sub: "可用 168,200㎡",
    icon: Building2,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "平均利用率",
    value: "72%",
    sub: "较上月 +4.2pp",
    icon: Activity,
    tone: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  {
    label: "待审入驻",
    value: 5,
    sub: "其中 2 项加急",
    icon: AlertTriangle,
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
]

const sites = [
  {
    id: "WH-001",
    name: "中铁建广州黄埔仓储基地",
    operator: "中铁建物料华南专业运营有限公司",
    region: "广东 · 广州",
    area: 12500,
    used: 11500,
    status: "营业中",
    rating: 4.8,
    contracts: 36,
  },
  {
    id: "WH-002",
    name: "中铁建东莞虎门港务仓储基地",
    operator: "中铁建物料华南专业运营有限公司",
    region: "广东 · 东莞",
    area: 18200,
    used: 15650,
    status: "营业中",
    rating: 4.7,
    contracts: 48,
  },
  {
    id: "WH-003",
    name: "深圳前海综合物流基地",
    operator: "深圳前海物流运营有限公司",
    region: "广东 · 深圳",
    area: 9800,
    used: 7644,
    status: "营业中",
    rating: 4.6,
    contracts: 28,
  },
  {
    id: "WH-004",
    name: "佛山顺德循环材料基地",
    operator: "中铁十二局物料分公司",
    region: "广东 · 佛山",
    area: 7200,
    used: 4608,
    status: "营业中",
    rating: 4.5,
    contracts: 19,
  },
  {
    id: "WH-005",
    name: "中山火炬开发区周转基地",
    operator: "中铁建中山运营有限公司",
    region: "广东 · 中山",
    area: 5600,
    used: 2352,
    status: "营业中",
    rating: 4.3,
    contracts: 11,
  },
  {
    id: "WH-006",
    name: "珠海高栏港临时仓储点",
    operator: "中铁十六局南方分公司",
    region: "广东 · 珠海",
    area: 3200,
    used: 0,
    status: "已暂停",
    rating: 3.9,
    contracts: 0,
  },
]

const pendingSites = [
  {
    id: "WHA-2026-008",
    name: "中铁十六局 · 番禺南沙临港基地",
    operator: "中铁十六局集团华南分公司",
    region: "广东 · 广州 · 南沙",
    area: 5200,
    submitDate: "2026-06-27",
    urgency: "加急",
  },
  {
    id: "WHA-2026-009",
    name: "中铁二十二局 · 惠州大亚湾基地",
    operator: "中铁二十二局集团第一工程有限公司",
    region: "广东 · 惠州",
    area: 4800,
    submitDate: "2026-06-26",
    urgency: "常规",
  },
  {
    id: "WHA-2026-010",
    name: "中铁十一局 · 江门台山基地",
    operator: "中铁十一局集团有限公司",
    region: "广东 · 江门",
    area: 3600,
    submitDate: "2026-06-25",
    urgency: "加急",
  },
  {
    id: "WHA-2026-011",
    name: "中铁建 · 肇庆鼎湖基地",
    operator: "中铁建物料华南专业运营有限公司",
    region: "广东 · 肇庆",
    area: 6400,
    submitDate: "2026-06-24",
    urgency: "常规",
  },
  {
    id: "WHA-2026-012",
    name: "中铁建 · 汕头潮南基地",
    operator: "中铁建物料华南专业运营有限公司",
    region: "广东 · 汕头",
    area: 2800,
    submitDate: "2026-06-22",
    urgency: "常规",
  },
]

const statusChip: Record<string, string> = {
  营业中: "bg-emerald-50 text-emerald-700 border-emerald-200",
  已暂停: "bg-amber-50 text-amber-700 border-amber-200",
  已封禁: "bg-red-50 text-red-700 border-red-200",
}

export function OperatorWarehouse() {
  const [search, setSearch] = useState("")
  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.operator.toLowerCase().includes(search.toLowerCase()) ||
      s.region.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">仓储基地监管</h1>
        <p className="text-sm text-muted-foreground mt-1">
          全平台基地入驻审核 · 容量监控 · 运营状态管理
        </p>
      </div>

      {/* 概览卡 */}
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

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">基地列表</TabsTrigger>
          <TabsTrigger value="pending">
            入驻审核
            <Badge variant="outline" className="ml-2 h-4 text-[10px] bg-amber-50 text-amber-700 border-amber-200">
              {pendingSites.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="map">地理分布</TabsTrigger>
        </TabsList>

        {/* 基地列表 */}
        <TabsContent value="list" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">在管基地</CardTitle>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索基地名称 / 运营方 / 地区"
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
                    <TableHead>基地名称</TableHead>
                    <TableHead>运营方</TableHead>
                    <TableHead className="w-[120px]">所在地</TableHead>
                    <TableHead className="w-[160px]">容量利用率</TableHead>
                    <TableHead className="w-[80px] text-center">活跃合同</TableHead>
                    <TableHead className="w-[80px] text-center">评分</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[140px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => {
                    const rate = Math.round((s.used / s.area) * 100)
                    const rateTone =
                      rate >= 90
                        ? "bg-amber-500"
                        : rate >= 60
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">
                          {s.id}
                        </TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {s.operator}
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {s.region}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${rateTone}`}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums w-9 text-right">
                              {rate}%
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">
                            {s.used.toLocaleString()} / {s.area.toLocaleString()}㎡
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm tabular-nums">
                          {s.contracts}
                        </TableCell>
                        <TableCell className="text-center text-sm tabular-nums">
                          {s.rating}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] h-5 ${statusChip[s.status]}`}
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Eye className="w-3.5 h-3.5 mr-0.5" />
                              详情
                            </Button>
                            {s.status === "营业中" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-amber-700 hover:text-amber-800"
                              >
                                <Pause className="w-3.5 h-3.5 mr-0.5" />
                                暂停
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-emerald-700 hover:text-emerald-800"
                              >
                                <Play className="w-3.5 h-3.5 mr-0.5" />
                                恢复
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

        {/* 审核 */}
        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingSites.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{p.name}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {p.id}
                      </span>
                      {p.urgency === "加急" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 bg-red-50 text-red-700 border-red-200"
                        >
                          加急
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {p.operator}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {p.region}
                      </span>
                      <span>建筑面积 {p.area.toLocaleString()}㎡</span>
                      <span>提交于 {p.submitDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    查看资料
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
                    审核通过
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* 地理分布占位 */}
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基地地理分布</CardTitle>
              <CardDescription className="text-xs">
                华南区域 28 个基地分布概览
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/8] bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    地图视图 · 集成第三方地图组件
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    支持热力图 / 聚合点 / 实时利用率展示
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
