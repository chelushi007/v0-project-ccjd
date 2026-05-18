"use client"

import { useMemo, useState } from "react"
import {
  ChevronRight,
  Home,
  Truck,
  Search,
  MapPin,
  Star,
  Award,
  ShieldCheck,
  Package,
  Filter,
  Grid3x3,
  List as ListIcon,
  ArrowUpDown,
  CheckCircle2,
  Building2,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TransportListPageProps {
  onNavigate?: (page: string) => void
}

interface TransportUnit {
  id: number
  name: string
  shortName: string
  location: string
  province: string
  region: "华南" | "华东" | "华北" | "华中" | "西南" | "西北" | "东北"
  rating: number
  completedOrders: number
  totalValue: string
  managedAmount: number // 万元，用于排序
  services: string[]
  certifications: string[]
  level: "央企一级" | "央企二级" | "省级"
  isRecommended: boolean
  established: number
  responseTime: string
}

const allUnits: TransportUnit[] = [
  {
    id: 1,
    name: "中铁建物资华南专业运营有限公司",
    shortName: "铁建华南运营",
    location: "广东省广州市天河区",
    province: "广东",
    region: "华南",
    rating: 4.9,
    completedOrders: 1256,
    totalValue: "2.5亿",
    managedAmount: 25000,
    services: ["物资托管", "租赁运营", "调剂服务", "仓储管理", "数据分析"],
    certifications: ["央企资质", "AAAA物流", "ISO 9001"],
    level: "央企一级",
    isRecommended: true,
    established: 2008,
    responseTime: "< 2 小时",
  },
  {
    id: 2,
    name: "中铁建物资深圳前海运营中心",
    shortName: "铁建前海运营",
    location: "广东省深圳市南山区",
    province: "广东",
    region: "华南",
    rating: 4.8,
    completedOrders: 856,
    totalValue: "1.8亿",
    managedAmount: 18000,
    services: ["物资托管", "专业运营", "代销服务", "智慧仓储"],
    certifications: ["专业资质", "信用AAA"],
    level: "央企一级",
    isRecommended: true,
    established: 2014,
    responseTime: "< 1 小时",
  },
  {
    id: 3,
    name: "中铁十四局东莞物资专运公司",
    shortName: "十四局东莞专运",
    location: "广东省东莞市虎门镇",
    province: "广东",
    region: "华南",
    rating: 4.7,
    completedOrders: 623,
    totalValue: "1.2亿",
    managedAmount: 12000,
    services: ["物资托管", "港口联运", "仓储服务"],
    certifications: ["专业资质", "安全生产"],
    level: "央企二级",
    isRecommended: false,
    established: 2012,
    responseTime: "< 4 小时",
  },
  {
    id: 4,
    name: "中铁十六局佛山物资管理中心",
    shortName: "十六局佛山",
    location: "广东省佛山市顺德区",
    province: "广东",
    region: "华南",
    rating: 4.6,
    completedOrders: 412,
    totalValue: "8000万",
    managedAmount: 8000,
    services: ["物资托管", "钢材运营", "设备管理"],
    certifications: ["专业资质"],
    level: "央企二级",
    isRecommended: false,
    established: 2015,
    responseTime: "< 4 小时",
  },
  {
    id: 5,
    name: "中铁建华东物资运营有限公司",
    shortName: "铁建华东运营",
    location: "上海市浦东新区",
    province: "上海",
    region: "华东",
    rating: 4.9,
    completedOrders: 1480,
    totalValue: "3.2亿",
    managedAmount: 32000,
    services: ["物资托管", "供应链金融", "全国调剂", "智慧仓储"],
    certifications: ["央企资质", "AAAA物流", "ISO 9001", "ISO 14001"],
    level: "央企一级",
    isRecommended: true,
    established: 2006,
    responseTime: "< 1 小时",
  },
  {
    id: 6,
    name: "中铁建华北物资专运中心",
    shortName: "铁建华北专运",
    location: "北京市丰台区",
    province: "北京",
    region: "华北",
    rating: 4.8,
    completedOrders: 920,
    totalValue: "2.1亿",
    managedAmount: 21000,
    services: ["物资托管", "进出口代理", "仓储管理"],
    certifications: ["央企资质", "保税资质"],
    level: "央企一级",
    isRecommended: true,
    established: 2009,
    responseTime: "< 2 小时",
  },
  {
    id: 7,
    name: "中铁建西南物资运营有限公司",
    shortName: "铁建西南运营",
    location: "四川省成都市青羊区",
    province: "四川",
    region: "西南",
    rating: 4.7,
    completedOrders: 758,
    totalValue: "1.5亿",
    managedAmount: 15000,
    services: ["物资托管", "区域调剂", "工地配送"],
    certifications: ["专业资质", "安全生产"],
    level: "央企一级",
    isRecommended: false,
    established: 2011,
    responseTime: "< 3 小时",
  },
  {
    id: 8,
    name: "中铁建华中物资运营公司",
    shortName: "铁建华中运营",
    location: "湖北省武汉市江汉区",
    province: "湖北",
    region: "华中",
    rating: 4.6,
    completedOrders: 540,
    totalValue: "9800万",
    managedAmount: 9800,
    services: ["物资托管", "钢材运营", "代销服务"],
    certifications: ["专业资质"],
    level: "央企二级",
    isRecommended: false,
    established: 2013,
    responseTime: "< 4 小时",
  },
  {
    id: 9,
    name: "中铁建西北物资运营中心",
    shortName: "铁建西北运营",
    location: "陕西省西安市未央区",
    province: "陕西",
    region: "西北",
    rating: 4.5,
    completedOrders: 386,
    totalValue: "6500万",
    managedAmount: 6500,
    services: ["物资托管", "工地配送"],
    certifications: ["专业资质"],
    level: "央企二级",
    isRecommended: false,
    established: 2016,
    responseTime: "< 6 小时",
  },
  {
    id: 10,
    name: "中铁建东北物资专运公司",
    shortName: "铁建东北专运",
    location: "辽宁省沈阳市和平区",
    province: "辽宁",
    region: "东北",
    rating: 4.4,
    completedOrders: 295,
    totalValue: "4800万",
    managedAmount: 4800,
    services: ["物资托管", "区域调剂"],
    certifications: ["专业资质"],
    level: "省级",
    isRecommended: false,
    established: 2017,
    responseTime: "< 8 小时",
  },
  {
    id: 11,
    name: "中铁建广州黄埔智慧物流中心",
    shortName: "铁建黄埔智慧",
    location: "广东省广州市黄埔区",
    province: "广东",
    region: "华南",
    rating: 4.8,
    completedOrders: 712,
    totalValue: "1.6亿",
    managedAmount: 16000,
    services: ["智慧仓储", "数据运营", "供应链金融"],
    certifications: ["专业资质", "高新技术企业"],
    level: "央企一级",
    isRecommended: true,
    established: 2019,
    responseTime: "< 1 小时",
  },
  {
    id: 12,
    name: "中铁十一局南宁物资运营公司",
    shortName: "十一局南宁",
    location: "广西省南宁市青秀区",
    province: "广西",
    region: "华南",
    rating: 4.5,
    completedOrders: 348,
    totalValue: "5800万",
    managedAmount: 5800,
    services: ["物资托管", "工地配送"],
    certifications: ["专业资质"],
    level: "央企二级",
    isRecommended: false,
    established: 2018,
    responseTime: "< 5 小时",
  },
]

const regions = ["全部", "华南", "华东", "华北", "华中", "西南", "西北", "东北"] as const
const levels = ["全部", "央企一级", "央企二级", "省级"] as const
const services = ["不限", "物资托管", "智慧仓储", "供应链金融", "代销服务", "区域调剂"] as const
type SortKey = "recommend" | "ordersDesc" | "valueDesc" | "ratingDesc" | "newest"

export function TransportListPage({ onNavigate }: TransportListPageProps) {
  const [keyword, setKeyword] = useState("")
  const [region, setRegion] = useState<(typeof regions)[number]>("全部")
  const [level, setLevel] = useState<(typeof levels)[number]>("全部")
  const [service, setService] = useState<(typeof services)[number]>("不限")
  const [sort, setSort] = useState<SortKey>("recommend")
  const [view, setView] = useState<"grid" | "list">("grid")

  const filtered = useMemo(() => {
    let list = [...allUnits]
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase()
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(k) ||
          u.shortName.toLowerCase().includes(k) ||
          u.location.toLowerCase().includes(k),
      )
    }
    if (region !== "全部") list = list.filter((u) => u.region === region)
    if (level !== "全部") list = list.filter((u) => u.level === level)
    if (service !== "不限") list = list.filter((u) => u.services.includes(service))

    switch (sort) {
      case "ordersDesc":
        list.sort((a, b) => b.completedOrders - a.completedOrders)
        break
      case "valueDesc":
        list.sort((a, b) => b.managedAmount - a.managedAmount)
        break
      case "ratingDesc":
        list.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        list.sort((a, b) => b.established - a.established)
        break
      case "recommend":
      default:
        list.sort((a, b) => Number(b.isRecommended) - Number(a.isRecommended) || b.rating - a.rating)
    }
    return list
  }, [keyword, region, level, service, sort])

  const goDetail = () => onNavigate?.("transport-detail")

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
        <span className="text-foreground font-medium">专运单位列表</span>
      </nav>

      {/* 页头：标题 + 关键字搜索 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-semibold text-foreground">专运单位列表</h1>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Award className="w-3 h-3 mr-1" />
              优质服务
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            汇聚 {allUnits.length} 家央企/省级专业运营单位，覆盖物资托管、智慧仓储、供应链金融等服务
          </p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索单位名称 / 简称 / 所在地"
            className="pl-9"
          />
        </div>
      </div>

      {/* 顶部统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="入驻单位" value={allUnits.length.toString()} suffix="家" tone="text-primary" />
        <StatCard
          label="累计成交订单"
          value={allUnits.reduce((s, u) => s + u.completedOrders, 0).toLocaleString()}
          suffix="单"
          tone="text-emerald-600"
        />
        <StatCard
          label="累计托管金额"
          value={(allUnits.reduce((s, u) => s + u.managedAmount, 0) / 10000).toFixed(1)}
          suffix="亿元"
          tone="text-amber-600"
        />
        <StatCard
          label="平均评分"
          value={(allUnits.reduce((s, u) => s + u.rating, 0) / allUnits.length).toFixed(1)}
          suffix="/ 5.0"
          tone="text-rose-600"
        />
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <FilterRow label="所在区域" value={region} options={regions} onChange={setRegion} />
            <FilterRow label="单位等级" value={level} options={levels} onChange={setLevel} />
            <FilterRow label="核心服务" value={service} options={services} onChange={setService} />
          </div>
        </CardContent>
      </Card>

      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          共 <span className="font-semibold text-foreground">{filtered.length}</span> 家单位
        </div>
        <div className="flex items-center gap-2">
          <SortControl value={sort} onChange={setSort} />
          <div className="inline-flex items-center rounded-md border border-border bg-card p-0.5">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-1.5 rounded transition-colors",
                view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="卡片视图"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-1.5 rounded transition-colors",
                view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="列表视图"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 结果区 */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center text-muted-foreground">
            <Building2 className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">未匹配到任何专运单位，请调整筛选条件</p>
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((u) => (
            <UnitCard key={u.id} unit={u} onClick={goDetail} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <UnitRow key={u.id} unit={u} onClick={goDetail} />
          ))}
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
}: {
  label: string
  value: string
  suffix?: string
  tone?: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
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
    { key: "recommend", label: "综合推荐" },
    { key: "ordersDesc", label: "订单最多" },
    { key: "valueDesc", label: "托管最高" },
    { key: "ratingDesc", label: "评分最高" },
    { key: "newest", label: "成立最新" },
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

function UnitCard({ unit, onClick }: { unit: TransportUnit; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="h-32 bg-gradient-to-br from-accent/15 to-accent/5 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Truck className="w-12 h-12 text-accent/20" />
        </div>
        {unit.isRecommended && (
          <Badge className="absolute top-2 left-2 bg-accent">
            <ShieldCheck className="w-3 h-3 mr-1" />
            推荐
          </Badge>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{unit.rating}</span>
        </div>
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {unit.certifications.slice(0, 2).map((c) => (
            <Badge key={c} variant="secondary" className="text-xs bg-card/90">
              {c}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Badge
            className={cn(
              "text-[10px] gap-0.5 px-1.5 py-0",
              unit.level === "央企一级"
                ? "bg-amber-500 hover:bg-amber-500 text-white"
                : unit.level === "央企二级"
                  ? "bg-slate-200 text-slate-700"
                  : "bg-emerald-100 text-emerald-700",
            )}
          >
            {unit.level === "央企一级" && <Crown className="w-2.5 h-2.5" />}
            {unit.level}
          </Badge>
          <span className="text-[10px] text-muted-foreground">成立 {unit.established}</span>
        </div>
        <h3 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {unit.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{unit.location}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">完成订单：</span>
            <span className="font-medium text-primary">{unit.completedOrders}</span>
          </div>
          <div>
            <span className="text-muted-foreground">托管：</span>
            <span className="font-medium">{unit.totalValue}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {unit.services.slice(0, 3).map((s) => (
            <Badge key={s} variant="outline" className="text-xs">
              {s}
            </Badge>
          ))}
          {unit.services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{unit.services.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="w-3.5 h-3.5" />
            响应 {unit.responseTime}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            托管咨询
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function UnitRow({ unit, onClick }: { unit: TransportUnit; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-all">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center">
          <Truck className="w-7 h-7 text-accent/40" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-card-foreground line-clamp-1">{unit.name}</h3>
            {unit.isRecommended && (
              <Badge className="bg-accent text-[10px] gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                推荐
              </Badge>
            )}
            <Badge
              className={cn(
                "text-[10px] px-1.5 py-0",
                unit.level === "央企一级"
                  ? "bg-amber-500 hover:bg-amber-500 text-white"
                  : unit.level === "央企二级"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-emerald-100 text-emerald-700",
              )}
            >
              {unit.level}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {unit.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {unit.rating}
            </span>
            <span>完成订单 {unit.completedOrders}</span>
            <span>累计 {unit.totalValue}</span>
            <span>响应 {unit.responseTime}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {unit.services.slice(0, 4).map((s) => (
              <Badge key={s} variant="outline" className="text-[10px]">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            托管咨询
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
