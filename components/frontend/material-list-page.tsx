"use client"

import { useMemo, useState } from "react"
import {
  Package,
  MapPin,
  ChevronRight,
  Filter,
  Eye,
  Clock,
  User,
  Phone,
  Search,
  ArrowUpDown,
  Tags,
  Recycle,
  LayoutGrid,
  List as ListIcon,
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

interface MaterialListPageProps {
  onNavigate?: (page: string) => void
}

type DealType = "出租" | "出售"

interface MaterialListItem {
  id: number
  name: string
  category: string
  dealType: DealType
  location: string
  price: string
  unit: string
  condition: string
  quantity: string
  supplier: string
  features: string[]
  description: string
  contactName: string
  contactPhone: string
  views: number
  publishTime: string
  isHot?: boolean
}

const materialData: MaterialListItem[] = [
  {
    id: 101,
    name: "工地周转木方 约200方",
    category: "房屋建筑类",
    dealType: "出租",
    location: "广东省深圳市龙岗区",
    price: "12",
    unit: "元/方/月",
    condition: "七成新",
    quantity: "约 200 方",
    supplier: "中铁建物资华南专业运营有限公司",
    features: ["现货供应", "可配送", "短期可租"],
    description: "工地周转木方,规格齐全,质量可靠,支持长短租,可送货上门。",
    contactName: "陈经理",
    contactPhone: "138****6688",
    views: 312,
    publishTime: "3小时前",
    isHot: true,
  },
  {
    id: 102,
    name: "塔吊标准节 10节",
    category: "其他材料",
    dealType: "出租",
    location: "广东省东莞市虎门镇",
    price: "1800",
    unit: "元/节/月",
    condition: "九成新",
    quantity: "10 节",
    supplier: "中铁十六局集团华南分公司",
    features: ["原厂配件", "带检测报告", "整套租赁"],
    description: "塔吊标准节,原厂配件,均带最新检测报告,支持配套使用。",
    contactName: "李工",
    contactPhone: "139****2345",
    views: 256,
    publishTime: "5小时前",
  },
  {
    id: 103,
    name: "盘扣式脚手架 约8000套",
    category: "拼装类",
    dealType: "出租",
    location: "广东省广州市番禺区",
    price: "0.8",
    unit: "元/套/天",
    condition: "九成新",
    quantity: "约 8000 套",
    supplier: "中铁十一局广州分公司",
    features: ["国标认证", "支持长租", "整批可议"],
    description: "盘扣式脚手架,国标认证,数量充足,支持长租与整批议价。",
    contactName: "王主管",
    contactPhone: "136****5566",
    views: 198,
    publishTime: "8小时前",
    isHot: true,
  },
  {
    id: 104,
    name: "施工电梯 SC200/200 双笼",
    category: "机械设备",
    dealType: "出租",
    location: "广东省珠海市横琴新区",
    price: "2.6",
    unit: "万元/月",
    condition: "八成新",
    quantity: "1 台",
    supplier: "中铁二十二局集团华南分公司",
    features: ["含安拆", "持证操作", "高层适用"],
    description: "SC200/200 双笼施工电梯,含安拆服务及操作员,适合高层项目使用。",
    contactName: "黄主任",
    contactPhone: "137****8901",
    views: 174,
    publishTime: "1天前",
  },
  {
    id: 105,
    name: "二手钢管扣件 约500吨",
    category: "拼装类",
    dealType: "出售",
    location: "广东省广州市黄埔区",
    price: "3500",
    unit: "元/吨",
    condition: "八成新",
    quantity: "约 500 吨",
    supplier: "中铁十四局集团广州分公司",
    features: ["品质保证", "可检测", "量大优惠"],
    description: "二手钢管扣件,均经过检测分类,品质有保证,量大可议价。",
    contactName: "刘经理",
    contactPhone: "135****7711",
    views: 428,
    publishTime: "1小时前",
    isHot: true,
  },
  {
    id: 106,
    name: "建筑模板 约1000张",
    category: "模板类",
    dealType: "出售",
    location: "广东省佛山市顺德区",
    price: "45",
    unit: "元/张",
    condition: "六成新",
    quantity: "约 1000 张",
    supplier: "中铁二十局集团华南分公司",
    features: ["批量优惠", "可自提", "支持开票"],
    description: "施工现场闲置建筑模板,可自提,数量较多,价格优惠。",
    contactName: "周工",
    contactPhone: "138****0099",
    views: 189,
    publishTime: "1天前",
  },
  {
    id: 107,
    name: "二手挖掘机 PC200-8 一台",
    category: "机械设备",
    dealType: "出售",
    location: "广东省东莞市厚街镇",
    price: "26",
    unit: "万元/台",
    condition: "七成新",
    quantity: "1 台",
    supplier: "中铁十八局华南分公司",
    features: ["手续齐全", "包过户", "可试机"],
    description: "PC200-8 二手挖掘机,手续齐全,无大修,支持试机过户。",
    contactName: "赵主管",
    contactPhone: "139****6633",
    views: 612,
    publishTime: "6小时前",
    isHot: true,
  },
  {
    id: 108,
    name: "废旧钢筋头 约80吨",
    category: "再生材料",
    dealType: "出售",
    location: "广东省惠州市仲恺区",
    price: "2800",
    unit: "元/吨",
    condition: "废料",
    quantity: "约 80 吨",
    supplier: "中铁二十四局华南分公司",
    features: ["现货", "支持过磅", "随提随结"],
    description: "工地废旧钢筋头,品类齐整,现货供应,支持现场过磅交易。",
    contactName: "孙工",
    contactPhone: "137****4422",
    views: 136,
    publishTime: "2天前",
  },
]

export function MaterialListPage({ onNavigate }: MaterialListPageProps) {
  const [tab, setTab] = useState<"all" | DealType>("all")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [region, setRegion] = useState("all")
  const [category, setCategory] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [sortKey, setSortKey] = useState<"default" | "price-asc" | "latest" | "hot">(
    "default",
  )
  const [view, setView] = useState<"list" | "card">("list")

  const filtered = useMemo(() => {
    let list = [...materialData]
    if (tab !== "all") list = list.filter((m) => m.dealType === tab)
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(kw) ||
          m.location.toLowerCase().includes(kw) ||
          m.description.toLowerCase().includes(kw),
      )
    }
    if (sortKey === "price-asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortKey === "latest") {
      list.sort((a, b) => a.id - b.id)
    } else if (sortKey === "hot") {
      list.sort((a, b) => b.views - a.views)
    }
    return list
  }, [tab, searchKeyword, sortKey])

  const counts = useMemo(
    () => ({
      all: materialData.length,
      出租: materialData.filter((m) => m.dealType === "出租").length,
      出售: materialData.filter((m) => m.dealType === "出售").length,
    }),
    [],
  )

  const goDetail = () => onNavigate?.("material-detail")
  const goPublish = () => onNavigate?.("material-publish")

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
        <span className="text-foreground">物资列表</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-7"
              onClick={() => setView("list")}
            >
              <ListIcon className="w-4 h-4 mr-1" />
              列表
            </Button>
            <Button
              variant={view === "card" ? "secondary" : "ghost"}
              size="sm"
              className="h-7"
              onClick={() => setView("card")}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              卡片
            </Button>
          </div>
          <Button size="sm" onClick={goPublish}>
            <Tags className="w-4 h-4 mr-1" />
            发布物资
          </Button>
        </div>
      </div>

      {/* 顶部信息条 */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Recycle className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground">物资列表</h1>
            <p className="text-sm text-muted-foreground line-clamp-1">
              聚合各项目部、各分公司的闲置物资,支持出租与出售两类成交方式,助力周转盘活。
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm shrink-0">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{counts.all}</div>
              <div className="text-[11px] text-muted-foreground">物资总数</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{counts.出租}</div>
              <div className="text-[11px] text-muted-foreground">出租中</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{counts.出售}</div>
              <div className="text-[11px] text-muted-foreground">出售中</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索筛选 */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索物资名称、地址、描述..."
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
                <SelectItem value="huizhou">惠州</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue placeholder="物资分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="house">房屋建筑类</SelectItem>
                <SelectItem value="assemble">拼装类</SelectItem>
                <SelectItem value="template">模板类</SelectItem>
                <SelectItem value="machine">机械设备</SelectItem>
                <SelectItem value="recycle">再生材料</SelectItem>
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue placeholder="成色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">不限成色</SelectItem>
                <SelectItem value="new">九成新</SelectItem>
                <SelectItem value="used">七八成新</SelectItem>
                <SelectItem value="old">六成及以下</SelectItem>
                <SelectItem value="scrap">废料</SelectItem>
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
                { key: "latest", label: "最新发布" },
                { key: "hot", label: "热门" },
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

      {/* 类别 Tab */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList>
            <TabsTrigger value="all">
              全部
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="出租">
              <Package className="w-3.5 h-3.5 mr-1" />
              物资出租
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {counts.出租}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="出售">
              <Tags className="w-3.5 h-3.5 mr-1" />
              物资出售
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {counts.出售}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <span className="text-sm text-muted-foreground">
            共 <span className="text-primary font-medium">{filtered.length}</span> 条
          </span>
        </div>
      </Tabs>

      {/* 列表内容 */}
      {view === "list" ? (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isRent = item.dealType === "出租"
            return (
              <Card
                key={item.id}
                onClick={goDetail}
                className="overflow-hidden hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* 左侧图片 */}
                    <div
                      className={cn(
                        "relative w-44 shrink-0 hidden md:flex items-center justify-center",
                        isRent
                          ? "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
                          : "bg-gradient-to-br from-accent/15 via-accent/5 to-transparent",
                      )}
                    >
                      <Package
                        className={cn(
                          "w-14 h-14",
                          isRent ? "text-primary/30" : "text-accent/30",
                        )}
                      />
                      <Badge
                        className={cn(
                          "absolute top-3 left-3 text-xs",
                          isRent ? "bg-primary" : "bg-accent",
                        )}
                      >
                        {item.dealType}
                      </Badge>
                      {item.isHot && (
                        <Badge className="absolute bottom-3 left-3 bg-destructive text-xs">
                          热门
                        </Badge>
                      )}
                    </div>

                    {/* 中间信息 */}
                    <div className="flex-1 p-4 min-w-0 flex flex-col gap-2">
                      <div className="flex items-start gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                          {item.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 shrink-0 text-muted-foreground"
                        >
                          {item.condition}
                        </Badge>
                        <h3 className="font-medium text-card-foreground text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors flex-1 min-w-0">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          {item.quantity}
                        </span>
                        <span className="text-muted-foreground/80">
                          供应商:{item.supplier}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between gap-3 flex-wrap mt-auto pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.features.slice(0, 4).map((f) => (
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

                    {/* 右侧价格 */}
                    <div className="w-52 shrink-0 border-l border-border p-4 flex flex-col items-end justify-between gap-3 bg-muted/30">
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground">
                          {isRent ? "租金" : "售价"}
                        </div>
                        <div className="flex items-baseline gap-1 justify-end">
                          <span
                            className={cn(
                              "text-2xl font-bold",
                              isRent ? "text-primary" : "text-accent",
                            )}
                          >
                            {item.price}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.unit}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1">
                          可议价 / 支持开票
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        查看详情
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isRent = item.dealType === "出租"
            return (
              <Card
                key={item.id}
                onClick={goDetail}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div
                  className={cn(
                    "h-32 relative",
                    isRent
                      ? "bg-gradient-to-br from-primary/15 to-primary/5"
                      : "bg-gradient-to-br from-accent/15 to-accent/5",
                  )}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package
                      className={cn(
                        "w-12 h-12",
                        isRent ? "text-primary/25" : "text-accent/25",
                      )}
                    />
                  </div>
                  <Badge
                    className={cn(
                      "absolute top-2 left-2",
                      isRent ? "bg-primary" : "bg-accent",
                    )}
                  >
                    {item.dealType}
                  </Badge>
                  <Badge variant="outline" className="absolute top-2 right-2 bg-card/90 text-xs">
                    {item.category}
                  </Badge>
                  <Badge variant="outline" className="absolute bottom-2 right-2 bg-card/90 text-xs">
                    {item.condition}
                  </Badge>
                  {item.isHot && (
                    <Badge className="absolute bottom-2 left-2 bg-destructive text-xs">
                      热门
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        isRent ? "text-primary" : "text-accent",
                      )}
                    >
                      {item.price}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.unit}</span>
                  </div>
                  <h3 className="font-medium text-card-foreground mb-2 line-clamp-1 text-sm group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    供应商:{item.supplier}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.features.slice(0, 2).map((f) => (
                      <Badge key={f} variant="outline" className="text-xs">
                        {f}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.publishTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* 分页占位 */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled>
          上一页
        </Button>
        <Button variant="default" size="sm" className="w-9 h-9 p-0">
          1
        </Button>
        <Button variant="outline" size="sm" className="w-9 h-9 p-0">
          2
        </Button>
        <Button variant="outline" size="sm" className="w-9 h-9 p-0">
          3
        </Button>
        <Button variant="outline" size="sm">
          下一页
        </Button>
      </div>
    </div>
  )
}
