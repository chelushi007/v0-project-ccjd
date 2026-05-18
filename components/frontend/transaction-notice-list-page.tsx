"use client"

import { useMemo, useState } from "react"
import {
  ChevronRight,
  Home,
  Bell,
  Search,
  Calendar,
  Filter,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface TransactionNoticeListPageProps {
  onNavigate?: (page: string) => void
}

type DealType = "all" | "warehouse" | "materialRent" | "materialSale"

interface DealRecord {
  id: number
  name: string
  type: Exclude<DealType, "all">
  partyA: string
  partyB: string
  amount: string
  amountValue: number // 万元，用于排序
  region: string
  date: string
}

const tabs: { key: DealType; label: string; partyALabel: string; partyBLabel: string }[] = [
  { key: "all", label: "全部公告", partyALabel: "甲方", partyBLabel: "乙方" },
  { key: "warehouse", label: "仓储交易", partyALabel: "出租单位", partyBLabel: "承租单位" },
  { key: "materialRent", label: "物资出租", partyALabel: "出租单位", partyBLabel: "承租单位" },
  { key: "materialSale", label: "物资出售", partyALabel: "出售单位", partyBLabel: "采购单位" },
]

const records: DealRecord[] = [
  // 仓储交易
  {
    id: 101,
    name: "中铁建广州南沙仓储基地租赁项目",
    type: "warehouse",
    partyA: "中铁建物资华南仓储有限公司",
    partyB: "中铁十一局广深城际项目部",
    amount: "360万元",
    amountValue: 360,
    region: "广东",
    date: "2026-02-28",
  },
  {
    id: 102,
    name: "中铁建深圳前海智慧仓储租赁项目",
    type: "warehouse",
    partyA: "中铁建物资华南专业运营有限公司",
    partyB: "中铁十四局深圳地铁13号线项目部",
    amount: "280万元",
    amountValue: 280,
    region: "广东",
    date: "2026-02-27",
  },
  {
    id: 103,
    name: "中铁建东莞虎门港堆场租赁项目",
    type: "warehouse",
    partyA: "中铁十四局集团广州分公司",
    partyB: "中铁二十二局莞惠城际项目部",
    amount: "150万元",
    amountValue: 150,
    region: "广东",
    date: "2026-02-26",
  },
  {
    id: 104,
    name: "中铁十六局佛山顺德钢构仓储租赁项目",
    type: "warehouse",
    partyA: "中铁十六局集团华南分公司",
    partyB: "中铁二十局广佛环线项目部",
    amount: "180万元",
    amountValue: 180,
    region: "广东",
    date: "2026-02-25",
  },
  {
    id: 105,
    name: "中铁二十二局惠州大亚湾恒温仓租赁项目",
    type: "warehouse",
    partyA: "中铁二十二局集团华南分公司",
    partyB: "中铁十八局深惠城际项目部",
    amount: "220万元",
    amountValue: 220,
    region: "广东",
    date: "2026-02-24",
  },
  {
    id: 106,
    name: "中铁二十四局中山火炬仓储基地租赁项目",
    type: "warehouse",
    partyA: "中铁二十四局集团华南分公司",
    partyB: "中铁二十五局深中通道项目部",
    amount: "95万元",
    amountValue: 95,
    region: "广东",
    date: "2026-02-23",
  },
  {
    id: 107,
    name: "中铁建上海浦东综合仓储基地租赁项目",
    type: "warehouse",
    partyA: "中铁建物资华东运营有限公司",
    partyB: "中铁建华东区域指挥部",
    amount: "520万元",
    amountValue: 520,
    region: "上海",
    date: "2026-02-22",
  },
  {
    id: 108,
    name: "中铁建北京丰台站综合仓储租赁项目",
    type: "warehouse",
    partyA: "中铁建华北物资专运中心",
    partyB: "中铁十六局集团京张项目部",
    amount: "440万元",
    amountValue: 440,
    region: "北京",
    date: "2026-02-21",
  },
  {
    id: 109,
    name: "中铁建武汉光谷物流园仓储租赁项目",
    type: "warehouse",
    partyA: "中铁建华中物资运营公司",
    partyB: "中铁十一局武汉地铁项目部",
    amount: "270万元",
    amountValue: 270,
    region: "湖北",
    date: "2026-02-20",
  },
  // 物资出租
  {
    id: 201,
    name: "盘扣式脚手架 8000套 长租项目",
    type: "materialRent",
    partyA: "中铁十一局广州分公司",
    partyB: "中铁建华南区域指挥部",
    amount: "65万元",
    amountValue: 65,
    region: "广东",
    date: "2026-02-28",
  },
  {
    id: 202,
    name: "塔吊标准节 30节 半年租赁",
    type: "materialRent",
    partyA: "中铁十六局集团华南分公司",
    partyB: "中铁十四局深圳地铁项目部",
    amount: "48万元",
    amountValue: 48,
    region: "广东",
    date: "2026-02-27",
  },
  {
    id: 203,
    name: "周转木方 1200方 季度出租",
    type: "materialRent",
    partyA: "中铁建物资华南专业运营有限公司",
    partyB: "中铁二十局广佛环线项目部",
    amount: "21万元",
    amountValue: 21,
    region: "广东",
    date: "2026-02-26",
  },
  {
    id: 204,
    name: "施工电梯 SC200/200 6台月租",
    type: "materialRent",
    partyA: "中铁二十二局集团华南分公司",
    partyB: "中铁十八局深惠城际项目部",
    amount: "32万元",
    amountValue: 32,
    region: "广东",
    date: "2026-02-25",
  },
  {
    id: 205,
    name: "二手钢管 800吨 半年长租",
    type: "materialRent",
    partyA: "中铁十四局集团广州分公司",
    partyB: "中铁建广州南沙项目部",
    amount: "55万元",
    amountValue: 55,
    region: "广东",
    date: "2026-02-24",
  },
  {
    id: 206,
    name: "汽车吊 25T 单月出租",
    type: "materialRent",
    partyA: "中铁二十四局华南分公司",
    partyB: "中铁二十五局深中通道项目部",
    amount: "18万元",
    amountValue: 18,
    region: "广东",
    date: "2026-02-23",
  },
  {
    id: 207,
    name: "钢板桩 600吨 半年租赁",
    type: "materialRent",
    partyA: "中铁建物资华东运营有限公司",
    partyB: "中铁十一局沪昆铁路项目部",
    amount: "120万元",
    amountValue: 120,
    region: "上海",
    date: "2026-02-22",
  },
  {
    id: 208,
    name: "混凝土泵车 4台 季度出租",
    type: "materialRent",
    partyA: "中铁建华北物资专运中心",
    partyB: "中铁十四局京沈高铁项目部",
    amount: "76万元",
    amountValue: 76,
    region: "北京",
    date: "2026-02-21",
  },
  // 物资出售
  {
    id: 301,
    name: "二手钢管扣件 500吨 整批出售",
    type: "materialSale",
    partyA: "中铁十四局集团广州分公司",
    partyB: "中铁建华南采购中心",
    amount: "175万元",
    amountValue: 175,
    region: "广东",
    date: "2026-02-28",
  },
  {
    id: 302,
    name: "废旧建筑模板 1500张 集中处置",
    type: "materialSale",
    partyA: "中铁二十局集团华南分公司",
    partyB: "再生资源华南采购联盟",
    amount: "62万元",
    amountValue: 62,
    region: "广东",
    date: "2026-02-27",
  },
  {
    id: 303,
    name: "二手挖掘机 PC200-8 1台",
    type: "materialSale",
    partyA: "中铁十八局华南分公司",
    partyB: "广东信达机械设备有限公司",
    amount: "26万元",
    amountValue: 26,
    region: "广东",
    date: "2026-02-26",
  },
  {
    id: 304,
    name: "废旧钢筋头 80吨 月度处置",
    type: "materialSale",
    partyA: "中铁二十四局华南分公司",
    partyB: "广州金鼎再生金属有限公司",
    amount: "22万元",
    amountValue: 22,
    region: "广东",
    date: "2026-02-25",
  },
  {
    id: 305,
    name: "拆除回收钢板 120吨",
    type: "materialSale",
    partyA: "中铁十六局集团华南分公司",
    partyB: "佛山顺鑫再生资源有限公司",
    amount: "31万元",
    amountValue: 31,
    region: "广东",
    date: "2026-02-24",
  },
  {
    id: 306,
    name: "电焊机/切割机 30台 整批出售",
    type: "materialSale",
    partyA: "中铁二十二局集团华南分公司",
    partyB: "中铁建华南调剂中心",
    amount: "8.5万元",
    amountValue: 8.5,
    region: "广东",
    date: "2026-02-23",
  },
  {
    id: 307,
    name: "二手装载机 ZL50G 2台",
    type: "materialSale",
    partyA: "中铁建华东物资运营有限公司",
    partyB: "上海新顺机械设备有限公司",
    amount: "58万元",
    amountValue: 58,
    region: "上海",
    date: "2026-02-22",
  },
  {
    id: 308,
    name: "废旧扣件 60吨 集中处置",
    type: "materialSale",
    partyA: "中铁建西南物资运营有限公司",
    partyB: "成都再生资源回收联盟",
    amount: "14万元",
    amountValue: 14,
    region: "四川",
    date: "2026-02-21",
  },
]

const regions = ["全部", "广东", "上海", "北京", "湖北", "四川"] as const
const periods = ["全部", "近 7 天", "近 30 天", "近 90 天"] as const
type SortKey = "newest" | "oldest" | "amountDesc" | "amountAsc"

const PAGE_SIZE = 10

export function TransactionNoticeListPage({ onNavigate }: TransactionNoticeListPageProps) {
  const [tab, setTab] = useState<DealType>("all")
  const [keyword, setKeyword] = useState("")
  const [region, setRegion] = useState<(typeof regions)[number]>("全部")
  const [period, setPeriod] = useState<(typeof periods)[number]>("全部")
  const [sort, setSort] = useState<SortKey>("newest")
  const [page, setPage] = useState(1)

  const current = tabs.find((t) => t.key === tab)!

  const filtered = useMemo(() => {
    let list = [...records]
    if (tab !== "all") list = list.filter((r) => r.type === tab)
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase()
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(k) ||
          r.partyA.toLowerCase().includes(k) ||
          r.partyB.toLowerCase().includes(k),
      )
    }
    if (region !== "全部") list = list.filter((r) => r.region === region)
    if (period !== "全部") {
      const days = period === "近 7 天" ? 7 : period === "近 30 天" ? 30 : 90
      const today = new Date("2026-02-28").getTime()
      list = list.filter((r) => (today - new Date(r.date).getTime()) / 86400000 <= days)
    }
    switch (sort) {
      case "oldest":
        list.sort((a, b) => a.date.localeCompare(b.date))
        break
      case "amountDesc":
        list.sort((a, b) => b.amountValue - a.amountValue)
        break
      case "amountAsc":
        list.sort((a, b) => a.amountValue - b.amountValue)
        break
      case "newest":
      default:
        list.sort((a, b) => b.date.localeCompare(a.date))
    }
    return list
  }, [tab, keyword, region, period, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageList = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // 分类数量
  const stats = useMemo(() => {
    const map = { warehouse: 0, materialRent: 0, materialSale: 0 } as Record<
      Exclude<DealType, "all">,
      number
    >
    for (const r of records) map[r.type] += 1
    const total = records.length
    const totalAmount = records.reduce((s, r) => s + r.amountValue, 0)
    return { ...map, total, totalAmount }
  }, [])

  const typeLabel: Record<Exclude<DealType, "all">, string> = {
    warehouse: "仓储交易",
    materialRent: "物资出租",
    materialSale: "物资出售",
  }
  const typeTone: Record<Exclude<DealType, "all">, string> = {
    warehouse: "bg-sky-100 text-sky-700",
    materialRent: "bg-emerald-100 text-emerald-700",
    materialSale: "bg-amber-100 text-amber-700",
  }

  return (
    <div className="space-y-6">
      {/* 面包屑 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => onNavigate?.("home")}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          首页
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">成交公告列表</span>
      </nav>

      {/* 页头 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">成交公告列表</h1>
            <Badge variant="secondary">最新成交</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            涵盖仓储交易、物资出租、物资出售三类成交记录，可按类型、区域、时间范围筛选与导出
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setPage(1)
              }}
              placeholder="搜索公告 / 甲乙双方"
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            导出
          </Button>
        </div>
      </div>

      {/* 顶部统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="累计公告"
          value={stats.total.toString()}
          suffix="条"
          tone="text-primary"
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
        />
        <StatCard label="仓储交易" value={stats.warehouse.toString()} suffix="条" tone="text-sky-600" />
        <StatCard label="物资出租" value={stats.materialRent.toString()} suffix="条" tone="text-emerald-600" />
        <StatCard label="物资出售" value={stats.materialSale.toString()} suffix="条" tone="text-amber-600" />
      </div>

      {/* Tab + 筛选 */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key)
                  setPage(1)
                }}
                className={cn(
                  "px-4 py-1.5 text-sm rounded transition-colors font-medium",
                  tab === t.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <FilterRow
              label="所在区域"
              value={region}
              options={regions}
              onChange={(v) => {
                setRegion(v)
                setPage(1)
              }}
            />
            <FilterRow
              label="时间范围"
              value={period}
              options={periods}
              onChange={(v) => {
                setPeriod(v)
                setPage(1)
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          共 <span className="font-semibold text-foreground">{filtered.length}</span> 条
        </div>
        <SortControl value={sort} onChange={setSort} />
      </div>

      {/* 表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[60px] text-center">序号</TableHead>
                {tab === "all" && <TableHead className="font-semibold w-[110px]">类型</TableHead>}
                <TableHead className="font-semibold">公告名称</TableHead>
                <TableHead className="font-semibold">{current.partyALabel}</TableHead>
                <TableHead className="font-semibold">{current.partyBLabel}</TableHead>
                <TableHead className="font-semibold w-[110px]">区域</TableHead>
                <TableHead className="font-semibold text-right w-[120px]">成交金额</TableHead>
                <TableHead className="font-semibold text-center w-[140px]">成交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tab === "all" ? 8 : 7} className="text-center py-12 text-muted-foreground">
                    暂无符合条件的公告
                  </TableCell>
                </TableRow>
              ) : (
                pageList.map((r, idx) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                      {(safePage - 1) * PAGE_SIZE + idx + 1}
                    </TableCell>
                    {tab === "all" && (
                      <TableCell>
                        <Badge className={cn("text-[10px]", typeTone[r.type])}>
                          {typeLabel[r.type]}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <span className="font-medium text-card-foreground hover:text-primary transition-colors line-clamp-1">
                        {r.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground line-clamp-1">{r.partyA}</TableCell>
                    <TableCell className="text-muted-foreground line-clamp-1">{r.partyB}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{r.region}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-primary font-semibold">{r.amount}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{r.date}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 分页 */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            第 <span className="text-foreground font-medium">{safePage}</span> / {totalPages} 页
          </p>
          <div className="inline-flex items-center gap-1">
            <Button variant="outline" size="icon" disabled={safePage === 1} onClick={() => setPage(1)}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === totalPages}
              onClick={() => setPage(totalPages)}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 子组件
// ─────────────────────────────────────────────
function StatCard({
  label,
  value,
  suffix,
  tone,
  icon,
}: {
  label: string
  value: string
  suffix?: string
  tone?: string
  icon?: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          {icon}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-semibold", tone ?? "text-foreground")}>{value}</span>
          {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

function FilterRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-colors",
              value === o
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function SortControl({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const opts: { key: SortKey; label: string }[] = [
    { key: "newest", label: "最新优先" },
    { key: "oldest", label: "最早优先" },
    { key: "amountDesc", label: "金额从高到低" },
    { key: "amountAsc", label: "金额从低到高" },
  ]
  return (
    <div className="inline-flex items-center gap-1 text-xs">
      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "px-2 py-1 rounded transition-colors",
            value === o.key ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
