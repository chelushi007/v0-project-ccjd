"use client"

import { useMemo, useState } from "react"
import {
  MapPin,
  Building2,
  Maximize2,
  Map as MapIcon,
  List,
  ChevronRight,
  Filter,
  Eye,
  Clock,
  Crown,
  Phone,
  User,
  Search,
  Zap,
  FileText,
  ArrowUpDown,
  Heart,
  Share2,
  FileSignature,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface WarehouseListPageProps {
  onNavigate?: (page: string) => void
}

type Source = "detail" | "quick"
type RentMode = "self" | "entrust"

interface WarehouseListItem {
  id: number
  source: Source
  rentMode: RentMode
  title: string
  type?: string
  location: string
  tier: "一级" | "二级"
  price?: string
  priceUnit?: string
  rentableArea?: string
  totalArea?: string
  startLease?: string
  rentMethod?: string[]
  description?: string
  features?: string[]
  contactName: string
  contactPhone: string
  views: number
  publishTime: string
  isHot?: boolean
}

const warehouseData: WarehouseListItem[] = [
  {
    id: 1,
    source: "detail",
    rentMode: "entrust",
    title: "中铁建广州南沙综合仓储基地",
    type: "综合仓储",
    location: "广东省广州市南沙区",
    tier: "一级",
    price: "0.56",
    priceUnit: "元/m²/天",
    rentableArea: "15,000",
    totalArea: "50,000",
    startLease: "60天",
    rentMethod: ["整租", "分租"],
    description: "南沙自贸区核心位置，配铁路专用线及大型装卸设备，提供24小时安保与海关监管服务。",
    features: ["铁路专用线", "大型装卸设备", "24小时安保"],
    contactName: "陈经理",
    contactPhone: "138****6688",
    views: 328,
    publishTime: "2小时前",
    isHot: true,
  },
  {
    id: 2,
    source: "detail",
    rentMode: "self",
    title: "中铁建深圳前海智慧仓储基地",
    type: "智慧仓储",
    location: "广东省深圳市南山区",
    tier: "一级",
    price: "0.52",
    priceUnit: "元/m²/天",
    rentableArea: "8,000",
    totalArea: "30,000",
    startLease: "30天",
    rentMethod: ["分租"],
    description: "前海自贸片区，WMS智能仓储系统，恒温区与跨境服务一应俱全。",
    features: ["自动化设备", "WMS系统", "恒温区"],
    contactName: "李主管",
    contactPhone: "139****2345",
    views: 256,
    publishTime: "5小时前",
    isHot: true,
  },
  {
    id: 3,
    source: "quick",
    rentMode: "self",
    title: "广州黄埔保税区现成标准仓出租",
    location: "广东省广州市黄埔区",
    tier: "二级",
    description: "项目部自有标准仓对外开放，重载地面，可天车装卸，长期合作优先，欢迎来电洽谈。",
    features: ["重载地面", "天车装卸", "长期合作"],
    contactName: "张工",
    contactPhone: "137****8901",
    views: 124,
    publishTime: "30分钟前",
    isHot: true,
  },
  {
    id: 4,
    source: "detail",
    rentMode: "entrust",
    title: "中铁建东莞虎门港务仓储基地",
    type: "港口仓储",
    location: "广东省东莞市虎门镇",
    tier: "一级",
    price: "0.38",
    priceUnit: "元/m²/天",
    rentableArea: "25,000",
    totalArea: "80,000",
    startLease: "90天",
    rentMethod: ["整租", "分租"],
    description: "近虎门港，配套海关监管与大型堆场，适用于跨境出口及大宗货物中转。",
    features: ["近虎门港", "海关监管", "大型堆场"],
    contactName: "王主任",
    contactPhone: "136****5566",
    views: 412,
    publishTime: "1天前",
  },
  {
    id: 5,
    source: "quick",
    rentMode: "entrust",
    title: "佛山顺德周转钢管堆场对外出租",
    location: "广东省佛山市顺德区",
    tier: "二级",
    description: "自有堆场长期托管周转钢管与扣件，周边便于运输，配 24h 看管，可签短租或长租合同。",
    features: ["可短租", "看管服务", "近高速"],
    contactName: "刘工",
    contactPhone: "135****7711",
    views: 87,
    publishTime: "1小时前",
  },
  {
    id: 6,
    source: "detail",
    rentMode: "self",
    title: "中铁十六局佛山顺德钢构仓储基地",
    type: "专业仓储",
    location: "广东省佛山市顺德区",
    tier: "二级",
    price: "0.45",
    priceUnit: "元/m²/天",
    rentableArea: "6,000",
    totalArea: "20,000",
    startLease: "60天",
    rentMethod: ["整租"],
    description: "钢材专用仓储，配天车与防锈处理工艺，承接钢构件加工与中转业务。",
    features: ["钢材专用", "天车设备", "防锈处理"],
    contactName: "周经理",
    contactPhone: "138****0099",
    views: 189,
    publishTime: "2天前",
  },
  {
    id: 7,
    source: "detail",
    rentMode: "entrust",
    title: "中铁二十二局惠州大亚湾石化仓储基地",
    type: "危化品仓储",
    location: "广东省惠州市大亚湾区",
    tier: "二级",
    price: "0.85",
    priceUnit: "元/m²/天",
    rentableArea: "4,500",
    totalArea: "15,000",
    startLease: "180天",
    rentMethod: ["整租"],
    description: "化工园区内危化品仓储，齐备消防达标与 24h 在线监控，资质齐全。",
    features: ["危化品资质", "消防达标", "24小时监控"],
    contactName: "黄主管",
    contactPhone: "139****6633",
    views: 156,
    publishTime: "3天前",
  },
  {
    id: 8,
    source: "quick",
    rentMode: "self",
    title: "珠海金湾综合仓储对外出租",
    location: "广东省珠海市金湾区",
    tier: "二级",
    description: "自有综合仓储对外开放，支持分租、装卸便捷，可开 9% 增值税专票，详情来电咨询。",
    features: ["可分租", "装卸便捷", "开票合规"],
    contactName: "赵工",
    contactPhone: "137****4422",
    views: 96,
    publishTime: "4小时前",
  },
]

const sourceMeta = {
  detail: {
    label: "详细发布",
    short: "出租",
    icon: FileText,
    badgeClass: "bg-accent text-accent-foreground",
    sourceBadgeClass: "bg-primary/10 text-primary border-primary/30",
  },
  quick: {
    label: "快捷发布",
    short: "出租",
    icon: Zap,
    badgeClass: "bg-accent text-accent-foreground",
    sourceBadgeClass: "bg-amber-500/10 text-amber-700 border-amber-500/40",
  },
} as const

const rentModeLabel = {
  self: "自主",
  entrust: "委托",
} as const

export function WarehouseListPage({ onNavigate }: WarehouseListPageProps) {
  const [source, setSource] = useState<"all" | Source>("all")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [region, setRegion] = useState("all")
  const [warehouseType, setWarehouseType] = useState("all")
  const [areaRange, setAreaRange] = useState("all")
  const [rentModeFilter, setRentModeFilter] = useState<"all" | RentMode>("all")
  const [sortKey, setSortKey] = useState<"default" | "price-asc" | "area-desc" | "latest">("default")

  const filtered = useMemo(() => {
    let list = [...warehouseData]
    if (source !== "all") list = list.filter((w) => w.source === source)
    if (rentModeFilter !== "all") list = list.filter((w) => w.rentMode === rentModeFilter)
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(kw) ||
          w.location.toLowerCase().includes(kw) ||
          (w.description?.toLowerCase().includes(kw) ?? false),
      )
    }
    if (sortKey === "price-asc") {
      list.sort((a, b) => Number(a.price ?? 99) - Number(b.price ?? 99))
    } else if (sortKey === "area-desc") {
      list.sort(
        (a, b) =>
          Number((b.rentableArea ?? "0").replace(/,/g, "")) -
          Number((a.rentableArea ?? "0").replace(/,/g, "")),
      )
    } else if (sortKey === "latest") {
      list.sort((a, b) => a.id - b.id)
    }
    return list
  }, [source, rentModeFilter, searchKeyword, sortKey])

  const counts = useMemo(
    () => ({
      all: warehouseData.length,
      detail: warehouseData.filter((w) => w.source === "detail").length,
      quick: warehouseData.filter((w) => w.source === "quick").length,
    }),
    [],
  )

  const goDetail = () => onNavigate?.("warehouse-detail")
  const goMap = () => onNavigate?.("warehouse-map")
  const goQuickPublish = () => onNavigate?.("detail-publish-quick")

  return (
    <div className="space-y-4">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="link"
          className="p-0 h-auto text-muted-foreground hover:text-primary"
          onClick={() => onNavigate?.("home")}
        >
          首页
        </Button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">仓储列表</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button variant="secondary" size="sm" className="h-7">
              <List className="w-4 h-4 mr-1" />
              列表
            </Button>
            <Button variant="ghost" size="sm" className="h-7" onClick={goMap}>
              <MapIcon className="w-4 h-4 mr-1" />
              地图
            </Button>
          </div>
        </div>
      </div>

      {/* 搜索筛选 */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索仓储名称、地址、描述..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue placeholder="区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部区域</SelectItem>
                <SelectItem value="guangzhou">广州</SelectItem>
                <SelectItem value="shenzhen">深圳</SelectItem>
                <SelectItem value="dongguan">东莞</SelectItem>
                <SelectItem value="foshan">佛山</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseType} onValueChange={setWarehouseType}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="general">综合仓储</SelectItem>
                <SelectItem value="smart">智慧仓储</SelectItem>
                <SelectItem value="port">港口仓储</SelectItem>
                <SelectItem value="danger">危化品仓储</SelectItem>
              </SelectContent>
            </Select>
            <Select value={areaRange} onValueChange={setAreaRange}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue placeholder="面积" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">不限面积</SelectItem>
                <SelectItem value="small">1000m²以下</SelectItem>
                <SelectItem value="medium">1000-5000m²</SelectItem>
                <SelectItem value="large">5000m²以上</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rentModeFilter} onValueChange={(v) => setRentModeFilter(v as typeof rentModeFilter)}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue placeholder="运营模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部模式</SelectItem>
                <SelectItem value="self">自主</SelectItem>
                <SelectItem value="entrust">委托</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-10">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>

          {/* 排序 */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              排序
            </span>
            {(
              [
                { key: "default", label: "综合" },
                { key: "price-asc", label: "价格从低到高" },
                { key: "area-desc", label: "面积从大到小" },
                { key: "latest", label: "最新发布" },
              ] as const
            ).map((s) => (
              <Button
                key={s.key}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 text-xs",
                  sortKey === s.key && "bg-primary/10 text-primary hover:bg-primary/15",
                )}
                onClick={() => setSortKey(s.key)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 来源 Tab */}
      <Tabs value={source} onValueChange={(v) => setSource(v as typeof source)}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList>
            <TabsTrigger value="all">
              全部
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="detail">
              <FileText className="w-3.5 h-3.5 mr-1" />
              详细发布
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {counts.detail}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="quick">
              <Zap className="w-3.5 h-3.5 mr-1" />
              快捷发布
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {counts.quick}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              共 <span className="text-primary font-medium">{filtered.length}</span> 条
            </span>
            <Button size="sm" variant="outline" onClick={goQuickPublish}>
              <Zap className="w-3.5 h-3.5 mr-1" />
              快捷发布仓储
            </Button>
          </div>
        </div>
      </Tabs>

      {/* 列表内容 */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const meta = sourceMeta[item.source]
          const SourceIcon = meta.icon
          return (
            <Card
              key={item.id}
              onClick={goDetail}
              className="overflow-hidden hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* 左侧图片 */}
                  <div className="relative w-48 shrink-0 hidden md:flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
                    <Building2 className="w-16 h-16 text-primary/30" />
                    <Badge className="absolute top-3 left-3 gap-1 text-xs bg-accent text-accent-foreground">
                      出租
                    </Badge>
                    {item.isHot && (
                      <Badge className="absolute bottom-3 left-3 bg-destructive text-xs">
                        热门
                      </Badge>
                    )}
                  </div>

                  {/* 中间信息 */}
                  <div className="flex-1 p-4 min-w-0 flex flex-col gap-2">
                    {/* 标题 + Tier + 来源 */}
                    <div className="flex items-start gap-2 flex-wrap">
                      <Badge
                        variant={item.tier === "一级" ? "default" : "outline"}
                        className={cn(
                          "text-[10px] gap-0.5 px-1.5 py-0 shrink-0",
                          item.tier === "一级"
                            ? "bg-amber-500 hover:bg-amber-500 text-white"
                            : "text-slate-600 border-slate-300",
                        )}
                      >
                        {item.tier === "一级" && <Crown className="w-2.5 h-2.5" />}
                        {item.tier}站点
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                        {rentModeLabel[item.rentMode]}运营
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] gap-0.5 px-1.5 py-0 shrink-0",
                          meta.sourceBadgeClass,
                        )}
                      >
                        <SourceIcon className="w-2.5 h-2.5" />
                        {meta.label}
                      </Badge>
                      <h3 className="font-medium text-card-foreground text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors flex-1 min-w-0">
                        {item.title}
                      </h3>
                    </div>

                    {/* 位置 + 类型 */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                      {item.type && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {item.type}
                        </span>
                      )}
                      {item.rentableArea && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" />
                          可租 {item.rentableArea} m²
                        </span>
                      )}
                      {item.startLease && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          起租 {item.startLease}
                        </span>
                      )}
                    </div>

                    {/* 描述 */}
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    )}

                    {/* 标签 + 联系人 */}
                    <div className="flex items-center justify-between gap-3 flex-wrap mt-auto pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.features?.slice(0, 4).map((f) => (
                          <Badge
                            key={f}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 text-muted-foreground"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.contactName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {item.contactPhone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.publishTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧价格 + 操作 */}
                  <div className="w-56 shrink-0 border-l border-border p-4 flex flex-col items-end justify-between gap-3 bg-muted/30">
                    {item.source === "detail" && item.price ? (
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground">租金单价</div>
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className="text-2xl font-bold text-primary">{item.price}</span>
                          <span className="text-xs text-muted-foreground">{item.priceUnit}</span>
                        </div>
                        {item.rentMethod?.length ? (
                          <div className="text-[11px] text-muted-foreground mt-1">
                            支持{item.rentMethod.join(" / ")}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground">租金</div>
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className="text-2xl font-bold text-primary">面议</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                          <Zap className="w-2.5 h-2.5 text-amber-600" />
                          快捷发布 · 详询联系人
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 w-full">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-8 gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          goDetail()
                        }}
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        立即下单
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Building2 className="w-12 h-12 opacity-30" />
              <p className="text-sm">暂无符合条件的仓储信息</p>
              <Button variant="outline" size="sm" onClick={() => setSearchKeyword("")}>
                清除筛选条件
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Button variant="outline" size="sm" disabled>
          上一页
        </Button>
        <Button variant="default" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <span className="text-muted-foreground">...</span>
        <Button variant="outline" size="sm">
          10
        </Button>
        <Button variant="outline" size="sm">
          下一页
        </Button>
      </div>
    </div>
  )
}
